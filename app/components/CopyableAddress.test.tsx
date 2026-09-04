import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import CopyableAddress from "./CopyableAddress";

const ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CopyableAddress", () => {
  it("renders the full address", () => {
    render(<CopyableAddress address={ADDRESS} />);
    expect(screen.getByText(ADDRESS)).toBeInTheDocument();
  });

  it("copies the address to the clipboard when the copy button is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyableAddress address={ADDRESS} />);
    fireEvent.click(screen.getByRole("button", { name: /copy wallet address/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(ADDRESS));
  });

  it("announces the copy confirmation for screen readers", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyableAddress address={ADDRESS} />);
    fireEvent.click(screen.getByRole("button", { name: /copy wallet address/i }));

    await waitFor(() => expect(screen.getByText(/copied/i)).toBeInTheDocument());
  });
});
