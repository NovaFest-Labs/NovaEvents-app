import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
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

  it("does not throw and stays uncopied when the clipboard write is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyableAddress address={ADDRESS} />);
    const button = screen.getByRole("button", { name: /copy wallet address/i });
    fireEvent.click(button);

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(button).toHaveTextContent("⧉");
    expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
  });

  it("reverts the copied indicator to the copy icon after 2 seconds", async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText } });

      render(<CopyableAddress address={ADDRESS} />);
      const button = screen.getByRole("button", { name: /copy wallet address/i });

      // Flush the microtask queue so the awaited clipboard write resolves
      // and setCopied(true) runs, even with fake timers active.
      await act(async () => {
        fireEvent.click(button);
        await Promise.resolve();
      });

      expect(button).toHaveTextContent("✓");

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(button).toHaveTextContent("⧉");
    } finally {
      vi.useRealTimers();
    }
  });
});
