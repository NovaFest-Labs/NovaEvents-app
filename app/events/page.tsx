"use client";

import Nav from "../components/Nav";
import EventCard from "./EventCard";
import { useEvents } from "../hooks/useEvents";

function LoadingGrid() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading events"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-white/10 rounded-xl p-6 animate-pulse"
        >
          <div className="h-5 bg-slate-700 rounded w-3/4 mb-3" />
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-6" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-8 bg-violet-700/40 rounded-lg w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Events</h1>
          <p className="text-slate-400">
            All events are settled on Stellar. Ticket sales, sponsorships, and
            payouts are publicly verifiable.
          </p>
        </div>

        {loading && <LoadingGrid />}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-10 text-center">
            <p className="text-red-300 font-medium mb-2">
              Couldn&apos;t load events
            </p>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="bg-slate-900 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-lg font-semibold mb-2">No events yet</p>
            <p className="text-slate-400 text-sm">
              Check back soon — new events will show up here as they&apos;re
              created.
            </p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
