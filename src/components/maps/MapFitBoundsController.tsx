"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapContext } from "@/platform/maps/map-context";
import { pinsForFitBounds } from "@/platform/maps/map-pin-filters";

const FIT_PADDING = 48;
const MAX_ZOOM_AFTER_FIT = 15;

/** MAP-016: fit map to all pins after multi-result tool merge. */
export function MapFitBoundsController() {
  const map = useMap();
  const { pins, activeMapCategory, fitBoundsToken } = useMapContext();

  useEffect(() => {
    if (!map || fitBoundsToken === 0) return;

    const eligible = pinsForFitBounds(pins, activeMapCategory);
    if (eligible.length < 2) return;
    if (typeof google === "undefined") return;

    const bounds = new google.maps.LatLngBounds();
    for (const pin of eligible) {
      bounds.extend({ lat: pin.lat, lng: pin.lng });
    }

    map.fitBounds(bounds, FIT_PADDING);

    const listener = map.addListener("idle", () => {
      const zoom = map.getZoom();
      if (zoom != null && zoom > MAX_ZOOM_AFTER_FIT) {
        map.setZoom(MAX_ZOOM_AFTER_FIT);
      }
      google.maps.event.removeListener(listener);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, fitBoundsToken, pins, activeMapCategory]);

  return null;
}
