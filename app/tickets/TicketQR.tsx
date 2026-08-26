"use client";

import { QRCodeSVG } from "qrcode.react";
import { useMemo } from "react";

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
 * - `issued_at` — ISO-8601 timestamp set when the component mounts.
 *                 Gives each QR a freshness marker so a screenshot from a
 *                 previous session is visually distinguishable (scanner can
 *                 optionally reject payloads older than N minutes).
 *
 * Tradeoffs (documented per issue acceptance criteria):
 *   ✅ No longer reproducible from public IDs alone — owner address is required.
 *   ✅ No new dependencies or contract changes needed.
 *   ✅ Scanner can cross-check owner against get_ticket on-chain.
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
  // issued_at is stable for the lifetime of this component instance.
  const issuedAt = useMemo(() => new Date().toISOString(), []);

  const value = JSON.stringify({
    event_id: eventId,
    ticket_id: ticketId,
    owner: ownerAddress,
    issued_at: issuedAt,
  });

  return (
    <div className="flex justify-center mt-4">
      <QRCodeSVG
        value={value}
        size={140}
        bgColor="#0f172a"
        fgColor="#ffffff"
        level="M"
        role="img"
        aria-label={`QR code for ticket #${ticketId} check-in`}
      />
    </div>
  );
}
