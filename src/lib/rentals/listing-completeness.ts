import type { BrokerListingDetail } from "./broker-listing-detail";

export type ListingCompletenessCheck = {
  key: string;
  label: string;
  gain: number;
  complete: boolean;
};

/** Profile completeness checks mirrored from ListingsManager kit (no fake scores). */
export function listingCompletenessChecks(
  listing: BrokerListingDetail,
): ListingCompletenessCheck[] {
  return [
    { key: "title", label: "Title", gain: 14, complete: listing.title.trim().length > 0 },
    { key: "neighborhood", label: "Neighborhood", gain: 14, complete: listing.neighborhood.trim().length > 0 },
    {
      key: "desc",
      label: "Add a description",
      gain: 14,
      complete: (listing.description?.trim().length ?? 0) > 0,
    },
    {
      key: "photos",
      label: "Add 3+ photos",
      gain: 14,
      complete: listing.images.length >= 3,
    },
    {
      key: "rent",
      label: "Add monthly rent",
      gain: 14,
      complete: listing.priceMonthly != null,
    },
    {
      key: "amen",
      label: "List 3+ amenities",
      gain: 14,
      complete: listing.amenities.length >= 3,
    },
    {
      key: "beds",
      label: "Bedroom count",
      gain: 14,
      complete: listing.bedrooms != null,
    },
  ];
}

export function listingCompletenessPercent(listing: BrokerListingDetail): number {
  const checks = listingCompletenessChecks(listing);
  const done = checks.filter((c) => c.complete).length;
  return Math.round((done / checks.length) * 100);
}
