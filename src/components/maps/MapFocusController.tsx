"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapContext } from "@/platform/maps/map-context";

const FOCUS_ZOOM = 15;

/** Pans the map when focusPinId is set (focusMapPin frontend tool or card click). */
export function MapFocusController() {
  const map = useMap();
  const { pins, focusPinId, clearFocusPinRequest } = useMapContext();

  useEffect(() => {
    if (!map || !focusPinId) return;
    const pin = pins.find((p) => p.id === focusPinId);
    if (!pin) {
      clearFocusPinRequest();
      return;
    }
    map.panTo({ lat: pin.lat, lng: pin.lng });
    const zoom = map.getZoom();
    if (zoom == null || zoom < FOCUS_ZOOM) {
      map.setZoom(FOCUS_ZOOM);
    }
    clearFocusPinRequest();
  }, [map, focusPinId, pins, clearFocusPinRequest]);

  return null;
}
