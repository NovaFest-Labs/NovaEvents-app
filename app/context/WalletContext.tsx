"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { LobstrModule } from "@creit.tech/stellar-wallets-kit/modules/lobstr";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";
import { RabetModule } from "@creit.tech/stellar-wallets-kit/modules/rabet";

StellarWalletsKit.init({
  network: Networks.TESTNET,
  modules: [
    new FreighterModule(),
    new LobstrModule(),
    new AlbedoModule(),
    new xBullModule(),
    new RabetModule(),
  ],
});

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

interface WalletContextValue {
  address: string | null;
  isConnecting: boolean;
  /**
   * True until the initial "was a wallet already connected in a previous
   * session" check resolves. Consumers that gate access on `address` (e.g.
   * the dashboard's redirect-if-disconnected) should wait for this to go
   * false before deciding — otherwise an already-connected wallet flashes
   * as disconnected during the async check.
   */
  isInitializing: boolean;
  error: string | null;
  /** Opens the wallet picker (Freighter, Lobstr, Albedo, xBull, Rabet, ...). */
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restorePreviousSession() {
      try {
        const result = await StellarWalletsKit.getAddress();
        if (!cancelled) setAddress(result.address);
      } catch {
        // No wallet connected in a previous session — expected on first visit.
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restorePreviousSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const result = await StellarWalletsKit.authModal();
      setAddress(result.address);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to connect wallet"));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    StellarWalletsKit.disconnect().catch(() => {
      // Best-effort — local state is already cleared above.
    });
  }, []);

  const value = useMemo(
    () => ({
      address,
      isConnecting,
      isInitializing,
      error,
      connect,
      disconnect,
    }),
    [address, isConnecting, isInitializing, error, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
