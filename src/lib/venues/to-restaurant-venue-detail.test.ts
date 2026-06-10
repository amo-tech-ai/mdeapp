import { describe, expect, it } from "vitest";
import { toRestaurantVenueDetail } from "./to-restaurant-venue-detail";

describe("toRestaurantVenueDetail", () => {
  it("maps search row fields to restaurant booking target", () => {
    const detail = toRestaurantVenueDetail({
      pinId: "restaurant-r1",
      title: "Rocoto",
      placeId: "ChIJ_test",
      mapsUrl: "https://maps.google.com/?cid=1",
      neighborhood: "Laureles",
      cuisine: "international",
      rating: 4.6,
      aiSummary: "Creative plates.",
      rank: 2,
    });

    expect(detail).toEqual({
      kind: "restaurant",
      pinId: "restaurant-r1",
      title: "Rocoto",
      placeId: "ChIJ_test",
      mapsUrl: "https://maps.google.com/?cid=1",
      neighborhood: "Laureles",
      cuisine: "international",
      rating: 4.6,
      summary: "Creative plates.",
      rank: 2,
    });
  });
});
