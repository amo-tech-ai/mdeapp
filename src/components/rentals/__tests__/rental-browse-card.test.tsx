import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { RentalBrowseCard } from "@/components/rentals/rental-browse-card";
import type { Rental } from "@/mastra/tools/search-rentals";

const rental: Rental = {
  id: "rnt_lau_001",
  title: "Bright 2BR with Balcony in Laureles",
  neighborhood: "Laureles",
  nightly_price: 78,
  currency: "USD",
  bedrooms: 2,
  wifi: true,
  amenities: ["wifi", "workspace"],
  image: "https://images.example/photo.jpg",
  source_url: "https://mdeai.co/rentals/rnt_lau_001",
  schedule_viewing_url: "https://mdeai.co/rentals/rnt_lau_001/schedule-viewing",
  host_name: "Andrés Restrepo",
  availability: "Available now",
  tags: ["long-stay"],
};

describe("RentalBrowseCard", () => {
  it("renders schedule CTA as a button (not internal Link pathname)", () => {
    const html = renderToStaticMarkup(
      <RentalBrowseCard rental={rental} onSelect={vi.fn()} />,
    );
    expect(html).toContain('data-testid="rental-schedule-cta"');
    expect(html).not.toContain('href="/rentals/rnt_lau_001/schedule-viewing"');
  });

  it("forwards map sync props to VenueCardShell", () => {
    const html = renderToStaticMarkup(
      <RentalBrowseCard rental={rental} selected onSelect={vi.fn()} />,
    );
    expect(html).toContain('data-pin-id="rental-rnt_lau_001"');
    expect(html).toContain('data-selected="true"');
    expect(html).toContain('role="button"');
  });
});
