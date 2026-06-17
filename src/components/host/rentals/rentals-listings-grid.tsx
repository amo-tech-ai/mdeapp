"use client";

import Image from "next/image";
import type { BrokerListingDetail } from "@/lib/rentals/broker-listing-detail";
import { formatBrokerMonthlyRent } from "@/lib/rentals/format-broker-rent";
import { ListingWorkflowPill } from "@/components/host/rentals/listing-workflow-pill";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RentalsListingsGridProps = {
  listings: BrokerListingDetail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function RentalsListingsGrid({
  listings,
  selectedId,
  onSelect,
}: RentalsListingsGridProps) {
  return (
    <div
      data-testid="rentals-listings-grid"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {listings.map((listing) => {
        const hero = listing.images[0];
        return (
          <button
            key={listing.id}
            type="button"
            data-testid={`lx-card-${listing.id}`}
            onClick={() => onSelect(listing.id)}
            className="text-left"
          >
            <Card
              className={cn(
                "overflow-hidden transition-shadow hover:shadow-md",
                selectedId === listing.id && "ring-2 ring-primary",
              )}
            >
              <div className="relative aspect-[4/3] bg-muted">
                {hero ? (
                  <Image
                    src={hero}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No photo yet
                  </div>
                )}
              </div>
              <div className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold">{listing.title}</h3>
                  <ListingWorkflowPill status={listing.listingWorkflowStatus} compact />
                </div>
                <p className="text-xs text-muted-foreground">{listing.neighborhood}</p>
                <p className="text-sm font-medium">
                  {formatBrokerMonthlyRent(listing.priceMonthly, listing.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {listing.bedrooms ?? "—"} BR · {listing.bathrooms ?? "—"} BA
                </p>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
