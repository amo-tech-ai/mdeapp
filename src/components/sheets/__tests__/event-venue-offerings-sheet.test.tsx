import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventVenueOfferingsContent } from "../event-venue-offerings-sheet";

describe("EventVenueOfferingsContent", () => {
  it("renders shadcn Card rows with gap stacks (no space-y)", () => {
    const html = renderToStaticMarkup(
      <EventVenueOfferingsContent
        target={{
          placeId: "ChIJSAN493MAMACITA01",
          title: "Mamacita",
          payload: {
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
                minimumSpend: null,
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
        }}
      />,
    );

    expect(html).toContain('data-slot="card"');
    expect(html).toContain('data-testid="event-venue-offering-card"');
    expect(html).toContain('data-testid="event-venue-package-card"');
    expect(html).not.toContain("space-y-3");
  });
});
