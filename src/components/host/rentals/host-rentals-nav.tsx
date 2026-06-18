"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BROKER_OVERVIEW_PATH } from "@/lib/rentals/broker-route-gate";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/host/rentals",
    label: "Concierge",
    testId: "host-rentals-nav-concierge",
    match: "concierge" as const,
  },
  {
    href: "/host/rentals/listings",
    label: "Listings",
    testId: "host-rentals-nav-listings",
    match: "listings" as const,
  },
  {
    href: BROKER_OVERVIEW_PATH,
    label: "Overview",
    testId: "host-rentals-nav-overview",
    match: "overview" as const,
  },
] as const;

export function HostRentalsNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOverview = pathname === "/host/rentals" && searchParams.get("mode") === "overview";

  function isActive(match: (typeof NAV_ITEMS)[number]["match"]): boolean {
    if (match === "overview") return isOverview;
    if (match === "concierge") return pathname === "/host/rentals" && !isOverview;
    return pathname.startsWith("/host/rentals/listings");
  }

  return (
    <nav
      data-testid="host-rentals-nav"
      className="flex flex-wrap items-center gap-2 border-b border-border pb-3"
      aria-label="Rentals host navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.match);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-testid={item.testId}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
