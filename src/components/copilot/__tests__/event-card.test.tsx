import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EventCard } from "../event-card";

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

/** Tool JSON shape from search-events (F15). */
const toolPayload = {
  id: "evt-001",
  title: "Salsa Night at Lleras",
  venue: "Parque Lleras",
  neighborhood: "El Poblado",
  startsAt: "2026-05-23T22:00:00.000Z",
  pricePerTicket: 25,
  imageUrl: "https://example.com/salsa.jpg",
};

describe("EventCard", () => {
  it("renders fields from search-events tool JSON", () => {
    const html = renderToStaticMarkup(
      <EventCard
        id={`event-${toolPayload.id}`}
        eventId={toolPayload.id}
        title={toolPayload.title}
        venue={toolPayload.venue}
        neighborhood={toolPayload.neighborhood}
        startsAt={toolPayload.startsAt}
        pricePerTicket={toolPayload.pricePerTicket}
        imageUrl={toolPayload.imageUrl}
        ticketUrl={`/events/${toolPayload.id}`}
      />,
    );

    expect(html).toContain('data-testid="event-card"');
    expect(html).toContain('data-result-kind="event"');
    expect(html).toContain(
      'aria-label="Event: Salsa Night at Lleras, El Poblado"',
    );
    expect(html).toContain(toolPayload.title);
    expect(html).toContain(toolPayload.venue);
    expect(html).toContain(toolPayload.neighborhood);
    expect(html).toContain("From $25");
    expect(html).toContain('data-testid="event-buy-cta"');
    expect(html).toContain(`href="/events/${toolPayload.id}"`);
  });

  it("Buy tickets uses button when onBuyTickets is provided (no navigation href)", () => {
    const html = renderToStaticMarkup(
      <EventCard
        id={`event-${toolPayload.id}`}
        eventId={toolPayload.id}
        title={toolPayload.title}
        venue={toolPayload.venue}
        neighborhood={toolPayload.neighborhood}
        startsAt={toolPayload.startsAt}
        pricePerTicket={toolPayload.pricePerTicket}
        ticketUrl={`/events/${toolPayload.id}`}
        onBuyTickets={() => {}}
      />,
    );
    expect(html).toContain('data-testid="event-buy-cta"');
    expect(html).not.toContain(`href="/events/${toolPayload.id}"`);
  });
});
