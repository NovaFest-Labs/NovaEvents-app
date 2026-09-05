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
import { isConnected, requestAccess, getAddress } from "@stellar/freighter-api";

interface WalletContextValue {
  address: string | null;
  isFreighterInstalled: boolean;
  isConnecting: boolean;
  /**
   * True until the initial "is Freighter already connected" check resolves.
   * Consumers that gate access on `address` (e.g. the dashboard's
   * redirect-if-disconnected) should wait for this to go false before
   * deciding — otherwise an already-connected wallet flashes as
   * disconnected during the async check.
   */
  isInitializing: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkInstalledAndConnection() {
      try {
        const connected = await isConnected();
        if (cancelled) return;

        if (connected.error) {
          setIsFreighterInstalled(false);
          return;
        }
        setIsFreighterInstalled(true);

        if (connected.isConnected) {
          const result = await getAddress();
          if (!cancelled && !result.error && result.address) {
            setAddress(result.address);
          }
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    checkInstalledAndConnection();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const result = await requestAccess();
      if (result.error) {
        setError(result.error.message ?? "Failed to connect to Freighter");
        return;
      }
      setAddress(result.address);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const value = useMemo(
    () => ({
      address,
      isFreighterInstalled,
      isConnecting,
      isInitializing,
      error,
      connect,
      disconnect,
    }),
    [address, isFreighterInstalled, isConnecting, isInitializing, error, connect, disconnect]
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
