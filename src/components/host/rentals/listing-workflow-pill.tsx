import type { ListingWorkflowStatus } from "@/lib/rentals/listing-workflow";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LABELS: Record<ListingWorkflowStatus, string> = {
  draft: "Draft",
  ready_for_review: "Ready for review",
  published: "Published",
  paused: "Paused",
  rejected: "Rejected",
};

const VARIANT: Record<ListingWorkflowStatus, "secondary" | "default" | "outline" | "destructive"> = {
  draft: "secondary",
  ready_for_review: "outline",
  published: "default",
  paused: "secondary",
  rejected: "destructive",
};

export function ListingWorkflowPill({
  status,
  compact = false,
}: {
  status: ListingWorkflowStatus;
  compact?: boolean;
}) {
  return (
    <Badge
      variant={VARIANT[status]}
      className={cn(compact && "text-[10px] px-1.5 py-0")}
      data-testid={`lx-status-${status}`}
    >
      {LABELS[status]}
    </Badge>
  );
}
