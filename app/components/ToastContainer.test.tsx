import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToastContainer } from "./ToastContainer";
import { ToastProvider } from "../context/ToastContext";

describe("ToastContainer", () => {
  beforeEach(() => {
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
});
