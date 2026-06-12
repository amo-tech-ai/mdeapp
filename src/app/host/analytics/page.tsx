import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HostAnalyticsShell } from "@/components/host/host-analytics-shell";

export const metadata = {
  title: "Sales insights · mdeai",
};

/**
 * SAN-729 · AIE-008 — Host Analytics Page.
 * Auth gate only — NO sales fetch here. The dashboard renders from
 * HostDashboardState, filled by hostOpsAgent via get_sales_insights. `/host` is a
 * protected middleware prefix; this guards the bypass path.
 */
export default async function HostAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/analytics");

  return <HostAnalyticsShell userEmail={user.email} />;
}
