import { describe, expect, it } from "vitest";
import { classifySearchRoute, needsSearchGrounding } from "./search-intent-router";

describe("needsSearchGrounding", () => {
  it("returns false for café map queries", () => {
    expect(needsSearchGrounding("quiet cafés near Laureles")).toBe(false);
    expect(classifySearchRoute("quiet cafés near Laureles")).toBe("maps");
  });

  it("returns true for freshness language", () => {
    expect(needsSearchGrounding("rooftop events Poblado this Friday")).toBe(
      true,
    );
    expect(classifySearchRoute("events tonight in Medellín")).toBe("search");
  });

  it("returns true when SQL empty and freshness + event-like", () => {
    expect(
      needsSearchGrounding("concerts this weekend", { sqlEventCount: 0 }),
    ).toBe(true);
    expect(
      needsSearchGrounding("music festival tickets", { sqlEventCount: 0 }),
    ).toBe(false);
  });

  it("returns false when SQL has events and query is generic map", () => {
    expect(
      needsSearchGrounding("events in Poblado", { sqlEventCount: 3 }),
    ).toBe(false);
  });

  it("skips web when SQL has enough rows and only freshness wording", () => {
    expect(
      needsSearchGrounding("salsa this weekend", { sqlEventCount: 5 }),
    ).toBe(false);
  });

  it("covers router matrix samples", () => {
    expect(classifySearchRoute("latest official lineup")).toBe("search");
    expect(classifySearchRoute("rentals in Laureles under 80")).toBe("maps");
    expect(classifySearchRoute("music festival tickets")).toBe(
      "supabase_events",
    );
  });
});
