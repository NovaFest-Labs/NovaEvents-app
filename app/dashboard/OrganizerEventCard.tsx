"use client";

import { useState } from "react";
import Link from "next/link";
import { formatUsdc } from "../lib/formatUsdc";
import { useRedeemTicket } from "../hooks/useRedeemTicket";
import type { OrganizerEvent } from "../hooks/useOrganizerEvents";

export default function OrganizerEventCard({ event }: { event: OrganizerEvent }) {
  const { redeemTicket, status, error, reset } = useRedeemTicket();
  const [ticketId, setTicketId] = useState("");

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketId.trim()) return;
    await redeemTicket(event.id, ticketId.trim());
  }

  const pending = status === "pending";

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <Link
            href={`/events/${event.id}`}
            className="font-semibold text-lg hover:text-violet-400 transition-colors"
          >
            {event.name}
          </Link>
          <p className="text-slate-400 text-sm mt-1">
            {event.tickets_sold} ticket{event.tickets_sold === 1 ? "" : "s"} sold ·{" "}
            {formatUsdc(event.current_balance)} balance
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCheckIn}
        className="flex flex-col sm:flex-row gap-2 sm:items-end"
      >
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor={`check-in-${event.id}`} className="text-xs text-slate-500">
            Ticket ID
          </label>
          <input
            id={`check-in-${event.id}`}
            value={ticketId}
            onChange={(e) => {
              setTicketId(e.target.value);
              if (status !== "idle") reset();
            }}
            placeholder="Enter ticket ID"
            className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !ticketId.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {pending ? "Checking in..." : "Check In"}
        </button>
      </form>

      {status === "error" && error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
      {status === "success" && (
        <p role="status" className="mt-2 text-xs text-green-400">
          Ticket #{ticketId} checked in.
        </p>
      )}
    </div>
  );
}
