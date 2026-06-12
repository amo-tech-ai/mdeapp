// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostRecommendationsPanel } from "@/components/host/host-recommendations-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { EMPTY_HOST_DASHBOARD, type HostDashboardState } from "@/lib/types/host-dashboard";

function state(over: Partial<HostDashboardState> = {}): HostDashboardState {
  return { ...EMPTY_HOST_DASHBOARD, ...over };
}

describe("HostKpiPanel — renders from HostDashboardState (every status)", () => {
  it("loading → skeletons with aria-busy (a11y)", () => {
    const html = renderToStaticMarkup(<HostKpiPanel state={state({ workflowStatus: "loading" })} />);
    expect(html).toContain('data-testid="host-kpi-skeletons"');
    expect(html).toContain('aria-busy="true"');
  });

  it("error → error empty-state", () => {
    const html = renderToStaticMarkup(<HostKpiPanel state={state({ workflowStatus: "error" })} />);
    expect(html).toContain('data-testid="host-kpi-error"');
  });

  it("idle with no cards → 'ask about your sales' prompt", () => {
    const html = renderToStaticMarkup(<HostKpiPanel state={state()} />);
    expect(html).toContain('data-testid="host-kpi-empty"');
  });

  it("ready with cards → KPI grid (numbers from state, not LLM)", () => {
    const html = renderToStaticMarkup(
      <HostKpiPanel
        state={state({
          workflowStatus: "ready",
          kpiCards: [
            { id: "revenue", label: "Total revenue", value: "COP 5,000", intent: "good" },
            { id: "tickets", label: "Tickets sold", value: "80", intent: "neutral" },
          ],
        })}
      />,
    );
    expect(html).toContain('data-testid="host-kpi-grid"');
    expect(html).toContain('data-testid="host-kpi-card-revenue"');
    expect(html).toContain("COP 5,000");
    expect(html).not.toContain('data-testid="host-kpi-empty"');
  });
});

describe("HostRecommendationsPanel", () => {
  it("renders severity-ranked items when present", () => {
    const html = renderToStaticMarkup(
      <HostRecommendationsPanel
        state={state({
          recommendations: [
            { eventId: "e1", eventName: "A", severity: "urgent", action: "Fix pricing." },
            { eventId: "e2", eventName: "B", severity: "watch", action: "Promote it." },
          ],
        })}
      />,
    );
    expect(html).toContain('data-testid="host-recommendations"');
    expect((html.match(/host-recommendation-item/g) ?? []).length).toBe(2);
    expect(html).toContain("Fix pricing.");
    expect(html).toContain("Act now"); // urgent label
  });

  it("renders nothing when empty", () => {
    expect(renderToStaticMarkup(<HostRecommendationsPanel state={state()} />)).toBe("");
  });
});

describe("HostNarrativeBanner", () => {
  it("shows the narration when present", () => {
    const html = renderToStaticMarkup(
      <HostNarrativeBanner state={state({ lastNarrative: "Two events sold well." })} />,
    );
    expect(html).toContain('data-testid="host-narrative-banner"');
    expect(html).toContain("Two events sold well.");
  });

  it("renders nothing without a narrative", () => {
    expect(renderToStaticMarkup(<HostNarrativeBanner state={state()} />)).toBe("");
  });
});
