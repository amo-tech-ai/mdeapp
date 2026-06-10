import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventVenueOfferingsContent } from "../event-venue-offerings-sheet";

const baseTarget = {
  placeId: "ChIJSAN493MAMACITA01",
  title: "Mamacita",
  payload: {
    partnerId: "partner-1",
    partnerLocationId: "loc-1",
    locationLabel: "Mamacita Provenza",
    neighborhood: "Provenza",
    placeId: "ChIJSAN493MAMACITA01",
    offerings: [
      {
        id: "off-1",
        offeringKey: "birthday",
        eventTypes: ["birthday"],
        amenities: ["rooftop"],
        minimumSpend: 5_000_000,
        pricePerPersonFrom: 85000,
      },
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Rooftop Celebration",
        description: "Private rooftop",
        priceFrom: 3500000,
        minGuests: 20,
        maxGuests: 80,
      },
    ],
  },
};

describe("EventVenueOfferingsContent", () => {
  it("renders shadcn Card rows with gap stacks (no space-y)", () => {
    const html = renderToStaticMarkup(
      <EventVenueOfferingsContent target={baseTarget} />,
    );

    expect(html).toContain('data-slot="card"');
    expect(html).toContain('data-testid="event-venue-offering-card"');
    expect(html).toContain('data-testid="event-venue-package-card"');
    expect(html).not.toContain("space-y-3");
    expect(html).not.toContain("later release");
  });

  it("renders minimum spend on offering cards, not package cards", () => {
    const html = renderToStaticMarkup(
      <EventVenueOfferingsContent target={baseTarget} />,
    );

    expect(html).toContain('data-testid="event-venue-offering-minimum-spend"');
    expect(html).toContain("Minimum spend");
    expect(html).toContain("5,000,000");
    const packageSection = html.split('data-testid="event-venue-package-card"')[1];
    expect(packageSection).toBeDefined();
    expect(packageSection).not.toContain("Minimum spend");
  });

  it("renders request-proposal-btn when onRequestProposal is provided", () => {
    const html = renderToStaticMarkup(
      <EventVenueOfferingsContent
        target={baseTarget}
        onRequestProposal={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="request-proposal-btn"');
    expect(html).toContain("Request proposal");
  });
});
