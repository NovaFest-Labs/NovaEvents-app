"use client";

import { useState } from "react";

type RedeemStatus = "idle" | "pending" | "success" | "error";

interface RedeemOutcome {
  success: boolean;
  error?: string;
}

interface UseRedeemTicketResult {
  redeemTicket: (eventId: string, ticketId: string) => Promise<RedeemOutcome>;
  status: RedeemStatus;
  error: string | null;
  reset: () => void;
}

/**
 * Checks a ticket in at the door by calling the contract's redeem_ticket
 * entrypoint.
 *
 * TODO (issue #1): once the Soroban contract client lands, call
 * contractClient.redeemTicket({ event: eventId, ticket: ticketId }) here.
 */
export function useRedeemTicket(): UseRedeemTicketResult {
  const [status, setStatus] = useState<RedeemStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function redeemTicket(eventId: string, ticketId: string): Promise<RedeemOutcome> {
    void eventId;
    void ticketId;
    setStatus("pending");
    setError(null);
    try {
      throw new Error(
        "Check-in isn't wired up to the contract yet — see issue #1."
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check in ticket";
      setStatus("error");
      setError(message);
      return { success: false, error: message };
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
  }

  return { redeemTicket, status, error, reset };
}
