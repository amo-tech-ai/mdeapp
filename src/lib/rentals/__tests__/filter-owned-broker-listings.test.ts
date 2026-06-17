import { describe, expect, it } from "vitest";
import { filterOwnedBrokerListings } from "../filter-owned-broker-listings";
import type { BrokerListingDetail } from "../broker-listing-detail";

const row = (id: string, landlordId: string | null): BrokerListingDetail => ({
  id,
  title: `Unit ${id}`,
  neighborhood: "Laureles",
  listingWorkflowStatus: "published",
  landlordId,
  bedrooms: 1,
  bathrooms: 1,
  priceMonthly: 1_000_000,
  currency: "COP",
  address: null,
  description: null,
  images: [],
  latitude: null,
  longitude: null,
  publishedAt: null,
  amenities: [],
});

describe("filterOwnedBrokerListings", () => {
  it("keeps only rows owned by broker landlord profiles", () => {
    const listings = [row("mine", "lp-1"), row("other", "lp-2"), row("orphan", null)];
    const owned = filterOwnedBrokerListings(listings, ["lp-1"]);
    expect(owned.map((l) => l.id)).toEqual(["mine"]);
  });

  it("returns empty when broker has no landlord profiles", () => {
    expect(filterOwnedBrokerListings([row("x", "lp-1")], [])).toEqual([]);
  });
});
