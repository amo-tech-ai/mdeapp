import { HostEventProvider } from "@/components/host/host-event-provider";

export default function HostEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HostEventProvider>{children}</HostEventProvider>;
}
