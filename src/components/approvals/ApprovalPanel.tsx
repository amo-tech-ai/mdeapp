"use client";

// ApprovalPanel — HITL demo shell (W4 adds Sheet + renderAndWaitForResponse).

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ApprovalDecision = "approved" | "edit" | "rejected";

export interface ApprovalPanelProps {
  title?: string;
  description?: string;
  preview?: React.ReactNode;
  status: "inProgress" | "executing" | "complete";
  respond?: (response: string) => void;
}

export function ApprovalPanel({
  title = "Approval required",
  description = "Review the proposed action.",
  preview,
  status,
  respond,
}: ApprovalPanelProps) {
  const [decision, setDecision] = useState<ApprovalDecision | null>(null);

  const handleApprove = () => {
    setDecision("approved");
    respond?.("APPROVED — proceed with the action.");
  };

  const handleEdit = () => {
    setDecision("edit");
    respond?.("EDIT — user wants to modify the proposal before approving.");
  };

  const handleReject = () => {
    setDecision("rejected");
    respond?.("REJECTED — user declined the proposed action.");
  };

  return (
    <Card className="mt-6 max-w-md w-full border-primary/30">
      <CardHeader className="text-center">
        {decision === "approved" ? (
          <>
            <p className="text-5xl mb-2" aria-hidden>
              ✅
            </p>
            <CardTitle>Approved</CardTitle>
            <CardDescription>Proceeding with the action.</CardDescription>
          </>
        ) : decision === "edit" ? (
          <>
            <p className="text-5xl mb-2" aria-hidden>
              ✏️
            </p>
            <CardTitle>Edit requested</CardTitle>
            <CardDescription>
              User wants to modify the proposal.
            </CardDescription>
          </>
        ) : decision === "rejected" ? (
          <>
            <p className="text-5xl mb-2" aria-hidden>
              ❌
            </p>
            <CardTitle>Rejected</CardTitle>
            <CardDescription>User declined the action.</CardDescription>
          </>
        ) : (
          <>
            <p className="text-5xl mb-2" aria-hidden>
              📋
            </p>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardHeader>

      {decision === null && preview && (
        <CardContent className="pt-0">
          <div className="rounded-lg bg-muted p-3 text-sm">{preview}</div>
        </CardContent>
      )}

      {decision === null && status === "executing" && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" onClick={handleApprove}>
              Approve
            </Button>
            <Button type="button" variant="outline" onClick={handleEdit}>
              Edit
            </Button>
            <Button type="button" variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
