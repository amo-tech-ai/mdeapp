import type { ListingWorkflowStatus } from "./listing-workflow";

export type PublishRpcName = "request_listing_publish" | "publish_listing" | "pause_listing";

/** Resolve which publish FSM RPC applies for the current workflow status. */
export function resolvePublishRpc(
  status: ListingWorkflowStatus,
): PublishRpcName | null {
  switch (status) {
    case "draft":
      return "request_listing_publish";
    case "ready_for_review":
    case "paused":
      return "publish_listing";
    case "published":
      return "pause_listing";
    default:
      return null;
  }
}

/** Whether publish/resume requires broker HITL acknowledgement checkbox. */
export function publishRequiresAck(status: ListingWorkflowStatus): boolean {
  return status === "ready_for_review" || status === "paused";
}

/** Primary CTA label in the property drawer. */
export function publishActionLabel(status: ListingWorkflowStatus): string | null {
  switch (status) {
    case "draft":
      return "Submit for review";
    case "ready_for_review":
      return "Approve & publish";
    case "published":
      return "Pause listing";
    case "paused":
      return "Resume listing";
    default:
      return null;
  }
}
