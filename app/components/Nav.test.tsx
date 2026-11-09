import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
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

describe("Nav - Wallet Connection", () => {
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

  it("shows Connect Wallet button when disconnected", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: null,
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

  it("opens the wallet picker when Connect Wallet is clicked", async () => {
    const connect = vi.fn();
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect,
      disconnect: vi.fn(),
    });

    const { default: userEvent } = await import("@testing-library/user-event");
    render(<Nav />);
    const [btn] = screen.getAllByRole("button", { name: /Connect Wallet/i });
    await userEvent.click(btn);

    expect(connect).toHaveBeenCalled();
  });

  it("shows wallet address and disconnect button when connected", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: "GBUQWP3BOUZX34ULNQG23RQ6F4PFXJJEFVXM5VCCCMQVXN7U2TGZL",
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

  it("announces that the GitHub link opens in a new tab", () => {
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<Nav />);

    const githubLinks = screen.getAllByRole("link", { name: /opens in a new tab/i });
    expect(githubLinks.length).toBeGreaterThan(0);
  });
});

describe("Nav - mobile menu", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.mocked(useWallet).mockReturnValue({
      address: null,
      isConnecting: false,
      isInitializing: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });
    vi.mocked(useToast).mockReturnValue({
      showToast: vi.fn(),
      toasts: [],
      removeToast: vi.fn(),
    });
  });

  function openMenu() {
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  }

  // jsdom doesn't apply the `hidden sm:flex` media-query hiding that keeps
  // the desktop nav links off-screen on mobile, so "My Tickets" exists twice
  // in the DOM (desktop + mobile dropdown) once the dropdown is open.

  it("opens and closes via the hamburger button", () => {
    render(<Nav />);

    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(1);

    openMenu();
    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(1);
  });

  it("closes when Escape is pressed", () => {
    render(<Nav />);
    openMenu();
    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(2);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(1);
  });

  it("closes when clicking outside the nav", () => {
    render(
      <div>
        <Nav />
        <main data-testid="page-content">Page body</main>
      </div>
    );
    openMenu();
    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(2);

    fireEvent.mouseDown(screen.getByTestId("page-content"));

    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(1);
  });

  it("does not close when clicking inside the open dropdown", () => {
    render(<Nav />);
    openMenu();

    const mobileLink = screen.getAllByRole("link", { name: "My Tickets" })[1];
    fireEvent.mouseDown(mobileLink);

    expect(screen.getAllByRole("link", { name: "My Tickets" })).toHaveLength(2);
  });
});
