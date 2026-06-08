import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventVenueSection } from "../event-venue-section";

describe("EventVenueSection", () => {
  it("renders venue name and location line", () => {
    const html = renderToStaticMarkup(
      <EventVenueSection
        venue={{
          name: "Hotel Intercontinental — Salón Real",
          address: "Calle 16 #28-51, El Poblado",
          city: "Medellín",
        }}
      />,
    );
    expect(html).toContain('data-testid="event-venue-section"');
    expect(html).toContain("Hotel Intercontinental");
    expect(html).toContain("Medellín");
  });
});
