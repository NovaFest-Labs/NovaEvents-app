export interface TicketQrPayload {
  event_id: string;
  ticket_id: string;
  owner: string;
  issued_at: string;
}

/**
 * Parses and shape-validates the JSON payload encoded in an attendee's
 * ticket QR (see app/tickets/TicketQR.tsx for the encoder).
 *
 * Returns null for anything that isn't valid JSON or is missing a required
 * field, so callers can show a generic "unrecognized QR code" rejection
 * without leaking parser errors.
 */
export function parseTicketQrPayload(raw: string): TicketQrPayload | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof data !== "object" || data === null) return null;
  const candidate = data as Record<string, unknown>;

  const { event_id, ticket_id, owner, issued_at } = candidate;
  if (
    typeof event_id !== "string" ||
    typeof ticket_id !== "string" ||
    typeof owner !== "string" ||
    typeof issued_at !== "string" ||
    !event_id ||
    !ticket_id ||
    !owner ||
    !issued_at
  ) {
    return null;
  }

  return { event_id, ticket_id, owner, issued_at };
}
