"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PHASE_A_OPPORTUNITIES,
  PHASE_A_RECENT,
  PHASE_A_WORKFLOWS,
} from "@/components/host/rentals/rentals-concierge-constants";

const DOT_CLASS: Record<string, string> = {
  red: "bg-destructive",
  amber: "bg-accent",
  blue: "bg-primary",
};

/** Left column — opportunities, workflows, recent (rc-left). Phase A: static, no agent sends. */
export function RentalsConversationHistory() {
  return (
    <aside
      data-testid="rc-left"
      className="flex min-h-0 flex-col gap-3 overflow-y-auto border-border lg:border-r lg:pr-4"
      aria-label="Broker opportunities and workflows"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        disabled
        data-testid="rc-new"
        title="Available after SAN-1124 broker CopilotKit bridge"
      >
        <Plus className="size-4" aria-hidden />
        New conversation
      </Button>

      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        ✦ Opportunities
      </div>
      <ul className="space-y-2" aria-label="Opportunity feed">
        {PHASE_A_OPPORTUNITIES.map((opp) => (
          <li key={opp.id}>
            <button
              type="button"
              disabled
              data-testid={`rc-opp-${opp.id}`}
              className={cn(
                "flex w-full items-start gap-2 rounded-lg border border-border bg-card p-2 text-left",
                "opacity-80",
              )}
            >
              <span
                className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT_CLASS[opp.dot])}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug">{opp.title}</span>
                <span className="block text-xs text-muted-foreground">{opp.subtitle}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Saved workflows
      </div>
      <ul className="space-y-1">
        {PHASE_A_WORKFLOWS.map((flow) => (
          <li key={flow.id}>
            <button
              type="button"
              disabled
              data-testid={`rc-flow-${flow.id}`}
              className="w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground"
            >
              {flow.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Recent
      </div>
      <ul className="space-y-1">
        {PHASE_A_RECENT.map((title, index) => (
          <li key={title}>
            <button
              type="button"
              disabled
              data-testid={`rc-hist-${index}`}
              className="w-full truncate rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground"
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
