import { describe, expect, it } from "vitest";
import {
  HOST_OS_NAV_ITEMS,
  HOST_OS_NAV_PLACEHOLDERS,
  deriveHostOsRouteLabel,
  isHostOsNavActive,
  isHostOsShellRoute,
} from "@/lib/host/host-os-nav";

describe("HOST_OS_NAV_ITEMS", () => {
  it("ships exactly Overview, Events, Analytics as live destinations", () => {
    expect(HOST_OS_NAV_ITEMS.map((i) => i.label)).toEqual([
      "Overview",
      "Events",
      "Analytics",
    ]);
  });

  it("points Overview at the dashboard route", () => {
    const overview = HOST_OS_NAV_ITEMS.find((i) => i.label === "Overview");
    expect(overview?.href).toBe("/host/dashboard");
  });

  it("keeps every live item enabled (no disabled flag)", () => {
    expect(HOST_OS_NAV_ITEMS.every((i) => !i.disabled)).toBe(true);
  });
});

describe("HOST_OS_NAV_PLACEHOLDERS", () => {
  it("reserves Venues, Tickets, Inbox, Settings as disabled — never pages this phase", () => {
    expect(HOST_OS_NAV_PLACEHOLDERS.map((i) => i.label)).toEqual([
      "Venues",
      "Tickets",
      "Inbox",
      "Settings",
    ]);
    expect(HOST_OS_NAV_PLACEHOLDERS.every((i) => i.disabled)).toBe(true);
  });
});

describe("isHostOsNavActive", () => {
  it("marks Overview active on the dashboard route and nested paths", () => {
    expect(isHostOsNavActive("/host/dashboard", "/host/dashboard")).toBe(true);
    expect(isHostOsNavActive("/host/dashboard/x", "/host/dashboard")).toBe(true);
  });

  it("marks Events active on the list and nested detail routes", () => {
    expect(isHostOsNavActive("/host/events", "/host/events")).toBe(true);
    expect(isHostOsNavActive("/host/events/123", "/host/events")).toBe(true);
  });

  it("does NOT mark Events active on the wizard route", () => {
    expect(isHostOsNavActive("/host/event/new", "/host/events")).toBe(false);
  });

  it("marks Analytics active on the analytics route", () => {
    expect(isHostOsNavActive("/host/analytics", "/host/analytics")).toBe(true);
  });

  it("does not cross-activate Overview on analytics", () => {
    expect(isHostOsNavActive("/host/analytics", "/host/dashboard")).toBe(false);
  });
});

describe("deriveHostOsRouteLabel", () => {
  it.each([
    ["/host/dashboard", "Overview"],
    ["/host/dashboard/anything", "Overview"],
    ["/host/events", "Events"],
    ["/host/events/123", "Events"],
    ["/host/event/new", "Create event"],
    ["/host/analytics", "Analytics"],
    ["/host", "Host"],
  ])("labels %s as %s", (pathname, label) => {
    expect(deriveHostOsRouteLabel(pathname)).toBe(label);
  });
});

describe("isHostOsShellRoute", () => {
  it("wraps the OS workspace routes in the shell", () => {
    expect(isHostOsShellRoute("/host/dashboard")).toBe(true);
    expect(isHostOsShellRoute("/host/events")).toBe(true);
    expect(isHostOsShellRoute("/host/events/123")).toBe(true);
    expect(isHostOsShellRoute("/host/analytics")).toBe(true);
  });

  it("leaves the marketing landing passthrough", () => {
    expect(isHostOsShellRoute("/host")).toBe(false);
  });

  it("leaves the event wizard passthrough (its own provider)", () => {
    expect(isHostOsShellRoute("/host/event")).toBe(false);
    expect(isHostOsShellRoute("/host/event/new")).toBe(false);
  });

  it("leaves the real-estate broker area passthrough (out of scope)", () => {
    expect(isHostOsShellRoute("/host/rentals")).toBe(false);
    expect(isHostOsShellRoute("/host/rentals/listings")).toBe(false);
    expect(isHostOsShellRoute("/host/rentals/onboarding")).toBe(false);
  });

  it("catches future /host/* routes in the OS shell by default", () => {
    expect(isHostOsShellRoute("/host/venues")).toBe(true);
    expect(isHostOsShellRoute("/host/settings")).toBe(true);
  });
});
