"use client";

import { useEffect, useRef } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import type { ConciergeWorkingMemory } from "@/lib/types";
import type { MapPinCategory } from "@/platform/contracts";
import { useMapContext } from "@/platform/maps/map-context";

const DEBOUNCE_MS = 300;

function buildMapUiSummary(
  pins: { id: string; category: MapPinCategory }[],
  selectedPinId: string | null,
) {
  const activeCategories = [...new Set(pins.map((p) => p.category))];
  const pinCountByCategory: Record<string, number> = {};
  for (const p of pins) {
    pinCountByCategory[p.category] = (pinCountByCategory[p.category] ?? 0) + 1;
  }
  return {
    selectedPinId,
    activeCategories,
    pinCountByCategory,
  };
}

/** Pushes MapContext summary into concierge working memory (debounced). */
export function MapUiSync() {
  const { pins, selectedPinId } = useMapContext();
  const { setState } = useCoAgent<ConciergeWorkingMemory>({
    name: "conciergeAgent",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const mapUi = buildMapUiSummary(pins, selectedPinId);
      const fingerprint = JSON.stringify(mapUi);
      if (fingerprint === lastPushedRef.current) return;
      lastPushedRef.current = fingerprint;
      setState((prev) => ({ ...(prev ?? {}), mapUi }));
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pins, selectedPinId, setState]);

  return null;
}
