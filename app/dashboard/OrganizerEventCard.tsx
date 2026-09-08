"use client";

import { useState } from "react";
import Link from "next/link";
import { formatUsdc } from "../lib/formatUsdc";
import { useTicketCheckIn } from "../hooks/useTicketCheckIn";
import QrScanner from "./QrScanner";
import type { OrganizerEvent } from "../hooks/useOrganizerEvents";

export default function OrganizerEventCard({ event }: { event: OrganizerEvent }) {
  const { checkInFromQr, checkInFromTicketId, status, message, reset } = useTicketCheckIn();
  const [ticketId, setTicketId] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const pending = status === "checking";

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketId.trim()) return;
    await checkInFromTicketId(event.id, ticketId.trim());
  }

  async function handleScan(payload: string) {
    setScannerOpen(false);
    await checkInFromQr(event.id, payload);
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
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

        <button
          type="button"
          onClick={() => {
            reset();
            setScannerOpen((open) => !open);
          }}
          className="shrink-0 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          {scannerOpen ? "Close scanner" : "Scan QR"}
        </button>
      </div>

      {scannerOpen && (
        <div className="mb-4">
          <QrScanner onDecode={handleScan} paused={pending} />
        </div>
      )}

      <form
        onSubmit={handleManualSubmit}
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

      {status === "error" && message && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {message}
        </p>
      )}
      {status === "rejected" && message && (
        <p role="alert" className="mt-2 text-xs text-amber-400">
          {message}
        </p>
      )}
      {status === "success" && message && (
        <p role="status" className="mt-2 text-xs text-green-400">
          {message}
        </p>
      )}
    </div>
  );
}
