import { describe, it, expect } from "vitest";
import { EVENT_CLARIFY_MESSAGE } from "@/lib/event-clarify-copy";
import { shouldInstantEventClarify } from "@/lib/event-search-fast-path";

describe("event clarify local UI", () => {
  it("canned clarify copy matches EVP-006", () => {
    expect(EVENT_CLARIFY_MESSAGE).toContain("What kind of events are you looking for?");
    expect(EVENT_CLARIFY_MESSAGE).toContain("Music");
  });

  it("generic query triggers instant clarify gate", () => {
    expect(shouldInstantEventClarify("list events in medellin", {})).toBe(true);
  });
});
