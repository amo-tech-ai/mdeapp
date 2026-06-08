import { describe, expect, it } from "vitest";

/**
 * Mirrors PROTECTED_PREFIXES logic in middleware.ts — /host landing must stay public.
 */
function isProtectedPath(pathname: string) {
  const PROTECTED_EXACT = ["/me/tickets"];
  const PROTECTED_PREFIXES = [
    "/host/events",
    "/host/event",
    "/trips",
    "/saved",
  ];

  if (PROTECTED_EXACT.includes(pathname)) {
    return true;
  }
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

describe("host route auth gate", () => {
  it("allows public /host marketing landing", () => {
    expect(isProtectedPath("/host")).toBe(false);
  });

  it("still protects host wizard and events list", () => {
    expect(isProtectedPath("/host/event/new")).toBe(true);
    expect(isProtectedPath("/host/events")).toBe(true);
  });
});
