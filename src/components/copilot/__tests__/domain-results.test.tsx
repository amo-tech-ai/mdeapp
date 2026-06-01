import { describe, expect, it, vi, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  categoryPinId,
  DomainResults,
} from "@/components/copilot/domain-results";

vi.mock("@/platform/maps/map-context", () => ({
  useMapContext: vi.fn(),
}));

vi.mock("@/components/copilot/tool-pins-sync", () => ({
  ToolPinsSync: () => null,
}));

vi.mock("@/components/chat/rich-card-results-context", () => ({
  RichCardResultsRegistrar: () => null,
}));

vi.mock("@/components/chat/rental-ui-context", () => ({
  useRentalUi: vi.fn(() => ({ openCafeDetail: vi.fn() })),
}));

import { useMapContext } from "@/platform/maps/map-context";

describe("DomainResults", () => {
  beforeEach(() => {
    vi.mocked(useMapContext).mockReturnValue({
      selectedPinId: null,
      panToPin: vi.fn(),
    } as unknown as ReturnType<typeof useMapContext>);
  });

  it("categoryPinId matches normalizeToolOutput pin ids", () => {
    expect(categoryPinId("restaurant", "abc")).toBe("restaurant-abc");
    expect(categoryPinId("attraction", "xyz")).toBe("attraction-xyz");
  });

  it("renders RestaurantCard with pin sync for restaurant rows", () => {
    const html = renderToStaticMarkup(
      React.createElement(DomainResults, {
        category: "restaurant",
        testId: "restaurant-card",
        result: {
          results: [
            {
              id: "r1",
              name: "Mal De Ojo",
              neighborhood: "El Poblado",
              cuisine: "paisa",
              avgPricePerPerson: 22,
              rating: 4.5,
              imageUrl: "https://example.com/a.jpg",
            },
          ],
        },
      }),
    );
    expect(html).toContain('data-pin-id="restaurant-r1"');
    expect(html).toContain('data-testid="restaurant-card-rating"');
    expect(html).toContain('data-result-kind="restaurant"');
    expect(html).toContain("Mal De Ojo");
  });

  it("renders AttractionCard for attraction rows", () => {
    const html = renderToStaticMarkup(
      React.createElement(DomainResults, {
        category: "attraction",
        testId: "attraction-card",
        result: {
          results: [
            {
              id: "a1",
              name: "Arví Park",
              neighborhood: "Santa Elena",
              category: "park",
              priceUsd: 0,
              rating: 4.6,
              imageUrl: "https://example.com/arvi.jpg",
            },
          ],
        },
      }),
    );
    expect(html).toContain('data-pin-id="attraction-a1"');
    expect(html).toContain('data-testid="attraction-card-rating"');
    expect(html).toContain('data-result-kind="attraction"');
  });

  it("renders attraction empty state test id", () => {
    const html = renderToStaticMarkup(
      React.createElement(DomainResults, {
        category: "attraction",
        testId: "attraction-card",
        result: { results: [] },
      }),
    );
    expect(html).toContain('data-testid="attraction-card-empty"');
  });
});
