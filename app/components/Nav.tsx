"use client";

import Link from "next/link";
import { useWallet } from "../hooks/useWallet";

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function WalletControl() {
  const { address, isFreighterInstalled, isConnecting, connect, disconnect } = useWallet();

  if (!isFreighterInstalled) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-violet-500 hover:text-violet-400 transition-colors"
      >
        Install Freighter
      </a>
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-slate-300">{shortenAddress(address)}</span>
        <button
          type="button"
          onClick={disconnect}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={isConnecting}
      className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}

export default function Nav() {
  return (
    <nav className="border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          NovaEvents
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/tickets"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            My Tickets
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
          <WalletControl />
        </div>
      </div>
    </nav>
  );
}
