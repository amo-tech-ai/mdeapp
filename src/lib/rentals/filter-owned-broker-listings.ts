import type { BrokerListingDetail } from "./broker-listing-detail";

/** Keep only rows owned by the broker's landlord profile ids (inventory scope). */
export function filterOwnedBrokerListings(
  listings: readonly BrokerListingDetail[],
  landlordProfileIds: readonly string[],
): BrokerListingDetail[] {
  const owned = new Set(landlordProfileIds);
  if (owned.size === 0) return [];
  return listings.filter(
    (listing) => listing.landlordId != null && owned.has(listing.landlordId),
  );
}
