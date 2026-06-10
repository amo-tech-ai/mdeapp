import { Badge } from "@/components/ui/badge";

/**
 * SAN-502 · EVT-043 — status chip for the admin event-requests queue.
 * Pure mapping kept separate from the queue component so it is unit-testable.
 */

export type EventBookingStatusInput = {
  partnerStatus: string;
  bookingStatus: string;
  needsInfo: boolean;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function eventBookingStatus(req: EventBookingStatusInput): {
  label: string;
  variant: BadgeVariant;
} {
  // confirmed (host-facing, bookings.status) > partner decision > needs info > pending
  if (req.bookingStatus === "confirmed") {
    return { label: "Confirmed", variant: "default" };
  }
  if (req.partnerStatus === "approved") {
    return { label: "Approved", variant: "default" };
  }
  if (req.partnerStatus === "declined") {
    return { label: "Declined", variant: "destructive" };
  }
  if (req.needsInfo) {
    return { label: "Needs info", variant: "outline" };
  }
  return { label: "Pending", variant: "secondary" };
}

export function EventBookingStatusChip({
  request,
}: {
  request: EventBookingStatusInput;
}) {
  const { label, variant } = eventBookingStatus(request);
  return (
    <Badge variant={variant} data-testid="event-booking-status">
      {label}
    </Badge>
  );
}
