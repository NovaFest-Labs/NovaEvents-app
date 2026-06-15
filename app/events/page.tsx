export default function EventsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight">
            NovaEvents
          </a>
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Events</h1>
          <p className="text-slate-400">
            All events are settled on Stellar. Ticket sales, sponsorships, and
            payouts are publicly verifiable.
          </p>
        </div>

        {/* Skeleton cards — replaced once API integration lands */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <p className="text-center text-slate-600 text-sm mt-14">
          Live event data coming soon — see{" "}
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents-api/issues/1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-500 hover:text-violet-400"
          >
            API issue #1
          </a>{" "}
          to contribute.
        </p>
      </div>
    </div>
  );
}
