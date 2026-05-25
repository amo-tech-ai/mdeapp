import { describe, expect, it } from "vitest";
import { mapAdkGroundingPins } from "./map-adk-grounding-pins";

describe("mapAdkGroundingPins", () => {
  it("maps MCP pins with real titles", () => {
    const rows = mapAdkGroundingPins({
      places: [],
      pins: [
        {
          id: "ChIJ1",
          title: "Café Euge",
          latitude: 6.24,
          longitude: -75.58,
          placeId: "ChIJ1",
          mapsUrl: "https://maps.google.com/?cid=1",
        },
      ],
      attribution: [
        {
          source: "google_maps_grounding",
          placeUri: "https://maps.google.com/?cid=1",
        },
      ],
      citations: [],
      confidence: 0.9,
      metadata: { source: "grounding-lite" },
    });
    expect(rows[0]?.title).toBe("Café Euge");
    expect(rows[0]?.mapsUrl).toContain("maps.google.com");
  });

  it("recovers title from attribution when pin title is Place", () => {
    const rows = mapAdkGroundingPins({
      places: [],
      pins: [
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
          title: "Pausa Coffee & Brunch - Google Maps",
        },
      ],
      citations: [],
      confidence: 0.9,
      metadata: {},
    });
    expect(rows[0]?.title).toBe("Pausa Coffee & Brunch");
  });

  it("falls back to places[] when pins[] empty", () => {
    const rows = mapAdkGroundingPins({
      places: [
        {
          id: "ChIJ2",
          title: "Café Namazzi",
          latitude: 6.23,
          longitude: -75.59,
          mapsUrl: "https://maps.google.com/?cid=2",
        },
      ],
      pins: [],
      attribution: [],
      citations: [],
      confidence: 0.9,
      metadata: {},
    });
    expect(rows[0]?.title).toBe("Café Namazzi");
  });
});
