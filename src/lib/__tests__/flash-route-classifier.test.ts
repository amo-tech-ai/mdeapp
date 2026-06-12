import { afterEach, describe, expect, it, vi } from "vitest";
import {
  classifyRouteWithFlash,
  isFlashRouteEnabled,
  mergeRegexAndFlashClassification,
  shouldInvokeFlashClassifier,
} from "../flash-route-classifier";
import { classifyRouterIntent } from "../router-intent";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";

const mockedGenerateObject = vi.mocked(generateObject);

describe("isFlashRouteEnabled", () => {
  afterEach(() => {
    delete process.env.FLASH_ROUTE;
  });

  it("is false unless FLASH_ROUTE=1", () => {
    expect(isFlashRouteEnabled()).toBe(false);
    process.env.FLASH_ROUTE = "1";
    expect(isFlashRouteEnabled()).toBe(true);
  });
});

describe("shouldInvokeFlashClassifier", () => {
  afterEach(() => {
    delete process.env.FLASH_ROUTE;
  });

  it("skips when flag off", () => {
    const regex = classifyRouterIntent("suggest venues for party in Medellín 30 people");
    expect(shouldInvokeFlashClassifier(regex, "suggest venues for party in Medellín 30 people")).toBe(
      false,
    );
  });

  it("runs in ambiguous band when flag on", () => {
    process.env.FLASH_ROUTE = "1";
    const query = "quiet rooftop dinner in Provenza";
    const regex = classifyRouterIntent(query);
    expect(regex.confidence).toBeGreaterThanOrEqual(0.5);
    expect(regex.confidence).toBeLessThan(0.85);
    expect(shouldInvokeFlashClassifier(regex, query)).toBe(true);
  });

  it("skips high-confidence venue_booking regex", () => {
    process.env.FLASH_ROUTE = "1";
    const query = "book Mamacita for 30";
    const regex = classifyRouterIntent(query);
    expect(regex.routingTarget).toBe("event_venue_booking");
    expect(regex.confidence).toBeGreaterThanOrEqual(0.85);
    expect(shouldInvokeFlashClassifier(regex, query)).toBe(false);
  });
});

describe("mergeRegexAndFlashClassification", () => {
  it("overrides event_discovery with venue_booking from flash", () => {
    const regex = classifyRouterIntent("music events in Medellín this weekend");
    const merged = mergeRegexAndFlashClassification(regex, {
      intent: "venue_booking",
      confidence: 0.88,
      topicShift: true,
      slots: { partySize: 30, neighborhood: "Medellín" },
    });
    expect(merged.intent).toBe("venue_booking");
    expect(merged.routingTarget).toBe("event_venue_booking");
    expect(merged.topicShift).toBe(true);
  });

  it("keeps regex when flash confidence is low", () => {
    const regex = classifyRouterIntent("salsa events this weekend");
    const merged = mergeRegexAndFlashClassification(regex, {
      intent: "restaurant_discovery",
      confidence: 0.4,
      topicShift: false,
      slots: {},
    });
    expect(merged.intent).toBe("event_discovery");
  });
});

describe("classifyRouteWithFlash", () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  });

  it("returns null without API key", async () => {
    const out = await classifyRouteWithFlash("somewhere for a birthday");
    expect(out).toBeNull();
    expect(mockedGenerateObject).not.toHaveBeenCalled();
  });

  it("parses structured flash output", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    mockedGenerateObject.mockResolvedValueOnce({
      object: {
        intent: "venue_booking",
        confidence: 0.9,
        topicShift: false,
        slots: { eventType: "birthday" },
      },
    } as never);

    const out = await classifyRouteWithFlash("somewhere for a birthday");
    expect(out?.intent).toBe("venue_booking");
    expect(out?.slots.eventType).toBe("birthday");
  });
});
