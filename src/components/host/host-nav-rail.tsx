"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/host/events", label: "Events", disabled: true },
  { href: "/host/event/new", label: "New event", active: true },
  { href: "/host/analytics", label: "Analytics", disabled: true },
] as const;

/** Host sidebar — events list deferred until `/host/events` ships. */
export function HostNavRail() {
  return (
    <nav
      aria-label="Host navigation"
      className="hidden w-44 shrink-0 border-r border-border bg-muted/20 px-3 py-4 md:block"
    >
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Host
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            {"disabled" in item && item.disabled ? (
              <span
                className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground/60"
                aria-disabled
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                  "active" in item && item.active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}
                aria-current={"active" in item && item.active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
