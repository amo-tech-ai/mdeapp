"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MapPin, MapPinCategory } from "@/platform/contracts";
import type { MapViewport } from "@/lib/map-ui-summary";
import { mergePinsByCategory } from "./merge-pins-by-category";
import { MOCK_LAYOUT_PIN } from "./map-config";

type MapContextValue = {
  pins: MapPin[];
  /** Latest map camera (F50b) — debounced from MapCameraSync */
  viewport: MapViewport | null;
  setViewport: (viewport: MapViewport) => void;
  /** Latest tool category that pushed pins — drives map results panel focus */
  activeMapCategory: MapPinCategory | null;
  selectedPinId: string | null;
  setSelectedPinId: (id: string | null) => void;
  /** Set by focusMapPin frontend tool — ChatMap pans when this changes */
  focusPinId: string | null;
  panToPin: (pinId: string) => void;
  clearFocusPinRequest: () => void;
  mergePinsByCategory: (
    category: MapPinCategory,
    incoming: MapPin[],
  ) => void;
  clearPins: () => void;
  /** Increments after tool merge with ≥2 pins — MapFitBoundsController listens. */
  fitBoundsToken: number;
  requestFitBounds: () => void;
};

const MapContext = createContext<MapContextValue | null>(null);

export function MapContextProvider({
  children,
  seedMockPin = true,
}: {
  children: ReactNode;
  seedMockPin?: boolean;
}) {
  const [pins, setPins] = useState<MapPin[]>(seedMockPin ? [MOCK_LAYOUT_PIN] : []);
  const [activeMapCategory, setActiveMapCategory] =
    useState<MapPinCategory | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [focusPinId, setFocusPinId] = useState<string | null>(null);
  const [viewport, setViewportState] = useState<MapViewport | null>(null);
  const [fitBoundsToken, setFitBoundsToken] = useState(0);

  const setViewport = useCallback((next: MapViewport) => {
    setViewportState((prev) => {
      if (
        prev &&
        prev.lat === next.lat &&
        prev.lng === next.lng &&
        prev.zoom === next.zoom
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const requestFitBounds = useCallback(() => {
    setFitBoundsToken((token) => token + 1);
  }, []);

  const panToPin = useCallback((pinId: string) => {
    setSelectedPinId(pinId);
    setFocusPinId(pinId);
  }, []);

  const clearFocusPinRequest = useCallback(() => {
    setFocusPinId(null);
  }, []);

  const mergePins = useCallback(
    (category: MapPinCategory, incoming: MapPin[]) => {
      if (incoming.length > 0) {
        setActiveMapCategory(category);
      }
      setPins((prev) => mergePinsByCategory(prev, category, incoming));
    },
    [],
  );

  const clearPins = useCallback(() => {
    setPins(seedMockPin ? [MOCK_LAYOUT_PIN] : []);
    setActiveMapCategory(null);
    setSelectedPinId(null);
  }, [seedMockPin]);

  const value = useMemo(
    () => ({
      pins,
      viewport,
      setViewport,
      activeMapCategory,
      selectedPinId,
      setSelectedPinId,
      focusPinId,
      panToPin,
      clearFocusPinRequest,
      mergePinsByCategory: mergePins,
      clearPins,
      fitBoundsToken,
      requestFitBounds,
    }),
    [
      pins,
      viewport,
      setViewport,
      activeMapCategory,
      selectedPinId,
      focusPinId,
      panToPin,
      clearFocusPinRequest,
      mergePins,
      clearPins,
      fitBoundsToken,
      requestFitBounds,
    ],
  );

  return (
    <MapContext.Provider value={value}>{children}</MapContext.Provider>
  );
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMapContext must be used within MapContextProvider");
  }
  return ctx;
}
