import type { MapPin } from "@/platform/contracts";

export function hasNonMockPins(pins: MapPin[]): boolean {
  return pins.some((pin) => pin.source !== "mock");
}

/** MAP-017: hide layout mock once real tool pins exist. */
export function filterRenderableMapPins(pins: MapPin[]): MapPin[] {
  const hideMock = hasNonMockPins(pins);
  return pins.filter((pin) => {
    if (hideMock && pin.source === "mock") return false;
    return Number.isFinite(pin.lat) && Number.isFinite(pin.lng);
  });
}

export type LatLngBoundsBox = {
  north: number;
  south: number;
  east: number;
  west: number;
};

/** Pure bounds helper for MAP-016 tests — no Maps JS API. */
export function computeLatLngBounds(
  coords: Array<{ lat: number; lng: number }>,
): LatLngBoundsBox | null {
  if (coords.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  for (const { lat, lng } of coords) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  }

  if (north < south) return null;
  return { north, south, east, west };
}

/** Pins eligible for fitBounds — active category + MAP-017 mock filter. */
export function pinsForFitBounds(
  pins: MapPin[],
  activeMapCategory: MapPin["category"] | null,
): MapPin[] {
  return filterRenderableMapPins(pins).filter(
    (pin) => !activeMapCategory || pin.category === activeMapCategory,
  );
}
