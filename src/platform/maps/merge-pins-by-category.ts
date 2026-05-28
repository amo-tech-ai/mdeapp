import type { MapPin, MapPinCategory } from "@/platform/contracts";

export function pinDedupeKey(pin: MapPin): string {
  return pin.placeId ?? pin.id;
}

/**
 * Replace all pins in `category` with `incoming` (deduped by id/placeId).
 * Empty `incoming` clears that category. Other categories are unchanged.
 */
export function mergePinsByCategory(
  existing: MapPin[],
  category: MapPinCategory,
  incoming: MapPin[],
): MapPin[] {
  const others = existing.filter((p) => p.category !== category);
  const byKey = new Map<string, MapPin>();

  for (const pin of incoming) {
    if (pin.category !== category) continue;
    byKey.set(pinDedupeKey(pin), pin);
  }

  return [...others, ...byKey.values()];
}
