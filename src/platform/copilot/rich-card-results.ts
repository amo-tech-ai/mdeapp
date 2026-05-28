import type { MapPinCategory } from "@/platform/contracts";

/** Verticals that render generative cards in chat — generic pin lists must stay hidden. */
export const RICH_CARD_CATEGORIES = [
  "rental",
  "event",
  "restaurant",
  "attraction",
  "grounded",
] as const satisfies readonly MapPinCategory[];

export type RichCardCategory = (typeof RICH_CARD_CATEGORIES)[number];

export function isRichCardCategory(
  category: MapPinCategory | null | undefined,
): category is RichCardCategory {
  return (
    category != null &&
    (RICH_CARD_CATEGORIES as readonly string[]).includes(category)
  );
}

export type RichCardCounts = Partial<Record<MapPinCategory, number>>;

/** Hide compact "Map results" when the active vertical already has rich cards in chat. */
export function shouldSuppressGenericMapResults(
  counts: RichCardCounts,
  activeMapCategory: MapPinCategory | null,
): boolean {
  if (activeMapCategory && (counts[activeMapCategory] ?? 0) > 0) {
    return isRichCardCategory(activeMapCategory);
  }
  return false;
}
