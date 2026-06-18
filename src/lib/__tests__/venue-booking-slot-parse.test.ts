import { describe, expect, it } from "vitest";
import {
  parseRequestedAtIso,
  parseVenueBookingSlots,
} from "@/lib/venue-booking-slot-parse";

describe("parseVenueBookingSlots", () => {
  it("parses Class U booking prompt", () => {
    const slots = parseVenueBookingSlots(
      "Book Mamasita Friday 8pm for 4. Contact QA User at qa-landlord@mdeai.co.",
    );
    expect(slots.venueName).toMatch(/mamasita/i);
    expect(slots.partySize).toBe(4);
    expect(slots.contactName).toBe("QA User");
    expect(slots.contactEmail).toBe("qa-landlord@mdeai.co");
    // 8pm Bogotá (-05:00) emitted as a UTC "Z" instant → 01:00 next day.
    expect(slots.requestedAtIso).toMatch(/T01:00:00\.000Z$/);
  });

  it("parses explicit date follow-up", () => {
    const iso = parseRequestedAtIso(
      "Friday June 13 2026 at 8pm, party of 4. Please submit the table booking request now.",
    );
    expect(iso).toBe("2026-06-14T01:00:00.000Z");
  });

  it("stores an explicit place id in placeId, not venueName", () => {
    const slots = parseVenueBookingSlots("Reserve a table place_id: ChIJxyz123 for 2");
    expect(slots.placeId).toBe("ChIJxyz123");
    expect(slots.venueName).toBeUndefined();
  });
});
