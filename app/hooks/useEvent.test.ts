import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useEvent } from "./useEvent";

const STUB_EVENT = {
  id: "1",
  name: "StellarFest 2026",
  description: "A festival for Stellar builders.",
  venue: "The Grand Hall",
  date: "2026-11-01T00:00:00Z",
  organizer_address: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
  funding_goal: "500000000000",
  current_balance: "125000000000",
  status: "active",
  tiers: [
    { id: "t1", name: "General", price: "50000000", supply_cap: 100, tickets_sold: 40 },
  ],
  sponsorships: [
    { sponsor_address: "GASPONSOR1ADDRESS000000000000000000000000000000000000000", amount: "1000000000" },
  ],
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useEvent", () => {
  it("starts in a loading state", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useEvent("1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.event).toBeNull();
  });

  it("populates the event on a successful fetch", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => STUB_EVENT,
    } as Response);

    const { result } = renderHook(() => useEvent("1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.event).toEqual(STUB_EVENT);
    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
  });

  it("sets notFound when the API returns 404", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useEvent("unknown"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.event).toBeNull();
  });

  it("sets an error message when the response is not ok and not a 404", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useEvent("1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/500/);
    expect(result.current.notFound).toBe(false);
  });
});
