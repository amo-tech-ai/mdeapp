// @vitest-environment jsdom
/**
 * Route smoke + contract tests for the partner landing placeholders
 * (SAN-691 /partners/rentals · SAN-664 /sponsors · SAN-663 /business/ai),
 * created to prevent dead links from the SAN-692 partner hub cards.
 *
 * Asserts each page: renders without throwing, has "Coming soon" copy,
 * links to its typed signup AND the partner hub (no empty/dead hrefs),
 * names its Linear task, is responsive (sm: utilities), guards motion
 * behind motion-safe:, and uses no hardcoded gray/zinc/slate shades.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import PartnersRentalsPage from "@/app/partners/rentals/page";
import SponsorsPage from "@/app/sponsors/page";
import BusinessAiPage from "@/app/business/ai/page";

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

type PageCase = {
  name: string;
  Page: () => React.JSX.Element;
  heading: string;
  signupType: "broker" | "sponsor" | "agency";
  linearId: string;
};

const CASES: PageCase[] = [
  {
    name: "/partners/rentals",
    Page: PartnersRentalsPage,
    heading: "For brokers &amp; rental hosts",
    signupType: "broker",
    linearId: "SAN-691",
  },
  {
    name: "/sponsors",
    Page: SponsorsPage,
    heading: "Sponsorship",
    signupType: "sponsor",
    linearId: "SAN-664",
  },
  {
    name: "/business/ai",
    Page: BusinessAiPage,
    heading: "AI services for business",
    signupType: "agency",
    linearId: "SAN-663",
  },
];

const FORBIDDEN_COLORS = /\b(?:bg|text|border|from|to|via)-(?:gray|zinc|slate|neutral|stone)-\d{2,3}\b/;

describe("partner landing placeholders", () => {
  for (const testCase of CASES) {
    describe(testCase.name, () => {
      const html = renderToStaticMarkup(<testCase.Page />);

      it("renders the partner heading and a 'Coming soon' marker", () => {
        expect(html).toContain(testCase.heading);
        expect(html).toContain("Coming soon");
      });

      it("renders the expected signup wizard href", () => {
        expect(html).toContain(
          `href="/partners/signup?type=${testCase.signupType}"`,
        );
      });

      it("renders the expected partner hub href", () => {
        expect(html).toContain('href="/partners"');
      });

      it("has no empty href attributes", () => {
        expect(html).not.toContain('href=""');
      });

      it("names its Linear task in visible copy", () => {
        expect(html).toContain(testCase.linearId);
      });

      it("is responsive (uses sm: breakpoint utilities)", () => {
        expect(html).toContain("sm:");
      });

      it("guards animation behind motion-safe:", () => {
        // Any animate-* utility must be prefixed with motion-safe:.
        const bareAnimate = /(?<!motion-safe:)animate-/.test(html);
        expect(bareAnimate).toBe(false);
      });

      it("uses semantic tokens, not hardcoded gray shades", () => {
        expect(FORBIDDEN_COLORS.test(html)).toBe(false);
      });
    });
  }
});
