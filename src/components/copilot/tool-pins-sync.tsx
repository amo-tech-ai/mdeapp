"use client";

import { useEffect, useRef } from "react";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";
import type { MapPinCategory } from "@/platform/contracts";

export function ToolPinsSync({
  category,
  result,
}: {
  category: MapPinCategory;
  result: unknown;
}) {
  const { mergePinsByCategory } = useMapContext();
  const lastMergedKeyRef = useRef("");

  useEffect(() => {
    const { pins } = normalizeToolOutput(category, result);
    if (pins.length === 0) return;
    const key = `${category}:${pins.map((p) => p.id).sort().join(",")}`;
    if (key === lastMergedKeyRef.current) return;
    lastMergedKeyRef.current = key;
    mergePinsByCategory(category, pins);
  }, [category, result, mergePinsByCategory]);

  return null;
}
