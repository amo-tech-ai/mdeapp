import { redirect } from "next/navigation";
import { HostDashboardOsShell } from "@/components/host/host-dashboard-os-shell";
import { loadHostDashboardInitial } from "@/lib/events/load-host-dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard · mdeai",
};

// skipcq: JS-0067 - Next.js App Router page export; not browser global scope
export default async function HostDashboardPage() { // skipcq: JS-0067
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/dashboard");

  const initialDashboard = await loadHostDashboardInitial(supabase, user.id);

  return (
    <HostDashboardOsShell userEmail={user.email} initialDashboard={initialDashboard} />
  );
}
