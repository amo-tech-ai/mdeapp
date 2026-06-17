"use client";

import type { BrokerListingDetail } from "@/lib/rentals/broker-listing-detail";
import type { BrokerListingStatusFilter } from "@/lib/rentals/filter-broker-listings";
import { formatBrokerMonthlyRent } from "@/lib/rentals/format-broker-rent";
import { ListingWorkflowPill } from "@/components/host/rentals/listing-workflow-pill";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: BrokerListingStatusFilter; label: string; testId: string }[] = [
  { value: "all", label: "All", testId: "lx-filter-all" },
  { value: "draft", label: "Draft", testId: "lx-filter-draft" },
  { value: "review", label: "Review", testId: "lx-filter-review" },
  { value: "published", label: "Published", testId: "lx-filter-published" },
  { value: "paused", label: "Paused", testId: "lx-filter-paused" },
];

type RentalsInventoryNavProps = {
  listings: BrokerListingDetail[];
  visibleListings: BrokerListingDetail[];
  selectedId: string | null;
  query: string;
  statusFilter: BrokerListingStatusFilter;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: BrokerListingStatusFilter) => void;
  onSelect: (id: string) => void;
};

export function RentalsInventoryNav({
  listings,
  visibleListings,
  selectedId,
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
  onSelect,
}: RentalsInventoryNavProps) {
  return (
    <aside
      data-testid="lx-left"
      className="flex min-h-0 w-full shrink-0 flex-col gap-3 border-border lg:w-80 lg:border-r lg:pr-4"
    >
      <div>
        <h2 className="text-sm font-semibold text-foreground">Inventory</h2>
        <p className="text-xs text-muted-foreground">
          {visibleListings.length} of {listings.length} listings
        </p>
      </div>

      <Input
        data-testid="lx-search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search listings…"
        aria-label="Search listings"
      />

      <div className="flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            data-testid={chip.testId}
            onClick={() => onStatusFilterChange(chip.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              statusFilter === chip.value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto" aria-label="Property list">
        {visibleListings.map((listing) => (
          <li key={listing.id}>
            <button
              type="button"
              data-testid={`lx-nav-${listing.id}`}
              onClick={() => onSelect(listing.id)}
              className={cn(
                "flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors",
                selectedId === listing.id
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:bg-muted/60",
              )}
            >
              <span className="line-clamp-1 text-sm font-medium">{listing.title}</span>
              <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{listing.neighborhood}</span>
                <ListingWorkflowPill status={listing.listingWorkflowStatus} compact />
              </span>
              <span className="text-xs text-foreground">
                {formatBrokerMonthlyRent(listing.priceMonthly, listing.currency)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
