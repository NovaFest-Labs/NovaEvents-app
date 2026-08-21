import Link from "next/link";

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
        </div>
      </div>
    </nav>
  );
}
