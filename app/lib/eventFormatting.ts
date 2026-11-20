/**
 * Formats an event date for display, falling back to "Date TBA" when the
 * date is absent or can't be parsed. `date` is absent when the on-chain
 * value can't be represented as a JS Date (the contract accepts any future
 * u64 unix timestamp, which can exceed ~year 275760, the limit of what
 * `Date` can hold).
 */
export function formatEventDate(
  date: string | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const parsed = new Date(date ?? NaN);
  return Number.isNaN(parsed.getTime())
    ? "Date TBA"
    : parsed.toLocaleDateString(undefined, options);
}
