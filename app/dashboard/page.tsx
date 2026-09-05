"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import CopyableAddress from "../components/CopyableAddress";
import CreateEventForm from "./CreateEventForm";
import OrganizerEventCard from "./OrganizerEventCard";
import { useWallet } from "../hooks/useWallet";
import { useOrganizerEvents } from "../hooks/useOrganizerEvents";

export default function DashboardPage() {
  const router = useRouter();
  const { address: walletAddress, isInitializing } = useWallet();
  const { events, loading, error, refetch } = useOrganizerEvents(walletAddress);

  useEffect(() => {
    if (!isInitializing && walletAddress === null) {
      router.replace("/");
    }
  }, [isInitializing, walletAddress, router]);

  if (isInitializing || walletAddress === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Nav />
      </div>
    );
  }

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

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-12">
          <p className="text-slate-400 text-sm mb-1">Connected wallet</p>
          <CopyableAddress address={walletAddress} className="text-sm" />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
          <CreateEventForm organizerAddress={walletAddress} onCreated={refetch} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Your Events</h2>

          {loading && (
            <div
              role="status"
              aria-live="polite"
              aria-label="Loading your events"
              className="space-y-3 animate-pulse"
            >
              {[0, 1].map((i) => (
                <div key={i} className="bg-slate-900 border border-white/10 rounded-xl p-6">
                  <div className="h-5 bg-slate-700 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-10 text-center">
              <p className="text-red-300 font-medium mb-2">
                Couldn&apos;t load your events
              </p>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="bg-slate-900 border border-white/10 rounded-xl p-12 text-center">
              <p className="text-lg font-semibold mb-2">No events yet</p>
              <p className="text-slate-400 text-sm">
                Events you create will show up here with sales and check-in tools.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="space-y-4">
              {events.map((event) => (
                <OrganizerEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
