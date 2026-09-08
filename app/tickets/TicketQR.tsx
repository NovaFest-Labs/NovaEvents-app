"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect, useCallback } from "react";

/** How often (ms) the QR code is regenerated with a fresh issued_at. */
const REFRESH_INTERVAL_MS = 30_000; // 30 seconds

interface TicketQRProps {
  eventId: string;
  ticketId: string;
  /** Stellar public key (G…) of the on-chain ticket owner. */
  ownerAddress: string;
}

/**
 * Encodes a QR payload that ties the ticket to its on-chain owner.
 *
 * Payload shape:
 *   { event_id, ticket_id, owner, issued_at }
 *
 * - `owner`     — the Stellar public key that holds this ticket on-chain.
 *                 The organizer's scanner calls get_ticket(event_id, ticket_id)
 *                 and verifies the returned owner matches this field.
 * - `issued_at` — ISO-8601 timestamp refreshed every REFRESH_INTERVAL_MS ms.
 *                 Gives each QR a freshness marker so a screenshot from a
 *                 previous session is visually distinguishable (scanner can
 *                 optionally reject payloads older than N minutes).
 *
 * A "refreshed X ago" hint is shown below the QR so attendees can see when
 * the code was last generated. The QR auto-regenerates while the page is open
 * so a long-open tab never goes stale.
 *
 * Tradeoffs (documented per issue acceptance criteria):
 *   ✅ No longer reproducible from public IDs alone — owner address is required.
 *   ✅ No new dependencies or contract changes needed.
 *   ✅ Scanner can cross-check owner against get_ticket on-chain.
 *   ✅ QR auto-refreshes so long-open tabs stay fresh.
 *   ⚠️  Not replay-proof end-to-end: a screenshot still works until the scanner
 *       enforces the issued_at window or a wallet-signed challenge is added.
 *   ⚠️  Owner address is visible inside the QR — acceptable because Stellar
 *       public keys are not secret, but worth noting.
 *   🔜  Next step: have the wallet sign a short-lived challenge (nonce + expiry)
 *       with Freighter once issue #1 lands, making replay attacks impossible.
 */
export default function TicketQR({
  eventId,
  ticketId,
  ownerAddress,
}: TicketQRProps) {
  const [issuedAt, setIssuedAt] = useState<Date>(() => new Date());
  // Seconds elapsed since the last QR generation.
  const [secondsAgo, setSecondsAgo] = useState(0);

  /** Regenerate the QR by updating issued_at to now. */
  const refresh = useCallback(() => {
    setIssuedAt(new Date());
    setSecondsAgo(0);
  }, []);

  // Auto-regenerate the QR every REFRESH_INTERVAL_MS while the page is open.
  useEffect(() => {
    const refreshTimer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, [refresh]);

  // Tick the "refreshed X ago" counter every second.
  useEffect(() => {
    const tickTimer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1_000);
    return () => clearInterval(tickTimer);
  }, [issuedAt]);

  const value = JSON.stringify({
    event_id: eventId,
    ticket_id: ticketId,
    owner: ownerAddress,
    issued_at: issuedAt.toISOString(),
  });

  const freshnessLabel =
    secondsAgo === 0
      ? "just refreshed"
      : `refreshed ${secondsAgo}s ago`;

  /** Seconds remaining until the next auto-refresh. */
  const secondsUntilRefresh = Math.max(
    0,
    Math.round(REFRESH_INTERVAL_MS / 1_000) - secondsAgo
  );

  return (
    <div className="flex flex-col items-center mt-4">
      <QRCodeSVG
        value={value}
        size={140}
        bgColor="#0f172a"
        fgColor="#ffffff"
        level="M"
        role="img"
        aria-label={`QR code for ticket #${ticketId} check-in`}
      />

      {/* Freshness hint */}
      <p
        className="mt-2 text-xs text-slate-500 select-none"
        aria-live="polite"
        aria-label={`QR code ${freshnessLabel}. Next refresh in ${secondsUntilRefresh} seconds.`}
      >
        {freshnessLabel}
        <span className="text-slate-600">
          {" · "}next refresh in {secondsUntilRefresh}s
        </span>
      </p>
    </div>
  );
}
