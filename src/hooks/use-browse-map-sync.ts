"use client";

import { useEffect, useRef } from "react";
import type { MapPin, MapPinCategory } from "@/platform/contracts/map-pin";
import { useMapContext } from "@/platform/maps/map-context";

export function useBrowseMapSync(
  pins: MapPin[],
  category: MapPinCategory,
) {
  const { mergePinsByCategory, requestFitBounds } = useMapContext();
  const prevKeyRef = useRef("");

  useEffect(() => {
    const key = pins.map((p) => `${p.id}:${p.lat}:${p.lng}`).join(",");
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;
    mergePinsByCategory(category, pins);
    if (pins.length >= 2) {
      requestFitBounds();
    }
  }, [pins, category, mergePinsByCategory, requestFitBounds]);
}
