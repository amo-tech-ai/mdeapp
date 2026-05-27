"use client";

import { ChatResultsColumn } from "@/components/chat/chat-results-column";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";

/** Hide generic pin rows when rich event cards are already shown. */
export function CenterPanelMapResultsSlot() {
  const { rows } = useEventSearchResults();
  if (rows.length > 0) return null;

  return (
    <div className="hidden max-h-[200px] shrink-0 border-t border-border sm:block">
      <ChatResultsColumn compact />
    </div>
  );
}
