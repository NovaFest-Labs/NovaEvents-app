"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "../../components/Nav";
import CopyableAddress from "../../components/CopyableAddress";
import { useWallet } from "../../hooks/useWallet";
import { useEvent, type TicketTier } from "../../hooks/useEvent";
import { formatUsdc } from "../../lib/formatUsdc";

const NOT_WIRED_UP_MESSAGE =
  "This isn't wired up to the contract yet — see issue #1.";

function EventSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading event details"
        className="mb-10 animate-pulse"
      >
        <div className="h-8 bg-slate-700 rounded w-1/2 mb-3" />
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-6" />
        <div className="h-4 bg-slate-800 rounded w-3/4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Ticket Tiers</h2>
            <div
              role="status"
              aria-live="polite"
              aria-label="Loading ticket tiers"
              className="space-y-3 animate-pulse"
            >
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

          <section>
            <h2 className="text-xl font-semibold mb-4">Sponsorships</h2>
            <div
              role="status"
              aria-live="polite"
              aria-label="Loading sponsorships"
              className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden animate-pulse"
            >
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

        <div className="space-y-6">
          <div
            role="status"
            aria-live="polite"
            aria-label="Loading event summary"
            className="bg-slate-900 border border-white/10 rounded-xl p-6 animate-pulse"
          >
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-full mb-6" />
            <div className="h-10 bg-violet-700/40 rounded-lg w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventNotFound({ id }: { id: string }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-violet-500 font-mono font-bold text-sm mb-4">404</p>
      <h1 className="text-4xl font-bold mb-4">Event not found</h1>
      <p className="text-slate-400 mb-10 max-w-sm mx-auto">
        We couldn&apos;t find an event with ID{" "}
        <span className="font-mono text-slate-300">{id}</span>. It may have
        been removed, or the link might be wrong.
      </p>
      <Link
        href="/events"
        className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Back to events
      </Link>
    </div>
  );
}

function EventError({ message }: { message: string }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-10">
        <p className="text-red-300 font-medium mb-2">
          Couldn&apos;t load this event
        </p>
        <p className="text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
}

function BuyTicketButton({
  tier,
  walletConnected,
}: {
  tier: TicketTier;
  walletConnected: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const soldOut = tier.tickets_sold >= tier.supply_cap;
  const disabled = !walletConnected || soldOut;

  function handleClick() {
    // TODO (issue #1): call the Soroban contract client's buy_ticket
    // entrypoint once the contract integration lands, e.g.
    //   await contractClient.buyTicket({ tier: tier.id, buyer: walletAddress })
    setMessage(NOT_WIRED_UP_MESSAGE);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={!walletConnected ? "Connect wallet to continue" : undefined}
        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        {soldOut ? "Sold out" : "Buy Ticket"}
      </button>
      {message && <p className="text-xs text-slate-500 max-w-[16rem] text-right">{message}</p>}
    </div>
  );
}

function SponsorPanel({ walletConnected }: { walletConnected: boolean }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const disabled = !walletConnected;

  function handleSponsor() {
    // TODO (issue #1): call the Soroban contract client's sponsor
    // entrypoint once the contract integration lands, e.g.
    //   await contractClient.sponsor({ amount, sponsor: walletAddress })
    setMessage(NOT_WIRED_UP_MESSAGE);
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
      <p className="text-slate-400 text-sm mb-3">Sponsor this event</p>
      <div className="flex gap-2">
        <label htmlFor="sponsor-amount" className="sr-only">
          Sponsorship amount (USDC)
        </label>
        <input
          id="sponsor-amount"
          type="number"
          min="0"
          step="0.0000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
          placeholder="Amount (USDC)"
          title={disabled ? "Connect wallet to continue" : undefined}
          className="flex-1 min-w-0 bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-40"
        />
        <button
          type="button"
          onClick={handleSponsor}
          disabled={disabled || !amount}
          title={disabled ? "Connect wallet to continue" : undefined}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          Sponsor
        </button>
      </div>
      {message && <p className="text-xs text-slate-500 mt-2">{message}</p>}
    </div>
  );
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function EventDetail({ id }: { id: string }) {
  const { event, loading, error, notFound } = useEvent(id);
  const { address: walletAddress } = useWallet();
  const walletConnected = walletAddress !== null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      {loading && <EventSkeleton />}

      {!loading && notFound && <EventNotFound id={id} />}

      {!loading && !notFound && error && <EventError message={error} />}

      {!loading && !notFound && !error && event && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold">{event.name}</h1>
              <span className="text-xs font-semibold uppercase tracking-wide bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-full px-3 py-1">
                {event.status}
              </span>
            </div>
            <p className="text-slate-400 mb-6">
              {event.venue} ·{" "}
              {new Date(event.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-slate-300 max-w-3xl">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">Ticket Tiers</h2>
                {event.tiers.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No ticket tiers have been created for this event.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {event.tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="bg-slate-900 border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-medium">{tier.name}</p>
                          <p className="text-slate-400 text-sm">
                            {formatUsdc(tier.price)} ·{" "}
                            {tier.tickets_sold} / {tier.supply_cap} sold
                          </p>
                        </div>
                        <BuyTicketButton
                          tier={tier}
                          walletConnected={walletConnected}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Sponsorships</h2>
                {event.sponsorships.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No sponsors yet — be the first to sponsor this event.
                  </p>
                ) : (
                  <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-left text-slate-400">
                          <th className="p-4 font-medium">Sponsor</th>
                          <th className="p-4 font-medium text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.sponsorships.map((sponsorship, i) => (
                          <tr
                            key={`${sponsorship.sponsor_address}-${i}`}
                            className={
                              i < event.sponsorships.length - 1
                                ? "border-b border-white/10"
                                : ""
                            }
                          >
                            <td className="p-4 font-mono text-slate-300">
                              {shortenAddress(sponsorship.sponsor_address)}
                            </td>
                            <td className="p-4 text-right">
                              {formatUsdc(sponsorship.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
                <p className="text-slate-400 text-sm mb-1">Funding</p>
                <p className="text-2xl font-bold mb-1">
                  {formatUsdc(event.current_balance)}
                </p>
                <p className="text-slate-500 text-sm mb-4">
                  of {formatUsdc(event.funding_goal)} goal
                </p>
                <p className="text-slate-400 text-sm mb-1">Organizer</p>
                <CopyableAddress
                  address={event.organizer_address}
                  className="text-sm"
                />
              </div>

              <SponsorPanel walletConnected={walletConnected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
