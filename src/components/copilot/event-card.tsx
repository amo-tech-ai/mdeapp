import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventCardProps = {
  id: string;
  eventId: string;
  title: string;
  venue: string;
  neighborhood: string;
  startsAt: string;
  pricePerTicket: number;
  imageUrl?: string;
  ticketUrl: string;
  sourceUrl?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onOpenDetails?: () => void;
  /** Opens venue sheet checkout step without navigating away from chat. */
  onBuyTickets?: () => void;
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

/** SCREEN-006 / F25 inline — event card in CopilotChat tool render. */
export function EventCard({
  id,
  title,
  venue,
  neighborhood,
  startsAt,
  pricePerTicket,
  imageUrl,
  ticketUrl,
  sourceUrl,
  selected,
  onSelect,
  onOpenDetails,
  onBuyTickets,
}: EventCardProps) {
  const cardLabel = `Event: ${title}${neighborhood ? `, ${neighborhood}` : ""}`;

  return (
    <article
      className={cn(
        "shrink-0 overflow-hidden rounded-lg border bg-card text-sm shadow-sm",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
      )}
      data-testid="event-card"
      data-result-kind="event"
      data-pin-id={id}
      data-selected={selected ? "true" : "false"}
      aria-label={cardLabel}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="h-28 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className="flex h-28 items-center justify-center bg-muted text-xs text-muted-foreground"
          aria-hidden
        >
          Event photo
        </div>
      )}
      <div
        className="p-3"
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={
          onSelect
            ? () => {
                if (onOpenDetails) onOpenDetails();
                else onSelect(id);
              }
            : undefined
        }
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onOpenDetails) onOpenDetails();
                  else onSelect(id);
                }
              }
            : undefined
        }
      >
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground">
          {venue} · {neighborhood}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatStartsAt(startsAt)}
        </p>
        <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          From ${pricePerTicket.toLocaleString("en-US")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {onBuyTickets ? (
            <Button
              type="button"
              size="sm"
              data-testid="event-buy-cta"
              onClick={(e) => {
                e.stopPropagation();
                onBuyTickets();
              }}
            >
              <Ticket className="size-3.5" aria-hidden />
              Buy tickets
            </Button>
          ) : (
            <Link
              href={ticketUrl}
              data-testid="event-buy-cta"
              className={cn(buttonVariants({ size: "sm", variant: "default" }))}
              onClick={(e) => e.stopPropagation()}
            >
              <Ticket className="size-3.5" aria-hidden />
              Buy tickets
            </Link>
          )}
          {sourceUrl && sourceUrl !== ticketUrl && sourceUrl.startsWith("http") ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="event-source-link"
              className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              onClick={(e) => e.stopPropagation()}
            >
              Source
            </a>
          ) : null}
          {onOpenDetails ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="event-details-cta"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
            >
              Details
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
