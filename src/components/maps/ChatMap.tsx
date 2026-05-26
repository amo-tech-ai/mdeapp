"use client";

/**
 * Map architecture (Mindtrip-aligned):
 * - Pins: lightweight CategoryMapMarker glyphs only (no photos on the map).
 * - Rich UI: SelectedPlaceOverlayCard via MapPinInfoWindow on pin select.
 */

import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { MapCameraSync } from "@/components/maps/MapCameraSync";
import { MapFocusController } from "@/components/maps/MapFocusController";
import { MapFitBoundsController } from "@/components/maps/MapFitBoundsController";
import { MapResizeSignal } from "@/components/maps/MapResizeSignal";
import { useMapContext } from "@/platform/maps/map-context";
import { isPinDimmed } from "@/platform/maps/active-map-category";
import { filterRenderableMapPins } from "@/platform/maps/map-pin-filters";
import { hasConfiguredMapId } from "@/lib/google-maps-map-id";
import {
  DEFAULT_MAP_ZOOM,
  getGoogleMapsMapId,
  MEDELLIN_CENTER,
} from "@/platform/maps/map-config";
import { CategoryMapMarker } from "@/components/maps/markers/CategoryMapMarker";
import { ClusteredCategoryMarkers } from "@/components/maps/ClusteredCategoryMarkers";
import { MapPinInfoWindow } from "@/components/maps/MapPinInfoWindow";
import { shouldClusterMapPins } from "@/lib/map-clustering";

export function ChatMap({
  mapResizeSignal = 0,
  mapDomId,
}: {
  mapResizeSignal?: number;
  mapDomId?: string;
}) {
  const { pins, activeMapCategory, selectedPinId, panToPin } = useMapContext();
  const mapId = getGoogleMapsMapId();
  const renderablePins = filterRenderableMapPins(pins);
  const useClustering = shouldClusterMapPins(renderablePins.length);
  const selectedPin =
    selectedPinId != null
      ? renderablePins.find((p) => p.id === selectedPinId) ?? null
      : null;
  return (
    <div
      id={mapDomId}
      className="relative h-full min-h-[280px] w-full"
      data-testid="chat-map"
      data-mapid-present={hasConfiguredMapId() ? "true" : "false"}
      data-map-clustering={useClustering ? "true" : "false"}
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
        <MapCameraSync />
        <MapFocusController />
        <MapFitBoundsController />
        <MapResizeSignal signal={mapResizeSignal} />
        {mapId && useClustering ? (
          <ClusteredCategoryMarkers
            pins={renderablePins}
            selectedPinId={selectedPinId}
            activeMapCategory={activeMapCategory}
            onSelectPin={panToPin}
          />
        ) : null}
        {mapId && !useClustering
          ? renderablePins.map((pin) => {
              const selected = selectedPinId === pin.id;
              const dimmed = isPinDimmed(pin, activeMapCategory);
              return (
                <AdvancedMarker
                  key={pin.id}
                  position={{ lat: pin.lat, lng: pin.lng }}
                  title={pin.title}
                  onClick={() => panToPin(pin.id)}
                >
                  <CategoryMapMarker
                    pinId={pin.id}
                    category={pin.category}
                    title={pin.title}
                    selected={selected}
                    dimmed={dimmed}
                    meta={pin.meta}
                  />
                </AdvancedMarker>
              );
            })
          : null}
        {selectedPin ? <MapPinInfoWindow pin={selectedPin} /> : null}
      </Map>
    </div>
  );
}
