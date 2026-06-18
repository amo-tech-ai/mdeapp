import { HostRecommendationsPanel } from "@/components/host/host-recommendations-panel";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * Right column for /host/analytics — recommendations when present, else onboarding copy.
 */
// skipcq: JS-0067 - ES module export; not browser global scope
export function HostAnalyticsAside({ state }: { state: HostDashboardState }) {
  if (state.recommendations.length > 0) {
    return <HostRecommendationsPanel state={state} />;
  }

  return (
    <div data-testid="host-analytics-aside-empty" className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Sales assistant</h2>
      <p className="text-sm text-muted-foreground">
        Ask about revenue, ticket sales, or which event needs attention. Numbers in the
        cards come from your database — the chat adds a plain-language summary.
      </p>
      <ul className="space-y-2 text-xs text-muted-foreground">
        <li>· Click a prompt chip or type in the chat below</li>
        <li>· Recommended actions appear here when the agent finds them</li>
      </ul>
    </div>
  );
}
