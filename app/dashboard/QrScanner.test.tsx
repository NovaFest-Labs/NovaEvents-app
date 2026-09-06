import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import QrScanner from "./QrScanner";

beforeEach(() => {
  cleanup();
});

describe("QrScanner", () => {
  it("falls back to a manual-entry prompt when the camera is unavailable", async () => {
    render(<QrScanner onDecode={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Camera access is not available|Enter the ticket ID manually/
    );
  });
});
