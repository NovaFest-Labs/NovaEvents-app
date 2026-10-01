import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSponsorEvent } from "./useSponsorEvent";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSponsorEvent", () => {
  it("stages an amount and moves to the confirming step", () => {
    const { result } = renderHook(() => useSponsorEvent());

    act(() => {
      result.current.confirm("25.00");
    });

    expect(result.current.status).toBe("confirming");
    expect(result.current.stagedAmount).toBe("25.00");
  });

  it("returns to idle when cancel is called from the confirming step", () => {
    const { result } = renderHook(() => useSponsorEvent());

    act(() => {
      result.current.confirm("25.00");
    });
    act(() => {
      result.current.cancel();
    });

    expect(result.current.status).toBe("idle");
  });

  it("submit() reports a clear not-wired-up error instead of hitting a nonexistent API endpoint", async () => {
    const { result } = renderHook(() => useSponsorEvent());

    act(() => {
      result.current.confirm("25.00");
    });

    await act(async () => {
      await result.current.submit("event-1", "GSPONSOR");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/issue #1/);
    // There is no POST /api/events/:id/sponsor route on the API — this must
    // not attempt a network call that would otherwise fail with a confusing 404.
    expect(fetch).not.toHaveBeenCalled();
  });
});
