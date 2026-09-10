import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import type { EventDetail as EventDetailData } from "../../hooks/useEvent";

vi.mock("../../hooks/useEvent", () => ({ useEvent: vi.fn() }));
vi.mock("../../hooks/useWallet", () => ({ useWallet: vi.fn() }));
vi.mock("../../context/ToastContext", () => ({ useToast: vi.fn() }));
vi.mock("../../components/Nav", () => ({ default: () => null }));

import EventDetail from "./EventDetail";
import { useEvent } from "../../hooks/useEvent";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../context/ToastContext";

const mockUseEvent = vi.mocked(useEvent);
const mockUseWallet = vi.mocked(useWallet);
const mockUseToast = vi.mocked(useToast);

const STUB_EVENT: EventDetailData = {
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
    { id: "t2", name: "VIP", price: "200000000", supply_cap: 10, tickets_sold: 10 },
  ],
  sponsorships: [
    {
      sponsor_address: "GASPONSOR1ADDRESS000000000000000000000000000000000000000",
      amount: "1000000000",
    },
  ],
};

function eventState(overrides: Partial<ReturnType<typeof useEvent>> = {}) {
  return {
    event: null,
    loading: false,
    error: null,
    notFound: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

function walletState(overrides: Partial<ReturnType<typeof useWallet>> = {}) {
  return {
    address: null,
    isConnecting: false,
    isInitializing: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockUseWallet.mockReturnValue(walletState());
  mockUseToast.mockReturnValue({ showToast: vi.fn(), removeToast: vi.fn(), toasts: [] });
});

describe("EventDetail", () => {
  it("shows a loading skeleton", () => {
    mockUseEvent.mockReturnValue(eventState({ loading: true }));
    render(<EventDetail id="1" />);

    expect(screen.getByLabelText("Loading event details")).toBeInTheDocument();
  });

  it("shows a 404 state for an unknown event id", () => {
    mockUseEvent.mockReturnValue(eventState({ notFound: true }));
    render(<EventDetail id="unknown" />);

    expect(screen.getByText("Event not found")).toBeInTheDocument();
  });

  it("shows an error state when the fetch fails", () => {
    mockUseEvent.mockReturnValue(
      eventState({ error: "Failed to fetch event (500)" })
    );
    render(<EventDetail id="1" />);

    expect(screen.getByText("Couldn't load this event")).toBeInTheDocument();
  });

  it("renders event details, tiers, and sponsorships", () => {
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    expect(screen.getByText("StellarFest 2026")).toBeInTheDocument();
    expect(screen.getByText("A festival for Stellar builders.")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
    // Sponsor address is shortened to first-6…last-6 chars
    expect(screen.getByText(/GASPON\.\.\./)).toBeInTheDocument();
  });

  it("disables Buy Ticket and Sponsor when wallet is not connected", () => {
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    const buyButtons = screen.getAllByRole("button", { name: "Buy Ticket" });
    expect(buyButtons[0]).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sponsor" })).toBeDisabled();
  });

  it("marks a sold-out tier and keeps it disabled even when wallet is connected", () => {
    mockUseWallet.mockReturnValue(
      walletState({ address: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK" })
    );
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    expect(screen.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Buy Ticket" })).toBeEnabled();
  });

  it("shows confirmation step when wallet is connected and a valid amount is entered", () => {
    mockUseWallet.mockReturnValue(
      walletState({ address: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK" })
    );
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    fireEvent.change(screen.getByLabelText("Sponsorship amount (USDC)"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sponsor" }));

    // After clicking Sponsor with a valid amount the panel transitions to the
    // confirmation step showing the staged amount and Confirm & Sponsor button.
    expect(screen.getByText("Confirm sponsorship")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm & Sponsor" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("returns to the amount-input step when Back is clicked", () => {
    mockUseWallet.mockReturnValue(
      walletState({ address: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK" })
    );
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    fireEvent.change(screen.getByLabelText("Sponsorship amount (USDC)"), {
      target: { value: "25" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sponsor" }));
    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByLabelText("Sponsorship amount (USDC)")).toBeInTheDocument();
  });

  it("shows a validation error when an invalid amount is submitted", () => {
    mockUseWallet.mockReturnValue(
      walletState({ address: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK" })
    );
    mockUseEvent.mockReturnValue(eventState({ event: STUB_EVENT }));
    render(<EventDetail id="1" />);

    fireEvent.change(screen.getByLabelText("Sponsorship amount (USDC)"), {
      target: { value: "-5" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sponsor" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Amount must be greater than 0."
    );
  });
});
