/**
 * Resolve listing_id for capture_lead when Gemini omits it (Proof 004 F9).
 */

const FIRST_LISTING_RE =
  /\b(first(\s+one)?|#1|top\s+one|that\s+one|the\s+first)\b/i;

export function extractListingIdsFromSession(
  sessionData: Record<string, unknown> | null | undefined,
): string[] {
  if (!sessionData || typeof sessionData !== "object") return [];
  const raw = sessionData.last_listing_ids;
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === "string" && id.length > 0);
}

/**
 * When params lack listing_id, use last search listing_ids + ordinal hints.
 */
export function enrichCaptureLeadParams(
  params: Record<string, unknown>,
  lastUserContent: string,
  lastListingIds: string[],
): Record<string, unknown> {
  if (typeof params.listing_id === "string" && params.listing_id.trim()) {
    return params;
  }
  if (lastListingIds.length === 0) return params;

  const text = lastUserContent.trim();
  const wantsFirst = FIRST_LISTING_RE.test(text);
  if (wantsFirst || lastListingIds.length === 1) {
    return { ...params, listing_id: lastListingIds[0] };
  }
  return params;
}
