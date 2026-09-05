"use client";

import { useCallback, useEffect, useState } from "react";

export interface OrganizerEvent {
  id: string;
  name: string;
  tickets_sold: number;
  current_balance: string;
}

interface UseOrganizerEventsResult {
  events: OrganizerEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the events created by `organizerAddress` from the API.
 *
 * Returns an empty, non-loading result when `organizerAddress` is `null`.
 */
export function useOrganizerEvents(organizerAddress: string | null): UseOrganizerEventsResult {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(organizerAddress !== null);
  const [error, setError] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);

  useEffect(() => {
    if (!organizerAddress) {
      return;
    }

    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

    async function fetchOrganizerEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${baseUrl}/api/events?organizer=${organizerAddress}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch your events (${response.status})`);
        }
        const data = (await response.json()) as OrganizerEvent[];
        setEvents(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch your events");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchOrganizerEvents();
    return () => controller.abort();
  }, [organizerAddress, refetchToken]);

  const refetch = useCallback(() => setRefetchToken((t) => t + 1), []);

  if (!organizerAddress) {
    return { events: [], loading: false, error: null, refetch };
  }

  return { events, loading, error, refetch };
}
