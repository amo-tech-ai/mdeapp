import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PlaceResultCard } from "../place-result-card";

describe("PlaceResultCard", () => {
  it("renders café title, not generic Place", () => {
    const html = renderToStaticMarkup(
      <PlaceResultCard
        testId="grounded-card"
        title="Café Euge"
        mapsUrl="https://maps.google.com/?cid=1"
      />,
    );
    expect(html).toContain("Café Euge");
    expect(html).not.toMatch(/<h3[^>]*>Place<\/h3>/);
    expect(html).toContain("Open in Google Maps");
  });
});
