import Nav from "../../components/Nav";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Event header skeleton */}
        <div role="status" aria-live="polite" aria-label="Loading event details" className="mb-10 animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-3" />
          <div className="h-4 bg-slate-800 rounded w-1/3 mb-6" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ticket tiers */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Ticket Tiers</h2>
              <div role="status" aria-live="polite" aria-label="Loading ticket tiers" className="space-y-3 animate-pulse">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-900 border border-white/10 rounded-xl p-5 flex items-center justify-between"
                  >
                    <div>
                      <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
                      <div className="h-3 bg-slate-800 rounded w-16" />
                    </div>
                    <div className="h-9 bg-violet-700/40 rounded-lg w-28" />
                  </div>
                ))}
              </div>
            </section>

            {/* Sponsorships */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Sponsorships</h2>
              <div role="status" aria-live="polite" aria-label="Loading sponsorships" className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden animate-pulse">
                <div className="p-5 border-b border-white/10 flex justify-between">
                  <div className="h-4 bg-slate-700 rounded w-40" />
                  <div className="h-4 bg-slate-800 rounded w-20" />
                </div>
                <div className="p-5 flex justify-between">
                  <div className="h-4 bg-slate-700 rounded w-40" />
                  <div className="h-4 bg-slate-800 rounded w-20" />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div role="status" aria-live="polite" aria-label="Loading event summary" className="bg-slate-900 border border-white/10 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-full mb-6" />
              <div className="h-10 bg-violet-700/40 rounded-lg w-full" />
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-sm mt-14">
          Showing skeleton for event{" "}
          <span className="text-slate-500 font-mono">{id}</span> — live data
          coming once{" "}
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents-api/issues/2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="API issue #2 (opens in a new tab)"
            className="text-violet-500 hover:text-violet-400"
          >
            API issue #2
          </a>{" "}
          lands.
        </p>
      </div>
    </div>
  );
}
