import {
  searchNightclubVenueAnchorsForBrowse,
  venueAnchorMapsUrl,
  venueAnchorSummary,
  type VenueAnchorRow,
} from "@/mastra/tools/search-venue-anchors";

/** Next.js may pass duplicate query keys as `string[]`. */
export function normalizeSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export type NightlifeVibe =
  | "reggaeton"
  | "rooftop"
  | "salsa"
  | "cocktails"
  | "live-music";

export type NightlifeListing = {
  id: string;
  name: string;
  neighborhood: string | null;
  tags: string[];
  summary: string | null;
  mapsUrl: string;
};

export function mapVenueAnchorToNightlifeListing(
  row: VenueAnchorRow,
): NightlifeListing {
  return {
    id: row.id,
    name: row.name,
    neighborhood: row.neighborhood,
    tags: row.tags ?? [],
    summary: venueAnchorSummary(row) ?? null,
    mapsUrl: venueAnchorMapsUrl(row.google_place_id),
  };
}

export function matchesNightlifeVibe(
  listing: NightlifeListing,
  vibe: NightlifeVibe,
): boolean {
  const tags = listing.tags.map((t) => t.toLowerCase());
  switch (vibe) {
    case "reggaeton":
      return tags.some((t) => t.includes("reggaeton"));
    case "rooftop":
      return tags.some((t) => t.includes("rooftop"));
    case "salsa":
      return tags.some((t) => t.includes("salsa"));
    case "cocktails":
      return tags.some((t) => t.includes("cocktail") || t.includes("bar"));
    case "live-music":
      return tags.some((t) => t.includes("live-music") || t.includes("dj"));
    default:
      return true;
  }
}

export async function loadNightlifeListings(filters: {
  neighborhood?: string;
  vibe?: NightlifeVibe;
  limit?: number;
}): Promise<{ results: NightlifeListing[]; error: string | null }> {
  const { rows, error } = await searchNightclubVenueAnchorsForBrowse({
    neighborhood: filters.neighborhood,
    limit: filters.limit ?? 24,
  });
  if (error) {
    return { results: [], error };
  }

  let results = rows.map(mapVenueAnchorToNightlifeListing);
  if (filters.vibe) {
    results = filters.vibe ? results.filter((row) => matchesNightlifeVibe(row, filters.vibe)) : results;
  }
  return { results, error: null };
}
