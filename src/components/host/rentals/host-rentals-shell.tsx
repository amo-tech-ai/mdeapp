import type { ReactNode } from "react";
import { HostNavRail } from "@/components/host/host-nav-rail";

/** RE-WIRE-001 — host chrome with centralized HostNavRail (includes Rentals section). */
export function HostRentalsShell({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="host-rentals-layout"
      className="flex min-h-screen flex-col bg-background md:flex-row"
    >
      <HostNavRail />
      <div className="min-w-0 flex-1 px-4 py-6 md:px-6">{children}</div>
    </div>
  );
}
