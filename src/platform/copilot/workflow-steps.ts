/** Tool → workflow strip labels (Phase A: UI driven by generative tool status). */

export type WorkflowKind =
  | "rental"
  | "event"
  | "restaurant"
  | "attraction"
  | "grounded";

export type WorkflowPhase = "idle" | "running" | "complete" | "error";

export const WORKFLOW_STEP_LABELS: Record<WorkflowKind, readonly string[]> = {
  rental: ["Searching listings", "Ranking matches", "Results ready"],
  event: ["Discovering events", "Filtering by vibe", "Results ready"],
  restaurant: ["Finding places", "Checking ratings", "Results ready"],
  attraction: ["Scanning spots", "Curating picks", "Results ready"],
  grounded: ["Grounding search", "Verifying places", "Results ready"],
};

const TOOL_KIND_MAP: Record<string, WorkflowKind> = {
  searchRentalsTool: "rental",
  "search-rentals": "rental",
  searchEventsTool: "event",
  "search-events": "event",
  searchRestaurantsTool: "restaurant",
  "search-restaurants": "restaurant",
  searchAttractionsTool: "attraction",
  "search-attractions": "attraction",
  searchGroundedPlacesTool: "grounded",
  "search-grounded-places": "grounded",
};

export function toolNameToWorkflowKind(name: string): WorkflowKind | null {
  return TOOL_KIND_MAP[name] ?? null;
}

/** Active step index while running (0..n-2); complete locks on last step. */
export function activeWorkflowStepIndex(
  phase: WorkflowPhase,
  stepCount: number,
  elapsedMs: number,
): number {
  if (phase === "idle" || stepCount <= 0) return -1;
  if (phase === "complete" || phase === "error") return stepCount - 1;
  const maxRunning = Math.max(0, stepCount - 2);
  return Math.min(Math.floor(elapsedMs / 900), maxRunning);
}
