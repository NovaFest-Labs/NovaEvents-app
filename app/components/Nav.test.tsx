import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

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
  useToast: vi.fn(() => ({
    showToast: vi.fn(),
  })),
}));

describe("Nav - Freighter Detection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Install Freighter link when extension not installed", () => {
    const { useWallet } = require("../hooks/useWallet");
    useWallet.mockReturnValue({
      address: null,
      isFreighterInstalled: false,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getByText(/Freighter not found/i)).toBeInTheDocument();
    const freighterLink = screen.getByRole("link", { name: /Install Freighter/i });
    expect(freighterLink).toHaveAttribute("href", "https://www.freighter.app/");
    expect(freighterLink).toHaveAttribute("target", "_blank");
  });

  it("shows Connect Wallet button when Freighter installed and wallet disconnected", () => {
    const { useWallet } = require("../hooks/useWallet");
    useWallet.mockReturnValue({
      address: null,
      isFreighterInstalled: true,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getByRole("button", { name: /Connect Wallet/i })).toBeInTheDocument();
  });

  it("shows wallet address and disconnect button when connected", () => {
    const { useWallet } = require("../hooks/useWallet");
    useWallet.mockReturnValue({
      address: "GBUQWP3BOUZX34ULNQG23RQ6F4PFXJJEFVXM5VCCCM監察QVXN7U2TGZL",
      isFreighterInstalled: true,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getByText(/GBUU\.\.\.TGZL/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Disconnect/i })).toBeInTheDocument();
  });

  it("shows Connecting state when wallet is connecting", () => {
    const { useWallet } = require("../hooks/useWallet");
    useWallet.mockReturnValue({
      address: null,
      isFreighterInstalled: true,
      isConnecting: true,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getByRole("button", { name: /Connecting.../i })).toBeInTheDocument();
  });
});
