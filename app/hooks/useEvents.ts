"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/env";

export interface EventSummary {
  id: string;
  name: string;
  venue: string;
  date: string;
  funding_goal: string;
  current_balance: string;
  tier_count: number;
}

interface UseEventsResult {
  events: EventSummary[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Fetches the list of active events from the API.
 *
 * The API base URL comes from NEXT_PUBLIC_API_URL — see .env.example.
 * Call the returned `retry` function to re-trigger the fetch after an error.
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/api/events`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch events (${response.status})`);
        }
        const data = (await response.json()) as EventSummary[];
        setEvents(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchEvents();
    return () => controller.abort();
  }, [retryCount]);

  const retry = () => setRetryCount((c) => c + 1);

  return { events, loading, error, retry };
}
