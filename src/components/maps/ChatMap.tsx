"use client";

import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { MapFocusController } from "@/components/maps/MapFocusController";
import { MapResizeSignal } from "@/components/maps/MapResizeSignal";
import { useMapContext } from "@/platform/maps/map-context";
import { hasConfiguredMapId } from "@/lib/google-maps-map-id";
import {
  DEFAULT_MAP_ZOOM,
  getGoogleMapsMapId,
  MEDELLIN_CENTER,
} from "@/platform/maps/map-config";

const CATEGORY_COLORS: Record<string, string> = {
  rental: "var(--primary)",
  restaurant: "#d97706",
  event: "#7c3aed",
  attraction: "#059669",
  venue: "#4b5563",
  grounded: "#2563eb",
  mock: "var(--primary)",
};

function isValidPinCoord(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

export function ChatMap({
  mapResizeSignal = 0,
  mapDomId,
}: {
  mapResizeSignal?: number;
  mapDomId?: string;
}) {
  const { pins, selectedPinId, setSelectedPinId } = useMapContext();
  const mapId = getGoogleMapsMapId();
  const renderablePins = pins.filter((pin) => isValidPinCoord(pin.lat, pin.lng));
  return (
    <div
      id={mapDomId}
      className="relative h-full min-h-[280px] w-full"
      data-testid="chat-map"
      data-mapid-present={hasConfiguredMapId() ? "true" : "false"}
    >
      <Map
        mapId={mapId}
        defaultCenter={MEDELLIN_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
      >
        <MapFocusController />
        <MapResizeSignal signal={mapResizeSignal} />
        {mapId
          ? renderablePins.map((pin) => {
          const selected = selectedPinId === pin.id;
          const color = CATEGORY_COLORS[pin.category] ?? "var(--primary)";
          return (
            <AdvancedMarker
              key={pin.id}
              position={{ lat: pin.lat, lng: pin.lng }}
              title={pin.title}
              onClick={() => setSelectedPinId(pin.id)}
            >
              <div
                data-testid="map-pin"
                data-pin-id={pin.id}
                data-pin-category={pin.category}
                role="img"
                aria-label={`${pin.category}: ${pin.title}`}
                className="flex size-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-md transition-transform"
                style={{
                  backgroundColor: color,
                  transform: selected ? "scale(1.15)" : "scale(1)",
                }}
              >
                •
              </div>
            </AdvancedMarker>
          );
            })
          : null}
      </Map>
    </div>
  );
}
