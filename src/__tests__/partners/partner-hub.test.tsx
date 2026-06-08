// @vitest-environment jsdom
/**
 * SAN-692 — MKT Partner hub marketing page (/partners).
 * Renders the PartnerHub marketing body and asserts: hero headline, the five
 * partner-type cards link to their (verified) destinations, signup CTAs point
 * at the live wizard, P2/P3 teasers are present, marquee is reduced-motion
 * safe, layout is responsive, and no hardcoded gray shades are used.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

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

const html = renderToStaticMarkup(<PartnerHub />);

const FORBIDDEN_COLORS =
  /\b(?:bg|text|border|from|to|via)-(?:gray|zinc|slate|neutral|stone)-\d{2,3}\b/;

describe("PartnerHub (/partners)", () => {
  it("renders the hero headline", () => {
    expect(html).toContain("Grow your business");
  });

  it("links the five partner-type cards to verified destinations (no dead links)", () => {
    expect(html).toContain('href="/host/event/new"'); // Host (live)
    expect(html).toContain('href="/restaurants"'); // Venue (live)
    expect(html).toContain('href="/partners/rentals"'); // Broker (placeholder)
    expect(html).toContain('href="/sponsors"'); // Sponsor (placeholder)
    expect(html).toContain('href="/business/ai"'); // Agency (placeholder)
  });

  it("routes the primary CTA to the signup wizard (does not duplicate SAN-723)", () => {
    expect(html).toContain('href="/partners/signup"');
  });

  it("includes P2/P3 teaser cards flagged 'Coming soon'", () => {
    expect(html).toContain("Coming soon");
    expect(html).toContain('href="/partners/signup?type=creator"');
    expect(html).toContain('href="/partners/signup?type=vendor"');
  });

  it("has no empty href attributes", () => {
    expect(html).not.toContain('href=""');
  });

  it("guards the marquee for prefers-reduced-motion", () => {
    expect(html).toContain("animate-marquee");
    expect(html).toContain("motion-reduce:animate-none");
  });

  it("is responsive (uses sm:/md: breakpoint utilities)", () => {
    expect(html).toContain("sm:");
    expect(html).toContain("md:");
  });

  it("uses semantic tokens, not hardcoded gray shades", () => {
    expect(FORBIDDEN_COLORS.test(html)).toBe(false);
  });
});
