import { describe, expect, it } from "vitest";
import { looksLikeEventVenueBookingQuery } from "../event-venue-booking-intent";

describe("event-venue-booking-intent — party plural parity", () => {
  it("matches both singular 'party' and plural 'parties'", () => {
    expect(looksLikeEventVenueBookingQuery("suggest venues for a party")).toBe(true);
    expect(looksLikeEventVenueBookingQuery("suggest venues for parties")).toBe(true);
  });
});
