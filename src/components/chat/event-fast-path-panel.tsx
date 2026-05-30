"use client";

import { EventResults } from "@/components/copilot/search-tool-renders";
import { useEventFastPath } from "@/components/chat/event-fast-path-context";

/** Inline event cards from fast-path search (no CopilotKit tool render). */
export function EventFastPathPanel() {
  const { toolResult } = useEventFastPath();
  if (!toolResult) return null;

  return (
    <div data-testid="event-fast-path-panel" className="px-2 pb-3 sm:px-4">
      <EventResults result={toolResult} />
    </div>
  );
}
