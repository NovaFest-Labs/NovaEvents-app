"use client";

import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/env";

export interface TicketTier {
  id: string;
  name: string;
  price: string;
  supply_cap: number;
  tickets_sold: number;
}

export interface Sponsorship {
  sponsor_address: string;
  amount: string;
}

export interface EventDetail {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  organizer_address: string;
  funding_goal: string;
  current_balance: string;
  status: string;
  tiers: TicketTier[];
  sponsorships: Sponsorship[];
}

interface UseEventResult {
  event: EventDetail | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  /** Re-fetch the event without a full page reload (e.g. after a sponsorship). */
  refetch: () => void;
}

/**
 * Fetches a single event's full detail from the API.
 *
 * The API base URL comes from NEXT_PUBLIC_API_URL — see .env.example.
 */
export function useEvent(id: string): UseEventResult {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [epoch, setEpoch] = useState(0);

  /** Increment epoch to trigger a re-fetch while keeping the stale data visible. */
  function refetch() {
    setEpoch((e) => e + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();

    async function fetchEvent() {
      // Only show the full loading state on the initial load; subsequent
      // refetches keep the stale event data visible so the UI doesn't flicker.
      if (epoch === 0) setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const response = await fetch(`${baseUrl}/api/events/${id}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          if (controller.signal.aborted) return;
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch event (${response.status})`);
        }
        const data = (await response.json()) as EventDetail;
        if (controller.signal.aborted) return;
        setEvent(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchEvent();
    return () => controller.abort();
  }, [id, epoch]); // eslint-disable-line react-hooks/exhaustive-deps

  return { event, loading, error, notFound, refetch };
}
