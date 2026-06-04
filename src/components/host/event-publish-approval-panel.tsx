"use client";

import { useState } from "react";
import { EventCard } from "@/components/copilot/event-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { draftToEventCardProps } from "@/lib/events/draft-to-event-card";
import {
  resolveApprovalCommit,
  type ApprovalCommitResponse,
} from "@/lib/events/resolve-approval-commit";
import type { EventDraftState } from "@/lib/types";
import type { ApprovalDecision } from "@/lib/events/approval-decision";

type EventPublishApprovalPanelProps = {
  draft: EventDraftState;
  status: "inProgress" | "executing" | "complete";
  respond: (decision: ApprovalDecision) => void;
  onPublished?: (payload: {
    eventId: string;
    slug: string;
    approvalRequestId?: string;
  }) => void;
};

/** F37 — HITL publish card for preview_and_publish. */
export function EventPublishApprovalPanel({
  draft,
  status,
  respond,
  onPublished,
}: EventPublishApprovalPanelProps) {
  const [decided, setDecided] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = draftToEventCardProps(draft, {
    slug: draft.publishedSlug ?? "preview",
  });

  async function commit(decision: ApprovalDecision) {
    if (decided || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/approval-commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          draft,
          approvalRequestId: draft.approvalRequestId,
        }),
      });
      const json = (await res.json()) as ApprovalCommitResponse;

      const outcome = resolveApprovalCommit(decision, res.ok, json);
      if (outcome.kind === "error") {
        // Includes the "approved but no eventId/slug" case — do NOT respond as
        // approved and do NOT lock the panel, so the host can retry.
        setError(outcome.message);
        setSubmitting(false);
        return;
      }

      if (outcome.kind === "published") {
        onPublished?.({
          eventId: outcome.eventId,
          slug: outcome.slug,
          approvalRequestId: outcome.approvalRequestId,
        });
      }
      setDecided(true);
      respond(decision);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval commit failed");
      setSubmitting(false);
    }
  }

  return (
    <Card
      className="mx-2 my-3 max-w-lg border-primary/30 sm:mx-4"
      data-testid="host-event-approval-panel"
    >
      <CardHeader>
        <CardTitle>Ready to publish?</CardTitle>
        <CardDescription>
          Review your event preview. Publishing makes tickets available to buyers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <EventCard {...preview} />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
      {status === "executing" && !decided ? (
        <CardFooter className="flex flex-wrap gap-2">
          <Button
            type="button"
            data-testid="host-event-approve"
            disabled={submitting}
            onClick={() => commit("approved")}
          >
            Publish event
          </Button>
          <Button
            type="button"
            variant="outline"
            data-testid="host-event-edit"
            disabled={submitting}
            onClick={() => commit("edit")}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            data-testid="host-event-reject"
            disabled={submitting}
            onClick={() => commit("rejected")}
          >
            Cancel
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
