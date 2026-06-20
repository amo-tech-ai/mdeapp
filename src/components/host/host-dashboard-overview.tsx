import Link from "next/link";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { HostRecommendationsPanel } from "@/components/host/host-recommendations-panel";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-1194 · HOST-DASH-001 — Host Dashboard OS · overview body.
 *
 * Roberto's "is my business healthy today?" 5-second read: a figure-free AI
 * daily briefing, a KPI snapshot, needs-attention triage, and quick links out
 * to the workspaces that own each action.
 *
 * GUARDRAIL (inherited from SAN-759 · AIE-007 — salesInsightWorkflow /
 * SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState): every number lives in
 * a data card produced by the deterministic loader / get_sales_insights result.
 * The briefing narrates trends in prose and NEVER re-types a figure. This
 * component is pure and presentational — no CopilotKit context — so it renders
 * cleanly in unit tests and never recomputes a number.
 */

export const DASHBOARD_QUICK_LINKS: ReadonlyArray<{
  href: string;
  label: string;
  testId: string;
}> = [
  { href: "/host/analytics", label: "Open Analytics", testId: "dashboard-open-analytics" },
  { href: "/host/events", label: "View events", testId: "dashboard-open-events" },
  { href: "/host/event/new", label: "Create event", testId: "dashboard-open-new-event" },
];

/** Honest "not wired yet" tile — dashed, muted, never a fake number. */
// skipcq: JS-0067 - module-local helper; not browser global scope
function DataPendingCard({ // skipcq: JS-0067
  testId,
  title,
  description,
}: {
  testId: string;
  title: string;
  description: string;
}) {
  return (
    <div
      data-testid={testId}
      className="rounded-lg border border-dashed border-border bg-muted/20 p-4"
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

// skipcq: JS-0067 - module-local helper; not browser global scope
function SectionHeading({ children }: { children: React.ReactNode }) { // skipcq: JS-0067
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostDashboardOverview({ state }: { state: HostDashboardState }) { // skipcq: JS-0067
  return (
    <div className="space-y-5 overflow-y-auto p-4">
      {/* 1. Daily briefing — figure-free prose */}
      <div className="space-y-2">
        <SectionHeading>Daily briefing</SectionHeading>
        {state.lastNarrative ? (
          <HostNarrativeBanner state={state} />
        ) : (
          <div
            data-testid="dashboard-briefing-pending"
            className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
          >
            <p className="text-sm text-foreground">
              <span aria-hidden="true" className="mr-1 font-bold text-accent-foreground">
                ✦
              </span>
              Your daily read appears here once the concierge reviews your
              portfolio. Ask &ldquo;what needs my attention today?&rdquo; below.
            </p>
          </div>
        )}
      </div>

      {/* 2. KPI snapshot — real numbers or built-in empty/loading/error */}
      <div className="space-y-2">
        <SectionHeading>Today at a glance</SectionHeading>
        <HostKpiPanel state={state} />
      </div>

      {/* 3. Needs attention — deterministic recommendations */}
      <div className="space-y-2">
        <SectionHeading>Needs attention</SectionHeading>
        {state.recommendations.length > 0 ? (
          <HostRecommendationsPanel state={state} />
        ) : (
          <div
            data-testid="dashboard-allclear"
            className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground"
          >
            Nothing needs you right now — you&rsquo;re all caught up.
          </div>
        )}
      </div>

      {/* 4. Quick links — deep-link out to the workspace that owns the write */}
      <div className="space-y-2">
        <SectionHeading>Jump to</SectionHeading>
        <div data-testid="dashboard-quick-links" className="flex flex-wrap gap-2">
          {DASHBOARD_QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={link.testId}
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 5 + 6. Not yet wired — honest placeholders, never fake numbers */}
      <div className="space-y-2">
        <SectionHeading>Coming soon</SectionHeading>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DataPendingCard
            testId="dashboard-portfolio-pending"
            title="Portfolio snapshot"
            description="Per-event revenue, capacity and conversion will appear here once event-level rollups are wired in."
          />
          <DataPendingCard
            testId="dashboard-health-pending"
            title="Business health"
            description="Sales, attendance, marketing and operations status cards are on the way."
          />
        </div>
      </div>
    </div>
  );
}
