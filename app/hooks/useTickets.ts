"use client";

import { useState, useEffect } from "react";

export interface Ticket {
  ticket_id: string;
  event_id: string;
  event_name: string;
  tier: string;
  redeemed: boolean;
}

/**
 * Fetches the on-chain tickets owned by `walletAddress`.
 *
 * Returns an empty array when `walletAddress` is `null` (no wallet connected)
 * or while the contract/API integration (issue #1) is still pending.
 *
 * Once the Soroban contract client is available, replace the TODO below with
 * a real contract call and update `tickets` with the result.
 */
export function useTickets(walletAddress: string | null): Ticket[] {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!walletAddress) {
      setTickets([]);
      return;
    }

    // TODO (issue #1): fetch real tickets from the Soroban contract / API.
    // e.g. contractClient.getTickets({ owner: walletAddress }).then(setTickets)
    setTickets([]);
  }, [walletAddress]);

  return tickets;
}
