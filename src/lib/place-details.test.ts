import { describe, expect, it } from "vitest";
import { normalizePlaceDetails } from "./place-details";

describe("normalizePlaceDetails", () => {
  it("maps Places API fields to client DTO", () => {
    const dto = normalizePlaceDetails({
      id: "places/ChIJTest",
      displayName: { text: "Pergamino" },
      formattedAddress: "Cq 73 #34-65, Medellín",
      rating: 4.6,
      userRatingCount: 1700,
      priceLevel: "PRICE_LEVEL_MODERATE",
      currentOpeningHours: {
        openNow: false,
        weekdayDescriptions: ["Monday: 7:30 AM – 8:00 PM"],
      },
      photos: [{ name: "places/ChIJTest/photos/abc" }],
      websiteUri: "https://www.pergamino.co",
      nationalPhoneNumber: "+57 318 8211303",
      googleMapsLinks: {
        placeUri: "https://maps.google.com/?cid=1",
        directionsUri: "https://maps.google.com/dir/?cid=1",
        reviewsUri: "https://maps.google.com/reviews/?cid=1",
      },
      types: ["coffee_shop", "cafe"],
    });

    expect(dto?.placeId).toBe("ChIJTest");
    expect(dto?.displayName).toBe("Pergamino");
    expect(dto?.openNow).toBe(false);
    expect(dto?.weekdayDescriptions).toHaveLength(1);
    expect(dto?.photoNames).toEqual(["places/ChIJTest/photos/abc"]);
    expect(dto?.websiteUri).toContain("pergamino.co");
    expect(dto?.nationalPhoneNumber).toContain("+57");
    expect(dto?.mapsUrl).toContain("maps.google.com");
  });

  it("returns null for invalid payload", () => {
    expect(normalizePlaceDetails(null)).toBeNull();
    expect(normalizePlaceDetails({})).toBeNull();
  });
});
