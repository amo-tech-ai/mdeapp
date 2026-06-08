import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PartnerSignupWizard } from "@/components/partners/partner-signup-wizard";

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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("PartnerSignupWizard", () => {
  it("shows auth gate when unauthenticated", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupWizard
        partnerType="host"
        isAuthenticated={false}
        loginNextPath="/partners/signup?type=host"
      />,
    );
    expect(html).toContain('data-testid="partner-signup-auth-gate"');
    expect(html).toContain("/login?next=");
  });

  it("renders activate form with hidden partner type", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupWizard
        partnerType="host"
        draftId="33333333-3333-4333-a333-333333333333"
        isAuthenticated
        loginNextPath="/partners/signup?type=host"
      />,
    );
    expect(html).toContain('data-testid="partner-signup-wizard"');
    expect(html).toContain('value="host"');
    expect(html).toContain('value="33333333-3333-4333-a333-333333333333"');
    expect(html).toContain('data-testid="partner-signup-submit"');
  });
});
