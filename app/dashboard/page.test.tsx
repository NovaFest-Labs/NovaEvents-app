import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("../hooks/useWallet", () => ({ useWallet: vi.fn() }));

import DashboardPage from "./page";
import { useWallet } from "../hooks/useWallet";

const mockUseWallet = vi.mocked(useWallet);

const STUB_ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

function walletState(overrides: Partial<ReturnType<typeof useWallet>> = {}) {
  return {
    address: null,
    isFreighterInstalled: true,
    isConnecting: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("DashboardPage", () => {
  it("associates each create-event field's label with its input", () => {
    mockUseWallet.mockReturnValue(walletState());
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

  it("shows the wallet-not-connected prompt when no wallet is connected", () => {
    mockUseWallet.mockReturnValue(walletState());
    render(<DashboardPage />);

    expect(screen.getByText("Wallet not connected")).toBeInTheDocument();
  });

  it("hides the wallet-not-connected prompt once a wallet is connected", () => {
    mockUseWallet.mockReturnValue(walletState({ address: STUB_ADDRESS }));
    render(<DashboardPage />);

    expect(screen.queryByText("Wallet not connected")).not.toBeInTheDocument();
  });

  it("shows an install link when Freighter is not installed", () => {
    mockUseWallet.mockReturnValue(walletState({ isFreighterInstalled: false }));
    render(<DashboardPage />);

    expect(screen.getAllByText("Install Freighter").length).toBeGreaterThan(0);
  });
});
