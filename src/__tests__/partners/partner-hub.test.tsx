// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PartnerHub } from "@/components/partners/partner-hub";

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

const HUB_LINKS = [
  "/partners/signup?type=host",
  "/venues",
  "/partners/rentals",
  "/sponsors",
  "/business/ai",
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

  it("links all eight program cards to funnel destinations", () => {
    for (const href of HUB_LINKS) {
      expect(html).toContain(`href="${href}"`);
    }
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
