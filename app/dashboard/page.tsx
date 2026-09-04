"use client";

import Nav from "../components/Nav";
import CopyableAddress from "../components/CopyableAddress";
import { useWallet } from "../hooks/useWallet";

export default function DashboardPage() {
  const walletAddress = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Organizer Dashboard</h1>
          <p className="text-slate-400">
            Create and manage your events. All actions are signed on-chain
            through your Stellar wallet.
          </p>
        </div>

        {walletAddress === null ? (
          <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-8 text-center mb-12">
            <p className="text-violet-300 font-medium mb-2">Wallet not connected</p>
            <p className="text-slate-400 text-sm mb-6">
              Connect your Freighter wallet to create events and manage check-ins.
            </p>
            <button
              disabled
              className="bg-violet-600 opacity-50 cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg"
            >
              Connect Wallet (coming soon)
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-12">
            <p className="text-slate-400 text-sm mb-1">Connected wallet</p>
            <CopyableAddress address={walletAddress} className="text-sm" />
          </div>
        )}

        {/* Create event form — disabled until wallet is connected */}
        <section className="mb-12 opacity-40 pointer-events-none select-none">
          <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Event name", "Venue", "Description", "Funding goal (USDC)"].map(
              (label) => {
                const id = `create-event-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                return (
                  <div key={label} className="flex flex-col gap-1">
                    <label htmlFor={id} className="text-sm text-slate-400">
                      {label}
                    </label>
                    <input
                      id={id}
                      disabled
                      className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                      placeholder="—"
                    />
                  </div>
                );
              }
            )}
          </div>
          <button
            disabled
            className="mt-6 bg-violet-600 text-white font-medium px-6 py-3 rounded-lg"
          >
            Create Event
          </button>
        </section>

        <p className="text-center text-slate-600 text-sm">
          Wallet integration tracked in{" "}
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents-app/issues/1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-500 hover:text-violet-400"
          >
            app issue #1
          </a>
          .
        </p>
      </div>
    </div>
  );
}
