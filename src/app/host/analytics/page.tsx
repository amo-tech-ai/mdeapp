import { redirect } from "next/navigation";
import { HostAnalyticsShell } from "@/components/host/host-analytics-shell";
import { loadHostDashboardInitial } from "@/lib/events/load-host-dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sales insights · mdeai",
};

// skipcq: JS-0067 - Next.js App Router page export; not browser global scope
export default async function HostAnalyticsPage() { // skipcq: JS-0067
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/analytics");

  const initialDashboard = await loadHostDashboardInitial(supabase, user.id);

  return <HostAnalyticsShell initialDashboard={initialDashboard} />;
}
