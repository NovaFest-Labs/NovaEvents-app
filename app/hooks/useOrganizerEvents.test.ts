import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
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

  it("re-fetches and updates events when refetch is called", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => STUB_RESPONSE,
    } as Response);

    const { result } = renderHook(() => useOrganizerEvents("GORGANIZER"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetch).toHaveBeenCalledOnce();

    const updatedResponse = [
      ...STUB_RESPONSE,
      { id: "2", name: "New Event", tickets_sold: 0, current_balance: "0" },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => updatedResponse,
    } as Response);

    result.current.refetch();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(result.current.events).toEqual(updatedResponse));
  });

  it("ignores a stale in-flight response when refetch is called before it resolves", async () => {
    let resolveFetch1: (value: Response) => void;
    const fetch1Promise = new Promise<Response>(
      (resolve) => (resolveFetch1 = resolve)
    );
    const STALE_RESPONSE = [{ ...STUB_RESPONSE[0], id: "stale" }];

    vi.mocked(fetch)
      .mockReturnValueOnce(fetch1Promise)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => STUB_RESPONSE,
      } as Response);

    const { result } = renderHook(() => useOrganizerEvents("GORGANIZER"));
    expect(result.current.loading).toBe(true);

    // Call refetch before the first fetch resolves.
    act(() => {
      result.current.refetch();
    });

    // Resolve the first (now-superseded) fetch after refetch has already
    // started the second one. A real aborted fetch would reject, but a
    // response can also already be in flight past the point abort() takes
    // effect, so the hook must not trust this result either way.
    resolveFetch1!({
      ok: true,
      json: async () => STALE_RESPONSE,
    } as Response);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.events).toEqual(STUB_RESPONSE);
  });
});
