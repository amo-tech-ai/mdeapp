"use client";

import { RentalResults } from "@/components/copilot/search-tool-renders";
import { useRentalFastPath } from "@/components/chat/rental-fast-path-context";

/** Inline rental cards from fast-path search (no CopilotKit tool render). */
export function RentalFastPathPanel() {
  const { toolResult, searchMeta } = useRentalFastPath();
  if (!toolResult) return null;

  return (
    <div data-testid="rental-fast-path-panel" className="px-2 pb-3 sm:px-4">
      <RentalResults result={toolResult} searchMeta={searchMeta ?? undefined} />
    </div>
  );
}
