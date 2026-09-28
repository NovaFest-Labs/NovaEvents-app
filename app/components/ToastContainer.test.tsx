import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within, cleanup } from "@testing-library/react";
import { ToastContainer } from "./ToastContainer";
import { ToastProvider, useToast } from "../context/ToastContext";

// duration 0 disables auto-dismiss, so the toasts stay put until closed.
function Trigger() {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={() => showToast("First toast", "success", 0)}>add-first</button>
      <button onClick={() => showToast("Second toast", "error", 0)}>add-second</button>
    </>
  );
}

function renderWithTrigger() {
  return render(
    <ToastProvider>
      <Trigger />
      <ToastContainer />
    </ToastProvider>
  );
}

describe("ToastContainer", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders empty state initially", () => {
    render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>
    );

    // Initially empty - no toasts should be visible
    const container = screen.queryByRole("button", { name: /close notification/i });
    expect(container).not.toBeInTheDocument();
  });

  it("renders every queued toast, each with its own close button", () => {
    renderWithTrigger();

    fireEvent.click(screen.getByText("add-first"));
    fireEvent.click(screen.getByText("add-second"));

    expect(screen.getByText("First toast")).toBeInTheDocument();
    expect(screen.getByText("Second toast")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /close notification/i })).toHaveLength(2);
  });

  it("removes only the toast whose close button was clicked", async () => {
    renderWithTrigger();

    fireEvent.click(screen.getByText("add-first"));
    fireEvent.click(screen.getByText("add-second"));

    const firstToast = screen.getByText("First toast").parentElement as HTMLElement;
    fireEvent.click(within(firstToast).getByRole("button", { name: /close notification/i }));

    // Toast plays a short exit animation before calling onClose.
    await waitFor(() => expect(screen.queryByText("First toast")).not.toBeInTheDocument());
    expect(screen.getByText("Second toast")).toBeInTheDocument();
  });
});
