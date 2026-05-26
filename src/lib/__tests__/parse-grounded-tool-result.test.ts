import { describe, expect, it } from "vitest";
import {
  cleanGroundingAttributionTitle,
  dedupeAttributionForDisplay,
  parseGroundedToolResult,
  resolveGroundedTitle,
  shouldShowGroundingAttribution,
} from "../parse-grounded-tool-result";

describe("resolveGroundedTitle", () => {
  it("keeps real MCP title", () => {
    expect(resolveGroundedTitle({ title: "Pausa Coffee & Brunch" }, 0, [])).toBe(
      "Pausa Coffee & Brunch",
    );
  });

  it("replaces generic Place from matching attribution index", () => {
    const mapsUrl = "https://maps.google.com/?cid=1";
    expect(
      resolveGroundedTitle(
        { title: "Place" },
        0,
        [
          {
            placeUri: mapsUrl,
            title: "Café Euge - Google Maps",
          },
        ],
        mapsUrl,
      ),
    ).toBe("Café Euge");
  });
});

describe("parseGroundedToolResult", () => {
  it("parses JSON string envelope from AG-UI", () => {
    const parsed = parseGroundedToolResult(
      JSON.stringify({
        source: "grounding",
        results: [
          {
            id: "ChIJ1",
            title: "Place",
            latitude: 6.24,
            longitude: -75.58,
            mapsUrl: "https://maps.google.com/?cid=1",
          },
        ],
        attribution: [
          {
            source: "google_maps_grounding",
            placeUri: "https://maps.google.com/?cid=1",
            title: "Botswana Café & Brunch - Google Maps",
          },
        ],
      }),
    );
    expect(parsed.results[0]?.title).toBe("Botswana Café & Brunch");
    expect(parsed.results[0]?.mapsUrl).toContain("maps.google.com");
  });

  it("preserves title and mapsUrl from grounded tool output", () => {
    const parsed = parseGroundedToolResult({
      source: "grounding",
      results: [
        {
          id: "ChIJabc",
          title: "Café Namazzi",
          latitude: 6.24,
          longitude: -75.59,
          placeId: "ChIJabc",
          mapsUrl: "https://maps.google.com/?cid=99",
        },
      ],
      attribution: [
        {
          source: "google_maps_grounding",
          placeUri: "https://maps.google.com/?cid=99",
        },
      ],
    });
    expect(parsed.results[0]?.title).toBe("Café Namazzi");
    expect(parsed.results[0]?.mapsUrl).toBe("https://maps.google.com/?cid=99");
  });

  it("parses enriched fields from MAP-018B sidecar", () => {
    const parsed = parseGroundedToolResult({
      source: "grounding",
      results: [
        {
          id: "ChIJabc",
          title: "Pergamino",
          latitude: 6.24,
          longitude: -75.59,
          mapsUrl: "https://maps.google.com/?cid=99",
          rating: 4.8,
          userRatingCount: 1700,
          priceLevel: "PRICE_LEVEL_MODERATE",
          openNow: true,
          photoName: "places/ChIJ/photos/x",
          fieldMaskVersion: "details-v2-mvp-2026-05-20",
        },
      ],
    });
    expect(parsed.results[0]?.rating).toBe(4.8);
    expect(parsed.results[0]?.photoName).toContain("photos/");
  });
});

describe("attribution display helpers", () => {
  it("strips Google Maps suffix from attribution titles", () => {
    expect(cleanGroundingAttributionTitle("Pausa Coffee - Google Maps")).toBe(
      "Pausa Coffee",
    );
  });

  it("hides duplicate Maps links when cards already have mapsUrl", () => {
    const url = "https://maps.google.com/?cid=1";
    const deduped = dedupeAttributionForDisplay(
      [{ placeUri: url, source: "google_maps_grounding" }],
      [url],
    );
    expect(deduped).toHaveLength(0);
    expect(shouldShowGroundingAttribution([{ placeUri: url }], [url])).toBe(
      false,
    );
  });
});
