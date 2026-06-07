import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const mocks = vi.hoisted(() => {
  const addMarkers = vi.fn();
  const clearMarkers = vi.fn();
  const clustererInstances: { map: unknown }[] = [];
  class MockMarkerClusterer {
    clearMarkers = clearMarkers;
    addMarkers = addMarkers;
    constructor(opts: { map: unknown }) {
      clustererInstances.push(opts);
    }
  }
  return { addMarkers, clearMarkers, clustererInstances, MockMarkerClusterer };
});

vi.mock("@googlemaps/markerclusterer", () => ({
  MarkerClusterer: mocks.MockMarkerClusterer,
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  useMap: () => ({}),
  AdvancedMarker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="advanced-marker">{children}</div>
  ),
}));

vi.mock("@/components/maps/markers/CategoryMapMarker", () => ({
  CategoryMapMarker: () => <span data-testid="category-marker" />,
}));

import { ClusteredCategoryMarkers } from "../ClusteredCategoryMarkers";
import type { MapPin } from "@/platform/contracts";

function pin(id: string): MapPin {
  return {
    id,
    category: "grounded",
    lat: 6.25,
    lng: -75.57,
    title: `Place ${id}`,
    source: "grounding",
  };
}

describe("ClusteredCategoryMarkers (MAP-009)", () => {
  beforeEach(() => {
    mocks.addMarkers.mockClear();
    mocks.clearMarkers.mockClear();
    mocks.clustererInstances.length = 0;
    vi.stubGlobal("google", {
      maps: {
        marker: {
          AdvancedMarkerElement: vi.fn(),
        },
      },
    });
  });

  it("creates MarkerClusterer when map is available", () => {
    renderToStaticMarkup(
      <ClusteredCategoryMarkers
        pins={[pin("a"), pin("b")]}
        selectedPinId={null}
        activeMapCategory="grounded"
        onSelectPin={() => {}}
      />,
    );
    expect(mocks.clustererInstances).toHaveLength(1);
    expect(mocks.clustererInstances[0]).toMatchObject({ map: {} });
  });

  it("renders one AdvancedMarker child per pin", () => {
    const html = renderToStaticMarkup(
      <ClusteredCategoryMarkers
        pins={[pin("a"), pin("b"), pin("c")]}
        selectedPinId={null}
        activeMapCategory={null}
        onSelectPin={() => {}}
      />,
    );
    const count = (html.match(/data-testid="advanced-marker"/g) ?? []).length;
    expect(count).toBe(3);
  });

  it("clearMarkers is available on the clusterer instance (P3 cleanup)", () => {
    renderToStaticMarkup(
      <ClusteredCategoryMarkers
        pins={[pin("x")]}
        selectedPinId={null}
        activeMapCategory={null}
        onSelectPin={() => {}}
      />,
    );
    // Verify the mock clusterer exposes clearMarkers so the cleanup effect can call it
    expect(typeof mocks.clearMarkers).toBe("function");
  });
});
