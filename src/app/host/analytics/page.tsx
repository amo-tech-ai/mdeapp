import { redirect } from "next/navigation";
import { HostAnalyticsShell } from "@/components/host/host-analytics-shell";
import { HostAnalyticsShellV2 } from "@/components/host/host-analytics-shell-v2";
import { isCopilotKitV2AnalyticsEnabled } from "@/lib/copilotkit-v2-analytics-flag";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sales insights · mdeai",
};

/**
 * SAN-729 · AIE-008 — Host Analytics Page.
 * SAN-888 · CK-V2-002 — shell v1/v2 gated by COPILOTKIT_V2_ANALYTICS.
 */
export default async function HostAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/host/analytics");

  const v2 = isCopilotKitV2AnalyticsEnabled();
  if (v2) {
    return <HostAnalyticsShellV2 userEmail={user.email} />;
  }
  return <HostAnalyticsShell userEmail={user.email} />;
}
