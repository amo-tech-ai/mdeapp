// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PartnerHub } from "@/components/partners/partner-hub";
import { PARTNER_HUB_CARDS } from "@/lib/partners/partner-hub-config";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// SAN-692 · D-PTR-01 link strategy: venue verticals route to the LIVE /venues
// landing (?v= variant, shipped SAN-661 · D-PTR-02); the rest route to the LIVE
// typed signup wizard until their landings ship. No card points at a 404.
const SIGNUP_TYPES = ["host", "broker", "sponsor", "agency"] as const;

// Routes with no page.tsx on disk (verified 2026-06-11) — the hub must not link
// any of them. /venues is now LIVE, so it is intentionally absent here.
const DEAD_HUB_ROUTES = [
  "/sponsors",
  "/business/ai",
  "/partners/rentals",
  "/partners/restaurants",
  "/partners/cafes",
  "/partners/nightlife",
  "/contact",
] as const;

// Hub is slotted into the reusable MarketingPageShell (SAN-692), which owns the
// <main data-testid="partner-hub"> + nav + footer chrome.
const html = renderToStaticMarkup(
  <MarketingPageShell accent="gold" mainTestId="partner-hub">
    <PartnerHub />
  </MarketingPageShell>,
);

const FORBIDDEN_COLORS =
  /\b(?:bg|text|border|from|to|via)-(?:gray|zinc|slate|neutral|stone)-\d{2,3}\b/;

describe("PartnerHub (/partners)", () => {
  it("renders hub marker and hero", () => {
    expect(html).toContain('data-testid="partner-hub"');
    expect(html).toContain("Grow your business with");
  });

  it("routes non-venue program cards to the live typed signup", () => {
    for (const type of SIGNUP_TYPES) {
      expect(html).toContain(`href="/partners/signup?type=${type}`);
    }
  });

  it("routes the four venue verticals to the live /venues ?v= variants", () => {
    const hrefOf = (key: string) =>
      PARTNER_HUB_CARDS.find((c) => c.key === key)?.href;
    expect(hrefOf("restaurants")).toBe("/venues?v=restaurant");
    expect(hrefOf("cafes")).toBe("/venues?v=cafe");
    expect(hrefOf("nightlife")).toBe("/venues?v=nightclub");
    expect(hrefOf("spaces")).toBe("/venues?v=space");
    expect(html).toContain('href="/venues?v=restaurant"');
  });

  it("links no dead/unbuilt route", () => {
    for (const route of DEAD_HUB_ROUTES) {
      expect(html).not.toContain(`href="${route}"`);
    }
  });

  it("renders the 'AI does the work' differentiator band", () => {
    expect(html).toContain("The AI does the work");
    expect(html).toContain("AI surfaces you");
  });

  it("routes primary CTA to signup landing (not duplicating wizard)", () => {
    expect(html).toContain('href="/partners/signup"');
  });

  it("has no empty href attributes", () => {
    expect(html).not.toContain('href=""');
  });

  it("guards motion for prefers-reduced-motion", () => {
    // Timeline connector + card hover transforms must yield to reduced motion.
    expect(html).toContain("motion-reduce:hidden");
    expect(html).toContain("motion-reduce:transition-none");
  });

  it("is responsive (uses sm: breakpoint utilities)", () => {
    expect(html).toContain("sm:");
  });

  it("uses semantic tokens, not hardcoded gray shades", () => {
    expect(FORBIDDEN_COLORS.test(html)).toBe(false);
  });
});

// PR #131 review (Cubic): the shared footer must link only to routes that
// exist on disk. Replaces the dead /about, /contact, /legal/privacy links.
const footerHtml = renderToStaticMarkup(<MarketingFooter />);

// Routes with a real src/app/**/page.tsx (verified 2026-06-08).
const LIVE_FOOTER_ROUTES = [
  "/",
  "/events",
  "/restaurants",
  "/cafes",
  "/nightlife",
  "/rentals",
  "/saved",
  "/me/tickets",
  "/partners",
  "/partners/signup",
  "/host/event/new",
];

const DEAD_ROUTES = ["/about", "/contact", "/legal/privacy"];

describe("MarketingFooter — live routes only", () => {
  it("links none of the removed dead routes", () => {
    for (const route of DEAD_ROUTES) {
      expect(footerHtml).not.toContain(`href="${route}"`);
    }
  });

  it("every footer href resolves to a known live route", () => {
    const hrefs = [...footerHtml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(LIVE_FOOTER_ROUTES).toContain(href);
    }
  });
});
