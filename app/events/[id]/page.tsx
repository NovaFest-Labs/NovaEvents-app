import type { Metadata } from "next";
import EventDetail from "./EventDetail";

interface Props {
  params: Promise<{ id: string }>;
}

interface ApiEvent {
  id: string;
  name: string;
  description: string;
  // cover_image_url will be available once API issue #14 lands
  cover_image_url?: string;
}

async function fetchEvent(id: string): Promise<ApiEvent | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      // Don't cache metadata fetches longer than the page revalidation window
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ApiEvent;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) {
    return {
      title: "Event — NovaEvents",
      description: "View event details on NovaEvents.",
    };
  }

  const title = `${event.name} — NovaEvents`;
  const description = event.description || "View event details on NovaEvents.";

  const images = event.cover_image_url
    ? [{ url: event.cover_image_url }]
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://novaevents.xyz/events/${id}`,
      siteName: "NovaEvents",
      locale: "en_US",
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  return <EventDetail id={id} />;
}
