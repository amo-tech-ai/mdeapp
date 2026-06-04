import type { ApprovalDecision } from "@/lib/events/approval-decision";

export type ApprovalCommitResponse = {
  success?: boolean;
  error?: { message?: string };
  eventId?: string;
  slug?: string;
  approvalRequestId?: string;
};

export type ApprovalCommitOutcome =
  | { kind: "error"; message: string }
  | {
      kind: "published";
      eventId: string;
      slug: string;
      approvalRequestId?: string;
    }
  | { kind: "decided" }; // edit / rejected — no publish payload expected

/**
 * Decide what the host approval panel should do with an `/api/approval-commit`
 * response. Enforces the **approved-response contract**: an `"approved"` success
 * MUST carry both `eventId` and `slug`, otherwise it is a retryable failure —
 * the caller must NOT `respond("approved")` (which would tell the agent the event
 * published) and must leave the panel re-submittable. Without this, a malformed
 * success would leave the host stuck: agent marked approved, but no published
 * state / slug and no retry. (SAN-366 / CodeRabbit PR #64.)
 */
export function resolveApprovalCommit(
  decision: ApprovalDecision,
  ok: boolean,
  json: ApprovalCommitResponse,
): ApprovalCommitOutcome {
  if (!ok || !json.success) {
    return {
      kind: "error",
      message: json.error?.message ?? "Approval commit failed",
    };
  }
  if (decision === "approved") {
    if (!json.eventId || !json.slug) {
      return {
        kind: "error",
        message: "Publish succeeded but returned no event reference. Please retry.",
      };
    }
    return {
      kind: "published",
      eventId: json.eventId,
      slug: json.slug,
      approvalRequestId: json.approvalRequestId,
    };
  }
  return { kind: "decided" };
}
