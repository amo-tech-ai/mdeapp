import { describe, expect, it } from "vitest";
import {
  alignGroundedAttribution,
  filterCafeGroundingRows,
  filterNightlifeGroundingRows,
  isCafeGroundingIntent,
  isCafeGroundingQuery,
  isNightlifeGroundingIntent,
  isNightlifeGroundingQuery,
  normalizeCafeGroundingQuery,
  resolveVenueGroundingKind,
  searchGroundedPlacesInputSchema,
  venueGroundingIntentSchema,
} from "../search-grounded-places";
import type { GroundedPlaceResult } from "../../lib/map-adk-grounding-pins";

describe("search-grounded-places café quality filter", () => {
  it("detects café discovery queries", () => {
    expect(isCafeGroundingQuery("list cafes in medellin")).toBe(true);
    expect(isCafeGroundingQuery("top cafes in medellin")).toBe(true);
    expect(isCafeGroundingQuery("quiet coffee shops near Laureles")).toBe(true);
    expect(isCafeGroundingQuery("salsa events this weekend")).toBe(false);
  });

  it("adds specialty intent and excludes nightlife language", () => {
    const normalized = normalizeCafeGroundingQuery("list cafes in medellin");
    expect(normalized).toContain("specialty coffee");
    expect(normalized).toContain("Exclude bar lounges");
  });

  it("removes bar/lounge distractors from café results", () => {
    const rows = [
      { id: "1", title: "General Cafe Bar Medellín", latitude: 1, longitude: 1 },
      { id: "2", title: "Café Noir Bar & Lounge", latitude: 1, longitude: 1 },
      { id: "3", title: "SKYBAR Bar & Lounge", latitude: 1, longitude: 1 },
      { id: "4", title: "Rituales Compañía de Café", latitude: 1, longitude: 1 },
      { id: "5", title: "Gardenia Brunch & Coffee", latitude: 1, longitude: 1 },
      { id: "6", title: "rivertown conquistadores", latitude: 1, longitude: 1 },
    ] satisfies GroundedPlaceResult[];

    const filtered = filterCafeGroundingRows(rows, "top cafes in medellin");
    expect(filtered.map((row) => row.title)).toEqual([
      "Rituales Compañía de Café",
      "Gardenia Brunch & Coffee",
    ]);
  });

  it("forces café filter when intent=cafe even if query is rewritten", () => {
    const rows = [
      { id: "1", title: "Café Noir Bar & Lounge", latitude: 1, longitude: 1 },
      { id: "2", title: "Velasquez Café & Brunch Laureles", latitude: 1, longitude: 1 },
    ] satisfies GroundedPlaceResult[];

    const filtered = filterCafeGroundingRows(
      rows,
      "highly rated venues in El Poblado",
      "cafe",
    );
    expect(filtered.map((row) => row.title)).toEqual([
      "Velasquez Café & Brunch Laureles",
    ]);
  });

  it("detects café intent from normalized query rewrite", () => {
    expect(
      isCafeGroundingIntent("highly rated venues in El Poblado", undefined),
    ).toBe(false);
    expect(isCafeGroundingIntent("list cafes in medellin")).toBe(true);
  });

  it("leaves non-café searches untouched", () => {
    const rows = [
      { id: "1", title: "General Cafe Bar Medellín", latitude: 1, longitude: 1 },
    ] satisfies GroundedPlaceResult[];

    expect(filterCafeGroundingRows(rows, "museums in centro")).toEqual(rows);
  });

  it("detects nightlife discovery queries", () => {
    expect(isNightlifeGroundingQuery("salsa bars in Poblado")).toBe(true);
    expect(
      isNightlifeGroundingQuery(
        "Where can I find salsa bars locals go to at night in Poblado?",
      ),
    ).toBe(true);
    expect(isNightlifeGroundingQuery("quiet cafés near Laureles")).toBe(false);
    expect(resolveVenueGroundingKind("rooftop cocktails provenza")).toBe(
      "nightlife",
    );
  });

  it("prefers nightlife titles for nightlife queries", () => {
    const rows = [
      { id: "1", title: "Gardenia Brunch & Coffee", latitude: 1, longitude: 1 },
      { id: "2", title: "Salsa Bar El Tibiri", latitude: 1, longitude: 1 },
      { id: "3", title: "Rooftop Lounge Medellín", latitude: 1, longitude: 1 },
    ] satisfies GroundedPlaceResult[];

    const filtered = filterNightlifeGroundingRows(
      rows,
      "salsa bars locals go to in Medellín",
    );
    expect(filtered.map((r) => r.title)).toEqual([
      "Salsa Bar El Tibiri",
      "Rooftop Lounge Medellín",
    ]);
  });

  it("forces nightlife filter when intent=nightlife even if query is generic", () => {
    expect(
      isNightlifeGroundingIntent("highly rated venues in El Poblado", "nightlife"),
    ).toBe(true);
    const rows = [
      { id: "1", title: "Gardenia Brunch & Coffee", latitude: 1, longitude: 1 },
      { id: "2", title: "Rooftop Lounge Medellín", latitude: 1, longitude: 1 },
    ] satisfies GroundedPlaceResult[];

    const filtered = filterNightlifeGroundingRows(
      rows,
      "highly rated venues in El Poblado",
      "nightlife",
    );
    expect(filtered.map((r) => r.title)).toEqual(["Rooftop Lounge Medellín"]);
    expect(
      resolveVenueGroundingKind("quiet cafés near Laureles", "nightlife"),
    ).toBe("nightlife");
  });

  it("accepts optional intent on tool inputSchema", () => {
    expect(
      searchGroundedPlacesInputSchema.parse({
        query: "rooftop cocktails Provenza",
        intent: "nightlife",
      }).intent,
    ).toBe("nightlife");
    expect(() =>
      venueGroundingIntentSchema.parse("restaurant"),
    ).toThrow();
  });

  it("aligns attribution by placeUri after café filtering drops rows (B1)", () => {
    const adkAttribution = [
      {
        source: "maps",
        placeUri: "https://maps.google.com/?cid=bar",
        title: "Wrong Bar Title",
      },
      {
        source: "maps",
        placeUri: "https://maps.google.com/?cid=cafe",
        title: "Stale Café Title",
      },
    ];
    const results = [
      {
        title: "Gardenia Brunch & Coffee",
        mapsUrl: "https://maps.google.com/?cid=cafe",
      },
    ];
    expect(alignGroundedAttribution(results, adkAttribution)).toEqual([
      {
        source: "maps",
        placeUri: "https://maps.google.com/?cid=cafe",
        title: "Gardenia Brunch & Coffee",
      },
    ]);
  });
});
