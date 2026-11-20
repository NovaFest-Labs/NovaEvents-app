import { describe, it, expect } from "vitest";
import { formatEventDate } from "./eventFormatting";

describe("formatEventDate", () => {
  it("formats a valid date with the default (long month) options", () => {
    // toLocaleDateString's exact field order depends on the runtime's
    // default locale, so match on content rather than a fixed string.
    expect(formatEventDate("2026-11-01T00:00:00Z")).toMatch(/November/);
    expect(formatEventDate("2026-11-01T00:00:00Z")).toMatch(/2026/);
  });

  it("formats a valid date with custom options (e.g. a short month)", () => {
    const formatted = formatEventDate("2026-11-01T00:00:00Z", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    expect(formatted).toMatch(/Nov\b/);
    expect(formatted).toMatch(/2026/);
    expect(formatted).not.toMatch(/November/);
  });

  it('returns "Date TBA" when the date is undefined', () => {
    // `date` is absent when the on-chain date can't be represented in JS
    // (past ~year 275760).
    expect(formatEventDate(undefined)).toBe("Date TBA");
  });

  it('returns "Date TBA" for a string that does not parse to a valid date', () => {
    expect(formatEventDate("not-a-date")).toBe("Date TBA");
  });
});
