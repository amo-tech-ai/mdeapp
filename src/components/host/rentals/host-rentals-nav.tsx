"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/host/rentals", label: "Concierge", testId: "host-rentals-nav-concierge" },
  {
    href: "/host/rentals/listings",
    label: "Listings",
    testId: "host-rentals-nav-listings",
  },
  {
    href: "/host/rentals/dashboard",
    label: "Dashboard",
    testId: "host-rentals-nav-dashboard",
  },
] as const;

export function HostRentalsNav() {
  const pathname = usePathname();

  return (
    <nav
      data-testid="host-rentals-nav"
      className="flex flex-wrap items-center gap-2 border-b border-border pb-3"
      aria-label="Rentals host navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/host/rentals"
            ? pathname === "/host/rentals"
            : pathname.startsWith(item.href);
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
