import { describe, expect, it } from "vitest";
import { mapBrokerListingRow } from "../map-broker-listing-row";

describe("mapBrokerListingRow", () => {
  it("maps snake_case apartment row to broker listing detail", () => {
    const detail = mapBrokerListingRow({
      id: "apt-1",
      title: "Loft",
      neighborhood: "Poblado",
      listing_workflow_status: "draft",
      landlord_id: "lp-9",
      bedrooms: 1,
      bathrooms: 1,
      price_monthly: 2_500_000,
      currency: "COP",
      address: "Cra 35",
      description: "City views",
      images: ["https://example.com/a.jpg"],
      latitude: 6.2,
      longitude: -75.57,
      published_at: null,
      amenities: ["Wifi"],
    });

    expect(detail).toMatchObject({
      id: "apt-1",
      listingWorkflowStatus: "draft",
      landlordId: "lp-9",
      images: ["https://example.com/a.jpg"],
      amenities: ["Wifi"],
    });
  });

  it("throws on invalid workflow status", () => {
    expect(() =>
      mapBrokerListingRow({
        id: "x",
        title: "x",
        neighborhood: "x",
        listing_workflow_status: "bogus",
        landlord_id: null,
        bedrooms: null,
        bathrooms: null,
        price_monthly: null,
        currency: null,
        address: null,
        description: null,
        images: null,
        latitude: null,
        longitude: null,
        published_at: null,
        amenities: null,
      }),
    ).toThrow(/invalid listing_workflow_status/);
  });
});
