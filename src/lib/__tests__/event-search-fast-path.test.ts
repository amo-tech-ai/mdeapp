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
});
