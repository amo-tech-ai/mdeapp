import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Coffee } from "lucide-react";
import { VenueCardPlaceholder } from "@/components/browse/venue-card-placeholder";

describe("VenueCardPlaceholder", () => {
  it("renders the one pale-teal brand gradient (D-03), never a grey box", () => {
    const html = renderToStaticMarkup(
      <VenueCardPlaceholder
        label="Café"
        icon={<Coffee aria-hidden />}
        mediaLayout="cover"
        testId="cafe-browse-card-photo-placeholder"
      />,
    );
    expect(html).toContain('data-testid="cafe-browse-card-photo-placeholder"');
    expect(html).toContain("oklch(0.970 0.015 180)");
    expect(html).toContain("oklch(0.926 0.030 184)");
    expect(html).toContain("Café");
    // brand teal placeholder must not fall back to a grey muted box
    expect(html).not.toContain("bg-muted");
  });

  it("uses the cover frame for browse grids and the inline frame otherwise", () => {
    const cover = renderToStaticMarkup(
      <VenueCardPlaceholder label="Nightlife" icon={null} mediaLayout="cover" />,
    );
    expect(cover).toContain("w-full");

    const inline = renderToStaticMarkup(
      <VenueCardPlaceholder label="Nightlife" icon={null} mediaLayout="inline" />,
    );
    expect(inline).toContain("w-24");
  });
});
