import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Nav from "./Nav";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../context/ToastContext";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock useWallet hook
vi.mock("../hooks/useWallet", () => ({
  useWallet: vi.fn(),
}));

// Mock useToast hook
vi.mock("../context/ToastContext", () => ({
  useToast: vi.fn(),
}));

describe("Nav - Freighter Detection", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Restore useToast default implementation after clearAllMocks wipes it
    vi.mocked(useToast).mockReturnValue({
      showToast: vi.fn(),
      toasts: [],
      removeToast: vi.fn(),
    });
  });

  it("shows Install Freighter link when extension not installed", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isFreighterInstalled: false,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    // WalletControl renders in both the desktop and mobile slots — at least
    // one instance of each element must be present.
    expect(screen.getAllByText(/Freighter not found/i).length).toBeGreaterThan(0);
    const freighterLinks = screen.getAllByRole("link", { name: /Install Freighter/i });
    expect(freighterLinks.length).toBeGreaterThan(0);
    expect(freighterLinks[0]).toHaveAttribute("href", "https://www.freighter.app/");
    expect(freighterLinks[0]).toHaveAttribute("target", "_blank");
  });

  it("shows Connect Wallet button when Freighter installed and wallet disconnected", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isFreighterInstalled: true,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(
      screen.getAllByRole("button", { name: /Connect Wallet/i }).length
    ).toBeGreaterThan(0);
  });

  it("shows wallet address and disconnect button when connected", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: "GBUQWP3BOUZX34ULNQG23RQ6F4PFXJJEFVXM5VCCCMQVXN7U2TGZL",
      isFreighterInstalled: true,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getAllByText(/GBUQ\.\.\.TGZL/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: /Disconnect/i }).length
    ).toBeGreaterThan(0);
  });

  it("shows Connecting state when wallet is connecting", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isFreighterInstalled: true,
      isConnecting: true,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    const connectingButtons = screen.getAllByRole("button", { name: /Connecting.../i });
    expect(connectingButtons.length).toBeGreaterThan(0);
    expect(connectingButtons[0]).toBeDisabled();
  });
});
