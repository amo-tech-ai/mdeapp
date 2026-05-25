"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

/** Triggers google.maps resize when parent layout changes (MAP-007 mobile sheet). */
export function MapResizeSignal({ signal }: { signal: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map || signal === 0) return;
    const id = window.setTimeout(() => {
      const g = (globalThis as { google?: { maps?: { event?: { trigger: (m: unknown, e: string) => void } } } }).google;
      if (g?.maps?.event) {
        g.maps.event.trigger(map, "resize");
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [map, signal]);

  return null;
}
