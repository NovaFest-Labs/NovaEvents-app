import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
    vi.mocked(useWallet).mockReturnValue({
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
    vi.mocked(useWallet).mockReturnValue({
      address: "GBUQWP3BOUZX34ULNQG23RQ6F4PFXJJEFVXM5VCCCMQVXN7U2TGZL",
      isFreighterInstalled: true,
      isConnecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    expect(screen.getByText(/GBUQ\.\.\.TGZL/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Disconnect/i })).toBeInTheDocument();
  });

  it("shows Connecting state when wallet is connecting", () => {
    vi.mocked(useWallet).mockReturnValue({
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
