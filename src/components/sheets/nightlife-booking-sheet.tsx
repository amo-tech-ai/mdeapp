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
import { CalendarCheck, ExternalLink, MapPin } from "lucide-react";

/** Phase A stub — real persist lands in VEN-021 (separate PR). */
export function NightlifeBookingSheet({
  target,
  open,
  onOpenChange,
}: {
  target: NightlifeVenueDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="flex items-start gap-2">
                  <CalendarCheck className="mt-0.5 size-4 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium">Booking stub for Phase A</p>
                    <p className="mt-1 text-muted-foreground">
                      No request is sent yet. Persistence ships in VEN-021 after
                      schema + RLS are verified.
                    </p>
                  </div>
                </div>
              </div>

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
                {target.placeId ? <Badge variant="outline">Place ID verified</Badge> : null}
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
