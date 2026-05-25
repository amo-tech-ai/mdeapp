"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, Share2, Ticket } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BookingCheckoutModal,
  type BookingCheckoutTarget,
} from "@/components/modals/booking-checkout-modal";
import {
  formatEventSchedule,
  formatTicketPrice,
  ticketsRemaining,
} from "@/lib/events/format-event";
import type { PublicEventDetail, PublicEventTicket } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type TierQuantities = Record<string, number>;

function initialQuantities(tickets: PublicEventTicket[]): TierQuantities {
  const next: TierQuantities = {};
  for (const tier of tickets) {
    next[tier.id] = ticketsRemaining(tier.qtyTotal, tier.qtySold) > 0 ? 1 : 0;
  }
  return next;
}

function lowestAvailablePrice(tickets: PublicEventTicket[]): PublicEventTicket | null {
  const available = tickets.filter((t) => ticketsRemaining(t.qtyTotal, t.qtySold) > 0);
  if (available.length === 0) return null;
  return available.reduce((min, t) => (t.priceCents < min.priceCents ? t : min));
}

type EventDetailViewProps = {
  event: PublicEventDetail;
};

export function EventDetailView({ event }: EventDetailViewProps) {
  const [quantities, setQuantities] = useState<TierQuantities>(() =>
    initialQuantities(event.tickets),
  );
  const [checkout, setCheckout] = useState<BookingCheckoutTarget | null>(null);

  const scheduleLabel = formatEventSchedule(event.startsAt, event.endsAt);
  const venueLine = [event.address, event.city].filter(Boolean).join(" · ");
  const fromTier = useMemo(() => lowestAvailablePrice(event.tickets), [event.tickets]);
  const returnPath = `/events/${event.slug ?? event.id}`;

  const openCheckout = (tier: PublicEventTicket) => {
    const qty = quantities[tier.id] ?? 1;
    if (qty < 1) return;
    setCheckout({
      event: { id: event.id, name: event.name },
      tier,
      quantity: qty,
    });
  };

  const primaryTier = fromTier ?? event.tickets[0] ?? null;
  const stickyTotal =
    primaryTier && (quantities[primaryTier.id] ?? 0) > 0
      ? formatTicketPrice(
          primaryTier.priceCents * (quantities[primaryTier.id] ?? 1),
          primaryTier.currency,
        )
      : fromTier
        ? formatTicketPrice(fromTier.priceCents, fromTier.currency)
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

            <section aria-labelledby="event-tiers-heading">
              <h2 id="event-tiers-heading" className="text-lg font-semibold">
                Tickets
              </h2>
              <ul className="mt-3 space-y-3" data-testid="event-tier-list">
                {event.tickets.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Ticket tiers coming soon. Check back or ask the concierge in chat.
                  </li>
                ) : (
                  event.tickets.map((tier) => {
                    const remaining = ticketsRemaining(tier.qtyTotal, tier.qtySold);
                    const soldOut = remaining === 0;
                    const qty = quantities[tier.id] ?? 0;

                    return (
                      <li
                        key={tier.id}
                        className="rounded-lg border border-border p-3"
                        data-testid="event-tier-row"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{tier.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatTicketPrice(tier.priceCents, tier.currency)}
                            </p>
                            {!soldOut && remaining <= 20 ? (
                              <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                                {remaining} left
                              </p>
                            ) : null}
                            {soldOut ? (
                              <p className="mt-1 text-xs font-medium text-muted-foreground">
                                Sold out
                              </p>
                            ) : null}
                          </div>
                          {!soldOut ? (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label={`Decrease ${tier.name} quantity`}
                                disabled={qty <= 0}
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.max(0, (prev[tier.id] ?? 0) - 1),
                                  }))
                                }
                              >
                                <Minus className="size-3.5" />
                              </Button>
                              <span
                                className="min-w-[1.5rem] text-center text-sm font-medium"
                                data-testid="event-tier-qty"
                              >
                                {qty}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label={`Increase ${tier.name} quantity`}
                                disabled={qty >= remaining}
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.min(
                                      remaining,
                                      (prev[tier.id] ?? 0) + 1,
                                    ),
                                  }))
                                }
                              >
                                <Plus className="size-3.5" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                        {!soldOut ? (
                          <Button
                            type="button"
                            className="mt-3 w-full"
                            size="sm"
                            disabled={qty < 1}
                            data-testid="event-tier-buy"
                            onClick={() => openCheckout(tier)}
                          >
                            <Ticket className="size-3.5" aria-hidden />
                            Buy {tier.name}
                          </Button>
                        ) : null}
                      </li>
                    );
                  })
                )}
              </ul>
            </section>

            {primaryTier && ticketsRemaining(primaryTier.qtyTotal, primaryTier.qtySold) > 0 ? (
              <Button
                type="button"
                className="hidden w-full md:inline-flex"
                data-testid="event-detail-buy-cta"
                onClick={() => openCheckout(primaryTier)}
              >
                Buy tickets
              </Button>
            ) : null}
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
              onClick={() => openCheckout(primaryTier)}
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
