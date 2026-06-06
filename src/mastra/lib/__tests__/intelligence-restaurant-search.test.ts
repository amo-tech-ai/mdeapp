import { describe, it, expect } from "vitest";
import {
  computeSignalBoost,
  parseIntelligenceSlots,
} from "../intelligence-restaurant-search";

/** Minimal venue_signals row for DATA-041-R04 boost tests (prod-shaped scores). */
const carmen = {
  quiet_score: 0.7,
  date_night_score: 0.95,
  rooftop_score: 0.4,
  digital_nomad_score: 0.25,
  wifi_score: 0.3,
  cocktail_score: 0.85,
  brunch_score: 0.5,
  hidden_gem_score: 0.45,
  nightlife_score: 0.35,
  local_authenticity_score: 0.65,
  touristy_score: 0.7,
  service_score: 0.92,
  value_score: 0.55,
  confidence: 0.93,
};

const mondongos = {
  quiet_score: 0.55,
  date_night_score: 0.65,
  rooftop_score: 0.3,
  digital_nomad_score: 0.35,
  wifi_score: 0.4,
  cocktail_score: 0.55,
  brunch_score: 0.6,
  hidden_gem_score: 0.7,
  nightlife_score: 0.45,
  local_authenticity_score: 0.88,
  touristy_score: 0.25,
  service_score: 0.82,
  value_score: 0.9,
  confidence: 0.89,
};

const relato = {
  quiet_score: 0.82,
  date_night_score: 0.78,
  rooftop_score: 0.91,
  digital_nomad_score: 0.35,
  wifi_score: 0.4,
  cocktail_score: 0.75,
  brunch_score: 0.55,
  hidden_gem_score: 0.4,
  nightlife_score: 0.45,
  local_authenticity_score: 0.72,
  touristy_score: 0.55,
  service_score: 0.85,
  value_score: 0.7,
  confidence: 0.92,
};

describe("parseIntelligenceSlots (DATA-041-R04)", () => {
  it("extracts Provenza rooftop + quiet from GQ-S01", () => {
    const slots = parseIntelligenceSlots("quiet rooftop Provenza");
    expect(slots.neighborhood).toBe("Provenza");
    expect(slots.wantsRooftop).toBe(true);
    expect(slots.wantsQuiet).toBe(true);
  });

  it("decouples romantic from cocktail", () => {
    const slots = parseIntelligenceSlots("romantic dinner Medellín");
    expect(slots.wantsDateNight).toBe(true);
    expect(slots.wantsCocktails).toBeUndefined();
  });

  it("detects anti-touristy and hidden gem", () => {
    const slots = parseIntelligenceSlots("local authentic not touristy Laureles");
    expect(slots.wantsAntiTouristy).toBe(true);
    expect(slots.wantsHiddenGem).toBe(true);
  });

  it("detects value and service slots", () => {
    expect(parseIntelligenceSlots("dinner under $80").wantsValue).toBe(true);
    expect(parseIntelligenceSlots("great service Poblado").wantsService).toBe(true);
  });
});

describe("computeSignalBoost (DATA-041-R04)", () => {
  it("date_night beats cocktail-only for romantic queries", () => {
    const romantic = parseIntelligenceSlots("romantic dinner");
    const cocktailOnly = { wantsCocktails: true };
    const romanticBoost = computeSignalBoost(romantic, carmen);
    const cocktailBoost = computeSignalBoost(cocktailOnly, carmen);
    expect(romanticBoost).toBeGreaterThan(cocktailBoost);
  });

  it("anti-touristy penalizes high touristy_score (Mondongos vs Carmen)", () => {
    const slots = parseIntelligenceSlots("local authentic not touristy Laureles");
    const mondBoost = computeSignalBoost(slots, mondongos);
    const carmenBoost = computeSignalBoost(slots, carmen);
    expect(mondBoost).toBeGreaterThan(carmenBoost);
  });

  it("value and service slots add boost", () => {
    const valueBoost = computeSignalBoost({ wantsValue: true }, mondongos);
    const serviceBoost = computeSignalBoost({ wantsService: true }, carmen);
    expect(valueBoost).toBeGreaterThan(0);
    expect(serviceBoost).toBeGreaterThan(0);
  });

  it("caps nomad double-count at 0.15", () => {
    const highNomad = {
      ...carmen,
      digital_nomad_score: 0.95,
      wifi_score: 0.92,
    };
    const boost = computeSignalBoost({ wantsNomad: true }, highNomad);
    expect(boost).toBeLessThanOrEqual(0.15 + 0.001);
  });

  it("GQ-S01 rooftop+quiet boost unchanged for Relato-shaped row", () => {
    const slots = parseIntelligenceSlots("quiet rooftop Provenza");
    const boost = computeSignalBoost(slots, relato);
    expect(boost).toBeCloseTo(0.91 * 0.35 + 0.82 * 0.25, 2);
  });

  it("returns 0 when confidence below 0.6", () => {
    const boost = computeSignalBoost(
      { wantsRooftop: true },
      { ...relato, confidence: 0.5 },
    );
    expect(boost).toBe(0);
  });
});
