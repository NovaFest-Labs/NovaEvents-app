import Nav from "../components/Nav";
import TicketQR from "./TicketQR";

// ---------------------------------------------------------------------------
// Mock data — replace with real on-chain queries once wallet connection (#1)
// and contract integration land.
// ---------------------------------------------------------------------------

interface Ticket {
  ticket_id: string;
  event_id: string;
  event_name: string;
  tier: string;
  redeemed: boolean;
}

// Simulates the connected wallet state. `null` = no wallet connected.
// `""` (empty string) = wallet connected but owns no tickets.
const MOCK_WALLET_ADDRESS: string | null =
  "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

const MOCK_TICKETS: Ticket[] = [
  {
    ticket_id: "1",
    event_id: "42",
    event_name: "StellarFest 2026",
    tier: "VIP",
    redeemed: false,
  },
  {
    ticket_id: "7",
    event_id: "42",
    event_name: "StellarFest 2026",
    tier: "General",
    redeemed: true,
  },
  {
    ticket_id: "3",
    event_id: "99",
    event_name: "Soroban Dev Day",
    tier: "General",
    redeemed: false,
  },
];

// ---------------------------------------------------------------------------

export default function TicketsPage() {
  // No wallet connected
  if (MOCK_WALLET_ADDRESS === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">My Tickets</h1>
          <div className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-10 mt-8">
            <p className="text-violet-300 font-medium mb-2">
              Wallet not connected
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Connect your Freighter wallet to view tickets you own.
            </p>
            <button
              disabled
              className="bg-violet-600 opacity-50 cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg"
            >
              Connect Wallet (coming soon)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tickets = MOCK_TICKETS;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">My Tickets</h1>
          <p className="text-slate-400 text-sm font-mono break-all">
            {MOCK_WALLET_ADDRESS}
          </p>
        </div>

        {tickets.length === 0 ? (
          /* Empty state */
          <div className="bg-slate-900 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-4xl mb-4">🎫</p>
            <p className="text-lg font-semibold mb-2">No tickets yet</p>
            <p className="text-slate-400 text-sm">
              Once you purchase a ticket on-chain it will appear here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {tickets.map((ticket) => (
              <li
                key={`${ticket.event_id}-${ticket.ticket_id}`}
                className="bg-slate-900 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg mb-1">
                      {ticket.event_name}
                    </h2>
                    <p className="text-slate-400 text-sm mb-1">
                      Tier:{" "}
                      <span className="text-white font-medium">
                        {ticket.tier}
                      </span>
                    </p>
                    <p className="text-slate-400 text-sm">
                      Ticket ID:{" "}
                      <span className="font-mono text-slate-300">
                        #{ticket.ticket_id}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ticket.redeemed
                        ? "bg-slate-700 text-slate-400"
                        : "bg-green-500/15 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {ticket.redeemed ? "Redeemed" : "Valid"}
                  </span>
                </div>

                <TicketQR
                  eventId={ticket.event_id}
                  ticketId={ticket.ticket_id}
                />

                <p className="text-center text-slate-600 text-xs mt-2">
                  Show this QR code to the organizer at the door
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
