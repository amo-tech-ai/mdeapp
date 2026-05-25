import type { MapPin, MapPinCategory } from "@/platform/contracts";

export function pinDedupeKey(pin: MapPin): string {
  return pin.placeId ?? pin.id;
}

/** Merge new pins into existing list; dedupe within batch and against prior pins. */
export function mergePinsByCategory(
  existing: MapPin[],
  category: MapPinCategory,
  incoming: MapPin[],
): MapPin[] {
  const others = existing.filter((p) => p.category !== category);
  const sameCategory = existing.filter((p) => p.category === category);
  const byKey = new Map<string, MapPin>();

  for (const pin of [...sameCategory, ...incoming]) {
    if (pin.category !== category) continue;
    byKey.set(pinDedupeKey(pin), pin);
  }

  return [...others, ...byKey.values()];
}
