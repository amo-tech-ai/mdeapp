import { HostAnalyticsProviderV1 } from "@/components/host/host-analytics-provider-v1";
import { HostAnalyticsProviderV2 } from "@/components/host/host-analytics-provider-v2";
import { isCopilotKitV2AnalyticsEnabled } from "@/lib/copilotkit-v2-analytics-flag";

/**
 * SAN-729 · AIE-008 + SAN-888 · CK-V2-002 — per-route CopilotKit for /host/analytics.
 * Flag off → v1 provider (prod). Flag on → v2 subpath prototype only on this route.
 */
export default function HostAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isCopilotKitV2AnalyticsEnabled()) {
    return <HostAnalyticsProviderV2>{children}</HostAnalyticsProviderV2>;
  }
  return <HostAnalyticsProviderV1>{children}</HostAnalyticsProviderV1>;
}
