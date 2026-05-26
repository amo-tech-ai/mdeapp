"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import type { MapPin, MapPinCategory } from "@/platform/contracts";
import { createPaisaClusterRenderer } from "@/lib/map-clustering";
import { ClusteredCategoryMapPin } from "@/components/maps/ClusteredCategoryMapPin";

export type ClusteredCategoryMarkersProps = {
  pins: MapPin[];
  selectedPinId: string | null;
  activeMapCategory: MapPinCategory | null;
  onSelectPin: (pinId: string) => void;
};

/**
 * MAP-009 — vis.gl AdvancedMarker pins synced to @googlemaps/markerclusterer.
 * Marker ref map updates after clusterer exists (pending queue via effect deps).
 */
export function ClusteredCategoryMarkers({
  pins,
  selectedPinId,
  activeMapCategory,
  onSelectPin,
}: ClusteredCategoryMarkersProps) {
  const map = useMap();
  const [markers, setMarkers] = useState<Record<string, Marker>>({});

  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({
      map,
      renderer: createPaisaClusterRenderer(),
    });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;
    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((prev) => {
      if ((marker && prev[key]) || (!marker && !prev[key])) return prev;
      if (marker) return { ...prev, [key]: marker };
      const rest = { ...prev };
      delete rest[key];
      return rest;
    });
  }, []);

  return (
    <>
      {pins.map((pin) => (
        <ClusteredCategoryMapPin
          key={pin.id}
          pin={pin}
          selected={selectedPinId === pin.id}
          activeMapCategory={activeMapCategory}
          setMarkerRef={setMarkerRef}
          onSelect={onSelectPin}
        />
      ))}
    </>
  );
}
