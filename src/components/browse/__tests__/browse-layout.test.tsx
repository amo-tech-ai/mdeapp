import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BrowseLayout } from "../BrowseLayout";

describe("BrowseLayout", () => {
  it("renders header, filters, and children", () => {
    const html = renderToStaticMarkup(
      <BrowseLayout
        testId="restaurants-browse"
        title="Restaurants"
        subtitle="Food in Medellín"
        filterBar={<div data-testid="filters">filters</div>}
      >
        <section data-testid="results">grid</section>
      </BrowseLayout>,
    );

    expect(html).toContain('data-testid="restaurants-browse"');
    expect(html).toContain('data-testid="filters"');
    expect(html).toContain('data-testid="results"');
    expect(html).toContain("Restaurants");
  });
});
