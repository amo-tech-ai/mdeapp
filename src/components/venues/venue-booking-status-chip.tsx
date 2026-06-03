"use client";

import { Badge } from "@/components/ui/badge";
import { useVenueBookingStatus } from "@/hooks/use-venue-booking-status";
import { cn } from "@/lib/utils";

export function VenueBookingStatusChip({
  placeId,
  uiKind,
  className,
}: {
  placeId?: string;
  uiKind: "cafe" | "nightlife" | "restaurant";
  className?: string;
}) {
  const { chip, loading, error } = useVenueBookingStatus({ placeId, uiKind });

  if (!placeId) return null;

  if (loading) {
    return (
      <Badge
        variant="outline"
        className={cn("text-xs font-normal", className)}
        data-testid="venue-booking-status-loading"
      >
        Checking booking…
      </Badge>
    );
  }

  if (error) {
    return (
      <span
        className={cn("text-xs text-muted-foreground", className)}
        data-testid="venue-booking-status-error"
      >
        Booking status unavailable
      </span>
    );
  }

  if (!chip) return null;

  return (
    <Badge
      variant={chip.variant}
      className={cn("text-xs font-medium", className)}
      data-testid="venue-booking-status-chip"
      data-booking-status={chip.status}
    >
      {chip.label}
    </Badge>
  );
}
