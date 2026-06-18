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
    expect(slots.requestedAtIso).toMatch(/T20:00:00-05:00$/);
  });

  it("parses explicit date follow-up", () => {
    const iso = parseRequestedAtIso(
      "Friday June 13 2026 at 8pm, party of 4. Please submit the table booking request now.",
    );
    expect(iso).toBe("2026-06-13T20:00:00-05:00");
  });
});
