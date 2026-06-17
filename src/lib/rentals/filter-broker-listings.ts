import type { BrokerListingDetail } from "./broker-listing-detail";
import type { ListingWorkflowStatus } from "./listing-workflow";

export type BrokerListingStatusFilter =
  | "all"
  | "draft"
  | "review"
  | "published"
  | "paused"
  | "rejected";

export type BrokerListingFilterInput = {
  query: string;
  status: BrokerListingStatusFilter;
};

/** Map workflow status to inventory filter bucket (`ready_for_review` → `review`). */
export function brokerListingStatusBucket(
  status: ListingWorkflowStatus,
): Exclude<BrokerListingStatusFilter, "all"> {
  if (status === "ready_for_review") return "review";
  return status;
}

/** Filter broker-owned listings by search text and status chip. */
export function filterBrokerListings(
  listings: readonly BrokerListingDetail[],
  filters: BrokerListingFilterInput,
): BrokerListingDetail[] {
  const q = filters.query.trim().toLowerCase();
  return listings.filter((listing) => {
    if (q.length > 0) {
      const haystack = `${listing.title} ${listing.neighborhood}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.status !== "all") {
      if (brokerListingStatusBucket(listing.listingWorkflowStatus) !== filters.status) {
        return false;
      }
    }
    return true;
  });
}
