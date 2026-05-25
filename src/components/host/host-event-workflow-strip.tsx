"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type HostWizardStep = "basics" | "venue" | "tickets" | "preview";

const STEPS: { id: HostWizardStep; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "venue", label: "Venue" },
  { id: "tickets", label: "Tickets" },
  { id: "preview", label: "Preview" },
];

type HostEventWorkflowStripProps = {
  activeStep?: HostWizardStep;
};

/** SCREEN-016 — Roberto wizard steps (static until EventDraftState / F33 wires live). */
export function HostEventWorkflowStrip({
  activeStep = "basics",
}: HostEventWorkflowStripProps) {
  const activeIndex = STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div
      data-testid="host-event-workflow-strip"
      className="shrink-0 border-b border-border bg-muted/30 px-4 py-2"
      role="status"
      aria-label="Event creation progress"
    >
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
        {STEPS.map((step, index) => {
          const done = activeIndex >= 0 && index < activeIndex;
          const current = index === activeIndex;
          const pending = !done && !current;

          return (
            <li key={step.id} className="flex items-center gap-1.5">
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
                data-step={step.id}
                data-state={done ? "done" : current ? "current" : "pending"}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <Circle className="size-3" aria-hidden />
                )}
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
