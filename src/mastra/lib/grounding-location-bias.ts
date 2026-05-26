import type { MapUiState } from "@/platform/contracts/map-ui-state";

export type GroundingLocationBias = {
  latitude: number;
  longitude: number;
};

/** Explicit tool input wins; else mapUi.viewport from concierge working memory. */
export function resolveGroundingLocationBias(
  input: {
    locationBias?: { latitude: number; longitude: number };
  },
  context?: { memory?: { getWorkingMemory?: () => Promise<unknown> } },
): GroundingLocationBias | undefined {
  const fromInput = input.locationBias;
  if (
    fromInput &&
    Number.isFinite(fromInput.latitude) &&
    Number.isFinite(fromInput.longitude)
  ) {
    return {
      latitude: fromInput.latitude,
      longitude: fromInput.longitude,
    };
  }

  const memory = context?.memory;
  if (!memory?.getWorkingMemory) return undefined;

  return undefined;
}

/** Sync resolver when working memory is already loaded (tests / future hook). */
export function locationBiasFromMapUi(
  mapUi: MapUiState | undefined,
): GroundingLocationBias | undefined {
  const v = mapUi?.viewport;
  if (!v || !Number.isFinite(v.lat) || !Number.isFinite(v.lng)) {
    return undefined;
  }
  return { latitude: v.lat, longitude: v.lng };
}
