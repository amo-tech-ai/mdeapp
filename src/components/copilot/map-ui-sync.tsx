"use client";

import { useEffect, useRef } from "react";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { buildMapUiSummary } from "@/lib/map-ui-summary";
import { useMapContext } from "@/platform/maps/map-context";

const DEBOUNCE_MS = 300;

function roundViewport(viewport: {
  lat: number;
  lng: number;
  zoom: number;
}): { lat: number; lng: number; zoom: number } {
  return {
    lat: Math.round(viewport.lat * 1e5) / 1e5,
    lng: Math.round(viewport.lng * 1e5) / 1e5,
    zoom: Math.round(viewport.zoom * 100) / 100,
  };
}

/** Pushes MapContext summary into concierge working memory (debounced). */
export function MapUiSync() {
  const { pins, selectedPinId, viewport } = useMapContext();
  const { setState } = useConciergeCoAgent();
  const setStateRef = useRef(setState);
  setStateRef.current = setState;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const mapUi = buildMapUiSummary(
        pins,
        selectedPinId,
        viewport ? roundViewport(viewport) : undefined,
      );
      const fingerprint = JSON.stringify(mapUi);
      if (fingerprint === lastPushedRef.current) return;
      lastPushedRef.current = fingerprint;
      setStateRef.current((prev) => ({ ...(prev ?? {}), mapUi }));
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pins, selectedPinId, viewport]);

  return null;
}
