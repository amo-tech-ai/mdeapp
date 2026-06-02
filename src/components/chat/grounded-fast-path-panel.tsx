"use client";

import { useGroundedFastPath } from "@/components/chat/grounded-fast-path-context";
import { GroundedPlaceResults } from "@/components/copilot/search-tool-renders";

export function GroundedFastPathPanel() {
  const { toolResult } = useGroundedFastPath();
  if (!toolResult) return null;

  return (
    <div data-testid="grounded-fast-path-panel" className="px-2 pb-3 sm:px-4">
      <GroundedPlaceResults result={toolResult} />
    </div>
  );
}
