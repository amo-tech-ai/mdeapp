import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HostEventCard, type HostEventCardProps } from "../host-event-card";

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

const base: HostEventCardProps = {
  id: "e1",
  title: "Salsa Night",
  venue: "Parque Lleras",
  neighborhood: "El Poblado",
  startsAt: "2026-06-12T22:00:00.000Z",
  priceMin: 25,
  imageUrl: "https://example.com/p.jpg",
  status: "published",
  slug: "salsa-night",
};

describe("HostEventCard", () => {
  it("shows the Published chip + a view link for published events with a slug", () => {
    const html = renderToStaticMarkup(<HostEventCard {...base} />);
    expect(html).toContain("Published");
    expect(html).toContain('data-testid="host-event-view-link"');
    expect(html).toContain("/events/salsa-night");
  });

  it("shows the Draft chip and no view link for drafts", () => {
    const html = renderToStaticMarkup(<HostEventCard {...base} status="draft" slug={null} />);
    expect(html).toContain("Draft");
    expect(html).not.toContain('data-testid="host-event-view-link"');
  });

  it("hides the view link when published but missing a slug", () => {
    const html = renderToStaticMarkup(<HostEventCard {...base} slug={null} />);
    expect(html).not.toContain('data-testid="host-event-view-link"');
  });

  it("renders 'Price TBD' (not $0) when priceMin is null", () => {
    const html = renderToStaticMarkup(<HostEventCard {...base} priceMin={null} />);
    expect(html).toContain("Price TBD");
    expect(html).not.toContain("From $0");
  });

  it("renders the photo placeholder when there is no image", () => {
    const html = renderToStaticMarkup(<HostEventCard {...base} imageUrl={undefined} />);
    expect(html).toContain("Event photo");
  });
});
