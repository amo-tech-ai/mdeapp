import { describe, expect, it, vi } from "vitest";
import { fetchLatestVenueBookingStatus } from "@/lib/venues/fetch-latest-venue-booking-status";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

function mockSupabase(row: { id: string; status: string; created_at: string } | null) {
  const maybeSingle = vi.fn(async () => ({ data: row, error: null }));
  const limit = vi.fn(() => ({ maybeSingle }));
  const order = vi.fn(() => ({ limit }));
  const eqKind = vi.fn(() => ({ order }));
  const eqPlace = vi.fn(() => ({ eq: eqKind }));
  const select = vi.fn(() => ({ eq: eqPlace }));
  const from = vi.fn(() => ({ select }));
  return { from, eqPlace, eqKind } as unknown as SupabaseClient<Database> & {
    eqPlace: ReturnType<typeof vi.fn>;
    eqKind: ReturnType<typeof vi.fn>;
  };
}

describe("fetchLatestVenueBookingStatus", () => {
  it("filters by place_id and venue_kind", async () => {
    const supabase = mockSupabase({
      id: "row-1",
      status: "pending",
      created_at: "2026-06-02T00:00:00Z",
    });

    const result = await fetchLatestVenueBookingStatus(supabase, {
      placeId: "ChIJven021proof01",
      venueKind: "nightclub",
    });

    expect(result.ok).toBe(true);
    if (result.ok && result.data) {
      expect(result.data.requestId).toBe("row-1");
      expect(result.data.status).toBe("pending");
    }
    expect(supabase.from).toHaveBeenCalledWith("venue_booking_requests");
    expect(supabase.eqPlace).toHaveBeenCalledWith(
      "place_id",
      "ChIJven021proof01",
    );
    expect(supabase.eqKind).toHaveBeenCalledWith("venue_kind", "nightclub");
  });

  it("returns null when no row", async () => {
    const supabase = mockSupabase(null);
    const result = await fetchLatestVenueBookingStatus(supabase, {
      placeId: "ChIJabcdefghijklmnop",
      venueKind: "cafe",
    });
    expect(result).toEqual({ ok: true, data: null });
  });
});
