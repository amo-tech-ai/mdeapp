import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { searchTextMock, searchNearbyMock, getPlaceMock, PlacesClientCtor } =
  vi.hoisted(() => {
    const searchTextMock = vi.fn(async () => [{}]);
    const searchNearbyMock = vi.fn(async () => [{}]);
    const getPlaceMock = vi.fn(async () => [{}]);
    const PlacesClientCtor = vi.fn(function PlacesClientMock() {
      return {
        searchText: searchTextMock,
        searchNearby: searchNearbyMock,
        getPlace: getPlaceMock,
      };
    });
    return { searchTextMock, searchNearbyMock, getPlaceMock, PlacesClientCtor };
  });

vi.mock("@googlemaps/places", () => ({
  PlacesClient: PlacesClientCtor,
}));

import {
  DEFAULT_NEARBY_SEARCH_MASK,
  DEFAULT_PLACE_DETAILS_MASK,
  DEFAULT_TEXT_SEARCH_MASK,
  PLACE_DETAILS_MVP_MASK,
  PlacesConfigError,
  buildPlaceDetailsMask,
  extractPlaceUri,
  getPlace,
  getPlaceDetails,
  isEditorialSummaryEnabled,
  resetPlacesClientForTests,
  searchNearby,
  searchText,
  validatePlacesFieldMask,
} from "./google-places-client";

type PlacesCallOptions = {
  otherArgs?: { headers?: Record<string, string> };
};

function callOptions(mock: ReturnType<typeof vi.fn>, index = 0): PlacesCallOptions {
  const call = mock.mock.calls[index] as unknown[] | undefined;
  return (call?.[1] ?? {}) as PlacesCallOptions;
}

describe("google-places-client field masks (MAP-004)", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "AIzaSyTestPlacesKey1234567890");
    resetPlacesClientForTests();
    searchTextMock.mockClear();
    searchNearbyMock.mockClear();
    getPlaceMock.mockClear();
    PlacesClientCtor.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetPlacesClientForTests();
  });

  it("searchText sends X-Goog-FieldMask with default mask", async () => {
    await searchText({ textQuery: "rooftop bar Provenza Medellín" });
    expect(searchTextMock).toHaveBeenCalledOnce();
    const opts = callOptions(searchTextMock);
    expect(opts?.otherArgs?.headers?.["X-Goog-FieldMask"]).toBe(
      DEFAULT_TEXT_SEARCH_MASK.join(","),
    );
  });

  it("searchNearby sends X-Goog-FieldMask with primaryType", async () => {
    await searchNearby({
      locationRestriction: {
        circle: {
          center: { latitude: 6.2442, longitude: -75.5812 },
          radius: 1500,
        },
      },
      includedTypes: ["cafe"],
    });
    const opts = callOptions(searchNearbyMock);
    expect(opts?.otherArgs?.headers?.["X-Goog-FieldMask"]).toBe(
      DEFAULT_NEARBY_SEARCH_MASK.join(","),
    );
    expect(DEFAULT_NEARBY_SEARCH_MASK).toContain("places.primaryType");
  });

  it("getPlace sends flat X-Goog-FieldMask for Mindtrip details", async () => {
    await getPlace({ placeId: "ChIJTest123" });
    const opts = callOptions(getPlaceMock);
    const mask = opts?.otherArgs?.headers?.["X-Goog-FieldMask"] ?? "";
    expect(mask).toBe(DEFAULT_PLACE_DETAILS_MASK.join(","));
    expect(mask).toContain("googleMapsLinks");
    expect(mask).toContain("photos");
    expect(mask).toContain("currentOpeningHours");
    expect(mask).not.toContain("places.googleMapsLinks");
    expect(mask).not.toContain("generativeSummary");
  });

  it("getPlaceDetails aliases getPlace", async () => {
    await getPlaceDetails({ placeId: "ChIJAlias" });
    expect(getPlaceMock).toHaveBeenCalledOnce();
    const call = getPlaceMock.mock.calls[0] as unknown[];
    const req = call[0] as { name?: string };
    expect(req?.name).toBe("places/ChIJAlias");
  });

  it("rejects empty field mask", () => {
    expect(() => validatePlacesFieldMask([])).toThrow(PlacesConfigError);
  });

  it("rejects wildcard field mask", () => {
    expect(() => validatePlacesFieldMask(["*"])).toThrow(PlacesConfigError);
  });
});

describe("DEFAULT_* masks — official field compliance", () => {
  it("text search includes googleMapsLinks per choose-fields", () => {
    expect(DEFAULT_TEXT_SEARCH_MASK).toContain("places.googleMapsLinks");
  });

  it("place details MVP mask excludes editorialSummary (Enterprise+Atmosphere)", () => {
    for (const field of [
      "rating",
      "userRatingCount",
      "photos",
      "types",
      "currentOpeningHours",
    ] as const) {
      expect(PLACE_DETAILS_MVP_MASK).toContain(field);
    }
    expect(PLACE_DETAILS_MVP_MASK).not.toContain("editorialSummary");
    expect(buildPlaceDetailsMask()).toEqual(PLACE_DETAILS_MVP_MASK);
  });

  it("adds editorialSummary only when PLACES_ENABLE_EDITORIAL_SUMMARY=true", () => {
    const prev = process.env.PLACES_ENABLE_EDITORIAL_SUMMARY;
    process.env.PLACES_ENABLE_EDITORIAL_SUMMARY = "true";
    expect(buildPlaceDetailsMask()).toContain("editorialSummary");
    process.env.PLACES_ENABLE_EDITORIAL_SUMMARY = prev;
    expect(isEditorialSummaryEnabled()).toBe(prev === "true");
  });
});

describe("extractPlaceUri", () => {
  it("returns placeUri from googleMapsLinks", () => {
    expect(
      extractPlaceUri({
        googleMapsLinks: {
          placeUri: "https://maps.google.com/?cid=12345678901234567",
        },
      }),
    ).toBe("https://maps.google.com/?cid=12345678901234567");
  });

  it("returns null when googleMapsLinks missing", () => {
    expect(extractPlaceUri({ id: "ChIJ" })).toBeNull();
  });
});
