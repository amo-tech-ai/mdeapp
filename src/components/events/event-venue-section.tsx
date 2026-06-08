import type { PublicEventVenue } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type EventVenueSectionProps = {
  venue: PublicEventVenue;
  className?: string;
};

export function EventVenueSection({ venue, className }: EventVenueSectionProps) {
  const locationLine = [venue.address, venue.city].filter(Boolean).join(" · ");

  return (
    <section
      className={cn("space-y-2", className)}
      data-testid="event-venue-section"
      aria-labelledby="event-venue-heading"
    >
      <h2 id="event-venue-heading" className="text-lg font-semibold">
        Venue
      </h2>
      <p className="text-base font-medium">{venue.name}</p>
      {locationLine ? (
        <p className="text-sm text-muted-foreground">{locationLine}</p>
      ) : null}
    </section>
  );
}
