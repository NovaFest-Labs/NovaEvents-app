import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { OrganizerEvent } from "../hooks/useOrganizerEvents";

vi.mock("../hooks/useWallet", () => ({ useWallet: vi.fn() }));
vi.mock("../hooks/useOrganizerEvents", () => ({ useOrganizerEvents: vi.fn() }));

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import DashboardPage from "./page";
import { useWallet } from "../hooks/useWallet";
import { useOrganizerEvents } from "../hooks/useOrganizerEvents";

const mockUseWallet = vi.mocked(useWallet);
const mockUseOrganizerEvents = vi.mocked(useOrganizerEvents);

const STUB_ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

function walletState(overrides: Partial<ReturnType<typeof useWallet>> = {}) {
  return {
    address: null,
    isFreighterInstalled: true,
    isConnecting: false,
    isInitializing: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    ...overrides,
  };
}

const STUB_EVENTS: OrganizerEvent[] = [
  { id: "1", name: "StellarFest 2026", tickets_sold: 40, current_balance: "125000000000" },
];

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockUseOrganizerEvents.mockReturnValue({
    events: [],
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
});

describe("DashboardPage", () => {
  it("redirects to home once the wallet check finishes with no address", () => {
    mockUseWallet.mockReturnValue(walletState({ isInitializing: false, address: null }));
    render(<DashboardPage />);

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("does not redirect while the wallet connection is still being checked", () => {
    mockUseWallet.mockReturnValue(walletState({ isInitializing: true, address: null }));
    render(<DashboardPage />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.queryByText("Organizer Dashboard")).not.toBeInTheDocument();
  });

  it("does not redirect once a wallet is connected", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    render(<DashboardPage />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.getByText("Organizer Dashboard")).toBeInTheDocument();
  });

  it("shows the create-event form fields when connected", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    render(<DashboardPage />);

    for (const label of ["Event name", "Venue", "Description", "Date", "Funding goal (USDC)"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("shows an empty state when the organizer has no events", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    render(<DashboardPage />);

    expect(screen.getByText("No events yet")).toBeInTheDocument();
  });

  it("lists the organizer's events", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    mockUseOrganizerEvents.mockReturnValue({
      events: STUB_EVENTS,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
    render(<DashboardPage />);

    expect(screen.getByText("StellarFest 2026")).toBeInTheDocument();
    expect(screen.getByText(/40 tickets sold/)).toBeInTheDocument();
  });

  it("shows an error state when the organizer's events fail to load", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    mockUseOrganizerEvents.mockReturnValue({
      events: [],
      loading: false,
      error: "Failed to fetch your events (500)",
      refetch: vi.fn(),
    });
    render(<DashboardPage />);

    expect(screen.getByText("Couldn't load your events")).toBeInTheDocument();
  });
});
