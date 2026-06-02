"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { NightlifeVenueDetail } from "@/components/chat/rental-ui-context";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { VenueBookingForm } from "@/components/sheets/venue-booking-form";
import { ExternalLink, MapPin } from "lucide-react";

export function NightlifeBookingSheet({
  target,
  open,
  onOpenChange,
}: {
  target: NightlifeVenueDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setVenueBookingConfirmation } = useRentalUi();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto sm:max-w-lg"
        data-testid="nightlife-booking-sheet"
      >
        {target ? (
          <>
            <SheetHeader>
              <SheetTitle>Request a nightlife visit</SheetTitle>
              <SheetDescription>
                {target.title}
                {target.formattedAddress ? ` · ${target.formattedAddress}` : ""}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 pb-4 text-sm">
              {target.placeId ? (
                <VenueBookingForm
                  venueKind="nightclub"
                  placeId={target.placeId}
                  venueTitle={target.title}
                  onSuccess={(result) => {
                    setVenueBookingConfirmation({
                      requestId: result.requestId,
                      message: result.message,
                      venueTitle: target.title,
                    });
                    onOpenChange(false);
                  }}
                />
              ) : (
                <p
                  className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive"
                  data-testid="nightlife-booking-missing-place-id"
                >
                  This listing is missing a verified Place ID — booking requests
                  cannot be saved yet.
                </p>
              )}

              <SheetFooter className="px-0">
                {target.directionsUrl ? (
                  <a
                    href={target.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-primary hover:bg-muted"
                    data-testid="nightlife-booking-directions-link"
                  >
                    <MapPin className="size-4" aria-hidden />
                    Directions
                  </a>
                ) : null}
                {target.mapsUrl ? (
                  <a
                    href={target.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-primary hover:bg-muted"
                    data-testid="nightlife-booking-maps-link"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    Maps
                  </a>
                ) : null}
                <Button type="button" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </SheetFooter>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Google-verified candidate</Badge>
                {target.placeId ? (
                  <Badge variant="outline">Place ID verified</Badge>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
