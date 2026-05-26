import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { GroundedPlaceCard } from "../grounded-place-card";

describe("GroundedPlaceCard", () => {
  it("renders rating and photo proxy when enriched props set", () => {
    const html = renderToStaticMarkup(
      <GroundedPlaceCard
        testId="grounded-card"
        title="Pergamino | Cafe"
        rating={4.8}
        userRatingCount={1700}
        priceLevel="PRICE_LEVEL_MODERATE"
        openNow={true}
        primaryType="cafe"
        photoName="places/ChIJ/photos/abc"
        mapsUrl="https://maps.google.com/?cid=1"
      />,
    );
    expect(html).toContain('data-testid="grounded-card-rating"');
    expect(html).toContain("4.8");
    expect(html).toContain("1.7k");
    expect(html).toContain("/api/places/photo?");
  });

  it("shows placeholder when no photoName", () => {
    const html = renderToStaticMarkup(
      <GroundedPlaceCard
        testId="grounded-card"
        title="Café Zeppelin"
        rating={4.5}
        mapsUrl="https://maps.google.com/?cid=2"
      />,
    );
    expect(html).toContain('data-testid="grounded-card-photo-placeholder"');
  });

  it("renders deep-link CTAs when URLs provided", () => {
    const html = renderToStaticMarkup(
      <GroundedPlaceCard
        testId="grounded-card"
        title="Pergamino"
        mapsUrl="https://maps.google.com/?cid=1"
        directionsUrl="https://maps.google.com/maps/dir//x"
        reviewsUrl="https://maps.google.com/maps/reviews/x"
      />,
    );
    expect(html).toContain('data-testid="grounded-maps-cta-row"');
    expect(html).toContain('data-testid="grounded-directions-link"');
    expect(html).toContain('data-testid="grounded-reviews-link"');
    expect(html).toContain('data-testid="grounded-maps-link"');
  });

  it("hides directions button when directionsUrl missing", () => {
    const html = renderToStaticMarkup(
      <GroundedPlaceCard
        testId="grounded-card"
        title="Café"
        mapsUrl="https://maps.google.com/?cid=2"
      />,
    );
    expect(html).not.toContain('data-testid="grounded-directions-link"');
    expect(html).toContain('data-testid="grounded-maps-link"');
  });

  it("renders photo author attributions when provided", () => {
    const html = renderToStaticMarkup(
      <GroundedPlaceCard
        testId="grounded-card"
        title="Pergamino"
        photoName="places/ChIJ/photos/abc"
        photoAuthorAttributions={[
          { displayName: "Jane Doe", uri: "https://example.com/jane" },
        ]}
      />,
    );
    expect(html).toContain('data-testid="grounded-card-photo-attribution"');
    expect(html).toContain("Jane Doe");
    expect(html).toContain("https://example.com/jane");
  });
});
