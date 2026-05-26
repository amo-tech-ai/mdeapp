import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";

export type GroundedAttributionRow = {
  source?: string;
  placeUri?: string;
  title?: string;
};

export type GroundedPhotoAttribution = {
  displayName?: string;
  uri?: string;
};

export type GroundedToolRow = {
  id: string;
  title: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  formattedAddress?: string;
  primaryType?: string;
  summary?: string;
  photoName?: string;
  photoAuthorAttributions?: GroundedPhotoAttribution[];
  fieldMaskVersion?: string;
};

export type ParsedGroundedToolResult = {
  results: GroundedToolRow[];
  attribution: GroundedAttributionRow[];
  source?: string;
};

const GENERIC_TITLE = /^place$/i;

export function cleanGroundingAttributionTitle(title: string): string {
  return title.replace(/\s*[-–]\s*Google Maps\s*$/i, "").trim();
}

export function resolveGroundedTitle(
  row: { title?: string; name?: string },
  index: number,
  attribution: GroundedAttributionRow[],
  mapsUrl?: string,
): string {
  const raw = (row.title ?? row.name ?? "").trim();
  if (raw && !GENERIC_TITLE.test(raw)) return raw;

  if (mapsUrl) {
    const match = attribution.find((a) => a.placeUri === mapsUrl);
    if (match?.title) {
      const cleaned = cleanGroundingAttributionTitle(match.title);
      if (cleaned) return cleaned;
    }
  }

  const byIndex = attribution[index];
  if (byIndex?.title) {
    const cleaned = cleanGroundingAttributionTitle(byIndex.title);
    if (cleaned) return cleaned;
  }

  return raw || "Place";
}

function readAttribution(result: unknown): GroundedAttributionRow[] {
  if (!result || typeof result !== "object") return [];
  const rows = (result as { attribution?: GroundedAttributionRow[] }).attribution;
  return Array.isArray(rows) ? rows : [];
}

function readSource(result: unknown): string | undefined {
  if (!result || typeof result !== "object") return undefined;
  const source = (result as { source?: string }).source;
  return typeof source === "string" ? source : undefined;
}

function readPhotoAuthorAttributions(
  row: Record<string, unknown>,
): GroundedPhotoAttribution[] | undefined {
  const raw = row.photoAuthorAttributions;
  if (!Array.isArray(raw)) return undefined;
  const out: GroundedPhotoAttribution[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const entry: GroundedPhotoAttribution = {};
    if (typeof rec.displayName === "string") entry.displayName = rec.displayName;
    if (typeof rec.uri === "string") entry.uri = rec.uri;
    if (entry.displayName || entry.uri) out.push(entry);
  }
  return out.length > 0 ? out : undefined;
}

/** Normalize CopilotKit / Mastra grounded tool payloads for cards + pins. */
export function parseGroundedToolResult(result: unknown): ParsedGroundedToolResult {
  let root: unknown = result;
  if (typeof root === "string") {
    try {
      root = JSON.parse(root) as unknown;
    } catch {
      return { results: [], attribution: [] };
    }
  }
  if (Array.isArray(root)) {
    root = { results: root, source: "grounding" };
  }

  const envelope = normalizeToolEnvelope(root);
  const attribution = readAttribution(root);
  const source = readSource(root) ?? envelope.source;

  const rawRows = (envelope.results ?? []) as Array<
    GroundedToolRow & { name?: string; maps_url?: string }
  >;

  const results = rawRows.map((row, index) => {
    const mapsUrl = row.mapsUrl ?? row.maps_url;
    const openNow =
      row.openNow === null
        ? null
        : typeof row.openNow === "boolean"
          ? row.openNow
          : undefined;
    return {
      id: String(row.id ?? `grounded-${index}`),
      title: resolveGroundedTitle(row, index, attribution, mapsUrl),
      mapsUrl,
      directionsUrl:
        typeof row.directionsUrl === "string" ? row.directionsUrl : undefined,
      reviewsUrl:
        typeof row.reviewsUrl === "string" ? row.reviewsUrl : undefined,
      latitude: row.latitude,
      longitude: row.longitude,
      placeId: row.placeId,
      rating: typeof row.rating === "number" ? row.rating : undefined,
      userRatingCount:
        typeof row.userRatingCount === "number"
          ? row.userRatingCount
          : undefined,
      priceLevel:
        typeof row.priceLevel === "string" ? row.priceLevel : undefined,
      openNow,
      formattedAddress:
        typeof row.formattedAddress === "string"
          ? row.formattedAddress
          : undefined,
      primaryType:
        typeof row.primaryType === "string" ? row.primaryType : undefined,
      summary: typeof row.summary === "string" ? row.summary : undefined,
      photoName:
        typeof row.photoName === "string" ? row.photoName : undefined,
      photoAuthorAttributions: readPhotoAuthorAttributions(
        row as Record<string, unknown>,
      ),
      fieldMaskVersion:
        typeof row.fieldMaskVersion === "string"
          ? row.fieldMaskVersion
          : undefined,
    };
  });

  return { results, attribution, source };
}

/** Hide attribution bullets when every card already exposes the same Maps URL. */
export function dedupeAttributionForDisplay(
  attribution: GroundedAttributionRow[],
  cardMapsUrls: string[],
): GroundedAttributionRow[] {
  const onCards = new Set(cardMapsUrls.filter(Boolean));
  const unique = new Map<string, GroundedAttributionRow>();

  for (const row of attribution) {
    if (!row.placeUri) continue;
    if (onCards.has(row.placeUri)) continue;
    if (!unique.has(row.placeUri)) unique.set(row.placeUri, row);
  }

  return [...unique.values()];
}

/** Single footer when cards already link to Maps — avoids 5× "Google Maps" spam. */
export function shouldShowGroundingAttribution(
  attribution: GroundedAttributionRow[],
  cardMapsUrls: string[],
): boolean {
  const deduped = dedupeAttributionForDisplay(attribution, cardMapsUrls);
  if (deduped.length > 0) return true;
  return attribution.length > 0 && cardMapsUrls.length === 0;
}
