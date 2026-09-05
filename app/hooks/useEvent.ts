"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

    async function fetchEvent() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setEvent(null);
      try {
        const response = await fetch(`${baseUrl}/api/events/${id}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch event (${response.status})`);
        }
        const data = (await response.json()) as EventDetail;
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
  }, [id]);

  return { event, loading, error, notFound };
}
