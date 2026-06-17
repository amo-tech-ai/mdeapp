import { describe, expect, it } from "vitest";
import { filterBrokerListings } from "../filter-broker-listings";
import type { BrokerListingDetail } from "../broker-listing-detail";

const BASE: BrokerListingDetail = {
  id: "a1",
  title: "Bright 2BR",
  neighborhood: "Laureles",
  listingWorkflowStatus: "published",
  landlordId: "lp1",
  bedrooms: 2,
  bathrooms: 2,
  priceMonthly: 3_200_000,
  currency: "COP",
  address: "Cra 70",
  description: "Nice unit",
  images: ["https://example.com/1.jpg"],
  latitude: 6.25,
  longitude: -75.59,
  publishedAt: "2026-06-01T00:00:00Z",
  amenities: ["Wifi", "Balcony", "Parking"],
};

describe("filterBrokerListings", () => {
  const listings: BrokerListingDetail[] = [
    BASE,
    {
      ...BASE,
      id: "a2",
      title: "Studio Provenza",
      neighborhood: "Provenza",
      listingWorkflowStatus: "draft",
    },
    {
      ...BASE,
      id: "a3",
      title: "3BR Envigado",
      neighborhood: "Envigado",
      listingWorkflowStatus: "ready_for_review",
    },
  ];

  it("returns all when filters are default", () => {
    expect(filterBrokerListings(listings, { query: "", status: "all" })).toHaveLength(3);
  });

  it("filters by search query on title and neighborhood", () => {
    const result = filterBrokerListings(listings, { query: "provenza", status: "all" });
    expect(result.map((r) => r.id)).toEqual(["a2"]);
  });

  it("maps ready_for_review to review status chip", () => {
    const result = filterBrokerListings(listings, { query: "", status: "review" });
    expect(result.map((r) => r.id)).toEqual(["a3"]);
  });
});
