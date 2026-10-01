"use client";

import { useState } from "react";

export type SponsorStatus = "idle" | "confirming" | "pending" | "success" | "error";

interface UseSponsorEventResult {
  status: SponsorStatus;
  error: string | null;
  /**
   * Move to the confirmation step with the given amount (in USDC, as a
   * decimal string e.g. "25.00").
   */
  confirm: (amount: string) => void;
  /** Go back from confirmation to the amount-input step. */
  cancel: () => void;
  /**
   * Submit the confirmed sponsorship.
   *
   * TODO (issue #1): once the Soroban contract client lands, call
   *   await contractClient.sponsorEvent({ event: eventId, amount: stroops, sponsor: sponsorAddress })
   * There is no backend endpoint for this — sponsor_event requires the
   * sponsor's own signature (require_auth), which only their wallet can
   * provide, so this can never be a plain API POST.
   */
  submit: (eventId: string, sponsorAddress: string) => Promise<void>;
  /** Amount currently staged for confirmation (decimal USDC string). */
  stagedAmount: string;
  /** Reset back to the initial idle state. */
  reset: () => void;
}

/** Maximum single-contribution in USDC (client-side guard). */
const MAX_USDC = 1_000_000;

export function useSponsorEvent(): UseSponsorEventResult {
  const [status, setStatus] = useState<SponsorStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [stagedAmount, setStagedAmount] = useState("");

  function confirm(amount: string) {
    setError(null);
    setStagedAmount(amount);
    setStatus("confirming");
  }

  function cancel() {
    setStatus("idle");
    setError(null);
  }

  async function submit(eventId: string, sponsorAddress: string) {
    void eventId;
    void sponsorAddress;
    setStatus("pending");
    setError(null);
    try {
      throw new Error(
        "Sponsoring isn't wired up to the contract yet — see issue #1."
      );
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Sponsorship failed — please try again.";
      setError(msg);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setStagedAmount("");
  }

  return { status, error, confirm, cancel, submit, stagedAmount, reset };
}

export { MAX_USDC };
