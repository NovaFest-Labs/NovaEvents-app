"use client";

import { useState } from "react";

export interface CreateEventTierInput {
  name: string;
  price: string;
  supplyCap: string;
}

export interface CreateEventInput {
  name: string;
  description: string;
  venue: string;
  date: string;
  fundingGoal: string;
  tiers: CreateEventTierInput[];
}

type CreateEventStatus = "idle" | "pending" | "success" | "error";

interface UseCreateEventResult {
  createEvent: (input: CreateEventInput) => Promise<void>;
  status: CreateEventStatus;
  error: string | null;
  reset: () => void;
}

/**
 * Submits a signed create_event transaction via the organizer's wallet.
 *
 * TODO (issue #1): once the Soroban contract client lands, build the
 * create_event invocation XDR from `input`, request a signature via
 * @stellar/freighter-api's signTransaction, and submit the signed
 * transaction to the network.
 */
export function useCreateEvent(organizerAddress: string | null): UseCreateEventResult {
  const [status, setStatus] = useState<CreateEventStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function createEvent(input: CreateEventInput): Promise<void> {
    void input;
    if (!organizerAddress) {
      setStatus("error");
      setError("Connect your wallet to create an event.");
      return;
    }

    setStatus("pending");
    setError(null);
    try {
      throw new Error(
        "Event creation isn't wired up to the contract yet — see issue #1."
      );
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
  }

  return { createEvent, status, error, reset };
}
