import { describe, expect, it } from "vitest";
import { buildHostFocusSummary } from "@/lib/host/host-focus-summary";

const EMPTY = {
  currentOrganization: null,
  currentEvent: null,
  currentVenue: null,
  currentFilters: {},
  currentDateRange: null,
};

describe("buildHostFocusSummary", () => {
  it("is empty when nothing is in focus", () => {
    expect(buildHostFocusSummary(EMPTY)).toEqual({});
  });

  it("includes only the populated focus fields", () => {
    const summary = buildHostFocusSummary({
      ...EMPTY,
      currentEvent: { id: "evt-a", name: "Event A" },
    });
    expect(summary).toEqual({ event: { id: "evt-a", name: "Event A" } });
    expect(summary).not.toHaveProperty("organization");
    expect(summary).not.toHaveProperty("venue");
  });

  it("omits empty filters but keeps non-empty ones", () => {
    expect(buildHostFocusSummary({ ...EMPTY, currentFilters: {} })).toEqual({});
    expect(
      buildHostFocusSummary({ ...EMPTY, currentFilters: { status: "published" } }),
    ).toEqual({ filters: { status: "published" } });
  });

  it("carries the full workspace focus when everything is set", () => {
    const summary = buildHostFocusSummary({
      currentOrganization: { id: "org-1", name: "Org One" },
      currentEvent: { id: "evt-a", name: "Event A" },
      currentVenue: { id: "ven-9", name: "Venue Nine" },
      currentFilters: { city: "Medellín" },
      currentDateRange: { from: "2026-06-01", to: "2026-06-30" },
    });
    expect(summary).toEqual({
      organization: { id: "org-1", name: "Org One" },
      event: { id: "evt-a", name: "Event A" },
      venue: { id: "ven-9", name: "Venue Nine" },
      filters: { city: "Medellín" },
      dateRange: { from: "2026-06-01", to: "2026-06-30" },
    });
  });
});
