import Link from "next/link";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 py-28 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-400 mb-8">
          Built on Stellar · Powered by Soroban
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
          Transparent Event
          <br />
          Management on Stellar
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Every sponsorship, ticket sale, and payout — on-chain, auditable, and
          open to anyone. No hidden ledgers. No closed books.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Explore Events
          </Link>
          <a
            href="https://github.com/NovaFest-Labs/NovaEvents"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Contract on GitHub (opens in a new tab)"
            className="border border-white/20 hover:border-white/40 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            View Contract ↗
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why on-chain?</h2>
          <p className="text-slate-400 text-center mb-14 max-w-xl mx-auto">
            Moving the full money flow on-chain turns an event into a
            transparent, auditable process.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-slate-900 border border-white/10 rounded-xl p-6"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
          <p className="text-slate-400 text-center mb-14">
            Three steps for organizers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <span className="text-violet-500 font-mono font-bold text-sm">
                  {s.step}
                </span>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open source banner */}
      <section className="px-6 py-20 bg-violet-600/10 border-t border-violet-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Open source. Open to contributors.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            NovaEvents is open for contribution on GrantFox — the Stellar
            ecosystem&apos;s open-source collaboration hub. Developers,
            designers, and builders are welcome.
          </p>
          <a
            href="https://grantfox.xyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contribute on GrantFox (opens in a new tab)"
            className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Contribute on GrantFox ↗
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>NovaEvents — MIT License</span>
          <span>Built on Stellar · Settled in USDC</span>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🎫",
    title: "On-Chain Tickets",
    body: "Ticket ownership is recorded on Stellar. Anyone can verify a ticket without trusting the organizer.",
  },
  {
    icon: "💰",
    title: "Public Sponsorships",
    body: "Every sponsor's contribution is recorded publicly. Sponsors see the full picture, not just their own slice.",
  },
  {
    icon: "💸",
    title: "Transparent Payouts",
    body: "Worker payments go through the contract. Every disbursement sits alongside the intake — same ledger.",
  },
  {
    icon: "✅",
    title: "Verifiable Check-in",
    body: "Organizers check in attendees against on-chain ownership records. No spoofed QR codes, no fake tickets.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your event",
    body: "Set a funding goal and define ticket tiers — General, VIP, or however many you need. Deployed to Stellar.",
  },
  {
    step: "02",
    title: "Collect funding",
    body: "Sponsors contribute USDC publicly. Attendees buy tickets on-chain. Every transaction is visible in real time.",
  },
  {
    step: "03",
    title: "Pay your team",
    body: "After the event, pay workers directly through the contract. Every payout is recorded next to every intake.",
  },
];
