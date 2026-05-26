"use client";

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapContext } from "@/platform/maps/map-context";

const DEBOUNCE_MS = 300;

/** Debounced mirror of map center/zoom → MapContext (F50b). Read-only; does not control the map. */
export function MapCameraSync() {
  const map = useMap();
  const { setViewport } = useMapContext();

  useEffect(() => {
    if (!map || !setViewport) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const pushViewport = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (!center) return;
      const lat = center.lat();
      const lng = center.lng();
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      setViewport({
        lat,
        lng,
        zoom: typeof zoom === "number" && Number.isFinite(zoom) ? zoom : 12,
      });
    };

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(pushViewport, DEBOUNCE_MS);
    };

    const idleListener = map.addListener("idle", schedule);
    return () => {
      if (timer) clearTimeout(timer);
      idleListener.remove();
    };
  }, [map, setViewport]);

  return null;
}
