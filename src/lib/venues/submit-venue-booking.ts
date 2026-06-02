import {
  venueBookingRequestSchema,
  type VenueBookingRequestInput,
  type VenueBookingSubmitResult,
} from "@/lib/venues/venue-booking-form-schema";

export async function submitVenueBooking(
  input: VenueBookingRequestInput,
): Promise<VenueBookingSubmitResult> {
  const payload = venueBookingRequestSchema.parse(input);

  const res = await fetch("/api/venue-booking/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as {
    success?: boolean;
    requestId?: string;
    message?: string;
    error?: { message?: string };
  };

  if (res.status === 401) {
    throw new Error("Sign in to request a booking.");
  }

  if (res.status === 409) {
    throw new Error(
      json.error?.message ?? "You already submitted this booking request.",
    );
  }

  if (!res.ok || !json.success || !json.requestId) {
    throw new Error(json.error?.message ?? "Could not submit booking request");
  }

  return {
    requestId: json.requestId,
    message:
      json.message ??
      "Request sent — we'll confirm by WhatsApp. This is not a confirmed reservation yet.",
  };
}
