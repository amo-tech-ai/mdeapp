import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EventVenueDetailBody } from "../event-venue-detail-body";
import type { EventVenueDetail } from "@/components/chat/rental-ui-context";
import type { PublicEventDetail } from "@/lib/events/types";

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

const detail: EventVenueDetail = {
  kind: "event",
  eventId: "evt-1",
  pinId: "event-evt-1",
  title: "Salsa Night",
  neighborhood: "Poblado",
  venue: "Parque Lleras",
  startsAt: "2026-05-23T22:00:00.000Z",
  pricePerTicket: 25,
  ticketUrl: "/events/evt-1",
  sourceUrl: "https://maps.google.com/?cid=123",
};

const publicEvent: PublicEventDetail = {
  id: "evt-1",
  slug: "salsa-night",
  name: "Salsa Night",
  description: "Live band and dance floor.",
  address: "Cra 37",
  city: "Medellín",
  startsAt: "2026-05-23T22:00:00.000Z",
  endsAt: null,
  imageUrl: null,
  currency: "USD",
  latitude: null,
  longitude: null,
  host: null,
  venue: null,
  tickets: [
    {
      id: "t1",
      name: "General",
      priceCents: 2500,
      currency: "USD",
      qtyTotal: 100,
      qtySold: 0,
      position: 0,
    },
  ],
};

describe("EventVenueDetailBody", () => {
  it("detail step shows trust fields and full-page fallback", () => {
    const html = renderToStaticMarkup(
      <EventVenueDetailBody
        detail={detail}
        step="detail"
        loadState="ready"
        publicEvent={publicEvent}
        loadError={null}
        onStepChange={() => {}}
      />,
    );
    expect(html).toContain('data-testid="event-sheet-venue"');
    expect(html).toContain('data-testid="event-sheet-maps-link"');
    expect(html).toContain('data-testid="venue-detail-buy-cta"');
    expect(html).toContain('data-testid="event-sheet-full-page-link"');
    expect(html).toContain("Live band");
  });

  it("checkout step renders ticket tiers and back control", () => {
    const html = renderToStaticMarkup(
      <EventVenueDetailBody
        detail={detail}
        step="checkout"
        loadState="ready"
        publicEvent={publicEvent}
        loadError={null}
        onStepChange={() => {}}
      />,
    );
    expect(html).toContain('data-testid="event-sheet-back-to-detail"');
    expect(html).toContain('data-testid="event-tier-list"');
    expect(html).toContain('data-testid="event-tier-row"');
    expect(html).not.toContain('href="/events/evt-1"');
  });
});
