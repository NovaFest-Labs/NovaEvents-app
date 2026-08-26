"use client";

import { useState } from "react";

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
 * TODO (issue #1): add a useEffect that calls the Soroban contract client when
 * walletAddress is non-null and updates tickets with the result:
 *   contractClient.getTickets({ owner: walletAddress }).then(setTickets)
 */
export function useTickets(walletAddress: string | null): Ticket[] {
  // walletAddress is intentionally unused until issue #1 lands.
  void walletAddress;
  const [tickets] = useState<Ticket[]>([]);
  return tickets;
}
