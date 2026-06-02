import { describe, expect, it, vi } from "vitest";
import {
  buildVenueBookingIdempotencyKey,
  insertVenueBookingRequest,
} from "@/lib/venues/venue-booking-core";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

function mockSupabase(
  insertResult: { data: { id: string } | null; error: { code?: string } | null },
) {
  const single = vi.fn(async () => insertResult);
  const select = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ insert }));
  return { from } as unknown as SupabaseClient<Database>;
}

describe("buildVenueBookingIdempotencyKey", () => {
  it("is stable for the same inputs", () => {
    const input = {
      venueKind: "cafe",
      placeId: "ChIJtest12345678",
      requestedAt: "2026-06-15T18:00:00.000Z",
    };
    expect(buildVenueBookingIdempotencyKey(input)).toBe(
      buildVenueBookingIdempotencyKey(input),
    );
    expect(buildVenueBookingIdempotencyKey(input)).toMatch(/^vb-[a-f0-9]{32}$/);
  });
});

describe("insertVenueBookingRequest", () => {
  const body = {
    venueKind: "nightclub",
    placeId: "ChIJnightlife12345",
    requestedAt: "2026-06-15T22:00:00.000Z",
    partySize: 4,
    contactName: "Tourist",
    contactEmail: "tourist@example.com",
  };

  it("returns 400 on invalid body", async () => {
    const supabase = mockSupabase({ data: null, error: null });
    const result = await insertVenueBookingRequest(supabase, "user-1", {
      venueKind: "bad",
    });
    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Validation failed",
    });
  });

  it("inserts pending row for authenticated user", async () => {
    const supabase = mockSupabase({
      data: { id: "req-uuid-1" },
      error: null,
    });
    const result = await insertVenueBookingRequest(supabase, "user-abc", body);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.requestId).toBe("req-uuid-1");
      expect(result.data.message).toContain("WhatsApp");
      expect(result.data.message).toContain("not a confirmed");
    }
    expect(supabase.from).toHaveBeenCalledWith("venue_booking_requests");
  });

  it("returns 409 on idempotency conflict", async () => {
    const supabase = mockSupabase({
      data: null,
      error: { code: "23505" },
    });
    const result = await insertVenueBookingRequest(supabase, "user-abc", body);
    expect(result).toEqual({
      ok: false,
      status: 409,
      message: "You already submitted this booking request.",
    });
  });
});
