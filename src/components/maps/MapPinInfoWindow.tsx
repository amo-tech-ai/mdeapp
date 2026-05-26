"use client";

import { InfoWindow } from "@vis.gl/react-google-maps";
import type { MapPin } from "@/platform/contracts";
import { useMapContext } from "@/platform/maps/map-context";
import { SelectedPlaceOverlayCard } from "@/components/maps/SelectedPlaceOverlayCard";

/**
 * Floating rich place card (Mindtrip pattern). Map pins stay lightweight glyphs only.
 */
export function MapPinInfoWindow({ pin }: { pin: MapPin }) {
  const { setSelectedPinId, clearFocusPinRequest } = useMapContext();

  const dismiss = () => {
    setSelectedPinId(null);
    clearFocusPinRequest();
  };

  return (
    <InfoWindow
      position={{ lat: pin.lat, lng: pin.lng }}
      pixelOffset={[0, -52]}
      onCloseClick={dismiss}
      headerDisabled
    >
      <SelectedPlaceOverlayCard pin={pin} />
    </InfoWindow>
  );
}
