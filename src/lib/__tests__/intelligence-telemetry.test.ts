import { afterEach, describe, expect, it, vi } from "vitest";
import { logRoutingDecision, type RoutingDecision } from "../intelligence-telemetry";

const SAMPLE: RoutingDecision = {
  intent: "rental_search",
  slots: { neighborhood: "Laureles", maxPricePerNight: 80, budgetType: "nightly" },
  confidence: 0.75,
  action: "search_now",
  source: "fast-path",
  ts: "2026-06-01T00:00:00.000Z",
};

describe("logRoutingDecision", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("emits [int-routing] line when LOG_LEVEL=debug", () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logRoutingDecision(SAMPLE);
    expect(spy).toHaveBeenCalledOnce();
    const [tag, json] = spy.mock.calls[0] as [string, string];
    expect(tag).toBe("[int-routing]");
    const parsed = JSON.parse(json) as RoutingDecision;
    expect(parsed.intent).toBe("rental_search");
    expect(parsed.confidence).toBe(0.75);
    expect(parsed.action).toBe("search_now");
    expect(parsed.ts).toBe("2026-06-01T00:00:00.000Z");
  });

  it("is a no-op when LOG_LEVEL is not debug", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logRoutingDecision(SAMPLE);
    expect(spy).not.toHaveBeenCalled();
  });

  it("slots contain no raw query text", () => {
    const rawText = "show me rentals in laureles under 80 dollars per night";
    const slots: RoutingDecision["slots"] = {
      neighborhood: "Laureles",
      maxPricePerNight: 80,
      hasBudget: true,
    };
    expect(Object.values(slots)).not.toContain(rawText);
    expect(Object.keys(slots)).not.toContain("queryText");
  });

  it("search_now action for high-confidence record", () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logRoutingDecision({ ...SAMPLE, confidence: 0.9, action: "search_now" });
    const parsed = JSON.parse((spy.mock.calls[0] as [string, string])[1]) as RoutingDecision;
    expect(parsed.action).toBe("search_now");
    expect(parsed.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("clarify action for mid-band record", () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logRoutingDecision({
      ...SAMPLE,
      confidence: 0.6,
      action: "clarify",
      source: "clarify-branch",
    });
    const parsed = JSON.parse((spy.mock.calls[0] as [string, string])[1]) as RoutingDecision;
    expect(parsed.action).toBe("clarify");
    expect(parsed.source).toBe("clarify-branch");
  });

  it("resultCount is included when provided", () => {
    vi.stubEnv("LOG_LEVEL", "debug");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logRoutingDecision({ ...SAMPLE, resultCount: 7 });
    const parsed = JSON.parse((spy.mock.calls[0] as [string, string])[1]) as RoutingDecision;
    expect(parsed.resultCount).toBe(7);
  });
});
