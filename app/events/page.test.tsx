import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import type { EventSummary } from "../hooks/useEvents";

vi.mock("../hooks/useEvents", () => ({ useEvents: vi.fn() }));
vi.mock("../hooks/useWallet", () => ({ useWallet: vi.fn() }));
vi.mock("../context/ToastContext", () => ({ useToast: vi.fn() }));
vi.mock("../components/Nav", () => ({ default: () => null }));

import EventsPage from "./page";
import { useEvents } from "../hooks/useEvents";
import { useWallet } from "../hooks/useWallet";

const mockUseEvents = vi.mocked(useEvents);
const mockUseWallet = vi.mocked(useWallet);

const STUB_EVENTS: EventSummary[] = [
  {
    id: "1",
    name: "StellarFest 2026",
    venue: "The Grand Hall",
    date: "2026-11-01T00:00:00Z",
    funding_goal: "500000000000",
    current_balance: "125000000000",
    tier_count: 3,
  },
  {
    id: "2",
    name: "DevCon Africa",
    venue: "Lagos Expo Center",
    date: "2026-12-15T00:00:00Z",
    funding_goal: "1000000000000",
    current_balance: "1000000000000",
    tier_count: 1,
  },
];

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockUseWallet.mockReturnValue({
    address: null,
    isConnecting: false,
    isInitializing: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
});

describe("EventsPage", () => {
  it("shows a loading state", () => {
    mockUseEvents.mockReturnValue({ events: [], loading: true, error: null, retry: vi.fn() });
    render(<EventsPage />);

    expect(screen.getByLabelText("Loading events")).toBeInTheDocument();
  });

  it("shows an empty state when there are no events", () => {
    mockUseEvents.mockReturnValue({ events: [], loading: false, error: null, retry: vi.fn() });
    render(<EventsPage />);

    expect(screen.getByText("No events yet")).toBeInTheDocument();
  });

  it("shows an error state when the fetch fails", () => {
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: "Failed to fetch events (500)",
      retry: vi.fn(),
    });
    render(<EventsPage />);

    expect(screen.getByText("Couldn't load events")).toBeInTheDocument();
  });

  it("shows a Retry button in the error state and calls retry when clicked", () => {
    const retry = vi.fn();
    mockUseEvents.mockReturnValue({
      events: [],
      loading: false,
      error: "Failed to fetch events (500)",
      retry,
    });
    render(<EventsPage />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("renders one card per event with a link to its detail page", () => {
    mockUseEvents.mockReturnValue({ events: STUB_EVENTS, loading: false, error: null, retry: vi.fn() });
    render(<EventsPage />);

    expect(screen.getByText("StellarFest 2026")).toBeInTheDocument();
    expect(screen.getByText("DevCon Africa")).toBeInTheDocument();

    const links = screen.getAllByRole("link").filter((el) =>
      el.getAttribute("href")?.startsWith("/events/")
    );
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/events/1");
    expect(links[1]).toHaveAttribute("href", "/events/2");
  });

  it("displays venue, tier count, and funding progress for each event", () => {
    mockUseEvents.mockReturnValue({ events: STUB_EVENTS, loading: false, error: null, retry: vi.fn() });
    render(<EventsPage />);

    expect(screen.getByText(/The Grand Hall/)).toBeInTheDocument();
    expect(screen.getByText("3 tiers")).toBeInTheDocument();
    expect(screen.getByText("1 tier")).toBeInTheDocument();
  });
});
