import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CafeBrowseCard } from "@/components/cafes/cafe-browse-card";

const listing = {
  id: "cafe-1",
  name: "Test Café",
  neighborhood: "Laureles",
  tags: ["specialty"],
  summary: "Quiet specialty coffee with WiFi.",
  mapsUrl: "https://maps.google.com/?q=test",
};

describe("CafeBrowseCard", () => {
  it("renders nova cover media for browse grid", () => {
    const html = renderToStaticMarkup(
      <CafeBrowseCard
        listing={listing}
        composition="nova"
        mediaLayout="cover"
      />,
    );
    expect(html).toContain('data-testid="cafe-card-cafe-1"');
    expect(html).toContain('data-result-kind="cafe"');
    expect(html).toContain("aspect-[16/10]");
    expect(html).toContain('data-testid="cafe-browse-card-photo-placeholder"');
    const heroIndex = html.indexOf(
      'data-testid="cafe-browse-card-photo-placeholder"',
    );
    const headingIndex = html.indexOf("<h3");
    expect(heroIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(-1);
    expect(heroIndex).toBeLessThan(headingIndex);
  });

  it("renders legacy inline media when requested", () => {
    const html = renderToStaticMarkup(
      <CafeBrowseCard
        listing={listing}
        composition="legacy"
        mediaLayout="inline"
      />,
    );
    expect(html).toContain('data-testid="cafe-card-cafe-1"');
    expect(html).toContain("<article");
  });
});
