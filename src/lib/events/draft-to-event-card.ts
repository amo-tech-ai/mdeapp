import type { EventDraftState } from "@/lib/types";
import type { EventCardProps } from "@/components/copilot/event-card";

/** Maps Roberto draft → inline EventCard preview props. */
export function draftToEventCardProps(
  draft: EventDraftState,
  opts?: { eventId?: string; slug?: string },
): EventCardProps {
  const id = opts?.eventId ?? "draft-preview";
  const slug = opts?.slug ?? "draft-preview";
  const tierMin =
    draft.ticketTiers.length > 0
      ? Math.min(...draft.ticketTiers.map((t) => t.priceCop))
      : draft.priceMinCop;

  return {
    id,
    eventId: id,
    title: draft.title || "Untitled event",
    venue: draft.venue || "Venue TBD",
    neighborhood: draft.neighborhood || "Medellín",
    startsAt: draft.dateIso ?? new Date().toISOString(),
    pricePerTicket: tierMin > 0 ? tierMin : 0,
    imageUrl: draft.coverPhotoPath,
    ticketUrl: `/events/${slug}`,
  };
}
