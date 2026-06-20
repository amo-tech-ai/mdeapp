// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HostOsNav } from "@/components/host/host-os-nav";

const mocks = vi.hoisted(() => ({ pathname: "/host/dashboard" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

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

function renderNav(pathname: string): string {
  mocks.pathname = pathname;
  return renderToStaticMarkup(<HostOsNav />);
}

describe("HostOsNav", () => {
  it("renders the nav exactly once", () => {
    const html = renderNav("/host/dashboard");
    const occurrences = html.split('data-testid="host-os-nav"').length - 1;
    expect(occurrences).toBe(1);
  });

  it("renders all three live destinations", () => {
    const html = renderNav("/host/dashboard");
    expect(html).toContain('data-testid="host-os-nav-overview"');
    expect(html).toContain('data-testid="host-os-nav-events"');
    expect(html).toContain('data-testid="host-os-nav-analytics"');
    expect(html).toContain("Overview");
    expect(html).toContain("Events");
    expect(html).toContain("Analytics");
  });

  it("marks the current route with aria-current=page", () => {
    const html = renderNav("/host/analytics");
    // The active link (Analytics) carries aria-current; only one should.
    const activeCount = html.split('aria-current="page"').length - 1;
    expect(activeCount).toBe(1);
    // It must be the analytics link, not overview.
    const analyticsActive = /href="\/host\/analytics"[^>]*aria-current="page"/.test(
      html,
    );
    expect(analyticsActive).toBe(true);
  });

  it("shows reserved placeholders as disabled coming-soon, not links", () => {
    const html = renderNav("/host/dashboard");
    expect(html).toContain('data-testid="host-os-nav-venues"');
    expect(html).toContain("(Coming soon)");
    expect(html).toContain('aria-disabled="true"');
    // Placeholders must not be navigable.
    expect(html).not.toContain('href="/host/venues"');
  });
});
