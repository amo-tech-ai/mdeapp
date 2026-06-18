/** GS-004 — when Tourist needs fresh web facts vs Maps MCP only. */

const FRESHNESS_SIGNAL =
  /\b(this weekend|tonight|today|latest|official|this friday|tomorrow|verify|is this (event|real)|ticket link|sold out)\b/i;

const MAP_ONLY_SIGNAL =
  /\b(caf[eé]|coffee|rental|apartment|map|near me|nearby|open now|quiet spot|poi|venue near|show on map)\b/i;

export type SearchIntentRoute = "search" | "maps" | "supabase_events";

export function needsSearchGrounding(
  query: string,
  options?: { sqlEventCount?: number },
): boolean {
  const q = query.trim();
  if (!q) return false;

  if (MAP_ONLY_SIGNAL.test(q) && !FRESHNESS_SIGNAL.test(q)) {
    return false;
  }

  if (FRESHNESS_SIGNAL.test(q)) {
    const needsVerify =
      /\b(verify|is this (event|real)|ticket link|sold out|official|latest)\b/i.test(
        q,
      );
    if (needsVerify) return true;
    return (options?.sqlEventCount ?? 0) < 3;
  }

  const sqlEmpty = (options?.sqlEventCount ?? 0) === 0;
  return (
    sqlEmpty &&
    FRESHNESS_SIGNAL.test(q) &&
    /\b(event|festival|concert|rooftop|party|gig|show)\b/i.test(q)
  );
}

export function classifySearchRoute(
  query: string,
  options?: { sqlEventCount?: number },
): SearchIntentRoute {
  if (MAP_ONLY_SIGNAL.test(query) && !FRESHNESS_SIGNAL.test(query)) {
    return "maps";
  }
  if (/\b(event|festival|concert|ticket|gig|show)\b/i.test(query)) {
    if (needsSearchGrounding(query, options)) return "search";
    return "supabase_events";
  }
  if (needsSearchGrounding(query, options)) return "search";
  return "maps";
}
