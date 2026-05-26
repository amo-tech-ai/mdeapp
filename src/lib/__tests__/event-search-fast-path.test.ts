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

  it("does not fast path generic first turn", () => {
    expect(canFastPathEventSearch("list events medellin", {})).toBe(false);
  });
});
