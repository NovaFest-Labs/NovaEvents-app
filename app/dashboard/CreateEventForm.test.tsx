import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import CreateEventForm from "./CreateEventForm";
import * as useCreateEventModule from "../hooks/useCreateEvent";

const STUB_ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Event name"), { target: { value: "StellarFest" } });
  fireEvent.change(screen.getByLabelText("Venue"), { target: { value: "The Grand Hall" } });
  fireEvent.change(screen.getByLabelText("Description"), { target: { value: "A great event." } });
  fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2026-11-01" } });
  fireEvent.change(screen.getByLabelText("Funding goal (USDC)"), { target: { value: "1000" } });
  fireEvent.change(screen.getByLabelText("Tier name"), { target: { value: "General" } });
  fireEvent.change(screen.getByLabelText("Price (USDC)"), { target: { value: "50" } });
  fireEvent.change(screen.getByLabelText("Supply cap"), { target: { value: "100" } });
}

describe("CreateEventForm", () => {
  it("associates each field's label with its input", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);

    for (const label of ["Event name", "Venue", "Description", "Date", "Funding goal (USDC)"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("starts with a single ticket tier row", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    expect(screen.getAllByLabelText("Tier name")).toHaveLength(1);
  });

  it("adds another tier row when 'Add tier' is clicked", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    fireEvent.click(screen.getByText("+ Add tier"));
    expect(screen.getAllByLabelText("Tier name")).toHaveLength(2);
  });

  it("does not allow removing the last remaining tier", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    expect(screen.getByLabelText("Remove tier 1")).toBeDisabled();
  });

  it("shows a validation error when required fields are missing", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Event name is required.");
  });

  it("rejects a date in the past", () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2000-01-01" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Date must be today or in the future.");
  });

  it("submits and shows the not-wired-up-yet error once all fields are valid", async () => {
    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/issue #1/);
  });
  
  it("strips leading/trailing whitespace from a submitted tier name", async () => {
    const createEvent = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(useCreateEventModule, "useCreateEvent").mockReturnValue({
      createEvent,
      status: "idle",
      error: null,
      reset: vi.fn(),
    });

    render(<CreateEventForm organizerAddress={STUB_ADDRESS} />);
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText("Tier name"), { target: { value: "  VIP  " } });
    fireEvent.click(screen.getByRole("button", { name: "Create Event" }));

    await vi.waitFor(() => expect(createEvent).toHaveBeenCalledTimes(1));
    expect(createEvent.mock.calls[0][0].tiers[0].name).toBe("VIP");
  });
  
});