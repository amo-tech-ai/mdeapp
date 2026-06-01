"use client";

import { RestaurantResults } from "@/components/copilot/search-tool-renders";
import { useRestaurantFastPath } from "@/components/chat/restaurant-fast-path-context";

/** Inline restaurant cards from fast-path search (no CopilotKit tool render). */
export function RestaurantFastPathPanel() {
  const { toolResult } = useRestaurantFastPath();
  if (!toolResult) return null;

  return (
    <div data-testid="restaurant-fast-path-panel" className="px-2 pb-3 sm:px-4">
      <RestaurantResults result={toolResult} />
    </div>
  );
}
