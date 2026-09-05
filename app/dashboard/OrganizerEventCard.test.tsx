import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import OrganizerEventCard from "./OrganizerEventCard";
import type { OrganizerEvent } from "../hooks/useOrganizerEvents";

const STUB_EVENT: OrganizerEvent = {
  id: "1",
  name: "StellarFest 2026",
  tickets_sold: 40,
  current_balance: "125000000000",
};

beforeEach(() => {
  cleanup();
});

describe("OrganizerEventCard", () => {
  it("shows ticket sales count and balance", () => {
    render(<OrganizerEventCard event={STUB_EVENT} />);

    expect(screen.getByText(/40 tickets sold/)).toBeInTheDocument();
    expect(screen.getByText(/12,500 USDC/)).toBeInTheDocument();
  });

  it("disables Check In until a ticket ID is entered", () => {
    render(<OrganizerEventCard event={STUB_EVENT} />);
    expect(screen.getByRole("button", { name: "Check In" })).toBeDisabled();
  });

  it("shows the not-wired-up-yet error after submitting a ticket ID", async () => {
    render(<OrganizerEventCard event={STUB_EVENT} />);

    fireEvent.change(screen.getByLabelText("Ticket ID"), { target: { value: "42" } });
    fireEvent.click(screen.getByRole("button", { name: "Check In" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/issue #1/);
  });
});
