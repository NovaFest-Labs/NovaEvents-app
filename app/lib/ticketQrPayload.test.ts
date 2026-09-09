import { describe, it, expect } from "vitest";
import { parseTicketQrPayload } from "./ticketQrPayload";

const VALID = {
  event_id: "event-1",
  ticket_id: "42",
  owner: "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK",
  issued_at: "2026-01-01T00:00:00.000Z",
};

describe("parseTicketQrPayload", () => {
  it("parses a valid payload", () => {
    expect(parseTicketQrPayload(JSON.stringify(VALID))).toEqual(VALID);
  });

  it("returns null for invalid JSON", () => {
    expect(parseTicketQrPayload("not json")).toBeNull();
  });

  it("returns null when a required field is missing", () => {
    const { owner: _owner, ...withoutOwner } = VALID;
    void _owner;
    expect(parseTicketQrPayload(JSON.stringify(withoutOwner))).toBeNull();
  });

  it("returns null when a required field is empty", () => {
    expect(parseTicketQrPayload(JSON.stringify({ ...VALID, ticket_id: "" }))).toBeNull();
  });

  it("returns null when issued_at is an empty string", () => {
    expect(parseTicketQrPayload(JSON.stringify({ ...VALID, issued_at: "" }))).toBeNull();
  });

  it("returns null for a JSON value that isn't an object", () => {
    expect(parseTicketQrPayload(JSON.stringify("hello"))).toBeNull();
  });
});
