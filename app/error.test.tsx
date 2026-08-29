import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ErrorBoundary from "./error";

afterEach(() => {
  cleanup();
});

describe("ErrorBoundary", () => {
  it("shows a message and a link back to home", () => {
    render(<ErrorBoundary error={new Error("boom")} reset={vi.fn()} />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("calls reset when the try again button is clicked", () => {
    const reset = vi.fn();
    render(<ErrorBoundary error={new Error("boom")} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
