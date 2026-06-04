import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HostEventsGrid } from "../host-events-grid";
import type { HostEventCardProps } from "../host-event-card";

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

const rows: HostEventCardProps[] = [
  {
    id: "1",
    title: "Published Event",
    venue: "Ruta N",
    neighborhood: "El Poblado",
    startsAt: "2026-06-12T22:00:00.000Z",
    priceMin: 25,
    status: "published",
    slug: "published-event",
  },
  {
    id: "2",
    title: "Draft Event",
    venue: "Venue TBD",
    neighborhood: "Medellín",
    startsAt: "2026-06-13T22:00:00.000Z",
    priceMin: null,
    status: "draft",
    slug: null,
  },
  {
    id: "3",
    title: "Pending Event",
    venue: "Venue TBD",
    neighborhood: "Medellín",
    startsAt: "2026-06-14T22:00:00.000Z",
    priceMin: 10,
    status: "pending_approval",
    slug: null,
  },
];

describe("HostEventsGrid", () => {
  it("renders every event; only the published one exposes a view link", () => {
    const html = renderToStaticMarkup(<HostEventsGrid events={rows} />);
    expect(html.match(/data-testid="host-event-card"/g)?.length).toBe(3);
    expect(html.match(/data-testid="host-event-view-link"/g)?.length).toBe(1);
    // draft row with null price renders the TBD copy
    expect(html).toContain("Price TBD");
    // status chips for each state
    expect(html).toContain("Published");
    expect(html).toContain("Draft");
    expect(html).toContain("Pending");
  });
});
