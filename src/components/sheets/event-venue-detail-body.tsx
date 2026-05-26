"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ExternalLink, MapPin, Ticket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookingCheckoutModal,
  type BookingCheckoutTarget,
} from "@/components/modals/booking-checkout-modal";
import { EventTicketTiers } from "@/components/events/event-ticket-tiers";
import { formatEventSchedule } from "@/lib/events/format-event";
import type { PublicEventDetail } from "@/lib/events/types";
import type { EventVenueDetail } from "@/components/chat/rental-ui-context";
import type { PublicEventLoadState } from "@/hooks/use-public-event-detail";
import { cn } from "@/lib/utils";

function isHttpUrl(url: string | undefined): url is string {
  return Boolean(url?.startsWith("http"));
}

type EventVenueDetailBodyProps = {
  detail: EventVenueDetail;
  step: "detail" | "checkout";
  loadState: PublicEventLoadState;
  publicEvent: PublicEventDetail | null;
  loadError: string | null;
  onStepChange: (step: "detail" | "checkout") => void;
};

export function EventVenueDetailBody({
  detail,
  step,
  loadState,
  publicEvent,
  loadError,
  onStepChange,
}: EventVenueDetailBodyProps) {
  const [checkout, setCheckout] = useState<BookingCheckoutTarget | null>(null);

  const returnPath = `/events/${publicEvent?.slug ?? detail.eventId}`;
  const scheduleLabel = publicEvent
    ? formatEventSchedule(publicEvent.startsAt, publicEvent.endsAt)
    : null;
  const venueLine = publicEvent
    ? [publicEvent.address, publicEvent.city].filter(Boolean).join(" · ")
    : `${detail.venue} · ${detail.neighborhood}`;
  const mapsUrl = isHttpUrl(detail.sourceUrl) ? detail.sourceUrl : undefined;

  if (step === "checkout") {
    return (
      <>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit"
          data-testid="event-sheet-back-to-detail"
          onClick={() => onStepChange("detail")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to details
        </Button>

        {loadState === "loading" || loadState === "idle" ? (
          <p className="text-sm text-muted-foreground" data-testid="event-sheet-loading">
            Loading tickets…
          </p>
        ) : null}

        {loadState === "error" ? (
          <div className="space-y-3 text-sm" data-testid="event-sheet-load-error">
            <p className="text-destructive">{loadError ?? "Could not load tickets"}</p>
            <Link
              href={detail.ticketUrl}
              className={cn(buttonVariants({ variant: "default" }))}
              data-testid="event-sheet-fallback-page"
            >
              Open full event page
            </Link>
          </div>
        ) : null}

        {loadState === "ready" && publicEvent ? (
          <EventTicketTiers
            event={publicEvent}
            compactFooter
            onCheckout={(target) => setCheckout(target)}
          />
        ) : null}

        <BookingCheckoutModal
          target={checkout}
          returnPath={returnPath}
          onClose={() => setCheckout(null)}
        />
      </>
    );
  }

  return (
    <>
      {detail.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={detail.imageUrl}
          alt=""
          className="max-h-48 w-full rounded-lg object-cover"
        />
      ) : null}

      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">When</dt>
          <dd data-testid="event-sheet-when">
            {scheduleLabel ??
              new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(detail.startsAt))}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Venue</dt>
          <dd data-testid="event-sheet-venue">{venueLine}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">From</dt>
          <dd>${detail.pricePerTicket.toLocaleString("en-US")}</dd>
        </div>
      </dl>

      {publicEvent?.description ? (
        <section>
          <h3 className="text-sm font-semibold">About</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
            {publicEvent.description}
          </p>
        </section>
      ) : null}

      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-fit gap-1.5",
          )}
          data-testid="event-sheet-maps-link"
        >
          <MapPin className="size-3.5" aria-hidden />
          Venue on Maps
        </a>
      ) : null}

      {loadState === "loading" ? (
        <p className="text-xs text-muted-foreground">Loading ticket options…</p>
      ) : null}

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          data-testid="venue-detail-buy-cta"
          onClick={() => onStepChange("checkout")}
        >
          <Ticket className="size-4" aria-hidden />
          Buy tickets
        </Button>
        <Link
          href={detail.ticketUrl}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "inline-flex gap-1.5",
          )}
          data-testid="event-sheet-full-page-link"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          Open full event page
        </Link>
      </div>
    </>
  );
}
