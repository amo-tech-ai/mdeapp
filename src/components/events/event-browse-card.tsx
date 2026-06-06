import Link from "next/link";
import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { formatEventCardPrice } from "@/lib/events/format-event";
import type { PublishedEventListItem } from "@/lib/events/list-published-events";
import type { EventCategory } from "@/mastra/tools/search-events";
import { cn } from "@/lib/utils";

type EventBrowseCardProps = {
  event: PublishedEventListItem;
  composition?: "legacy" | "nova";
  mediaLayout?: "inline" | "cover";
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  music: "Music",
  food: "Food",
  culture: "Culture",
  sport: "Sport",
  nightlife: "Nightlife",
};

function formatStartsAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function EventBrowseCardMedia({
  imageUrl,
  imageAlt,
  mediaLayout,
}: {
  imageUrl?: string;
  imageAlt: string;
  mediaLayout: "inline" | "cover";
}) {
  const frameClass = cn(
    "relative overflow-hidden rounded-xl bg-muted text-xs text-muted-foreground",
    mediaLayout === "cover"
      ? "aspect-[16/10] w-full"
      : "aspect-[16/10] w-24 shrink-0 self-start",
  );

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={imageAlt}
        className={cn(frameClass, "object-cover")}
        loading="lazy"
        data-testid="event-browse-card-photo"
      />
    );
  }

  return (
    <div
      className={cn(frameClass, "flex items-center justify-center")}
      data-testid="event-browse-card-photo-placeholder"
      aria-hidden
    >
      Event
    </div>
  );
}

export function EventBrowseCard({
  event,
  composition = "nova",
  mediaLayout = "cover",
}: EventBrowseCardProps) {
  const detailsHref = `/events/${event.slug}`;
  const priceLabel =
    event.pricePerTicket <= 0
      ? "Free"
      : `From ${formatEventCardPrice(event.pricePerTicket, event.currency)}`;

  return (
    <VenueCardShell
      testId="event-card"
      resultKind="event"
      composition={composition}
      mediaLayout={mediaLayout}
      ariaLabel={`Event: ${event.title}${event.neighborhood ? `, ${event.neighborhood}` : ""}`}
      media={
        <EventBrowseCardMedia
          imageUrl={event.imageUrl}
          imageAlt={event.title}
          mediaLayout={mediaLayout}
        />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <Link
            href={detailsHref}
            data-testid="event-details-cta"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Details
          </Link>
          {event.ticketUrl.startsWith("http") ? (
            <Link
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="event-buy-cta"
              className={cn(buttonVariants({ size: "sm", variant: "default" }))}
            >
              <Ticket data-icon="inline-start" aria-hidden />
              Buy tickets
            </Link>
          ) : (
            <Button
              size="sm"
              variant="default"
              nativeButton={false}
              render={
                <Link
                  href={detailsHref}
                  data-testid="event-buy-cta"
                />
              }
            >
              <Ticket data-icon="inline-start" aria-hidden />
              Buy tickets
            </Button>
          )}
        </div>
      }
    >
      {event.neighborhood ? (
        <p className="text-[11px] font-medium text-muted-foreground">
          {event.neighborhood}
        </p>
      ) : null}
      <h3 className="font-medium leading-snug">{event.title}</h3>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <Badge variant="secondary">
          {CATEGORY_LABELS[event.category]}
        </Badge>
        <Badge variant="outline">{priceLabel}</Badge>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {event.venue} · {formatStartsAt(event.startsAt)}
      </p>
    </VenueCardShell>
  );
}
