import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CafeResultCard } from "../cafe-result-card";

describe("CafeResultCard", () => {
  it("renders ranked grounded café facts without semantic claims", () => {
    const html = renderToStaticMarkup(
      <CafeResultCard
        testId="grounded-card"
        pinId="grounded-rituales"
        rank={1}
        title="Rituales Compañía de Café"
        rating={4.7}
        userRatingCount={1600}
        priceLevel="PRICE_LEVEL_INEXPENSIVE"
        openNow={true}
        primaryType="cafe"
        summary="Specialty coffee stop in Laureles with a calm weekday feel."
        formattedAddress="Laureles, Medellín"
        placeId="places/abc"
        fieldMaskVersion="places-new-v1"
      />,
    );

    expect(html).toContain('data-testid="grounded-card"');
    expect(html).toContain('data-result-kind="cafe"');
    expect(html).toContain('data-pin-id="grounded-rituales"');
    expect(html).toContain("Match #1");
    expect(html).toContain("Google-verified candidate");
    expect(html).toContain("Place ID");
    expect(html).toContain("★ 4.7");
  });

  it("renders details and booking stub actions", () => {
    const html = renderToStaticMarkup(
      <CafeResultCard
        pinId="grounded-pergamino"
        rank={2}
        title="Pergamino"
        mapsUrl="https://maps.google.com/?cid=1"
        directionsUrl="https://maps.google.com/maps/dir//x"
        reviewsUrl="https://maps.google.com/maps/reviews/x"
      />,
    );

    expect(html).toContain('data-testid="cafe-details-cta"');
    expect(html).toContain('data-testid="cafe-booking-cta"');
    expect(html).toContain('data-testid="cafe-card-directions-link"');
    expect(html).toContain('data-testid="cafe-card-reviews-link"');
  });
});
