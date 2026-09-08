"use client";

import { useState } from "react";
import { getApiBaseUrl } from "../lib/env";

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
   * Submit the confirmed sponsorship.  In production this will call the
   * Soroban contract via the Freighter wallet; for now it POSTs to the
   * REST API so the rest of the flow (toast, list refresh) is fully wired.
   *
   * TODO (issue #1): replace the fetch with the Soroban contract client call:
   *   await contractClient.sponsorEvent({ event: eventId, amount: stroops, sponsor: sponsorAddress })
   */
  submit: (eventId: string, sponsorAddress: string) => Promise<void>;
  /** Amount currently staged for confirmation (decimal USDC string). */
  stagedAmount: string;
  /** Reset back to the initial idle state. */
  reset: () => void;
}

/** Maximum single-contribution in USDC (client-side guard). */
const MAX_USDC = 1_000_000;

/** Convert a decimal USDC string to the integer stroops string the API expects. */
function usdcToStroops(usdc: string): string {
  // Multiply by 10_000_000 (7 decimal places on Stellar).
  const stroops = Math.round(parseFloat(usdc) * 10_000_000);
  return String(stroops);
}

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
    setStatus("pending");
    setError(null);
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/events/${eventId}/sponsor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsor_address: sponsorAddress,
          amount: usdcToStroops(stagedAmount),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
          (body as { message?: string }).message ??
          `Sponsorship failed (${response.status})`;
        throw new Error(msg);
      }
      setStatus("success");
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
