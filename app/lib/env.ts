/**
 * Typed accessor for environment variables required at runtime.
 *
 * Throws a descriptive error rather than letting `undefined` silently
 * propagate into fetch URLs or other callsites.
 *
 * Usage:
 *   import { getApiBaseUrl } from "../lib/env";
 *   const base = getApiBaseUrl();   // throws if NEXT_PUBLIC_API_URL is unset
 */

/**
 * Returns the NovaEvents API base URL (no trailing slash).
 *
 * Reads NEXT_PUBLIC_API_URL from the environment.  Throws if the variable
 * is not set so the problem surfaces immediately with a clear message
 * instead of silently building a broken fetch URL like "undefined/api/…".
 *
 * The variable is optional in local development — an empty string is
 * accepted and causes all requests to go to the same origin (i.e. Next.js
 * API routes on the same host).  Only a missing/undefined value is treated
 * as a misconfiguration.
 */
export function getApiBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;

  if (value === undefined) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_API_URL\n" +
        "Copy .env.example to .env.local and set the variable, or leave it " +
        "empty to use same-origin API routes."
    );
  }

  // Strip any accidental trailing slash for consistent URL construction.
  return value.replace(/\/$/, "");
}
