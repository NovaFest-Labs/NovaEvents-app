import EventDetail from "./EventDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;

  return <EventDetail id={id} />;
}
