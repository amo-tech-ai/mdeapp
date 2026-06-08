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

// Every hub card routes to the LIVE typed signup (no dead landings) — PR #131
// prod validation found /venues, /sponsors, /business/ai, /partners/{rentals,
// restaurants,cafes,nightlife} all 404.
const SIGNUP_TYPES = ["host", "venue", "broker", "sponsor", "agency"] as const;
const DEAD_HUB_ROUTES = [
  "/venues",
  "/sponsors",
  "/business/ai",
  "/partners/rentals",
  "/partners/restaurants",
  "/partners/cafes",
  "/partners/nightlife",
] as const;

// Hub is now slotted into the reusable MarketingPageShell (SAN-692), which
// owns the <main data-testid="partner-hub"> + nav + footer chrome.
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
    expect(html).toContain("Grow your business with mdeai");
  });

  it("routes every program card to the live typed signup", () => {
    for (const type of SIGNUP_TYPES) {
      expect(html).toContain(`href="/partners/signup?type=${type}`);
    }
  });

  it("links no dead/unbuilt landing route", () => {
    for (const route of DEAD_HUB_ROUTES) {
      expect(html).not.toContain(`href="${route}"`);
    }
  });

  it("venue subtype cards carry the category param", () => {
    const hrefOf = (key: string) =>
      PARTNER_HUB_CARDS.find((c) => c.key === key)?.href;
    expect(hrefOf("restaurants")).toBe(
      "/partners/signup?type=venue&category=restaurant",
    );
    expect(hrefOf("cafes")).toBe("/partners/signup?type=venue&category=cafe");
    expect(hrefOf("nightlife")).toBe(
      "/partners/signup?type=venue&category=nightclub",
    );
  });

  it("routes primary CTA to signup landing (not duplicating wizard)", () => {
    expect(html).toContain('href="/partners/signup"');
  });

  it("has no empty href attributes", () => {
    expect(html).not.toContain('href=""');
  });

  it("guards the marquee for prefers-reduced-motion", () => {
    expect(html).toContain("animate-marquee");
    expect(html).toContain("motion-reduce:animate-none");
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
