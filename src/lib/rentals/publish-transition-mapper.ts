import type { PublishTransitionResult } from "./broker-surface-state";
import { isListingWorkflowStatus } from "./listing-workflow";

/** Snake-case row returned by publish_listing / transition_listing_workflow RPCs. */
export type PublishTransitionRpcRow = {
  id: string;
  listing_workflow_status: string;
  published_at: string | null;
  published_by: string | null;
};

/** Map Supabase apartments RPC row → broker UI camelCase contract. */
export function mapPublishTransitionFromRpc(row: PublishTransitionRpcRow): PublishTransitionResult {
  if (!isListingWorkflowStatus(row.listing_workflow_status)) {
    throw new Error(`invalid listing_workflow_status: ${row.listing_workflow_status}`);
  }
  return {
    apartmentId: row.id,
    listingWorkflowStatus: row.listing_workflow_status,
    publishedAt: row.published_at,
    publishedBy: row.published_by,
  };
}
