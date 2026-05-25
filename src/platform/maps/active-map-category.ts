import type { MapPin, MapPinCategory } from "@/platform/contracts";

/** Pins shown in map results / focus — prefer latest search category when it has pins. */
export function pinsForMapResults(
  pins: MapPin[],
  activeCategory: MapPinCategory | null,
): MapPin[] {
  const visible = pins.filter((p) => p.source !== "mock");
  if (!activeCategory) return visible;
  const active = visible.filter((p) => p.category === activeCategory);
  return active.length > 0 ? active : visible;
}

export function isPinDimmed(
  pin: MapPin,
  activeCategory: MapPinCategory | null,
): boolean {
  if (!activeCategory || pin.source === "mock") return false;
  return pin.category !== activeCategory;
}
