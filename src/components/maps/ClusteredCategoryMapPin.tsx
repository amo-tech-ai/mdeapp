"use client";

import { useCallback } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Marker } from "@googlemaps/markerclusterer";
import type { MapPin, MapPinCategory } from "@/platform/contracts";
import { CategoryMapMarker } from "@/components/maps/markers/CategoryMapMarker";
import { isPinDimmed } from "@/platform/maps/active-map-category";

export type ClusteredCategoryMapPinProps = {
  pin: MapPin;
  selected: boolean;
  activeMapCategory: MapPinCategory | null;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  onSelect: (pinId: string) => void;
};

/** Single AdvancedMarker registered with MarkerClusterer via ref callback. */
export function ClusteredCategoryMapPin({
  pin,
  selected,
  activeMapCategory,
  setMarkerRef,
  onSelect,
}: ClusteredCategoryMapPinProps) {
  const dimmed = isPinDimmed(pin, activeMapCategory);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement | null) => {
      setMarkerRef(marker, pin.id);
    },
    [setMarkerRef, pin.id],
  );

  return (
    <AdvancedMarker
      position={{ lat: pin.lat, lng: pin.lng }}
      title={pin.title}
      ref={ref}
      onClick={() => onSelect(pin.id)}
    >
      <CategoryMapMarker
        pinId={pin.id}
        category={pin.category}
        title={pin.title}
        selected={selected}
        dimmed={dimmed}
        meta={pin.meta}
      />
    </AdvancedMarker>
  );
}
