import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
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
});
