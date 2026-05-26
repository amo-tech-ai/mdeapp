"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookingCheckoutModal,
  type BookingCheckoutTarget,
} from "@/components/modals/booking-checkout-modal";
import { EventTicketTiers } from "@/components/events/event-ticket-tiers";
import {
  formatEventSchedule,
  formatTicketPrice,
  ticketsRemaining,
} from "@/lib/events/format-event";
import type { PublicEventDetail, PublicEventTicket } from "@/lib/events/types";
import { cn } from "@/lib/utils";

function lowestAvailablePrice(tickets: PublicEventTicket[]): PublicEventTicket | null {
  const available = tickets.filter((t) => ticketsRemaining(t.qtyTotal, t.qtySold) > 0);
  if (available.length === 0) return null;
  return available.reduce((min, t) => (t.priceCents < min.priceCents ? t : min));
}

type EventDetailViewProps = {
  event: PublicEventDetail;
};

export function EventDetailView({ event }: EventDetailViewProps) {
  const [checkout, setCheckout] = useState<BookingCheckoutTarget | null>(null);

  const scheduleLabel = formatEventSchedule(event.startsAt, event.endsAt);
  const venueLine = [event.address, event.city].filter(Boolean).join(" · ");
  const fromTier = useMemo(() => lowestAvailablePrice(event.tickets), [event.tickets]);
  const returnPath = `/events/${event.slug ?? event.id}`;

  const primaryTier = fromTier ?? event.tickets[0] ?? null;
  const stickyTotal =
    primaryTier
      ? formatTicketPrice(primaryTier.priceCents, primaryTier.currency)
      : "Sold out";

  return (
    <>
      <div
        className="min-h-screen bg-background pb-24 md:pb-8"
        data-testid="event-detail-page"
      >
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Link
              href="/chat"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1.5",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to chat
            </Link>
            <span className="text-sm font-medium text-muted-foreground">mdeai</span>
            <Button type="button" variant="outline" size="sm" disabled title="Phase 2">
              <Share2 className="size-3.5" aria-hidden />
              Share
            </Button>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-[1fr_minmax(320px,400px)] md:py-8">
          <div className="space-y-6">
            {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.imageUrl}
                alt=""
                className="aspect-[16/10] w-full rounded-xl object-cover"
              />
            ) : (
              <div
                className="flex aspect-[16/10] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground"
                aria-hidden
              >
                Event photo
              </div>
            )}

            <section className="md:hidden">
              <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{scheduleLabel}</p>
              {venueLine ? (
                <p className="mt-1 text-sm text-muted-foreground">{venueLine}</p>
              ) : null}
            </section>

            {event.description ? (
              <section>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="hidden md:block">
              <h1 className="text-2xl font-semibold tracking-tight">{event.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{scheduleLabel}</p>
              {venueLine ? (
                <p className="mt-1 text-sm text-muted-foreground">{venueLine}</p>
              ) : null}
            </div>

            {fromTier ? (
              <p className="text-sm font-medium">
                From {formatTicketPrice(fromTier.priceCents, fromTier.currency)}
              </p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">Sold out</p>
            )}

            <EventTicketTiers
              event={event}
              onCheckout={(target) => setCheckout(target)}
            />
          </aside>
        </div>

        {primaryTier && ticketsRemaining(primaryTier.qtyTotal, primaryTier.qtySold) > 0 ? (
          <div
            className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur md:hidden"
            data-testid="event-detail-mobile-buy-bar"
          >
            <Button
              type="button"
              className="w-full"
              data-testid="event-detail-mobile-buy-cta"
              onClick={() =>
                setCheckout({
                  event: { id: event.id, name: event.name },
                  tier: primaryTier,
                  quantity: 1,
                })
              }
            >
              Buy tickets · {stickyTotal}
            </Button>
          </div>
        ) : null}
      </div>

      <BookingCheckoutModal
        target={checkout}
        returnPath={returnPath}
        onClose={() => setCheckout(null)}
      />
    </>
  );
}
