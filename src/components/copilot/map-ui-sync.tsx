"use client";

import { useEffect, useRef } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { buildMapUiSummary } from "@/lib/map-ui-summary";
import { useMapContext } from "@/platform/maps/map-context";

const DEBOUNCE_MS = 300;

/** Pushes MapContext summary into concierge working memory (debounced). */
export function MapUiSync() {
  const { pins, selectedPinId, viewport } = useMapContext();
  const { setState } = useCoAgent<ConciergeWorkingMemory>({
    name: "conciergeAgent",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const mapUi = buildMapUiSummary(
        pins,
        selectedPinId,
        viewport ?? undefined,
      );
      const fingerprint = JSON.stringify(mapUi);
      if (fingerprint === lastPushedRef.current) return;
      lastPushedRef.current = fingerprint;
      setState((prev) => ({ ...(prev ?? {}), mapUi }));
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pins, selectedPinId, viewport, setState]);

  return null;
}
