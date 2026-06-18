"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DATA_PENDING_LABEL } from "@/lib/rentals/data-pending";

export type RentalsWorkspaceMode = "concierge" | "overview";

type RentalsDynamicWorkspaceProps = {
  mode: RentalsWorkspaceMode;
};

/** Right column — dynamic workspace (rc-right). Phase A: empty + overview KPI stubs. */
export function RentalsDynamicWorkspace({ mode }: RentalsDynamicWorkspaceProps) {
  if (mode === "overview") {
    return (
      <aside
        data-testid="rc-right"
        className="flex min-h-0 flex-col gap-3 overflow-y-auto border-border lg:border-l lg:pl-4"
        aria-label="Broker overview workspace"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent" aria-hidden />
          <h2 className="font-serif text-base font-semibold">Overview</h2>
          <Badge variant="secondary" className="ml-auto text-xs">
            Phase B
          </Badge>
        </div>
        <div data-testid="ctx-analytics" className="space-y-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            KPI blocks wire from{" "}
            <span className="font-medium text-foreground">fetchBrokerDashboard</span> after this
            shell lands — no invented counts in Phase A.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["r1-kpi-0", "r1-kpi-1", "r1-kpi-2", "r1-kpi-3"].map((testId) => (
              <div
                key={testId}
                data-testid={testId}
                className="rounded-md border border-border bg-background p-3"
              >
                <div className="text-xs text-muted-foreground">Metric</div>
                <div className="font-mono text-lg font-semibold">{DATA_PENDING_LABEL}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      data-testid="rc-right"
      className="flex min-h-0 flex-col overflow-y-auto border-border lg:border-l lg:pl-4"
      aria-label="Broker context workspace"
    >
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Sparkles className="size-4 text-accent" aria-hidden />
        <h2 className="font-serif text-base font-semibold">Workspace</h2>
      </div>
      <div
        data-testid="ctx-empty"
        className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-12 text-center"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Sparkles className="size-5 text-muted-foreground" aria-hidden />
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">
          Ask the concierge and listing, lead, viewing, or map context appears here. Chat ships with{" "}
          <span className="font-medium text-foreground">brokerAgent</span> in Phase C.
        </p>
      </div>
    </aside>
  );
}
