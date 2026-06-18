"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PHASE_A_STARTERS } from "@/components/host/rentals/rentals-concierge-constants";
import type { RentalsWorkspaceMode } from "@/components/host/rentals/rentals-dynamic-workspace";

type RentalsConciergeCenterProps = {
  mode: RentalsWorkspaceMode;
};

/** Center column — empty state + disabled composer (rc-center). No CopilotChat until SAN-1124. */
export function RentalsConciergeCenter({ mode }: RentalsConciergeCenterProps) {
  return (
    <section
      data-testid="rc-center"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      aria-label="Broker concierge chat"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-1 py-2">
        <Badge variant="outline" className="text-xs font-normal">
          AI-ready — brokerAgent not live
        </Badge>
        {mode === "overview" ? (
          <span className="text-xs text-muted-foreground">Overview mode — same shell</span>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1 py-6">
        <div data-testid="rc-empty" className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Sparkles className="size-7 text-accent" aria-hidden />
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Your rentals, run by AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Ask in plain language. Draft listings, reply to leads, schedule viewings, and generate
            marketing — you approve anything that publishes or sends.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {PHASE_A_STARTERS.map((starter, index) => (
              <button
                key={starter.id}
                type="button"
                disabled
                data-testid={`rc-starter-${index}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
              >
                {starter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border px-1 pb-2 pt-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {["Show vacant units", "Reply to this lead", "Publish the Laureles 2BR"].map((s, i) => (
            <button
              key={s}
              type="button"
              disabled
              data-testid={`rc-sugg-${i}`}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <Textarea
            rows={1}
            disabled
            readOnly
            placeholder="Ask your rentals concierge… (SAN-1124)"
            aria-label="Message the rentals concierge"
            data-testid="rc-input"
            className="min-h-10 resize-none"
          />
          <Button
            type="button"
            size="icon"
            disabled
            aria-label="Send"
            data-testid="rc-send"
            className="shrink-0"
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Phase A shell — composer disabled until broker CopilotKit bridge ships.
        </p>
      </div>
    </section>
  );
}
