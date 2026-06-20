"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HostOsShell } from "@/components/host/host-os-shell";
import { isHostOsShellRoute } from "@/lib/host/host-os-nav";

/**
 * SAN-1209 · HOST-OS-001 — Host OS layout.
 *
 * Wraps the host workspace routes (Overview · Events · Analytics) in the single
 * unified shell so the nav, the persistent hostOpsAgent chat and the shared
 * context survive client-side navigation between them. The marketing landing
 * (`/host`), the event wizard (`/host/event*`) and the real-estate broker area
 * (`/host/rentals*`) stay passthrough — they own their own chrome/provider.
 *
 * A client layout (usePathname) is required because Next.js cannot scope a
 * layout to a subset of sibling segments without route groups, and we must keep
 * the wizard's separate provider intact rather than restructure those folders.
 */
export default function HostLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isHostOsShellRoute(pathname)) {
    return <HostOsShell>{children}</HostOsShell>;
  }

  return <>{children}</>;
}
