import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useOrganizerEvents } from "./useOrganizerEvents";

const STUB_RESPONSE = [
  { id: "1", name: "StellarFest 2026", tickets_sold: 40, current_balance: "125000000000" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useOrganizerEvents", () => {
  it("returns an empty, non-loading result when there is no wallet address", () => {
    const { result } = renderHook(() => useOrganizerEvents(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("populates events for the given organizer address", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => STUB_RESPONSE,
    } as Response);

    const { result } = renderHook(() => useOrganizerEvents("GORGANIZER"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.events).toEqual(STUB_RESPONSE);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("organizer=GORGANIZER"),
      expect.anything()
    );
  });

  it("sets an error message when the response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useOrganizerEvents("GORGANIZER"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/500/);
  });
});
