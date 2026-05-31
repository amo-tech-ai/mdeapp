import { describe, expect, it } from "vitest";
import {
  buildEventSearchParams,
  canFastPathEventSearch,
  shouldInstantEventClarify,
} from "@/lib/event-search-fast-path";
import type { ConciergeWorkingMemory } from "@/lib/types";

describe("event-search-fast-path", () => {
  it("instant clarify for generic city-only query", () => {
    expect(shouldInstantEventClarify("list events medellin", {})).toBe(true);
    expect(
      shouldInstantEventClarify("list events medellin", {
        lastEventQuery: { genericAskPending: true },
      }),
    ).toBe(false);
  });

  it("fast path for category-specific query", () => {
    expect(canFastPathEventSearch("music events in Medellín", {})).toBe(true);
    const params = buildEventSearchParams("music events in Medellín", {});
    expect(params?.category).toBe("music");
  });

  it("fast path after clarify when user names category", () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: { genericAskPending: true },
    };
    expect(canFastPathEventSearch("music", memory)).toBe(true);
    expect(buildEventSearchParams("music", memory)?.category).toBe("music");
  });

  it("category-only clarify answer clears stale dateWindow", () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: {
        genericAskPending: true,
        dateWindow: "this_weekend",
      },
    };
    const params = buildEventSearchParams("music", memory);
    expect(params).toEqual({
      category: "music",
      dateWindow: "any",
      limit: 10,
    });
  });

  it("category-only clarify answer clears stale neighborhood", () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: {
        genericAskPending: true,
        neighborhood: "El Poblado",
        dateWindow: "tonight",
      },
    };
    const params = buildEventSearchParams("music", memory);
    expect(params).toEqual({
      category: "music",
      dateWindow: "any",
      limit: 10,
    });
  });

  it('explicit "music this weekend" keeps this_weekend after clarify', () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: { genericAskPending: true, dateWindow: "tonight" },
    };
    const params = buildEventSearchParams("music this weekend", memory);
    expect(params?.category).toBe("music");
    expect(params?.dateWindow).toBe("this_weekend");
    expect(params?.neighborhood).toBeUndefined();
  });

  it('explicit "music in Poblado" keeps neighborhood after clarify', () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: {
        genericAskPending: true,
        dateWindow: "this_weekend",
      },
    };
    const params = buildEventSearchParams("music in Poblado", memory);
    expect(params?.category).toBe("music");
    expect(params?.neighborhood).toBe("El Poblado");
    expect(params?.dateWindow).toBe("this_weekend");
  });

  it("does not fast path generic first turn", () => {
    expect(canFastPathEventSearch("list events medellin", {})).toBe(false);
  });

  it("does not fast path rental queries with neighborhood names", () => {
    expect(
      canFastPathEventSearch("1BR in Laureles under $80/night", {}),
    ).toBe(false);
    expect(buildEventSearchParams("1BR in Laureles under $80/night", {})).toBe(
      null,
    );
  });

  it("does not fast path restaurant/café venue queries", () => {
    expect(canFastPathEventSearch("best cafes in Poblado", {})).toBe(false);
    expect(canFastPathEventSearch("restaurants in Poblado", {})).toBe(false);
    expect(buildEventSearchParams("best cafes in Poblado", {})).toBe(null);
  });

  it("does not fast path rental when stale event memory exists", () => {
    const memory: ConciergeWorkingMemory = {
      lastEventQuery: { category: "music", dateWindow: "any" },
    };
    expect(
      canFastPathEventSearch("1BR in Laureles under $80/night", memory),
    ).toBe(false);
  });

  it("still fast paths genuine event queries with neighborhoods", () => {
    expect(canFastPathEventSearch("music in Poblado", {})).toBe(true);
    expect(canFastPathEventSearch("nightlife this weekend in Poblado", {})).toBe(
      true,
    );
    expect(buildEventSearchParams("salsa events in Laureles", {})?.category).toBe(
      "music",
    );
  });

  describe("UX-019 Option B memory guard (UX-T-019)", () => {
    const afterSalsaMemory: ConciergeWorkingMemory = {
      lastEventQuery: { category: "music", dateWindow: "any" },
    };

    it("Option A regression: dinner after event memory does not fast-path", () => {
      expect(
        buildEventSearchParams("quiet rooftop dinner in Provenza", afterSalsaMemory),
      ).toBeNull();
      expect(
        canFastPathEventSearch("quiet rooftop dinner in Provenza", afterSalsaMemory),
      ).toBe(false);
    });

    it("L55: Provenza tonight does not inherit stale category from prior salsa search", () => {
      const params = buildEventSearchParams("Provenza tonight", afterSalsaMemory);
      expect(params?.category).toBeUndefined();
      expect(params?.dateWindow).toBe("tonight");
    });

    it("L81: bare follow-up does not replay last event query", () => {
      expect(buildEventSearchParams("ok", afterSalsaMemory)).toBeNull();
      expect(canFastPathEventSearch("and there?", afterSalsaMemory)).toBe(false);
    });
  });
});
