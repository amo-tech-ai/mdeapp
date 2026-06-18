// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MyTicketsList } from "@/components/tickets/my-tickets-list";
import type { BuyerOrderListItem } from "@/lib/tickets/wallet-types";

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

const upcomingOrder: BuyerOrderListItem = {
  id: "11111111-1111-1111-1111-111111111111",
  shortId: "MDE-UP1",
  status: "paid",
  totalCents: 4000000,
  currency: "cop",
  quantity: 2,
  eventName: "Grand Finals 2026",
  eventStartTime: "2099-02-24T01:00:00+00:00",
  imageUrl: "https://images.unsplash.com/photo-cover.jpg",
  venue: "Test Venue",
};

const pastOrder: BuyerOrderListItem = {
  id: "22222222-2222-2222-2222-222222222222",
  shortId: "MDE-PAST1",
  status: "paid",
  totalCents: 1500000,
  currency: "cop",
  quantity: 1,
  eventName: "Flower Festival 2020",
  eventStartTime: "2020-08-07T01:00:00+00:00",
  imageUrl: null,
  venue: null,
};

describe("MyTicketsList", () => {
  it("renders the empty state when there are no orders", () => {
    const html = renderToStaticMarkup(
      <MyTicketsList orders={[]} upcoming={[]} past={[]} />,
    );
    expect(html).toContain('data-testid="my-tickets-empty"');
    expect(html).toContain("No tickets yet");
    expect(html).not.toContain('data-testid="my-tickets-tab-upcoming"');
  });

  it("renders Upcoming/Past pill tabs with counts", () => {
    const html = renderToStaticMarkup(
      <MyTicketsList
        orders={[upcomingOrder, pastOrder]}
        upcoming={[upcomingOrder]}
        past={[pastOrder]}
      />,
    );
    expect(html).toContain('data-testid="my-tickets-tab-upcoming"');
    expect(html).toContain('data-testid="my-tickets-tab-past"');
    expect(html).toContain("Upcoming · 1");
    expect(html).toContain("Past · 1");
  });

  it("renders the cover image + venue line on an order card", () => {
    const html = renderToStaticMarkup(
      <MyTicketsList
        orders={[upcomingOrder]}
        upcoming={[upcomingOrder]}
        past={[]}
      />,
    );
    expect(html).toContain('data-testid="my-tickets-cover"');
    expect(html).toContain("photo-cover.jpg");
    expect(html).toContain("Grand Finals 2026");
    expect(html).toContain("· Test Venue");
    expect(html).toContain('data-testid="my-tickets-show-qr"');
    expect(html).toContain(
      'href="/me/tickets/11111111-1111-1111-1111-111111111111"',
    );
  });

  it("falls back to a placeholder when an order has no cover image", () => {
    const html = renderToStaticMarkup(
      <MyTicketsList orders={[pastOrder]} upcoming={[]} past={[pastOrder]} />,
    );
    expect(html).toContain('data-testid="my-tickets-cover-placeholder"');
    expect(html).not.toContain('data-testid="my-tickets-cover"');
  });
});
