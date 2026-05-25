import type { AdkGroundingInvokeResponse } from "./adk-grounding-types";

export type GroundedPlaceResult = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  mapsUrl?: string;
};

const GENERIC_TITLE = /^place$/i;

function cleanAttributionTitle(title: string): string {
  return title.replace(/\s*[-–]\s*Google Maps\s*$/i, "").trim();
}

function resolvePinTitle(
  row: Record<string, unknown>,
  index: number,
  attribution: AdkGroundingInvokeResponse["attribution"],
): string {
  const raw = String(row.title ?? row.name ?? "").trim();
  if (raw && !GENERIC_TITLE.test(raw)) return raw;

  const mapsUrl = row.mapsUrl ? String(row.mapsUrl) : undefined;
  if (mapsUrl) {
    const match = attribution.find((a) => a.placeUri === mapsUrl);
    const attTitle = (match as { title?: string } | undefined)?.title;
    if (typeof attTitle === "string" && attTitle.trim()) {
      return cleanAttributionTitle(attTitle);
    }
  }

  const byIndex = attribution[index] as { title?: string } | undefined;
  if (byIndex?.title?.trim()) {
    return cleanAttributionTitle(byIndex.title);
  }

  return raw || "Place";
}

/** Map ADK invoke pins/places → Mastra tool results (fail-open on partial rows). */
export function mapAdkGroundingPins(
  adk: AdkGroundingInvokeResponse,
): GroundedPlaceResult[] {
  const pinRows =
    adk.pins.length > 0 ? adk.pins : (adk.places as typeof adk.pins);
  const attribution = adk.attribution ?? [];

  return pinRows
    .map((row, index): GroundedPlaceResult | null => {
      const r = row as Record<string, unknown>;
      const latitude = Number(r.latitude);
      const longitude = Number(r.longitude);
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

      const mapsUrl = r.mapsUrl ? String(r.mapsUrl) : undefined;
      return {
        id: String(r.id ?? r.placeId ?? `grounded-${index}`),
        title: resolvePinTitle(r, index, attribution),
        latitude,
        longitude,
        placeId: r.placeId ? String(r.placeId) : undefined,
        mapsUrl,
      };
    })
    .filter((row): row is GroundedPlaceResult => row !== null);
}
