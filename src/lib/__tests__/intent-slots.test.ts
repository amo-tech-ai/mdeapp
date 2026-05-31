import { describe, it, expect } from "vitest";
import {
  canDeterministicSearch,
  confidenceToAction,
  extractIntentSlotsHeuristic,
  CONFIDENCE_CLARIFY_MIN,
  CONFIDENCE_FAST_PATH,
} from "../intent-slots";

describe("confidenceToAction", () => {
  it("maps bands per INT-001 / agent-plan", () => {
    expect(confidenceToAction(CONFIDENCE_FAST_PATH)).toBe("search_now");
    expect(confidenceToAction(0.9)).toBe("search_now");
    expect(confidenceToAction(CONFIDENCE_CLARIFY_MIN)).toBe("clarify");
    expect(confidenceToAction(0.75)).toBe("clarify");
    expect(confidenceToAction(0.49)).toBe("agent");
  });
});

describe("extractIntentSlotsHeuristic — rental hero", () => {
  it("parses monthly June Medellín budget into clarify band (not canned 0.5 only)", () => {
    const out = extractIntentSlotsHeuristic(
      "list rentals in june 1 to 30 $1000 medellin",
    );
    expect(out.intent).toBe("rental_search");
    expect(out.slots.budget?.maxPricePerNight).toBeGreaterThan(0);
    expect(out.slots.budget?.budgetType).toBe("monthly");
    expect(out.slots.dateRange?.label).toBe("June 1–30");
    expect(out.slots.cityWide).toBe(true);
    expect(out.confidence).toBeGreaterThanOrEqual(0.5);
    expect(out.action).not.toBe("agent");
  });

  it("June 5 to 7 label uses parsed numbers not hardcoded range", () => {
    const out = extractIntentSlotsHeuristic(
      "apartment june 5 to 7 in Laureles under $100/night",
    );
    expect(out.intent).toBe("rental_search");
    expect(out.slots.dateRange?.label).toBe("June 5–7");
    expect(out.slots.dateRange?.start).toBe("2026-06-05");
    expect(out.slots.dateRange?.end).toBe("2026-06-07");
  });

  it("fast-path 1BR Laureles $80/night", () => {
    const out = extractIntentSlotsHeuristic("1BR in Laureles under $80/night");
    expect(out.intent).toBe("rental_search");
    expect(out.slots.neighborhood).toBe("Laureles");
    expect(out.slots.bedrooms).toBe(1);
    expect(out.slots.budget?.maxPricePerNight).toBe(80);
    expect(out.confidence).toBeGreaterThanOrEqual(CONFIDENCE_FAST_PATH);
    expect(canDeterministicSearch(out)).toBe(true);
  });
});

describe("extractIntentSlotsHeuristic — café", () => {
  it("quiet café Laureles remote work → cafe_search", () => {
    const out = extractIntentSlotsHeuristic(
      "quiet café in Laureles for remote work tomorrow",
    );
    expect(out.intent).toBe("cafe_search");
    expect(out.slots.neighborhood).toBe("Laureles");
    expect(out.slots.needs).toContain("remote_work");
    expect(out.confidence).toBeGreaterThanOrEqual(CONFIDENCE_FAST_PATH);
  });
});

describe("extractIntentSlotsHeuristic — events", () => {
  it("salsa events this weekend near Provenza", () => {
    const out = extractIntentSlotsHeuristic(
      "salsa events this weekend near Provenza",
    );
    expect(out.intent).toBe("event_discovery");
    expect(out.slots.neighborhood).toBe("Provenza");
    expect(out.slots.vibes).toContain("salsa");
    expect(out.slots.dateRange?.label).toBe("this weekend");
  });
});

describe("extractIntentSlotsHeuristic — restaurant", () => {
  it("quiet rooftop Provenza → restaurant_search with queryText", () => {
    const out = extractIntentSlotsHeuristic("quiet rooftop Provenza");
    expect(out.intent).toBe("restaurant_search");
    expect(out.slots.neighborhood).toBe("Provenza");
    expect(out.slots.queryText).toContain("rooftop");
  });

  it("extracts timeOfDay, groupSize, occasion from restaurant query", () => {
    const out = extractIntentSlotsHeuristic(
      "dinner for 4 people date night restaurant El Poblado",
    );
    expect(out.intent).toBe("restaurant_search");
    expect(out.slots.timeOfDay).toBe("dinner");
    expect(out.slots.groupSize).toBe(4);
    expect(out.slots.occasion).toBe("date-night");
    expect(out.slots.neighborhood).toBe("El Poblado");
  });

  it("extracts brunch and friends occasion", () => {
    const out = extractIntentSlotsHeuristic(
      "brunch restaurant with friends in Laureles",
    );
    expect(out.intent).toBe("restaurant_search");
    expect(out.slots.timeOfDay).toBe("brunch");
    expect(out.slots.occasion).toBe("friends");
  });
});
