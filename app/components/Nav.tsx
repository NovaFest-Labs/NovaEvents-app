"use client";

import Link from "next/link";
import { useWallet } from "../hooks/useWallet";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function WalletControl() {
  const { address, isFreighterInstalled, isConnecting, connect, disconnect, error } = useWallet();
  const { showToast } = useToast();

  // Show error toast when wallet connection fails
  useEffect(() => {
    if (error) {
      showToast(error, "error", 7000);
    }
  }, [error, showToast]);

  if (!isFreighterInstalled) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Freighter not found</span>
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-violet-500 hover:text-violet-400 transition-colors font-medium"
        >
          Install Freighter ↗
        </a>
      </div>
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-white/10 px-4 sm:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight shrink-0">
          NovaEvents
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6">
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

        {/* Mobile: wallet control + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <WalletControl />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {menuOpen ? (
              /* × close icon */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            ) : (
              /* ☰ hamburger */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 mt-3 pt-3 flex flex-col gap-1">
          {[
            { href: "/events", label: "Events" },
            { href: "/tickets", label: "My Tickets" },
            { href: "/dashboard", label: "Dashboard" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-2 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </nav>
  );
}
