/** Display helpers for enriched grounded place cards (MAP-018F). */

const PRICE_LEVEL_LABELS: Record<string, string> = {
  PRICE_LEVEL_FREE: "Free",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

export function formatReviewCount(count?: number): string {
  if (count == null || count < 1) return "";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

export function formatGroundedRating(
  rating?: number,
  userRatingCount?: number,
): string | null {
  if (rating == null || Number.isNaN(rating)) return null;
  const count = formatReviewCount(userRatingCount);
  return count ? `${rating.toFixed(1)} (${count})` : rating.toFixed(1);
}

export function priceLevelToLabel(priceLevel?: string): string | null {
  if (!priceLevel) return null;
  return PRICE_LEVEL_LABELS[priceLevel] ?? null;
}

export function primaryTypeToLabel(primaryType?: string): string | null {
  if (!primaryType) return null;
  return primaryType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function openNowLabel(openNow?: boolean | null): string | null {
  if (openNow === true) return "Open now";
  if (openNow === false) return "Closed";
  return null;
}

export function richGroundedCardsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RICH_GROUNDED_CARDS !== "false";
}
