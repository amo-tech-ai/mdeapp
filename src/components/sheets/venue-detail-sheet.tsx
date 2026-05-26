"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar } from "lucide-react";
import { useRentalUi, type VenueDetailTarget } from "@/components/chat/rental-ui-context";
import { EventVenueDetailBody } from "@/components/sheets/event-venue-detail-body";
import { usePublicEventDetail } from "@/hooks/use-public-event-detail";

function RentalDetailBody({
  detail,
}: {
  detail: Extract<VenueDetailTarget, { kind: "rental" }>;
}) {
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

/** SCREEN-007 — rental/event detail slide-over on `/`. */
export function VenueDetailSheet() {
  const { venueDetail, closeVenueDetail, setEventVenueStep } = useRentalUi();
  const eventId =
    venueDetail?.kind === "event" ? venueDetail.eventId : null;
  const { event: publicEvent, state: loadState, error: loadError } =
    usePublicEventDetail(eventId);

  const priceLabel =
    venueDetail?.kind === "rental" && venueDetail.nightlyPrice != null
      ? `$${venueDetail.nightlyPrice.toLocaleString("en-US")}/night`
      : venueDetail?.kind === "event"
        ? `$${venueDetail.pricePerTicket.toLocaleString("en-US")} ticket`
        : undefined;

  const eventStep =
    venueDetail?.kind === "event" ? (venueDetail.step ?? "detail") : "detail";

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
        data-event-step={
          venueDetail?.kind === "event" ? eventStep : undefined
        }
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
                <EventVenueDetailBody
                  detail={venueDetail}
                  step={eventStep}
                  loadState={loadState}
                  publicEvent={publicEvent}
                  loadError={loadError}
                  onStepChange={setEventVenueStep}
                />
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
