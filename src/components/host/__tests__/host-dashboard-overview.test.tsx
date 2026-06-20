// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HostDashboardOverview } from "@/components/host/host-dashboard-overview";
import { EMPTY_HOST_DASHBOARD, type HostDashboardState } from "@/lib/types/host-dashboard";

function state(over: Partial<HostDashboardState> = {}): HostDashboardState {
  return { ...EMPTY_HOST_DASHBOARD, ...over };
}

describe("HostDashboardOverview — figure-free briefing", () => {
  it("idle → shows the ✦ briefing-pending placeholder (no fake number)", () => {
    const html = renderToStaticMarkup(<HostDashboardOverview state={state()} />);
    expect(html).toContain('data-testid="dashboard-briefing-pending"');
    expect(html).not.toContain('data-testid="host-narrative-banner"');
  });

  it("with a narrative → renders the narration banner, not the placeholder", () => {
    const html = renderToStaticMarkup(
      <HostDashboardOverview state={state({ lastNarrative: "Two events sold well." })} />,
    );
    expect(html).toContain('data-testid="host-narrative-banner"');
    expect(html).toContain("Two events sold well.");
    expect(html).not.toContain('data-testid="dashboard-briefing-pending"');
  });
});

describe("HostDashboardOverview — KPI snapshot (numbers from state, not LLM)", () => {
  it("idle with no cards → KPI empty prompt", () => {
    const html = renderToStaticMarkup(<HostDashboardOverview state={state()} />);
    expect(html).toContain('data-testid="host-kpi-empty"');
  });

  it("ready with cards → KPI grid showing the state value verbatim", () => {
    const html = renderToStaticMarkup(
      <HostDashboardOverview
        state={state({
          workflowStatus: "ready",
          kpiCards: [
            { id: "revenue", label: "Total revenue", value: "COP 5,000", intent: "good" },
          ],
        })}
      />,
    );
    expect(html).toContain('data-testid="host-kpi-grid"');
    expect(html).toContain("COP 5,000");
  });
});

describe("HostDashboardOverview — needs attention triage", () => {
  it("no recommendations → all-clear card", () => {
    const html = renderToStaticMarkup(<HostDashboardOverview state={state()} />);
    expect(html).toContain('data-testid="dashboard-allclear"');
  });

  it("with recommendations → ranked panel, not the all-clear card", () => {
    const html = renderToStaticMarkup(
      <HostDashboardOverview
        state={state({
          recommendations: [
            {
              eventId: "00000000-0000-4000-8000-000000000001",
              eventName: "Salsa Night",
              severity: "urgent",
              action: "Fix pricing.",
            },
          ],
        })}
      />,
    );
    expect(html).toContain('data-testid="host-recommendations"');
    expect(html).not.toContain('data-testid="dashboard-allclear"');
  });
});

describe("HostDashboardOverview — quick links + honest placeholders", () => {
  it("always renders the three deep-link quick links out to owning workspaces", () => {
    const html = renderToStaticMarkup(<HostDashboardOverview state={state()} />);
    expect(html).toContain('data-testid="dashboard-quick-links"');
    expect(html).toContain('data-testid="dashboard-open-analytics"');
    expect(html).toContain('data-testid="dashboard-open-events"');
    expect(html).toContain('data-testid="dashboard-open-new-event"');
    expect(html).toContain('href="/host/analytics"');
  });

  it("renders data-pending tiles for not-yet-wired sections (never fake numbers)", () => {
    const html = renderToStaticMarkup(<HostDashboardOverview state={state()} />);
    expect(html).toContain('data-testid="dashboard-portfolio-pending"');
    expect(html).toContain('data-testid="dashboard-health-pending"');
  });
});
