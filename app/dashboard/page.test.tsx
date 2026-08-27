import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("../hooks/useWallet", () => ({ useWallet: vi.fn() }));

import DashboardPage from "./page";
import { useWallet } from "../hooks/useWallet";

const mockUseWallet = vi.mocked(useWallet);

const STUB_ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("DashboardPage", () => {
  it("associates each create-event field's label with its input", () => {
    mockUseWallet.mockReturnValue(null);
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

  it("shows the wallet-not-connected prompt when useWallet returns null", () => {
    mockUseWallet.mockReturnValue(null);
    render(<DashboardPage />);

    expect(screen.getByText("Wallet not connected")).toBeInTheDocument();
  });

  it("hides the wallet-not-connected prompt once a wallet is connected", () => {
    mockUseWallet.mockReturnValue(STUB_ADDRESS);
    render(<DashboardPage />);

    expect(screen.queryByText("Wallet not connected")).not.toBeInTheDocument();
  });
});
