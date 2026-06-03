import { describe, expect, it } from "vitest";
import { venueKindForBookingQuery } from "@/lib/venues/venue-booking-status-display";

describe("useVenueBookingStatus", () => {
  it("maps nightlife UI kind to nightclub for Supabase query", () => {
    expect(venueKindForBookingQuery("nightlife")).toBe("nightclub");
  });
});
