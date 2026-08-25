import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("associates each create-event field's label with its input", () => {
    render(<DashboardPage />);

    for (const label of [
      "Event name",
      "Venue",
      "Description",
      "Funding goal (USDC)",
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });
});
