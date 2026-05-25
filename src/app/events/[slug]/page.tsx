import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCheckoutNotice } from "@/components/events/event-checkout-notice";
import { EventDetailView } from "@/components/events/event-detail-view";
import { getPublicEvent } from "@/lib/events/get-public-event";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  if (!event) {
    return { title: "Event not found · mdeai" };
  }
  return {
    title: `${event.name} · mdeai`,
    description: event.description ?? `Tickets for ${event.name} in Medellín`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  if (!event) notFound();

  return (
    <>
      <Suspense fallback={null}>
        <EventCheckoutNotice />
      </Suspense>
      <EventDetailView event={event} />
    </>
  );
}
