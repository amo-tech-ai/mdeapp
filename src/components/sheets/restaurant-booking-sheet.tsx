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
import type { RestaurantVenueDetail } from "@/components/chat/rental-ui-context";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { VenueBookingForm } from "@/components/sheets/venue-booking-form";
import { ExternalLink } from "lucide-react";

export function RestaurantBookingSheet({
  target,
  open,
  onOpenChange,
}: {
  target: RestaurantVenueDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setVenueBookingConfirmation } = useRentalUi();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto sm:max-w-lg"
        data-testid="restaurant-booking-sheet"
      >
        {target ? (
          <>
            <SheetHeader>
              <SheetTitle>Request a table</SheetTitle>
              <SheetDescription>
                {target.title}
                {target.neighborhood ? ` · ${target.neighborhood}` : ""}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4 px-4 pb-4 text-sm">
              {target.placeId ? (
                <VenueBookingForm
                  venueKind="restaurant"
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
                  data-testid="restaurant-booking-missing-place-id"
                >
                  This listing is missing a verified Place ID — table requests
                  cannot be saved yet.
                </p>
              )}

              <SheetFooter className="px-0">
                {target.mapsUrl ? (
                  <a
                    href={target.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-sm font-medium text-primary hover:bg-muted"
                    data-testid="restaurant-booking-maps-link"
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
