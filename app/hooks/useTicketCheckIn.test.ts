import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

const mockGetTicket = vi.fn();
const mockRedeemTicket = vi.fn();

vi.mock("./useGetTicket", () => ({
  useGetTicket: () => ({ getTicket: mockGetTicket }),
}));
vi.mock("./useRedeemTicket", () => ({
  useRedeemTicket: () => ({ redeemTicket: mockRedeemTicket, status: "idle", error: null, reset: vi.fn() }),
}));

import { useTicketCheckIn } from "./useTicketCheckIn";

const PAYLOAD = JSON.stringify({
  event_id: "event-1",
  ticket_id: "42",
  owner: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
  issued_at: "2026-01-01T00:00:00.000Z",
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useTicketCheckIn", () => {
  it("rejects an unparseable QR payload without calling the contract", async () => {
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", "not json");
    });

    expect(result.current.status).toBe("rejected");
    expect(result.current.message).toMatch(/Unrecognized QR code/);
    expect(mockGetTicket).not.toHaveBeenCalled();
  });

  it("rejects a QR payload scanned against the wrong event", async () => {
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-2", PAYLOAD);
    });

    expect(result.current.status).toBe("rejected");
    expect(result.current.message).toMatch(/different event/);
    expect(mockGetTicket).not.toHaveBeenCalled();
  });

  it("rejects when the on-chain owner does not match the QR payload", async () => {
    mockGetTicket.mockResolvedValue({ owner: "GDIFFERENTOWNER", redeemed: false });
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", PAYLOAD);
    });

    expect(result.current.status).toBe("rejected");
    expect(result.current.message).toMatch(/owner does not match/);
    expect(mockRedeemTicket).not.toHaveBeenCalled();
  });

  it("rejects an already-redeemed ticket", async () => {
    mockGetTicket.mockResolvedValue({
      owner: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
      redeemed: true,
    });
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", PAYLOAD);
    });

    expect(result.current.status).toBe("rejected");
    expect(result.current.message).toMatch(/already been redeemed/);
    expect(mockRedeemTicket).not.toHaveBeenCalled();
  });

  it("redeems and reports success when the owner matches and the ticket is unredeemed", async () => {
    mockGetTicket.mockResolvedValue({
      owner: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
      redeemed: false,
    });
    mockRedeemTicket.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", PAYLOAD);
    });

    expect(mockRedeemTicket).toHaveBeenCalledWith("event-1", "42");
    expect(result.current.status).toBe("success");
    expect(result.current.message).toMatch(/checked in/);
  });

  it("surfaces a redeem failure as an error", async () => {
    mockGetTicket.mockResolvedValue({
      owner: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
      redeemed: false,
    });
    mockRedeemTicket.mockResolvedValue({ success: false, error: "boom" });
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", PAYLOAD);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.message).toBe("boom");
  });

  it("surfaces a lookup failure as an error", async () => {
    mockGetTicket.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromQr("event-1", PAYLOAD);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.message).toBe("network down");
  });

  it("checks in from a manually-entered ticket ID without a QR cross-check", async () => {
    mockRedeemTicket.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useTicketCheckIn());

    await act(async () => {
      await result.current.checkInFromTicketId("event-1", "42");
    });

    expect(mockGetTicket).not.toHaveBeenCalled();
    expect(mockRedeemTicket).toHaveBeenCalledWith("event-1", "42");
    expect(result.current.status).toBe("success");
  });
});
