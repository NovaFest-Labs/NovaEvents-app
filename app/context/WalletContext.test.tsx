import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";

const { mockGetAddress, mockAuthModal, mockDisconnect, mockInit } = vi.hoisted(() => ({
  mockGetAddress: vi.fn(),
  mockAuthModal: vi.fn(),
  mockDisconnect: vi.fn(),
  mockInit: vi.fn(),
}));

vi.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: {
    init: mockInit,
    getAddress: mockGetAddress,
    authModal: mockAuthModal,
    disconnect: mockDisconnect,
  },
  Networks: { TESTNET: "Test SDF Network ; September 2015" },
}));
vi.mock("@creit.tech/stellar-wallets-kit/modules/freighter", () => ({
  FreighterModule: vi.fn(),
}));
vi.mock("@creit.tech/stellar-wallets-kit/modules/lobstr", () => ({
  LobstrModule: vi.fn(),
}));
vi.mock("@creit.tech/stellar-wallets-kit/modules/albedo", () => ({
  AlbedoModule: vi.fn(),
}));
vi.mock("@creit.tech/stellar-wallets-kit/modules/xbull", () => ({
  xBullModule: vi.fn(),
}));
vi.mock("@creit.tech/stellar-wallets-kit/modules/rabet", () => ({
  RabetModule: vi.fn(),
}));

import { WalletProvider, useWallet } from "./WalletContext";

function wrapper({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}

describe("WalletContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts initializing and resolves to disconnected when no previous session exists", async () => {
    mockGetAddress.mockRejectedValue(new Error("no wallet connected"));
    const { result } = renderHook(() => useWallet(), { wrapper });

    expect(result.current.isInitializing).toBe(true);
    expect(result.current.address).toBeNull();

    await waitFor(() => expect(result.current.isInitializing).toBe(false));
    expect(result.current.address).toBeNull();
  });

  it("restores a previously connected wallet address on mount", async () => {
    mockGetAddress.mockResolvedValue({ address: "GPREVIOUSLYCONNECTED" });
    const { result } = renderHook(() => useWallet(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));
    expect(result.current.address).toBe("GPREVIOUSLYCONNECTED");
  });

  it("connects via the auth modal and sets the address", async () => {
    mockGetAddress.mockRejectedValue(new Error("none"));
    mockAuthModal.mockResolvedValue({ address: "GNEWLYCONNECTED" });
    const { result } = renderHook(() => useWallet(), { wrapper });
    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.address).toBe("GNEWLYCONNECTED");
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message and clears isConnecting when connecting fails", async () => {
    mockGetAddress.mockRejectedValue(new Error("none"));
    mockAuthModal.mockRejectedValue(new Error("User rejected the modal"));
    const { result } = renderHook(() => useWallet(), { wrapper });
    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.address).toBeNull();
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.error).toBe("User rejected the modal");
  });

  it("disconnects and clears the address immediately, without waiting for the kit", async () => {
    mockGetAddress.mockResolvedValue({ address: "GCONNECTED" });
    mockDisconnect.mockResolvedValue(undefined);
    const { result } = renderHook(() => useWallet(), { wrapper });
    await waitFor(() => expect(result.current.address).toBe("GCONNECTED"));

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.address).toBeNull();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });

  it("throws when useWallet is called outside a WalletProvider", () => {
    expect(() => renderHook(() => useWallet())).toThrow(
      "useWallet must be used within a WalletProvider"
    );
  });
});
