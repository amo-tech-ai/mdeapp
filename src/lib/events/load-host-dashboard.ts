import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  gatherSalesSummaries,
  computeSalesInsights,
} from "@/lib/events/sales-insights-core";
import { toKpiCards } from "@/lib/events/host-dashboard-kpis";
import {
  EMPTY_HOST_DASHBOARD,
  type HostDashboardState,
} from "@/lib/types/host-dashboard";

/**
 * SAN-729 · AIE-008 — server-side initial dashboard (deterministic only).
 * Loads RLS-scoped sales summaries and builds KPI cards without calling Gemini.
 * Chat still owns plain-language narration via get_sales_insights.
 */
// skipcq: JS-0067 - ES module export; not browser global scope
export async function loadHostDashboardInitial( // skipcq: JS-0067
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<HostDashboardState> {
  try {
    const summaries = await gatherSalesSummaries(supabase, userId);
    const insights = computeSalesInsights(summaries);
    const kpiCards = toKpiCards(insights);
    const hasSales = summaries.some(
      (s) => s.paidOrders > 0 || s.grossRevenueCents > 0,
    );

    if (!hasSales) {
      return { ...EMPTY_HOST_DASHBOARD };
    }

    return {
      ...EMPTY_HOST_DASHBOARD,
      salesSummaries: summaries,
      insights,
      kpiCards,
      recommendations: insights.recommendedActions,
      workflowStatus: "ready",
      lastUpdatedIso: new Date().toISOString(),
    };
  } catch {
    return { ...EMPTY_HOST_DASHBOARD, workflowStatus: "error" };
  }
}
