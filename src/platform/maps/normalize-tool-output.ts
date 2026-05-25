import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import {
  parseGroundedToolResult,
  resolveGroundedTitle,
} from "@/lib/parse-grounded-tool-result";
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
  index: number,
  attribution: Array<{ placeUri?: string; title?: string }>,
): MapPin | null {
  const lat = item.latitude;
  const lng = item.longitude;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  const mapsUrl = item.mapsUrl ?? undefined;
  const title =
    category === "grounded"
      ? resolveGroundedTitle(item, index, attribution, mapsUrl)
      : (item.title ?? item.name ?? "").trim() || "Place";

  const pin = {
    id: `${category}-${item.id}`,
    category,
    lat,
    lng,
    title,
    subtitle: item.neighborhood,
    placeId: item.placeId ?? undefined,
    placeUri: mapsUrl,
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
  if (category === "grounded") {
    const parsed = parseGroundedToolResult(result);
    const pins: MapPin[] = [];
    for (const row of parsed.results) {
      if (row.latitude == null || row.longitude == null) continue;
      const pin = itemToPin(
        {
          id: row.id,
          title: row.title,
          latitude: row.latitude,
          longitude: row.longitude,
          placeId: row.placeId,
          mapsUrl: row.mapsUrl,
        },
        category,
        "grounding",
        pins.length,
        parsed.attribution,
      );
      if (pin) pins.push(pin);
    }
    return { pins, resultCount: parsed.results.length };
  }

  const envelope = normalizeToolEnvelope(result);
  const rows = (envelope.results ?? []) as LatLngItem[];
  const root = result && typeof result === "object" ? result : {};
  const sourceField =
    (root as { source?: string }).source ?? envelope.source;

  const source =
    sourceField === "supabase" ||
    sourceField === "sql" ||
    sourceField === "places"
      ? "sql"
      : sourceField === "grounding"
        ? "grounding"
        : "tool";

  const pins: MapPin[] = [];
  for (const [index, row] of rows.entries()) {
    const pin = itemToPin(row, category, source, index, []);
    if (pin) pins.push(pin);
  }

  return { pins, resultCount: rows.length };
}
