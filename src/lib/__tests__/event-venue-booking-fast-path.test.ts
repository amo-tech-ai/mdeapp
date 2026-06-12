import { describe, expect, it } from "vitest";
import {
  buildEventVenueBookingSearchParams,
  canFastPathEventVenueBooking,
  eventVenueBookingAssistantSummary,
} from "../event-venue-booking-fast-path";

describe("event-venue-booking-fast-path", () => {
  it("fast paths all SAN-494 test queries", () => {
    const queries = [
      "I need a venue for a birthday party for 30 people",
      "Looking for a corporate event venue",
      "Need a restaurant for a private event",
      "Birthday venue in Poblado for 50 guests",
    ];
    for (const q of queries) {
      expect(canFastPathEventVenueBooking(q)).toBe(true);
      expect(buildEventVenueBookingSearchParams(q)?.queryText).toBe(q);
    }
  });

  it("builds neighborhood from Poblado alias", () => {
    expect(
      buildEventVenueBookingSearchParams(
        "Birthday venue in Poblado for 50 guests",
      )?.neighborhood,
    ).toBe("El Poblado");
  });

  it("summarizes venue booking results", () => {
    expect(eventVenueBookingAssistantSummary(3, 30)).toContain("private events");
    expect(eventVenueBookingAssistantSummary(0)).toContain("No venues");
  });
});
