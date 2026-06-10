import { submitVenueBooking } from "@/lib/venues/submit-venue-booking";
import type { VenueBookingHitlArgs } from "@/components/chat/venue-booking-hitl-panel";

export type DirectBookingConfirmation = {
  requestId: string;
  message: string;
  venueTitle: string;
};

export type DirectBookingResult =
  | { ok: true; confirmation: DirectBookingConfirmation }
  | { ok: false; error: unknown };

/**
 * SAN-496 · EVT-037 — submit a slot-complete venue booking and map the outcome
 * to a discriminated result. Never throws: a rejected submit becomes
 * `{ ok: false }` so the caller can reset the HITL panel and surface feedback
 * instead of silently swallowing the error (the P1 bug this guards against).
 */
export async function submitDirectVenueBooking(
  args: VenueBookingHitlArgs,
  submit: typeof submitVenueBooking = submitVenueBooking,
): Promise<DirectBookingResult> {
  try {
    const result = await submit({
      venueKind: args.venueKind,
      placeId: args.placeId,
      requestedAt: args.requestedAt,
      partySize: args.partySize,
      contactName: args.contactName,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      notes: args.notes,
      venueTitle: args.venueTitle,
    });
    return {
      ok: true,
      confirmation: {
        requestId: result.requestId,
        message: result.message,
        venueTitle: args.venueTitle?.trim() || args.placeId,
      },
    };
  } catch (error) {
    console.error(
      "[VenueBookingDirectHitl] submitVenueBooking failed",
      error,
    );
    return { ok: false, error };
  }
}
