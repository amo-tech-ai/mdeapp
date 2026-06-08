// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { EventHostLanding } from "@/components/partners/event-host-landing";

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

describe("EventHostLanding", () => {
  const html = renderToStaticMarkup(<EventHostLanding />);

  it("renders landing marker and wireframe hero copy", () => {
    expect(html).toContain('data-testid="event-host-landing"');
    expect(html).toContain("Publish your event in 30 seconds.");
  });

  it("links primary CTA to host signup", () => {
    expect(html).toContain('data-testid="event-host-primary-cta"');
    expect(html).toContain('href="/partners/signup?type=host"');
  });

  it("links secondary CTA to live wizard", () => {
    expect(html).toContain('data-testid="event-host-secondary-cta"');
    expect(html).toContain('href="/host/event/new"');
  });

  it("includes wizard preview mock in hero", () => {
    expect(html).toContain("Host event wizard");
    expect(html).toContain("Wizard preview");
  });

  it("sign-in preserves signup return path", () => {
    expect(html).toContain("/login?next=");
    expect(html).toContain("type%3Dhost");
  });

  it("does not use hardcoded Tailwind gray scales", () => {
    expect(html).not.toMatch(FORBIDDEN_COLORS);
  });
});
