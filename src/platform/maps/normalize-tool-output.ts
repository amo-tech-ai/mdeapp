import {
  mapPinSchema,
  type MapPin,
  type MapPinCategory,
} from "@/platform/contracts";

type LatLngItem = {
  id: string;
  title?: string;
  name?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string | null;
  mapsUrl?: string | null;
};

function itemToPin(
  item: LatLngItem,
  category: MapPinCategory,
  source: MapPin["source"],
): MapPin | null {
  const lat = item.latitude;
  const lng = item.longitude;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  const title = (item.title ?? item.name ?? "").trim() || "Place";
  const pin = {
    id: `${category}-${item.id}`,
    category,
    lat,
    lng,
    title,
    subtitle: item.neighborhood,
    placeId: item.placeId ?? undefined,
    placeUri: item.mapsUrl ?? undefined,
    source,
    meta: { rawId: item.id },
  };

  const parsed = mapPinSchema.safeParse(pin);
  return parsed.success ? parsed.data : null;
}

export type NormalizedToolOutput = {
  pins: MapPin[];
  resultCount: number;
};

export function normalizeToolOutput(
  category: MapPinCategory,
  result: unknown,
): NormalizedToolOutput {
  if (!result || typeof result !== "object") {
    return { pins: [], resultCount: 0 };
  }

  const envelope = result as {
    results?: LatLngItem[];
    source?: string;
  };

  const rows = Array.isArray(envelope.results) ? envelope.results : [];
  const source =
    envelope.source === "supabase" ||
    envelope.source === "sql" ||
    envelope.source === "places"
      ? "sql"
      : envelope.source === "grounding"
        ? "grounding"
        : "tool";

  const pins: MapPin[] = [];
  for (const row of rows) {
    const pin = itemToPin(row, category, source);
    if (pin) pins.push(pin);
  }

  return { pins, resultCount: rows.length };
}
