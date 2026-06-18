import { describe, expect, it } from "vitest";
import {
  buildEventVenueBookingSearchParams,
  canFastPathEventVenueBooking,
  eventVenueBookingAssistantSummary,
} from "../event-venue-booking-fast-path";
import { looksLikeEventVenueBookingQuery } from "../event-venue-booking-intent";

describe("event-venue-booking-intent — party plural parity", () => {
  it("matches both singular 'party' and plural 'parties'", () => {
    expect(looksLikeEventVenueBookingQuery("suggest venues for a party")).toBe(true);
    expect(looksLikeEventVenueBookingQuery("suggest venues for parties")).toBe(true);
  });
});

describe("event-venue-booking-fast-path", () => {
  it("fast paths all SAN-494 acceptance matrix queries", () => {
    const queries = [
      "suggest venues for party in Medellín 30 people",
      "book Mamacita for 30",
      "private event space Laureles",
      "somewhere for a birthday",
      "I need a venue for birthday party 30 people",
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
