import {
  searchCafeVenueAnchorsForBrowse,
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

export type CafeFeature = "specialty" | "workspace";

export type CafeListing = {
  id: string;
  name: string;
  neighborhood: string | null;
  tags: string[];
  summary: string | null;
  mapsUrl: string;
};

export function mapVenueAnchorToCafeListing(row: VenueAnchorRow): CafeListing {
  return {
    id: row.id,
    name: row.name,
    neighborhood: row.neighborhood,
    tags: row.tags ?? [],
    summary: venueAnchorSummary(row) ?? null,
    mapsUrl: venueAnchorMapsUrl(row.google_place_id),
  };
}

export function matchesCafeFeature(
  listing: CafeListing,
  feature: CafeFeature,
): boolean {
  const tags = listing.tags.map((t) => t.toLowerCase());
  switch (feature) {
    case "specialty":
      return tags.some(
        (t) =>
          t.includes("specialty") ||
          t.includes("third-wave") ||
          t.includes("single-origin"),
      );
    case "workspace":
      return tags.some(
        (t) =>
          t.includes("workspace") ||
          t.includes("wifi") ||
          t.includes("cowork"),
      );
    default:
      return true;
  }
}

export async function loadCafeListings(filters: {
  neighborhood?: string;
  feature?: CafeFeature;
  limit?: number;
}): Promise<{ results: CafeListing[]; error: string | null }> {
  const { rows, error } = await searchCafeVenueAnchorsForBrowse({
    neighborhood: filters.neighborhood,
    limit: filters.limit ?? 24,
  });
  if (error) {
    return { results: [], error };
  }

  let results = rows.map(mapVenueAnchorToCafeListing);
  if (filters.feature) {
    results = results.filter((row) =>
      filters.feature ? matchesCafeFeature(row, filters.feature) : true,
    );
    );
  }
  return { results, error: null };
}
