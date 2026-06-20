/**
 * SAN-1209 · HOST-OS-001 — Host OS nav model + route helpers.
 *
 * Pure (no React) so the active-route logic and route labels are unit-testable
 * without a DOM. The shell renders these once; pages never render nav again.
 *
 * Phase-0 scope: Overview · Events · Analytics are live. Venues · Tickets ·
 * Inbox · Settings are reserved placeholders (disabled) — NOT pages this phase.
 */

export type HostOsNavItem = {
  href: string;
  label: string;
  testId: string;
  disabled?: boolean;
};

/** Live host OS destinations (Phase 0). Overview is the dashboard route. */
export const HOST_OS_NAV_ITEMS: HostOsNavItem[] = [
  { href: "/host/dashboard", label: "Overview", testId: "host-os-nav-overview" },
  { href: "/host/events", label: "Events", testId: "host-os-nav-events" },
  { href: "/host/analytics", label: "Analytics", testId: "host-os-nav-analytics" },
];

/** Reserved future destinations — shown disabled, never linked this phase. */
export const HOST_OS_NAV_PLACEHOLDERS: HostOsNavItem[] = [
  { href: "/host/venues", label: "Venues", testId: "host-os-nav-venues", disabled: true },
  { href: "/host/tickets", label: "Tickets", testId: "host-os-nav-tickets", disabled: true },
  { href: "/host/inbox", label: "Inbox", testId: "host-os-nav-inbox", disabled: true },
  { href: "/host/settings", label: "Settings", testId: "host-os-nav-settings", disabled: true },
];

/** True when `href` is the active host OS destination for `pathname`. */
// skipcq: JS-0067 - ES module export; not browser global scope
export function isHostOsNavActive(pathname: string, href: string): boolean {
  if (href === "/host/events") {
    // Events list owns its nested detail routes, but NOT the /host/event wizard.
    return pathname === "/host/events" || pathname.startsWith("/host/events/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * True when `pathname` should render inside the unified Host OS shell.
 *
 * Only explicitly listed workspace routes get the shell. All other `/host/*`
 * paths (venues, settings, rentals, public marketing landing, the event wizard)
 * stay passthrough — they own their own chrome/provider.
 *
 * Phase-0 shell routes:
 *  - `/host/dashboard`  → Overview workspace
 *  - `/host/events`     → Events list + detail
 *  - `/host/analytics`  → Analytics dashboard
 */
// skipcq: JS-0067, JS-R1005 - ES module export; flat route guards read clearer than a table
export function isHostOsShellRoute(pathname: string): boolean {
  return (
    pathname === "/host/dashboard" || pathname.startsWith("/host/dashboard/") ||
    pathname === "/host/events" || pathname.startsWith("/host/events/") ||
    pathname === "/host/analytics" || pathname.startsWith("/host/analytics/")
  );
}

/**
 * Human label for the route-aware context strip in the shell header. Lets the
 * host always see which workspace they're in even as content swaps underneath.
 */
// skipcq: JS-0067, JS-R1005 - ES module export; sequential label matchers kept together
export function deriveHostOsRouteLabel(pathname: string): string {
  if (pathname === "/host/dashboard" || pathname.startsWith("/host/dashboard/")) {
    return "Overview";
  }
  if (pathname.startsWith("/host/events")) return "Events";
  if (pathname.startsWith("/host/event")) return "Create event";
  if (pathname.startsWith("/host/analytics")) return "Analytics";
  return "Host";
}
