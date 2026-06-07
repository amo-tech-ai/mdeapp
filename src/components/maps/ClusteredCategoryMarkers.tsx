"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
 *
 * P3: clusterer is cleared on unmount/map-change so markers don't leak.
 * P4: marker refs are stored in a ref (not state); N concurrent setMarkerRef
 *     calls from child mounts are coalesced into one clearMarkers/addMarkers
 *     call via queueMicrotask instead of firing N separate React renders.
 */
export function ClusteredCategoryMarkers({
  pins,
  selectedPinId,
  activeMapCategory,
  onSelectPin,
}: ClusteredCategoryMarkersProps) {
  const map = useMap();
  const markersRef = useRef<Record<string, Marker>>({});
  const flushPendingRef = useRef(false);

  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map, renderer: createPaisaClusterRenderer() });
  }, [map]);

  // P3: clear markers when the clusterer is replaced (map changed) or on unmount
  useEffect(() => {
    return () => {
      clusterer?.clearMarkers();
    };
  }, [clusterer]);

  // P4: batch all setMarkerRef calls from the same render tick into one sync
  const setMarkerRef = useCallback(
    (marker: Marker | null, key: string) => {
      const prev = markersRef.current;
      if (marker) {
        if (prev[key] === marker) return;
        markersRef.current = { ...prev, [key]: marker };
      } else {
        if (!(key in prev)) return;
        const next = { ...prev };
        delete next[key];
        markersRef.current = next;
      }
      if (flushPendingRef.current) return;
      flushPendingRef.current = true;
      queueMicrotask(() => {
        flushPendingRef.current = false;
        if (!clusterer) return;
        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markersRef.current));
      });
    },
    [clusterer],
  );

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
