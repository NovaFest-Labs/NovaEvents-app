import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCreateEvent, type CreateEventInput } from "./useCreateEvent";

const STUB_INPUT: CreateEventInput = {
  name: "StellarFest 2026",
  description: "A festival for Stellar builders.",
  venue: "The Grand Hall",
  date: "2026-11-01",
  fundingGoal: "1000",
  tiers: [{ name: "General", price: "50", supplyCap: "100" }],
};

describe("useCreateEvent", () => {
  it("errors immediately when there is no connected wallet", async () => {
    const { result } = renderHook(() => useCreateEvent(null));

    await act(async () => {
      await result.current.createEvent(STUB_INPUT);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/connect your wallet/i);
  });

  it("surfaces the not-wired-up-yet error for a connected wallet", async () => {
    const { result } = renderHook(() => useCreateEvent("GORGANIZER"));

    await act(async () => {
      await result.current.createEvent(STUB_INPUT);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/issue #1/);
  });

  it("resets status and error", async () => {
    const { result } = renderHook(() => useCreateEvent("GORGANIZER"));

    await act(async () => {
      await result.current.createEvent(STUB_INPUT);
    });
    act(() => result.current.reset());

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });
});
