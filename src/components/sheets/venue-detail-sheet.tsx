"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRentalUi, type VenueDetailTarget } from "@/components/chat/rental-ui-context";

function formatEventDate(iso: string) {
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

function RentalDetailBody({ detail }: { detail: Extract<VenueDetailTarget, { kind: "rental" }> }) {
  const { openScheduleViewing, closeVenueDetail } = useRentalUi();

  return (
    <>
      {detail.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={detail.photoUrl}
          alt=""
          className="max-h-48 w-full rounded-lg object-cover"
        />
      ) : null}
      <dl className="grid gap-2 text-sm">
        {detail.bedrooms != null ? (
          <div>
            <dt className="text-muted-foreground">Bedrooms</dt>
            <dd>{detail.bedrooms}</dd>
          </div>
        ) : null}
        {detail.hostName ? (
          <div>
            <dt className="text-muted-foreground">Host</dt>
            <dd>{detail.hostName}</dd>
          </div>
        ) : null}
        {detail.availability ? (
          <div>
            <dt className="text-muted-foreground">Availability</dt>
            <dd>{detail.availability}</dd>
          </div>
        ) : null}
        {detail.amenities && detail.amenities.length > 0 ? (
          <div>
            <dt className="text-muted-foreground">Amenities</dt>
            <dd>{detail.amenities.slice(0, 6).join(" · ")}</dd>
          </div>
        ) : null}
      </dl>
      <SheetFooter className="px-0">
        <Button
          type="button"
          data-testid="venue-detail-schedule-cta"
          onClick={() => {
            closeVenueDetail();
            openScheduleViewing({
              listingId: detail.listingId,
              title: detail.title,
              neighborhood: detail.neighborhood,
            });
          }}
        >
          <Calendar className="size-4" aria-hidden />
          Schedule viewing
        </Button>
      </SheetFooter>
    </>
  );
}

function EventDetailBody({ detail }: { detail: Extract<VenueDetailTarget, { kind: "event" }> }) {
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
          <dd>{formatEventDate(detail.startsAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Venue</dt>
          <dd>{detail.venue}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">From</dt>
          <dd>${detail.pricePerTicket.toLocaleString("en-US")} USD</dd>
        </div>
      </dl>
      <SheetFooter className="px-0">
        <Link
          href={detail.ticketUrl}
          data-testid="venue-detail-buy-cta"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Ticket className="size-4" aria-hidden />
          Buy tickets
        </Link>
      </SheetFooter>
    </>
  );
}

/** SCREEN-007 — rental/event detail slide-over on `/`. */
export function VenueDetailSheet() {
  const { venueDetail, closeVenueDetail } = useRentalUi();

  const priceLabel =
    venueDetail?.kind === "rental" && venueDetail.nightlyPrice != null
      ? `$${venueDetail.nightlyPrice.toLocaleString("en-US")}/night`
      : venueDetail?.kind === "event"
        ? `$${venueDetail.pricePerTicket.toLocaleString("en-US")} ticket`
        : undefined;

  return (
    <Sheet
      open={venueDetail != null}
      onOpenChange={(open) => {
        if (!open) closeVenueDetail();
      }}
    >
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto sm:max-w-lg"
        data-testid="venue-detail-sheet"
      >
        {venueDetail ? (
          <>
            <SheetHeader>
              <SheetTitle>{venueDetail.title}</SheetTitle>
              <SheetDescription>
                {venueDetail.neighborhood}
                {priceLabel ? ` · ${priceLabel}` : ""}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-4">
              {venueDetail.kind === "rental" ? (
                <RentalDetailBody detail={venueDetail} />
              ) : (
                <EventDetailBody detail={venueDetail} />
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
