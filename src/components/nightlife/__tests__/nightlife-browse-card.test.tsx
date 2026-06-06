import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NightlifeBrowseCard } from "@/components/nightlife/nightlife-browse-card";

const listing = {
  id: "nl-1",
  name: "Test Club",
  neighborhood: "Provenza",
  tags: ["rooftop"],
  summary: "Rooftop cocktails with city views.",
  mapsUrl: "https://maps.google.com/?q=test",
};

describe("NightlifeBrowseCard", () => {
  it("renders nova cover media for browse grid", () => {
    const html = renderToStaticMarkup(
      <NightlifeBrowseCard
        listing={listing}
        composition="nova"
        mediaLayout="cover"
      />,
    );
    expect(html).toContain('data-testid="nightlife-card-nl-1"');
    expect(html).toContain("aspect-[16/10]");
    expect(html).toContain(
      'data-testid="nightlife-browse-card-photo-placeholder"',
    );
    const heroIndex = html.indexOf(
      'data-testid="nightlife-browse-card-photo-placeholder"',
    );
    const headingIndex = html.indexOf("<h3");
    expect(heroIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(-1);
    expect(heroIndex).toBeLessThan(headingIndex);
  });

  it("renders legacy inline media when requested", () => {
    const html = renderToStaticMarkup(
      <NightlifeBrowseCard
        listing={listing}
        composition="legacy"
        mediaLayout="inline"
      />,
    );
    expect(html).toContain('data-testid="nightlife-card-nl-1"');
    expect(html).toContain("<article");
  });
});
