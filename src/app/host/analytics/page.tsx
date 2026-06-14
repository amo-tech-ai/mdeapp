import { redirect } from "next/navigation";
import { HostAnalyticsShell } from "@/components/host/host-analytics-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sales insights · mdeai",
};

export default async function HostAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/analytics");

  return <HostAnalyticsShell userEmail={user.email} />;
}
