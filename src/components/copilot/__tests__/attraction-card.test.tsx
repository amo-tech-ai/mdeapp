import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AttractionCard } from "../attraction-card";

describe("AttractionCard", () => {
  it("renders photo, rating, and category badges", () => {
    const html = renderToStaticMarkup(
      <AttractionCard
        title="Comuna 13 Graffiti Tour"
        neighborhood="San Javier"
        category="tour"
        priceUsd={25}
        durationMinutes={180}
        bestTimeOfDay="morning"
        rating={4.8}
        imageUrl="https://example.com/tour.jpg"
        mapsUrl="https://maps.google.com/?cid=2"
        aiSummary="Guided street-art walk with cable car views."
        pinId="attraction-a1"
        testId="attraction-card"
        onSelect={() => undefined}
        onOpenDetails={() => undefined}
      />,
    );
    expect(html).toContain('data-testid="attraction-card-photo"');
    expect(html).toContain('data-testid="attraction-card-rating"');
    expect(html).toContain("Tour");
    expect(html).toContain("$25");
    expect(html).toContain("180 min");
    expect(html).toContain('data-result-kind="attraction"');
  });
});
