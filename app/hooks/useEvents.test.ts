import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useEvents } from "./useEvents";

const STUB_RESPONSE = [
  {
    id: "1",
    name: "StellarFest 2026",
    venue: "The Grand Hall",
    date: "2026-11-01T00:00:00Z",
    funding_goal: "500000000000",
    current_balance: "125000000000",
    tier_count: 3,
  },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useEvents", () => {
  it("starts in a loading state", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useEvents());

    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
  });

  it("populates events on a successful fetch", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => STUB_RESPONSE,
    } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.events).toEqual(STUB_RESPONSE);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/500/);
    expect(result.current.events).toEqual([]);
  });
});
