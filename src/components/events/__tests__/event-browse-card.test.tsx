import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventBrowseCard } from "@/components/events/event-browse-card";
import type { PublishedEventListItem } from "@/lib/events/list-published-events";

const event: PublishedEventListItem = {
  id: "evt-1",
  eventId: "evt-1",
  slug: "salsa-night-laureles",
  title: "Salsa Night",
  venue: "Club Social",
  neighborhood: "Laureles",
  startsAt: "2026-06-13T03:00:00+00:00",
  pricePerTicket: 25,
  currency: "USD",
  ticketUrl: "https://example.com/tickets",
  category: "music",
  status: "published",
};

describe("EventBrowseCard", () => {
  it("renders nova cover shell for browse grid", () => {
    const html = renderToStaticMarkup(
      <EventBrowseCard
        event={event}
        composition="nova"
        mediaLayout="cover"
      />,
    );
    expect(html).toContain('data-testid="event-card"');
    expect(html).toContain('data-result-kind="event"');
    expect(html).toContain("aspect-[16/10]");
    expect(html).toContain('data-testid="event-browse-card-photo-placeholder"');
    expect(html).toContain('data-testid="event-details-cta"');
    expect(html).toContain('data-testid="event-buy-cta"');
    expect(html).toContain("/events/salsa-night-laureles");
    const heroIndex = html.indexOf(
      'data-testid="event-browse-card-photo-placeholder"',
    );
    const headingIndex = html.indexOf("<h3");
    expect(heroIndex).toBeLessThan(headingIndex);
  });

  it("renders image hero when imageUrl is set", () => {
    const html = renderToStaticMarkup(
      <EventBrowseCard
        event={{ ...event, imageUrl: "https://cdn.example.com/event.jpg" }}
        composition="nova"
        mediaLayout="cover"
      />,
    );
    expect(html).toContain('data-testid="event-browse-card-photo"');
    expect(html).toContain("https://cdn.example.com/event.jpg");
    expect(html).toContain('alt="Salsa Night"');
  });
});
