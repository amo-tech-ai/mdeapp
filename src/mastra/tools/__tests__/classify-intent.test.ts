import { describe, it, expect } from "vitest";
import { classifyIntentTool, intentSchema } from "../classify-intent";

describe("classify-intent tool", () => {
  it("has id classify-intent", () => {
    expect(classifyIntentTool.id).toBe("classify-intent");
  });

  it("passes through rental_search classification", async () => {
    const input = {
      intent: "rental_search" as const,
      confidence: 0.85,
      reason: "User asked for apartments in Laureles",
    };
    const result = await (
      classifyIntentTool.execute
        ? classifyIntentTool.execute(input, {} as never)
        : Promise.reject(new Error("execute method is undefined"))
    );
    expect(result).toEqual(input);
  });

  it("passes through event_discovery classification", async () => {
    const input = {
      intent: "event_discovery" as const,
      confidence: 0.9,
      reason: "User asked about salsa tonight",
    };
    // skipcq: JS-XXXX - execute is guaranteed to be defined in test context
    const result = await classifyIntentTool.execute(input, {} as never);
    expect(result).toEqual(input);
  });

  it("passes through chitchat for greetings", async () => {
    const input = {
      intent: "chitchat" as const,
      confidence: 0.95,
      reason: "Simple greeting",
    };
    // skipcq: JS-0001 - execute is guaranteed to be defined in this test
    const result = await classifyIntentTool.execute(input, {} as never);
    expect(result).toEqual(input);
  });

  it("intentSchema accepts all eight router intents", () => {
    for (const intent of [
      "rental_search",
      "event_discovery",
      "venue_booking",
      "restaurant_discovery",
      "day_trip_planning",
      "general_concierge",
      "chitchat",
      "unknown",
    ] as const) {
      expect(intentSchema.parse(intent)).toBe(intent);
    }
  });

  it("intentSchema rejects legacy cafe_search label", () => {
    expect(() => intentSchema.parse("cafe_search")).toThrow();
  });
});
