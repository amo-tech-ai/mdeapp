"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
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
 * P3: clusterer is cleared on unmount/map-change (useLayoutEffect cleanup).
 * P4: marker refs stored in a ref (not state); N concurrent setMarkerRef calls
 *     from child mounts are coalesced into one clearMarkers/addMarkers call via
 *     queueMicrotask instead of firing N separate React renders.
 *
 * Stale-closure guard: clustererRef is updated via useLayoutEffect, which runs
 * synchronously before microtasks, so the queueMicrotask callback always reads
 * the current clusterer instance even when the map changes mid-flight.
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
  // Updated synchronously in useLayoutEffect — always current when microtask runs.
  const clustererRef = useRef<MarkerClusterer | null>(null);

  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map, renderer: createPaisaClusterRenderer() });
  }, [map]);

  // P3 + stale-closure guard: update ref before any microtask can read it;
  // clear markers on unmount or when the map (and thus clusterer) changes.
  // Also sync already-mounted markers into the new instance so pins don't
  // disappear after a map re-init until the next setMarkerRef call.
  useLayoutEffect(() => {
    clustererRef.current = clusterer;
    if (clusterer) {
      const existing = Object.values(markersRef.current);
      if (existing.length > 0) {
        clusterer.addMarkers(existing);
      }
    }
    return () => {
      clusterer?.clearMarkers();
      clustererRef.current = null;
    };
  }, [clusterer]);

  // P4: batch all setMarkerRef calls from the same render tick into one sync.
  // Empty dep array — stability comes from clustererRef, not the clusterer closure.
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
        const c = clustererRef.current;
        if (!c) return;
        c.clearMarkers();
        c.addMarkers(Object.values(markersRef.current));
      });
    },
    [],
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
