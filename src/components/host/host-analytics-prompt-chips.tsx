"use client";

import { useHostOpsChat } from "@/lib/hooks/use-host-ops-chat";
import { cn } from "@/lib/utils";

const PROMPTS = [
  {
    id: "sales",
    label: "How are my sales?",
    message: "how are my sales?",
    testId: "host-analytics-chip-sales",
  },
  {
    id: "best",
    label: "Best event",
    message: "how is my best event doing?",
    testId: "host-analytics-chip-best",
  },
  {
    id: "events",
    label: "My events",
    message: "which events do I have?",
    testId: "host-analytics-chip-events",
  },
] as const;

type HostAnalyticsPromptChipsProps = {
  className?: string;
};

/** Quick prompts above host analytics chat — fills composer via hostOpsAgent. */
export function HostAnalyticsPromptChips({ className }: HostAnalyticsPromptChipsProps) {
  const { appendMessage, isLoading } = useHostOpsChat();

  return (
    <div
      data-testid="host-analytics-prompt-chips"
      className={cn("space-y-2", className)}
      role="group"
      aria-label="Suggested questions"
    >
      <p className="text-xs font-medium text-muted-foreground">Try asking</p>
      <div className="flex flex-wrap gap-1.5">
        {PROMPTS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            data-testid={chip.testId}
            disabled={isLoading}
            onClick={() => void appendMessage(chip.message)}
            className={cn(
              "rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground",
              "motion-safe:transition-colors motion-reduce:transition-none hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
