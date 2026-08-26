"use client";

import { useState, useEffect } from "react";

/**
 * Returns the connected Freighter wallet address, or `null` when no wallet
 * is connected.
 *
 * Today this always returns `null` because the Freighter integration (issue #1)
 * has not landed yet.  Once it does, replace the body of this hook with the
 * real Freighter API call — the rest of the app will pick it up automatically.
 */
export function useWallet(): string | null {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // TODO (issue #1): call getPublicKey() from @stellar/freighter-api here
    // and setAddress(publicKey) on success, setAddress(null) on failure.
    setAddress(null);
  }, []);

  return address;
}
