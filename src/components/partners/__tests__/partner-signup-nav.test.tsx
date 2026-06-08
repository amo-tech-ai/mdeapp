// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { PartnerSignupNav } from "@/components/partners/partner-signup-nav";

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

describe("PartnerSignupNav", () => {
  it("preserves draft on back-to-picker link", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupNav
        showBackToPicker
        pickerHref="/partners/signup?draft=22222222-2222-4222-a222-222222222222"
      />,
    );
    expect(html).toContain(
      'href="/partners/signup?draft=22222222-2222-4222-a222-222222222222"',
    );
  });

  it("sign-in uses next redirect when provided", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupNav
        signInHref="/login?next=%2Fpartners%2Fsignup%3Ftype%3Dhost"
      />,
    );
    expect(html).toContain('href="/login?next=%2Fpartners%2Fsignup%3Ftype%3Dhost"');
  });
});
