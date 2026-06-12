import { HostEventShell } from "@/components/host/host-event-shell";
import { HostEventShellV2 } from "@/components/host/host-event-shell-v2";
import { isCopilotKitV2HostEventEnabled } from "@/lib/copilotkit-v2-host-event-flag";
import { getServerUser } from "@/lib/auth/session";

export const metadata = {
  title: "Create event · mdeai",
};

/**
 * SCREEN-016 — Roberto host wizard.
 * SAN-889 · CK-V2-003 — shell v1/v2 gated by COPILOTKIT_V2_HOST_EVENT.
 */
export default async function HostEventNewPage() {
  const { user } = await getServerUser();

  if (isCopilotKitV2HostEventEnabled()) {
    return <HostEventShellV2 userEmail={user?.email} />;
  }
  return <HostEventShell userEmail={user?.email} />;
}
