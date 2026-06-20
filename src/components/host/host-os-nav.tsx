"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HOST_OS_NAV_ITEMS,
  HOST_OS_NAV_PLACEHOLDERS,
  isHostOsNavActive,
  type HostOsNavItem,
} from "@/lib/host/host-os-nav";
import { cn } from "@/lib/utils";

/**
 * SAN-1209 · HOST-OS-001 — the single host nav, rendered once by HostOsShell.
 *
 * Replaces the per-page HostNavRail duplication across dashboard / events /
 * analytics. Workflow-ordered (Overview → Events → Analytics) with reserved
 * placeholders for the post-phase destinations.
 */

const linkClassName = (active: boolean) =>
  cn(
    "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
  );

function NavLink({ item, pathname }: { item: HostOsNavItem; pathname: string }) {
  if (item.disabled) {
    return (
      <span
        data-testid={item.testId}
        className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground/60"
        aria-disabled="true"
        aria-label={`${item.label} (Coming soon)`}
      >
        {item.label} (Coming soon)
      </span>
    );
  }
  const active = isHostOsNavActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      data-testid={item.testId}
      className={linkClassName(active)}
      aria-current={active ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}

export function HostOsNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Host navigation"
      data-testid="host-os-nav"
      className="w-full shrink-0 border-b border-border bg-muted/20 px-3 py-3 md:w-48 md:border-b-0 md:border-r md:py-4"
    >
      <p className="mb-2 hidden px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:mb-3 md:block">
        Host OS
      </p>
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:space-y-1 md:overflow-visible">
        {HOST_OS_NAV_ITEMS.map((item) => (
          <li key={item.label} className="shrink-0 md:shrink">
            <NavLink item={item} pathname={pathname} />
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden border-t border-border pt-4 md:mt-6 md:block">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:mb-3">
          Soon
        </p>
        <ul className="space-y-1">
          {HOST_OS_NAV_PLACEHOLDERS.map((item) => (
            <li key={item.label}>
              <NavLink item={item} pathname={pathname} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
