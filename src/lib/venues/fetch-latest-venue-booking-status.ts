import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { VenueBookingKind } from "@/lib/venues/venue-booking-form-schema";
import { normalizeVenueBookingStatus } from "@/lib/venues/venue-booking-status-display";

export type LatestVenueBookingStatus = {
  requestId: string;
  status: string;
  createdAt: string;
};

export async function fetchLatestVenueBookingStatus(
  supabase: SupabaseClient<Database>,
  input: { placeId: string; venueKind: VenueBookingKind },
): Promise<
  | { ok: true; data: LatestVenueBookingStatus | null }
  | { ok: false; message: string }
> {
  if (!input.placeId || input.placeId.length < 8) {
    return { ok: true, data: null };
  }

  const { data, error } = await supabase
    .from("venue_booking_requests")
    .select("id, status, created_at")
    .eq("place_id", input.placeId)
    .eq("venue_kind", input.venueKind)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data) {
    return { ok: true, data: null };
  }

  if (!normalizeVenueBookingStatus(data.status)) {
    return { ok: true, data: null };
  }

  return {
    ok: true,
    data: {
      requestId: data.id,
      status: data.status,
      createdAt: data.created_at,
    },
  };
}
