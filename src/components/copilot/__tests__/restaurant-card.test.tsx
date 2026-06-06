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
    expect(html).toContain("absolute inset-0");
    expect(html).toContain("aspect-[16/10]");
    expect(html).toContain('data-testid="restaurant-card-rating"');
    expect(html).toContain("★ 4.5");
    expect(html).toContain("$22/person");
    expect(html).toContain("Paisa");
    expect(html).toContain('data-result-kind="restaurant"');
  });

  it("sets body aria-label when details CTA is interactive", () => {
    const html = renderToStaticMarkup(
      <RestaurantCard
        title="Mal De Ojo"
        pinId="restaurant-r1"
        testId="restaurant-card"
        onOpenDetails={() => undefined}
      />,
    );
    expect(html).toContain('aria-label="Open details for Mal De Ojo"');
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
    expect(html).toContain("aspect-[16/10]");
  });

  it("renders full-width cover media for browse layout", () => {
    const html = renderToStaticMarkup(
      <RestaurantCard
        title="Browse Spot"
        imageUrl="https://example.com/photo.jpg"
        mediaLayout="cover"
        composition="nova"
        pinId="restaurant-cover-test"
        testId="restaurant-card"
      />,
    );
    expect(html).toContain("aspect-[16/10]");
    expect(html).toContain("w-full");
    expect(html).toContain("object-cover");
  });
});
