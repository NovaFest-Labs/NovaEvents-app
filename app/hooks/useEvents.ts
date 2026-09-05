"use client";

import { useEffect, useState } from "react";

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
}

/**
 * Fetches the list of active events from the API.
 *
 * The API base URL comes from NEXT_PUBLIC_API_URL — see .env.example.
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

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
  }, []);

  return { events, loading, error };
}
