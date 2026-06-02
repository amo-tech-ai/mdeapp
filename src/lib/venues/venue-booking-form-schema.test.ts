import { describe, expect, it } from "vitest";
import { venueBookingRequestSchema } from "@/lib/venues/venue-booking-form-schema";

describe("venueBookingRequestSchema", () => {
  const valid = {
    venueKind: "cafe" as const,
    placeId: "ChIJabcdefghijklmnop",
    requestedAt: "2026-06-15T18:00:00.000Z",
    partySize: 2,
    contactName: "Camila",
    contactEmail: "camila@example.com",
  };

  it("accepts a minimal valid payload", () => {
    expect(venueBookingRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid venue kind", () => {
    const result = venueBookingRequestSchema.safeParse({
      ...valid,
      venueKind: "nightlife",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short place id", () => {
    const result = venueBookingRequestSchema.safeParse({
      ...valid,
      placeId: "short",
    });
    expect(result.success).toBe(false);
  });
});
