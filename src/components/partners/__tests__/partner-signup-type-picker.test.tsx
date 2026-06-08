// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { PartnerSignupTypePicker } from "@/components/partners/partner-signup-type-picker";
import { PARTNER_TYPES } from "@/lib/partners/partner-types";

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

const FORBIDDEN_COLORS =
  /\b(?:bg|text|border|from|to|via)-(?:gray|zinc|slate|neutral|stone)-\d{2,3}\b/;

describe("PartnerSignupTypePicker", () => {
  const html = renderToStaticMarkup(<PartnerSignupTypePicker />);

  it("renders landing marker and hero copy", () => {
    expect(html).toContain('data-testid="partner-signup-type-picker"');
    expect(html).toContain("Turn local demand into bookings");
    expect(html).toContain("Choose your partner type");
  });

  it("links every partner type to typed signup", () => {
    for (const partnerType of PARTNER_TYPES) {
      expect(html).toContain(`href="/partners/signup?type=${partnerType}"`);
    }
  });

  it("shows invalid type alert when provided", () => {
    const invalid = renderToStaticMarkup(
      <PartnerSignupTypePicker invalidTypeParam="not-a-type" />,
    );
    expect(invalid).toContain('role="alert"');
    expect(invalid).toContain("not-a-type");
  });

  it("preserves draft query on type links", () => {
    const withDraft = renderToStaticMarkup(
      <PartnerSignupTypePicker draftId="22222222-2222-4222-a222-222222222222" />,
    );
    expect(withDraft).toContain(
      'href="/partners/signup?type=host&amp;draft=22222222-2222-4222-a222-222222222222"',
    );
  });

  it("does not ship placeholder testimonial copy", () => {
    expect(html).not.toContain("(placeholder)");
    expect(html).not.toContain("partner-signup-trust");
  });

  it("sign-in link preserves return path with draft", () => {
    const withDraft = renderToStaticMarkup(
      <PartnerSignupTypePicker draftId="22222222-2222-4222-a222-222222222222" />,
    );
    expect(withDraft).toContain("/login?next=");
    expect(withDraft).toContain("draft%3D22222222");
  });

  it("uses semantic tokens, not hardcoded gray shades", () => {
    expect(FORBIDDEN_COLORS.test(html)).toBe(false);
  });

  it("is responsive (uses sm: breakpoint utilities)", () => {
    expect(html).toContain("sm:");
  });
});
