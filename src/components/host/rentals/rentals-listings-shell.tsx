"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { BrokerListingDetail } from "@/lib/rentals/broker-listing-detail";
import {
  filterBrokerListings,
  type BrokerListingStatusFilter,
} from "@/lib/rentals/filter-broker-listings";
import { RentalsInventoryNav } from "@/components/host/rentals/rentals-inventory-nav";
import { RentalsListingsDrawer } from "@/components/host/rentals/rentals-listings-drawer";
import { RentalsListingsGrid } from "@/components/host/rentals/rentals-listings-grid";
import { RentalsListingsMap } from "@/components/host/rentals/rentals-listings-map";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type RentalsListingsShellProps = {
  initialListings: BrokerListingDetail[];
  loadError: string | null;
};

export function RentalsListingsShell({
  initialListings,
  loadError,
}: RentalsListingsShellProps) {
  const [listings, setListings] = useState(initialListings);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrokerListingStatusFilter>("all");
  const [mapOn, setMapOn] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const visibleListings = useMemo(
    () => filterBrokerListings(listings, { query, status: statusFilter }),
    [listings, query, statusFilter],
  );

  const selectedListing = useMemo(
    () => listings.find((l) => l.id === selectedId) ?? null,
    [listings, selectedId],
  );

  const handlePublish = useCallback(async (listing: BrokerListingDetail) => {
    setPublishing(true);
    setPublishError(null);
    try {
      const res = await fetch("/api/host/rentals/listings/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartmentId: listing.id,
          listingWorkflowStatus: listing.listingWorkflowStatus,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        transition?: { apartmentId: string; listingWorkflowStatus: string };
      };
      if (!res.ok) {
        throw new Error(body.error ?? "Publish failed");
      }
      if (body.transition) {
        setListings((prev) =>
          prev.map((row) =>
            row.id === body.transition!.apartmentId
              ? {
                  ...row,
                  listingWorkflowStatus: body.transition!
                    .listingWorkflowStatus as BrokerListingDetail["listingWorkflowStatus"],
                }
              : row,
          ),
        );
      }
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  }, []);

  if (loadError) {
    return (
      <EmptyState
        testId="rentals-listings-error"
        title="Failed to load listings"
        description={loadError}
        suggestions={[
          {
            label: "Retry",
            testId: "rentals-listings-retry",
            onClick: () => window.location.reload(),
          },
        ]}
      />
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        testId="rentals-listings-empty"
        title="No listings yet"
        description="Add your first rental unit to start managing inventory."
        suggestions={[
          {
            label: "Start onboarding",
            testId: "rentals-listings-onboarding",
            onClick: () => {
              window.location.href = "/host/rentals/onboarding";
            },
          },
        ]}
      />
    );
  }

  return (
    <div data-testid="listings-explorer" className="flex min-h-[70vh] flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            All listings · {visibleListings.length}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your rental inventory — grid first, optional map split.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mapOn ? "outline" : "default"}
            size="sm"
            data-testid="le-view-grid"
            onClick={() => setMapOn(false)}
          >
            Grid
          </Button>
          <Button
            type="button"
            variant={mapOn ? "default" : "outline"}
            size="sm"
            data-testid="le-view-map"
            onClick={() => setMapOn(true)}
          >
            Split map
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <RentalsInventoryNav
          listings={listings}
          visibleListings={visibleListings}
          selectedId={selectedId}
          query={query}
          statusFilter={statusFilter}
          onQueryChange={setQuery}
          onStatusFilterChange={setStatusFilter}
          onSelect={(id) => {
            setSelectedId(id);
            setPublishError(null);
          }}
        />

        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col gap-4",
            mapOn && "lg:flex-row",
          )}
        >
          <div className={cn("min-h-0 flex-1", mapOn && "lg:w-[70%]")}>
            {visibleListings.length === 0 ? (
              <EmptyState
                testId="rentals-listings-filter-empty"
                title="No listings match your filters"
                description="Try clearing search or status filters."
              />
            ) : (
              <RentalsListingsGrid
                listings={visibleListings}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setPublishError(null);
                }}
              />
            )}
          </div>

          {mapOn ? (
            <div className="min-h-[280px] lg:w-[30%]">
              <RentalsListingsMap
                listings={visibleListings}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setPublishError(null);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        data-testid="rentals-listings-helper"
        className="sticky bottom-0 border-t border-border bg-background/95 px-3 py-2 backdrop-blur"
      >
        <p className="text-xs text-muted-foreground">
          Deep AI workflows (ad copy, multi-turn analysis) live in{" "}
          <Link href="/host/rentals" className="text-primary hover:underline">
            Concierge
          </Link>
          .
        </p>
      </div>

      <RentalsListingsDrawer
        key={selectedId ?? "closed"}
        listing={selectedListing}
        open={selectedId != null}
        onClose={() => {
          setSelectedId(null);
          setPublishError(null);
        }}
        onPublish={handlePublish}
        publishing={publishing}
        publishError={publishError}
      />
    </div>
  );
}

export function RentalsListingsSkeleton() {
  return (
    <div data-testid="rentals-listings-loading" className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
