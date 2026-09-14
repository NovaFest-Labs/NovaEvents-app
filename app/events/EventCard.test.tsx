import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import EventCard from "./EventCard";
import type { EventSummary } from "../hooks/useEvents";

const STUB_EVENT: EventSummary = {
  id: "1",
  name: "StellarFest 2026",
  venue: "Lagos, Nigeria",
  date: "2026-12-01T10:00:00.000Z",
  funding_goal: "500000000000",
  current_balance: "250000000000",
  tier_count: 2,
};

beforeEach(() => {
  cleanup();
});

describe("EventCard", () => {
  it("shows a formatted date for a valid event date", () => {
    render(<EventCard event={STUB_EVENT} />);

    expect(screen.getByText(/Dec.*2026|2026.*Dec/)).toBeInTheDocument();
  });

  it("shows a fallback instead of 'Invalid Date' when the event date is malformed", () => {
    render(<EventCard event={{ ...STUB_EVENT, date: "" }} />);

    expect(screen.queryByText(/Invalid Date/)).not.toBeInTheDocument();
    expect(screen.getByText(/Date TBA/)).toBeInTheDocument();
  });
});
