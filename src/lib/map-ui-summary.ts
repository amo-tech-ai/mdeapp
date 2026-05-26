import type { MapPinCategory } from "@/platform/contracts";
import type { MapUiState } from "@/platform/contracts/map-ui-state";

export type MapViewport = { lat: number; lng: number; zoom: number };

export function buildMapUiSummary(
  pins: { id: string; category: MapPinCategory }[],
  selectedPinId: string | null,
  viewport?: MapViewport,
): MapUiState {
  const activeCategories = [...new Set(pins.map((p) => p.category))];
  const pinCountByCategory: Record<string, number> = {};
  for (const p of pins) {
    pinCountByCategory[p.category] = (pinCountByCategory[p.category] ?? 0) + 1;
  }
  return {
    selectedPinId,
    activeCategories,
    pinCountByCategory,
    ...(viewport ? { viewport } : {}),
  };
}
