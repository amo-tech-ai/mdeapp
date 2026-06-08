import type { ReactNode } from "react";
import { HostNavRail } from "@/components/host/host-nav-rail";

type HostEventsShellProps = {
  children: ReactNode;
};

/** Shared host list layout — nav rail + main content (SAN-730 / AIE-002). */
export function HostEventsShell({ children }: HostEventsShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <HostNavRail />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
