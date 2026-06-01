import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RestaurantCard } from "../restaurant-card";

describe("RestaurantCard", () => {
  it("renders photo, rating, and price badges for full payload", () => {
    const html = renderToStaticMarkup(
      <RestaurantCard
        title="Mal De Ojo"
        neighborhood="El Poblado"
        cuisine="paisa"
        priceTier="$$"
        avgPricePerPerson={22}
        rating={4.5}
        imageUrl="https://example.com/photo.jpg"
        mapsUrl="https://maps.google.com/?cid=1"
        aiSummary="Classic paisa plates in a lively dining room."
        pinId="restaurant-r1"
        testId="restaurant-card"
        onSelect={() => undefined}
        onOpenDetails={() => undefined}
      />,
    );
    expect(html).toContain('data-testid="restaurant-card-photo"');
    expect(html).toContain('data-testid="restaurant-card-rating"');
    expect(html).toContain("★ 4.5");
    expect(html).toContain("$22/person");
    expect(html).toContain("Paisa");
    expect(html).toContain('data-result-kind="restaurant"');
  });

  it("renders glyph placeholder when image missing", () => {
    const html = renderToStaticMarkup(
      <RestaurantCard
        title="Sparse Spot"
        pinId="restaurant-x"
        testId="restaurant-card"
      />,
    );
    expect(html).toContain('data-testid="restaurant-card-photo-placeholder"');
    expect(html).not.toContain('data-testid="restaurant-card-photo"');
  });
});
