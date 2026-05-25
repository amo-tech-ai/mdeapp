"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ApprovalDecision = "approved" | "edit" | "rejected";

export interface ApprovalPanelProps {
  title?: string;
  description?: string;
  preview?: React.ReactNode;
  status: "inProgress" | "executing" | "complete";
  respond?: (response: ApprovalDecision) => void;
}

/** Generic HITL shell — host wizard uses EventPublishApprovalPanel. */
export function ApprovalPanel({
  title = "Approval required",
  description = "Review the proposed action.",
  preview,
  status,
  respond,
}: ApprovalPanelProps) {
  const [decided, setDecided] = useState<ApprovalDecision | null>(null);

  const onClick = (decision: ApprovalDecision) => {
    if (decided) return;
    setDecided(decision);
    respond?.(decision);
  };

  return (
    <Card className="mt-6 max-w-md w-full border-primary/30" data-testid="approval-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {preview ? <CardContent className="pt-0">{preview}</CardContent> : null}
      {decided === null && status === "executing" ? (
        <CardFooter className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => onClick("approved")}>
            Approve
          </Button>
          <Button type="button" variant="outline" onClick={() => onClick("edit")}>
            Edit
          </Button>
          <Button type="button" variant="destructive" onClick={() => onClick("rejected")}>
            Reject
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
