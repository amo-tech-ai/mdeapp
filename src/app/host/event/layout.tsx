import { HostEventProviderV1 } from "@/components/host/host-event-provider-v1";
import { HostEventProviderV2 } from "@/components/host/host-event-provider-v2";
import { isCopilotKitV2HostEventEnabled } from "@/lib/copilotkit-v2-host-event-flag";

/**
 * SAN-889 · CK-V2-003 — per-route CopilotKit for /host/event/*.
 * Flag off → v1 provider (prod). Flag on → v2 subpath prototype only on this route.
 */
export default function HostEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isCopilotKitV2HostEventEnabled()) {
    return <HostEventProviderV2>{children}</HostEventProviderV2>;
  }
  return <HostEventProviderV1>{children}</HostEventProviderV1>;
}
