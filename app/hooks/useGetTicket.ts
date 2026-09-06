"use client";

export interface OnChainTicket {
  owner: string;
  redeemed: boolean;
}

/**
 * Reads a ticket's on-chain record via the contract's get_ticket entrypoint.
 *
 * TODO (issue #1): once the Soroban contract client lands, call
 * contractClient.getTicket({ event: eventId, ticket: ticketId }) here and
 * return the resolved owner/redeemed state.
 */
export function useGetTicket() {
  async function getTicket(eventId: string, ticketId: string): Promise<OnChainTicket> {
    void eventId;
    void ticketId;
    throw new Error("Ticket lookup isn't wired up to the contract yet — see issue #1.");
  }

  return { getTicket };
}
