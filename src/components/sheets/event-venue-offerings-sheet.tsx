"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EventVenueOfferingsTarget } from "@/components/chat/rental-ui-context";
import { useRentalUi } from "@/components/chat/rental-ui-context";

function formatCop(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function offeringLabel(key: string): string {
  return key
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function EventVenueOfferingsContent({
  target,
  onRequestProposal,
}: {
  target: EventVenueOfferingsTarget;
  onRequestProposal?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-6 text-sm">
      <p className="text-muted-foreground">
        Browse offerings and packages for this venue. Request a proposal to
        start planning your private event.
      </p>

      {target.payload.offerings.length > 0 ? (
        <section
          className="flex flex-col gap-3"
          data-testid="event-venue-offerings-list"
        >
          <h3 className="text-sm font-semibold">Offerings</h3>
          <div className="flex flex-col gap-3">
            {target.payload.offerings.map((offering) => (
              <Card
                key={offering.id}
                size="sm"
                data-testid="event-venue-offering-card"
              >
                <CardHeader>
                  <CardTitle>{offeringLabel(offering.offeringKey)}</CardTitle>
                  {offering.minimumSpend != null ? (
                    <CardDescription
                      data-testid="event-venue-offering-minimum-spend"
                    >
                      Minimum spend {formatCop(offering.minimumSpend)}
                    </CardDescription>
                  ) : offering.pricePerPersonFrom != null ? (
                    <CardDescription>
                      From {formatCop(offering.pricePerPersonFrom)} / guest
                    </CardDescription>
                  ) : null}
                </CardHeader>
                {offering.eventTypes.length > 0 ? (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {offering.eventTypes.map((type) => (
                        <Badge key={type} variant="secondary">
                          {offeringLabel(type)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {target.payload.packages.length > 0 ? (
        <section
          className="flex flex-col gap-3"
          data-testid="event-venue-packages-list"
        >
          <h3 className="text-sm font-semibold">Packages</h3>
          <div className="flex flex-col gap-3">
            {target.payload.packages.map((pkg) => (
              <Card
                key={pkg.id}
                size="sm"
                data-testid="event-venue-package-card"
              >
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  {pkg.description ? (
                    <CardDescription>{pkg.description}</CardDescription>
                  ) : null}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    From {formatCop(pkg.priceFrom)} · {pkg.minGuests}–
                    {pkg.maxGuests} guests
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {onRequestProposal ? (
        <SheetFooter className="px-0">
          <Button
            type="button"
            className="w-full"
            onClick={onRequestProposal}
            data-testid="request-proposal-btn"
          >
            Request proposal
          </Button>
        </SheetFooter>
      ) : null}
    </div>
  );
}

export function EventVenueOfferingsSheet({
  target,
  open,
  onOpenChange,
}: {
  target: EventVenueOfferingsTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { openEventProposalShell } = useRentalUi();

  const handleRequestProposal = target
    ? () => {
        openEventProposalShell({
          venueTitle: target.title,
          placeId: target.payload.placeId,
          partnerId: target.payload.partnerId,
          partnerLocationId: target.payload.partnerLocationId,
        });
      }
    : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto sm:max-w-lg"
        data-testid="event-venue-offerings-sheet"
      >
        {target ? (
          <>
            <SheetHeader>
              <SheetTitle>Event venue offerings</SheetTitle>
              <SheetDescription>
                {target.title}
                {target.payload.neighborhood
                  ? ` · ${target.payload.neighborhood}`
                  : ""}
              </SheetDescription>
            </SheetHeader>

            <EventVenueOfferingsContent
              target={target}
              onRequestProposal={handleRequestProposal}
            />
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
