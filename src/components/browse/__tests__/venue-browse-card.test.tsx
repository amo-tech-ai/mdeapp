import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  VenueBrowseCard,
  type VenueBrowseListing,
} from "@/components/browse/venue-browse-card";

const cafe: VenueBrowseListing = {
  id: "cafe-1",
  name: "Test Café",
  neighborhood: "Laureles",
  tags: ["specialty"],
  summary: "Quiet specialty coffee with WiFi.",
  mapsUrl: "https://maps.google.com/?q=test",
};

const nightlife: VenueBrowseListing = {
  id: "nl-1",
  name: "Test Club",
  neighborhood: "Provenza",
  tags: ["rooftop"],
  summary: "Rooftop cocktails with city views.",
  mapsUrl: "https://maps.google.com/?q=test",
};

describe("VenueBrowseCard", () => {
  it("renders the café contract (test ids, glyph label, media before heading)", () => {
    const html = renderToStaticMarkup(
      <VenueBrowseCard kind="cafe" listing={cafe} />,
    );
    expect(html).toContain('data-testid="cafe-card-cafe-1"');
    expect(html).toContain('data-result-kind="cafe"');
    expect(html).toContain('data-testid="cafe-browse-card-photo-placeholder"');
    expect(html).toContain("aspect-[16/10]");

    const heroIndex = html.indexOf(
      'data-testid="cafe-browse-card-photo-placeholder"',
    );
    const headingIndex = html.indexOf("<h3");
    expect(heroIndex).toBeGreaterThan(-1);
    expect(headingIndex).toBeGreaterThan(-1);
    expect(heroIndex).toBeLessThan(headingIndex);
  });

  it("renders the nightlife contract with its own test ids", () => {
    const html = renderToStaticMarkup(
      <VenueBrowseCard kind="nightlife" listing={nightlife} />,
    );
    expect(html).toContain('data-testid="nightlife-card-nl-1"');
    expect(html).toContain('data-result-kind="nightlife"');
    expect(html).toContain(
      'data-testid="nightlife-browse-card-photo-placeholder"',
    );
  });

  it("uses the pale-teal placeholder gradient — never a grey bg-muted box", () => {
    const html = renderToStaticMarkup(
      <VenueBrowseCard kind="cafe" listing={cafe} />,
    );
    // Isolate the placeholder element (everything else, e.g. button hover
    // states, may legitimately use bg-muted).
    const start = html.indexOf("<div", html.indexOf("px-3 pt-3"));
    const placeholder = html.slice(
      start,
      html.indexOf('data-testid="cafe-browse-card-photo-placeholder"') + 200,
    );
    // D-03: one pale-teal gradient placeholder, conveyed by glyph + label.
    expect(placeholder).toContain("linear-gradient(150deg");
    expect(placeholder).not.toContain("bg-muted");
  });

  it("renders legacy inline media when requested", () => {
    const html = renderToStaticMarkup(
      <VenueBrowseCard
        kind="cafe"
        listing={cafe}
        composition="legacy"
        mediaLayout="inline"
      />,
    );
    expect(html).toContain('data-testid="cafe-card-cafe-1"');
    expect(html).toContain("<article");
  });
});
