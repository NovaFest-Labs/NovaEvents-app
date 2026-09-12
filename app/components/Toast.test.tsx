import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders success toast with correct message", () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Success message"
        type="success"
        duration={0}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders error toast with correct message", () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-2"
        message="Error message"
        type="error"
        duration={0}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Error message")).toBeInTheDocument();
    // The ✕ icon appears in both the icon span and the close button — grab the icon span
    const icons = screen.getAllByText("✕");
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Toast
        id="test-3"
        message="Test message"
        type="success"
        duration={0}
        onClose={onClose}
      />
    );

    const closeButtons = screen.getAllByText("✕");
    const closeButton = closeButtons[closeButtons.length - 1];
    await user.click(closeButton);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith("test-3");
    });
  });

  it("auto-dismisses after duration", async () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-4"
        message="Auto-dismiss test"
        type="success"
        duration={100}
        onClose={onClose}
      />
    );

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalledWith("test-4");
      },
      { timeout: 500 }
    );
  });

  it("never auto-dismisses when duration is 0", () => {
    vi.useFakeTimers();
    try {
      const onClose = vi.fn();
      render(
        <Toast
          id="test-5"
          message="Persistent message"
          type="success"
          duration={0}
          onClose={onClose}
        />
      );

      // Well past any normal duration — duration={0} means the toast stays
      // up until closed manually, so onClose must never fire on its own.
      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByText("Persistent message")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
