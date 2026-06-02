import { parseGroundedToolResult } from "@/lib/parse-grounded-tool-result";

export type GroundedVenueKind = "cafe" | "nightlife" | "general";

const NIGHTLIFE_PRIMARY = /\b(night_club|bar|nightclub|cocktail|wine_bar|pub)\b/i;

export function inferGroundedVenueKindFromRows(
  rows: Array<{ primaryType?: string; title?: string }>,
): GroundedVenueKind {
  if (rows.length === 0) return "general";
  const nightlifeHits = rows.filter(
    (r) =>
      (r.primaryType && NIGHTLIFE_PRIMARY.test(r.primaryType)) ||
      /\b(bar|club|salsa|rooftop|nightlife|discotec|lounge)\b/i.test(
        r.title ?? "",
      ),
  ).length;
  const cafeHits = rows.filter((r) =>
    /\bcaf[eé]|coffee|brunch/i.test(r.title ?? ""),
  ).length;
  if (nightlifeHits > cafeHits) return "nightlife";
  if (cafeHits > 0) return "cafe";
  return "general";
}

export function readGroundedVenueKind(result: unknown): GroundedVenueKind {
  if (result && typeof result === "object") {
    const meta = (result as { metadata?: Record<string, unknown> }).metadata;
    const kind = meta?.venueKind;
    if (kind === "cafe" || kind === "nightlife" || kind === "general") {
      return kind;
    }
  }
  const parsed = parseGroundedToolResult(result);
  if (parsed.venueKind) return parsed.venueKind;
  return inferGroundedVenueKindFromRows(parsed.results);
}
