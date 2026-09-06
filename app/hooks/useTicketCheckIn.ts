"use client";

import { useState } from "react";
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

  async function finishWithRedeem(eventId: string, ticketId: string) {
    const outcome = await redeemTicket(eventId, ticketId);
    if (!outcome.success) {
      setStatus("error");
      setMessage(outcome.error ?? "Failed to check in ticket.");
      return;
    }
    setStatus("success");
    setMessage(`Ticket #${ticketId} checked in.`);
  }

  async function checkInFromQr(eventId: string, rawPayload: string): Promise<void> {
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

      await finishWithRedeem(payload.event_id, payload.ticket_id);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to verify ticket.");
    }
  }

  async function checkInFromTicketId(eventId: string, ticketId: string): Promise<void> {
    setStatus("checking");
    setMessage(null);
    await finishWithRedeem(eventId, ticketId);
  }

  function reset() {
    setStatus("idle");
    setMessage(null);
  }

  return { checkInFromQr, checkInFromTicketId, status, message, reset };
}
