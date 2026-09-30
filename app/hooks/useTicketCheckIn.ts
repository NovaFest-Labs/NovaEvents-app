"use client";

import { useRef, useState } from "react";
import { useGetTicket } from "./useGetTicket";
import { useRedeemTicket } from "./useRedeemTicket";
import { parseTicketQrPayload } from "../lib/ticketQrPayload";

type CheckInStatus = "idle" | "checking" | "success" | "rejected" | "error";

interface UseTicketCheckInResult {
  /** Check in from a scanned QR payload string, cross-checking the on-chain owner first. */
  checkInFromQr: (eventId: string, rawPayload: string) => Promise<void>;
  /** Check in from a manually-entered ticket ID, skipping the QR owner cross-check. */
  checkInFromTicketId: (eventId: string, ticketId: string) => Promise<void>;
  status: CheckInStatus;
  message: string | null;
  reset: () => void;
}

/**
 * Orchestrates the organizer-facing check-in flow described in issue #15:
 * look up the ticket's on-chain owner, cross-check it against the QR
 * payload, then redeem — surfacing a distinct rejection reason for an
 * owner mismatch vs. an already-redeemed ticket.
 */
export function useTicketCheckIn(): UseTicketCheckInResult {
  const { getTicket } = useGetTicket();
  const { redeemTicket } = useRedeemTicket();

  const [status, setStatus] = useState<CheckInStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Bumped by reset() (and at the start of each new attempt) so a check-in
  // that's still in flight when the organizer clears the field can't
  // overwrite that reset once it resolves.
  const generationRef = useRef(0);

  async function finishWithRedeem(eventId: string, ticketId: string, generation: number) {
    const outcome = await redeemTicket(eventId, ticketId);
    if (generation !== generationRef.current) return;

    if (!outcome.success) {
      setStatus("error");
      setMessage(outcome.error ?? "Failed to check in ticket.");
      return;
    }
    setStatus("success");
    setMessage(`Ticket #${ticketId} checked in.`);
  }

  async function checkInFromQr(eventId: string, rawPayload: string): Promise<void> {
    const generation = ++generationRef.current;
    setStatus("checking");
    setMessage(null);

    const payload = parseTicketQrPayload(rawPayload);
    if (!payload) {
      setStatus("rejected");
      setMessage("Unrecognized QR code.");
      return;
    }

    if (payload.event_id !== eventId) {
      setStatus("rejected");
      setMessage("This ticket is for a different event.");
      return;
    }

    try {
      const ticket = await getTicket(payload.event_id, payload.ticket_id);
      if (generation !== generationRef.current) return;

      if (ticket.redeemed) {
        setStatus("rejected");
        setMessage("This ticket has already been redeemed.");
        return;
      }

      if (ticket.owner !== payload.owner) {
        setStatus("rejected");
        setMessage("QR owner does not match the on-chain ticket owner.");
        return;
      }

      await finishWithRedeem(payload.event_id, payload.ticket_id, generation);
    } catch (err) {
      if (generation !== generationRef.current) return;
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to verify ticket.");
    }
  }

  async function checkInFromTicketId(eventId: string, ticketId: string): Promise<void> {
    const generation = ++generationRef.current;
    setStatus("checking");
    setMessage(null);
    await finishWithRedeem(eventId, ticketId, generation);
  }

  function reset() {
    generationRef.current++;
    setStatus("idle");
    setMessage(null);
  }

  return { checkInFromQr, checkInFromTicketId, status, message, reset };
}
