"use client";

import { useRentalUi } from "@/components/chat/rental-ui-context";

/** Post-submit confirmation for venue booking requests (VEN-021). */
export function VenueBookingConfirmationBanner() {
  const { venueBookingConfirmation, clearVenueBookingConfirmation } =
    useRentalUi();

  if (!venueBookingConfirmation) return null;

  return (
    <div
      className="mx-4 mb-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
      data-testid="venue-booking-confirmation-card"
      role="status"
    >
      <p className="font-medium text-primary">Booking request received</p>
      <p className="mt-1 text-muted-foreground">
        {venueBookingConfirmation.message}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {venueBookingConfirmation.venueTitle} · Ref{" "}
        {venueBookingConfirmation.requestId.slice(0, 8)}
      </p>
      <button
        type="button"
        className="mt-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={clearVenueBookingConfirmation}
      >
        Dismiss
      </button>
    </div>
  );
}
