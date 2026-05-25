import { describe, expect, it } from "vitest";

/** Mirrors grounded card props from search-tool-renders groundedRender. */
export function groundedPlaceCardView(row: {
  id: string;
  title: string;
  mapsUrl?: string;
}) {
  return {
    key: row.id,
    title: row.title,
    mapsUrl: row.mapsUrl,
    hasMapsLink: Boolean(row.mapsUrl),
  };
}

describe("groundedPlaceCardView", () => {
  it("exposes real title and mapsUrl for café cards", () => {
    const view = groundedPlaceCardView({
      id: "ChIJabc",
      title: "Pausa Coffee & Brunch",
      mapsUrl: "https://maps.google.com/?cid=123",
    });
    expect(view.title).toBe("Pausa Coffee & Brunch");
    expect(view.hasMapsLink).toBe(true);
    expect(view.mapsUrl).toContain("maps.google.com");
  });
});
