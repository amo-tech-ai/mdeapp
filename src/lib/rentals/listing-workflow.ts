/** PTR-RENTALS-003 / SAN-1106 — client mirror of listing_workflow_status FSM */

export const LISTING_WORKFLOW_STATUSES = [
  "draft",
  "ready_for_review",
  "published",
  "paused",
  "rejected",
] as const;

export type ListingWorkflowStatus = (typeof LISTING_WORKFLOW_STATUSES)[number];

const VALID_TRANSITIONS: Record<ListingWorkflowStatus, readonly ListingWorkflowStatus[]> = {
  draft: ["ready_for_review"],
  ready_for_review: ["published", "rejected"],
  published: ["paused"],
  paused: ["published"],
  rejected: ["draft"],
};

/** Type guard for `listing_workflow_status` values from Supabase. */
export function isListingWorkflowStatus(value: unknown): value is ListingWorkflowStatus {
  return (
    typeof value === "string" &&
    (LISTING_WORKFLOW_STATUSES as readonly string[]).includes(value)
  );
}

/** Return true when `from → to` is allowed (or a no-op). */
export function canTransitionListingWorkflow(
  from: ListingWorkflowStatus,
  to: ListingWorkflowStatus,
): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from].includes(to);
}

/** Throw when `from → to` is not a valid listing workflow transition. */
export function assertListingWorkflowTransition(
  from: ListingWorkflowStatus,
  to: ListingWorkflowStatus,
): void {
  if (!canTransitionListingWorkflow(from, to)) {
    throw new Error(`invalid listing workflow transition: ${from} → ${to}`);
  }
}
