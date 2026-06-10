"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EventProposalShellTarget } from "@/components/chat/rental-ui-context";

/**
 * SAN-496 placeholder — review panel shell only. No DB write, no Mastra tool.
 */
export function EventProposalShell({
  target,
  open,
  onOpenChange,
}: {
  target: EventProposalShellTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        data-testid="event-proposal-shell"
      >
        {target ? (
          <>
            <DialogHeader>
              <DialogTitle>Review event proposal</DialogTitle>
              <DialogDescription>
                Venue: {target.venueTitle}
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm"
              data-testid="event-proposal-hitl-panel"
            >
              <p className="text-muted-foreground">
                Event details, guest count, and budget will appear here for
                your review before Patricia approves at{" "}
                <span className="font-medium text-foreground">
                  /admin/event-bookings
                </span>
                .
              </p>
              <p className="text-xs text-muted-foreground">
                Proposal pending — not confirmed until admin approval.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="event-proposal-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled
                data-testid="event-proposal-submit-btn"
              >
                Submit proposal
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
