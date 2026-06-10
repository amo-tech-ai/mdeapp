"use client";

import { RestaurantCard } from "@/components/copilot/restaurant-card";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { useEventVenueOfferings } from "@/hooks/use-event-venue-offerings";
import type { RestaurantCardProps } from "@/components/copilot/restaurant-card";

type RestaurantCardWithEventVenueProps = Omit<
  RestaurantCardProps,
  "hostsEvents" | "onOpenEventVenue"
> & {
  placeId?: string | null;
};

export function RestaurantCardWithEventVenue({
  placeId,
  title,
  pinId,
  ...cardProps
}: RestaurantCardWithEventVenueProps) {
  const { openEventVenueOfferings } = useRentalUi();
  const { payload, hasOfferings } = useEventVenueOfferings(placeId);

  const openEventVenue = hasOfferings && payload
    ? () => {
        openEventVenueOfferings({
          placeId: payload.placeId,
          title,
          pinId,
          payload,
        });
      }
    : undefined;

  return (
    <RestaurantCard
      {...cardProps}
      title={title}
      pinId={pinId}
      hostsEvents={hasOfferings}
      onOpenEventVenue={openEventVenue}
    />
  );
}
