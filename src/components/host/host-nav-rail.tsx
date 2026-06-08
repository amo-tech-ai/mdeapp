"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem =
  | { href: string; label: string; testId: string; disabled?: false }
  | { href: string; label: string; testId: string; disabled: true };

const NAV_ITEMS: NavItem[] = [
  { href: "/host/events", label: "Events", testId: "host-nav-link-events" },
  { href: "/host/event/new", label: "New event", testId: "host-nav-link-new-event" },
  { href: "/host/analytics", label: "Analytics", testId: "host-nav-analytics-soon", disabled: true },
];

const linkClassName = (active: boolean) =>
  cn(
    "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
  );

/** Returns true when `href` matches the current host route (pathname-aware active state). */
export function isHostNavActive(pathname: string, href: string): boolean {
  if (href === "/host/events") {
    return pathname === "/host/events" || pathname.startsWith("/host/events/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Host sidebar — Events + New event; Analytics deferred until PAGE-M02 ships. */
export function HostNavRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Host navigation"
      data-testid="host-nav-rail"
      className="w-full shrink-0 border-b border-border bg-muted/20 px-3 py-3 md:w-44 md:border-b-0 md:border-r md:py-4"
    >
      <p className="mb-2 hidden px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:mb-3 md:block">
        Host
      </p>
      <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0 md:space-y-1 md:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = !item.disabled && isHostNavActive(pathname, item.href);
          return (
            <li key={item.label} className="shrink-0 md:shrink">
              {item.disabled ? (
                <span
                  data-testid={item.testId}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground/60"
                  aria-disabled="true"
                  aria-label={`${item.label} (Coming soon)`}
                >
                  {item.label} (Coming soon)
                </span>
              ) : (
                <Link
                  href={item.href}
                  data-testid={item.testId}
                  className={linkClassName(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
