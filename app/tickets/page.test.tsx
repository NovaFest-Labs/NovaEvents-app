import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { Ticket } from "../hooks/useTickets";

// ── module-level mocks (hoisted before imports of the component) ─────────────
vi.mock("../hooks/useWallet", () => ({ useWallet: vi.fn() }));
vi.mock("../hooks/useTickets", () => ({ useTickets: vi.fn() }));

// import AFTER mocks are set up
import TicketsPage from "./page";
import { useWallet } from "../hooks/useWallet";
import { useTickets } from "../hooks/useTickets";

const mockUseWallet = vi.mocked(useWallet);
const mockUseTickets = vi.mocked(useTickets);

// ── helpers ──────────────────────────────────────────────────────────────────

const STUB_ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

const STUB_TICKETS: Ticket[] = [
  {
    ticket_id: "1",
    event_id: "42",
    event_name: "StellarFest 2026",
    tier: "VIP",
    redeemed: false,
  },
  {
    ticket_id: "7",
    event_id: "42",
    event_name: "StellarFest 2026",
    tier: "General",
    redeemed: true,
  },
];

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ── State 1: wallet not connected ─────────────────────────────────────────────

describe("TicketsPage — wallet not connected", () => {
  it("shows the 'Wallet not connected' message", () => {
    mockUseWallet.mockReturnValue(null);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    expect(screen.getByText("Wallet not connected")).toBeInTheDocument();
  });

  it("shows the disabled Connect Wallet button", () => {
    mockUseWallet.mockReturnValue(null);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    const btn = screen.getByRole("button", { name: /connect wallet/i });
    expect(btn).toBeDisabled();
  });

  it("does not show the ticket list", () => {
    mockUseWallet.mockReturnValue(null);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

// ── State 2: connected, zero tickets ──────────────────────────────────────────

describe("TicketsPage — connected, no tickets", () => {
  it("shows the wallet address", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    expect(screen.getByText(STUB_ADDRESS)).toBeInTheDocument();
  });

  it("shows the empty-state message", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    expect(screen.getByText("No tickets yet")).toBeInTheDocument();
  });

  it("does not show a ticket list", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue([]);
    render(<TicketsPage />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

// ── State 3: connected with tickets ───────────────────────────────────────────

describe("TicketsPage — connected with tickets", () => {
  it("shows the wallet address", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue(STUB_TICKETS);
    render(<TicketsPage />);

    expect(screen.getByText(STUB_ADDRESS)).toBeInTheDocument();
  });

  it("renders one list item per ticket", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue(STUB_TICKETS);
    render(<TicketsPage />);

    expect(screen.getAllByRole("listitem")).toHaveLength(STUB_TICKETS.length);
  });

  it("displays event name and tier for each ticket", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue(STUB_TICKETS);
    render(<TicketsPage />);

    expect(screen.getAllByText("StellarFest 2026")).toHaveLength(2);
    expect(screen.getByText("VIP")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
  });

  it("shows 'Valid' badge for unredeemed tickets and 'Redeemed' for redeemed ones", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue(STUB_TICKETS);
    render(<TicketsPage />);

    expect(screen.getAllByText("Valid")).toHaveLength(1);
    expect(screen.getAllByText("Redeemed")).toHaveLength(1);
  });

  it("does not show the empty-state message", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    mockUseTickets.mockReturnValue(STUB_TICKETS);
    render(<TicketsPage />);

    expect(screen.queryByText("No tickets yet")).not.toBeInTheDocument();
  });
});
