import Link from "next/link";
import { formatUsdc } from "../lib/formatUsdc";
import type { EventSummary } from "../hooks/useEvents";

export default function EventCard({ event }: { event: EventSummary }) {
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-violet-500/40 transition-colors"
    >
      <h2 className="text-lg font-semibold mb-1 truncate">{event.name}</h2>
      <p className="text-slate-400 text-sm mb-4">
        {event.venue} · {formattedDate}
      </p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-slate-500 mb-1">Funding</p>
          <p className="text-sm text-white">
            {formatUsdc(event.current_balance)} / {formatUsdc(event.funding_goal)}
          </p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-1.5">
          {event.tier_count} tier{event.tier_count === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
