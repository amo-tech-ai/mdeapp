"use client";

import { EventCard } from "@/components/copilot/event-card";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { useMapContext } from "@/platform/maps/map-context";

function eventPinId(eventId: string) {
  return `event-${eventId}`;
}

/** Persistent event cards below chat — survives scroll; fed by search-events tool render. */
export function EventResultsPanel() {
  const { rows } = useEventSearchResults();
  const { selectedPinId, panToPin } = useMapContext();
  const { openVenueDetail } = useRentalUi();

  if (rows.length === 0) return null;

  return (
    <section
      data-testid="event-results-panel"
      aria-label="Event results"
      className="shrink-0 border-t border-border bg-background px-2 py-2 sm:px-4"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Events ({rows.length})
      </h2>
      <div className="flex max-h-[min(40vh,320px)] flex-col gap-2 overflow-y-auto overflow-x-hidden pr-1">
        {rows.map((e) => {
          const pinId = eventPinId(e.id);
          const ticketUrl = `/events/${e.id}`;
          const openDetail = () => {
            panToPin(pinId);
            openVenueDetail({
              kind: "event",
              eventId: e.id,
              pinId,
              title: e.title,
              neighborhood: e.neighborhood,
              venue: e.venue,
              startsAt: e.startsAt,
              pricePerTicket: e.pricePerTicket,
              imageUrl: e.imageUrl,
              ticketUrl,
            });
          };
          return (
            <EventCard
              key={e.id}
              id={pinId}
              eventId={e.id}
              title={e.title}
              venue={e.venue}
              neighborhood={e.neighborhood}
              startsAt={e.startsAt}
              pricePerTicket={e.pricePerTicket}
              imageUrl={e.imageUrl}
              ticketUrl={ticketUrl}
              selected={selectedPinId === pinId}
              onSelect={() => panToPin(pinId)}
              onOpenDetails={openDetail}
            />
          );
        })}
      </div>
    </section>
  );
}
