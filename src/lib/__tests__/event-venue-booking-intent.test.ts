import { describe, expect, it } from "vitest";
import {
  looksLikeEventVenueBookingQuery,
  parseEventVenueBookingIntent,
} from "../event-venue-booking-intent";

describe("event-venue-booking-intent", () => {
  const venueBookingQueries = [
    "I need a venue for a birthday party for 30 people",
    "Looking for a venue for 30 guests",
    "Looking for a corporate event venue",
    "Need a restaurant for a private event",
    "Birthday venue in Poblado for 50 guests",
    "Corporate event venue in Poblado",
    "Restaurant for a private event",
    "Wedding venue",
    "Baby shower venue",
    "Restaurant for 20 people",
  ];

  it.each(venueBookingQueries)("detects venue booking: %s", (query) => {
    expect(looksLikeEventVenueBookingQuery(query)).toBe(true);
  });

  it("detects suggest-venues + plural party phrasing", () => {
    expect(looksLikeEventVenueBookingQuery("suggest venues for parties")).toBe(
      true,
    );
  });

  it("parses party size and neighborhood", () => {
    expect(
      parseEventVenueBookingIntent(
        "I need a venue for a birthday party for 30 people",
      ),
    ).toMatchObject({ partySize: 30, eventType: "birthday" });

    expect(
      parseEventVenueBookingIntent("Birthday venue in Poblado for 50 guests"),
    ).toMatchObject({
      partySize: 50,
      neighborhood: "El Poblado",
      eventType: "birthday",
    });
  });

  it("does not misclassify ticketed event discovery", () => {
    expect(looksLikeEventVenueBookingQuery("salsa events this weekend")).toBe(
      false,
    );
    expect(looksLikeEventVenueBookingQuery("music events in Medellín")).toBe(
      false,
    );
    expect(
      looksLikeEventVenueBookingQuery("nightlife this weekend in Poblado"),
    ).toBe(false);
  });
});
