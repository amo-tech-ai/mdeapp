import { HostAnalyticsProvider } from "@/components/host/host-analytics-provider";

export default function HostAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HostAnalyticsProvider>{children}</HostAnalyticsProvider>;
}
