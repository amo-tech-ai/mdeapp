import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import {
  venueBookingRequestSchema,
  type VenueBookingRequestInput,
  type VenueBookingSubmitResult,
} from "@/lib/venues/venue-booking-form-schema";

export function buildVenueBookingIdempotencyKey(input: {
  venueKind: string;
  placeId: string;
  requestedAt: string;
  partySize: number;
}): string {
  const raw = `${input.venueKind}|${input.placeId}|${input.requestedAt}|${input.partySize}`;
  const digest = createHash("sha256").update(raw).digest("hex").slice(0, 32);
  return `vb-${digest}`;
}

export async function insertVenueBookingRequest(
  supabase: SupabaseClient<Database>,
  userId: string,
  body: unknown,
): Promise<
  | { ok: true; data: VenueBookingSubmitResult }
  | { ok: false; status: number; message: string }
> {
  const parsed = venueBookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Validation failed",
    };
  }

  const input: VenueBookingRequestInput = parsed.data;
  const idempotencyKey =
    input.idempotencyKey ??
    buildVenueBookingIdempotencyKey({
      venueKind: input.venueKind,
      placeId: input.placeId,
      requestedAt: input.requestedAt,
      partySize: input.partySize,
    });

  const metadata: Json = input.venueTitle
    ? { venue_title: input.venueTitle }
    : {};

  const { data, error } = await supabase
    .from("venue_booking_requests")
    .insert({
      user_id: userId,
      venue_kind: input.venueKind,
      place_id: input.placeId,
      restaurant_id: input.restaurantId ?? null,
      party_size: input.partySize,
      requested_at: input.requestedAt,
      contact_name: input.contactName,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone ?? null,
      notes: input.notes ?? null,
      status: "pending",
      source: "web",
      idempotency_key: idempotencyKey,
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        status: 409,
        message: "You already submitted this booking request.",
      };
    }
    return {
      ok: false,
      status: 500,
      message: "Could not save booking request",
    };
  }

  return {
    ok: true,
    data: {
      requestId: data.id,
      message:
        "Request sent — we'll confirm by WhatsApp. This is not a confirmed reservation yet.",
    },
  };
}
