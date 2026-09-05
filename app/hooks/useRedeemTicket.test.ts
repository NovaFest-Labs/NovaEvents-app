import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRedeemTicket } from "./useRedeemTicket";

describe("useRedeemTicket", () => {
  it("surfaces the not-wired-up-yet error", async () => {
    const { result } = renderHook(() => useRedeemTicket());

    await act(async () => {
      await result.current.redeemTicket("event-1", "ticket-1");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/issue #1/);
  });

  it("resets status and error", async () => {
    const { result } = renderHook(() => useRedeemTicket());

    await act(async () => {
      await result.current.redeemTicket("event-1", "ticket-1");
    });
    act(() => result.current.reset());

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });
});
