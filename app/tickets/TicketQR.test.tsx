import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import TicketQR from "./TicketQR";

// ── helpers ──────────────────────────────────────────────────────────────────

const PROPS = {
  eventId: "event-1",
  ticketId: "42",
  ownerAddress: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// ── rendering ─────────────────────────────────────────────────────────────────

describe("TicketQR — rendering", () => {
  it("renders an SVG QR code with the correct aria-label", () => {
    render(<TicketQR {...PROPS} />);
    expect(
      screen.getByRole("img", { name: /qr code for ticket #42 check-in/i })
    ).toBeInTheDocument();
  });

  it("shows 'just refreshed' immediately after mount", () => {
    render(<TicketQR {...PROPS} />);
    // The <p> element's text content (excluding the child <span>) contains "just refreshed"
    const hints = screen.getAllByText(/just refreshed/i);
    expect(hints.length).toBeGreaterThan(0);
  });

  it("shows the countdown to next refresh", () => {
    render(<TicketQR {...PROPS} />);
    expect(screen.getByText(/next refresh in 30s/i)).toBeInTheDocument();
  });
});

// ── freshness label ticks ─────────────────────────────────────────────────────

describe("TicketQR — freshness label ticks", () => {
  it("updates label to 'refreshed 1s ago' after 1 second", () => {
    render(<TicketQR {...PROPS} />);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByText(/refreshed 1s ago/i)).toBeInTheDocument();
  });

  it("updates label to 'refreshed 5s ago' after 5 seconds", () => {
    render(<TicketQR {...PROPS} />);

    act(() => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.getByText(/refreshed 5s ago/i)).toBeInTheDocument();
  });

  it("decrements countdown each second", () => {
    render(<TicketQR {...PROPS} />);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByText(/next refresh in 29s/i)).toBeInTheDocument();
  });
});

// ── auto-refresh ──────────────────────────────────────────────────────────────

describe("TicketQR — auto-refresh", () => {
  it("resets secondsAgo to near-zero after the 30s refresh fires", () => {
    render(<TicketQR {...PROPS} />);

    // Advance to just after the 30s refresh interval.
    // After this the freshness label should show a small number (0 or 1),
    // not 29 or 30, proving the QR was regenerated.
    act(() => {
      vi.advanceTimersByTime(30_001);
    });

    // The label should NOT say "refreshed 29s ago" or "refreshed 30s ago"
    expect(screen.queryByText(/refreshed 2[0-9]s ago/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/refreshed 30s ago/i)).not.toBeInTheDocument();
  });

  it("shows a small secondsAgo value after the refresh fires", () => {
    render(<TicketQR {...PROPS} />);

    act(() => {
      vi.advanceTimersByTime(30_001);
    });

    // After refresh + one extra ms, the countdown should be near 30s again
    // (i.e. the next-refresh counter is > 25)
    const hint = document.querySelector("p[aria-live='polite']");
    const text = hint?.textContent ?? "";
    const match = text.match(/next refresh in (\d+)s/i);
    expect(match).not.toBeNull();
    const seconds = parseInt(match![1], 10);
    expect(seconds).toBeGreaterThan(25);
  });

  it("still works after two full refresh cycles (60 s total)", () => {
    render(<TicketQR {...PROPS} />);

    act(() => {
      vi.advanceTimersByTime(60_001);
    });

    // After two refresh cycles the countdown should be near 30s again
    const hint = document.querySelector("p[aria-live='polite']");
    const text = hint?.textContent ?? "";
    const match = text.match(/next refresh in (\d+)s/i);
    expect(match).not.toBeNull();
    const seconds = parseInt(match![1], 10);
    expect(seconds).toBeGreaterThan(25);
  });
});

// ── accessibility ─────────────────────────────────────────────────────────────

describe("TicketQR — accessibility", () => {
  it("freshness paragraph has aria-live='polite'", () => {
    render(<TicketQR {...PROPS} />);
    // Query by the aria-label attribute, which is unique and deterministic
    const hint = document.querySelector("p[aria-live='polite']");
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveAttribute("aria-live", "polite");
  });

  it("freshness paragraph has a descriptive aria-label", () => {
    render(<TicketQR {...PROPS} />);
    const hint = document.querySelector("p[aria-live='polite']");
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/QR code just refreshed/i)
    );
  });
});
