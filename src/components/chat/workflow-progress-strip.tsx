"use client";

import { Check, Circle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WORKFLOW_STEP_LABELS,
  activeWorkflowStepIndex,
} from "@/platform/copilot/workflow-steps";
import { useChatWorkflow } from "@/components/chat/chat-workflow-context";

/** SCREEN-004 — Mindtrip-style step strip driven by tool generative render status. */
export function WorkflowProgressStrip() {
  const { snapshot, now } = useChatWorkflow();

  if (snapshot.phase === "idle" || !snapshot.kind) {
    return (
      <div
        data-testid="workflow-progress-strip"
        data-phase="idle"
        className="shrink-0 border-b border-border bg-muted/30 px-4 py-2"
        aria-hidden
      />
    );
  }

  const labels = WORKFLOW_STEP_LABELS[snapshot.kind];
  const elapsed =
    snapshot.startedAt != null ? now - snapshot.startedAt : 0;
  const activeIndex = activeWorkflowStepIndex(
    snapshot.phase,
    labels.length,
    elapsed,
  );
  const isError = snapshot.phase === "error";

  return (
    <div
      data-testid="workflow-progress-strip"
      data-phase={snapshot.phase}
      data-kind={snapshot.kind}
      className={cn(
        "shrink-0 border-b border-border px-4 py-2",
        isError ? "bg-destructive/10" : "bg-muted/30",
      )}
      role="status"
      aria-live="polite"
      aria-label={isError ? "Search failed" : "Search progress"}
    >
      {isError ? (
        <p className="flex items-center gap-2 text-sm text-destructive" data-testid="workflow-error">
          <X className="size-4" aria-hidden />
          Search failed — try again or adjust your filters.
        </p>
      ) : (
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
        {labels.map((label, index) => {
          const done =
            snapshot.phase === "complete"
              ? true
              : activeIndex >= 0 && index < activeIndex;
          const current =
            snapshot.phase === "running" && index === activeIndex;
          const pending = !done && !current;

          return (
            <li key={label} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span className="text-muted-foreground/50" aria-hidden>
                  →
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                  done && "bg-primary/10 text-primary",
                  current && "bg-secondary text-secondary-foreground",
                  pending && "text-muted-foreground",
                )}
                data-step={index}
                data-state={done ? "done" : current ? "current" : "pending"}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden />
                ) : current ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Circle className="size-3" aria-hidden />
                )}
                {label}
              </span>
            </li>
          );
        })}
      </ol>
      )}
    </div>
  );
}
