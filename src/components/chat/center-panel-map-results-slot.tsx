"use client";

import { ChatResultsColumn } from "@/components/chat/chat-results-column";
import { useRichCardResults } from "@/components/chat/rich-card-results-context";
import { useMapContext } from "@/platform/maps/map-context";

/**
 * Compact pin list under center chat — fallback only when no rich generative cards
 * own the active vertical (see RICH_CARD_CATEGORIES in rich-card-results.ts).
 */
export function CenterPanelMapResultsSlot() {
  const { shouldSuppressGenericMapResults } = useRichCardResults();
  const { activeMapCategory } = useMapContext();

  if (shouldSuppressGenericMapResults(activeMapCategory)) return null;

  return (
    <div className="hidden max-h-[200px] shrink-0 border-t border-border sm:block">
      <ChatResultsColumn compact />
    </div>
  );
}
