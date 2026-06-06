import { describe, expect, it } from "vitest";
import {
  analyzeVenueIntelligenceQuery,
  getVenueIntelligenceClarification,
  shouldClarifyVenueIntelligence,
} from "../intelligence-restaurant-venue-wrapper";

describe("INT-021 — Restaurant & Venue Intelligence Wrapper", () => {
  describe("restaurant intent → SEARCH-003 restaurant_hybrid", () => {
    it("romantic dinner in Poblado", () => {
      const a = analyzeVenueIntelligenceQuery("romantic dinner in Poblado");
      expect(a.route).toBe("restaurant_hybrid");
      expect(a.intent).toBe("restaurant_search");
      expect(a.action).toBe("search_now");
      expect(a.slots.wantsDateNight).toBe(true);
      expect(a.slots.neighborhood).toBe("El Poblado");
      expect(a.rankReasonHints).toContain("date_night_score");
      expect(a.userExplanation).toMatch(/restaurants/i);
    });

    it("quiet rooftop in Provenza", () => {
      const a = analyzeVenueIntelligenceQuery("quiet rooftop in Provenza");
      expect(a.route).toBe("restaurant_hybrid");
      expect(a.slots.wantsRooftop).toBe(true);
      expect(a.slots.wantsQuiet).toBe(true);
      expect(a.rankReasonHints).toEqual(
        expect.arrayContaining(["rooftop_score", "quiet_score"]),
      );
    });

    it("local not touristy Laureles", () => {
      const a = analyzeVenueIntelligenceQuery("local not touristy Laureles");
      expect(a.route).toBe("restaurant_hybrid");
      expect(a.slots.wantsAntiTouristy).toBe(true);
      expect(a.slots.neighborhood).toBe("Laureles");
      expect(a.rankReasonHints).toContain("touristy_score");
    });

    it("cocktail restaurant in Poblado", () => {
      const a = analyzeVenueIntelligenceQuery("cocktail restaurant in Poblado");
      expect(a.route).toBe("restaurant_hybrid");
      expect(a.slots.wantsCocktails).toBe(true);
      expect(a.rankReasonHints).toContain("cocktail_score");
    });
  });

  describe("café intent → cafe_anchor", () => {
    it("quiet specialty coffee in Laureles", () => {
      const a = analyzeVenueIntelligenceQuery("quiet specialty coffee in Laureles");
      expect(a.route).toBe("cafe_anchor");
      expect(a.intent).toBe("cafe_search");
      expect(a.slots.wantsQuiet).toBe(true);
      expect(a.slots.wantsSpecialtyCoffee).toBe(true);
      expect(a.userExplanation).toMatch(/cafés/i);
    });

    it("coffee work spot with wifi", () => {
      const a = analyzeVenueIntelligenceQuery("coffee work spot with wifi");
      expect(a.route).toBe("cafe_anchor");
      expect(a.slots.wantsNomad).toBe(true);
      expect(a.sharedSlots.needs).toContain("remote_work");
    });
  });

  describe("nightlife intent → nightlife_anchor (VEN-025)", () => {
    it("salsa bars locals go to", () => {
      const a = analyzeVenueIntelligenceQuery("salsa bars locals go to");
      expect(a.route).toBe("nightlife_anchor");
      expect(a.intent).toBe("venue_search");
      expect(a.slots.wantsSalsa).toBe(true);
      expect(a.userExplanation).toMatch(/not ticketed events/i);
    });

    it("popular clubs tonight in Provenza", () => {
      const a = analyzeVenueIntelligenceQuery("popular clubs tonight in Provenza");
      expect(a.route).toBe("nightlife_anchor");
      expect(a.slots.wantsNightlife).toBe(true);
      expect(a.slots.neighborhood).toBe("El Poblado");
    });
  });

  describe("clarification", () => {
    it("ambiguous nice place tonight", () => {
      const a = analyzeVenueIntelligenceQuery("nice place tonight");
      expect(a.route).toBe("clarify");
      expect(a.action).toBe("clarify");
      expect(shouldClarifyVenueIntelligence("nice place tonight")).toBe(true);
      expect(getVenueIntelligenceClarification("nice place tonight")).toMatch(
        /dinner|coffee|nightlife/i,
      );
    });

    it("ambiguous good spot in Laureles", () => {
      const a = analyzeVenueIntelligenceQuery("good spot in Laureles");
      expect(a.route).toBe("clarify");
      expect(a.clarification?.options.length).toBeGreaterThanOrEqual(3);
      expect(a.sharedSlots.neighborhood).toBe("Laureles");
    });
  });

  describe("does not hijack ticketed events", () => {
    it("salsa events this weekend stays unsupported", () => {
      const a = analyzeVenueIntelligenceQuery("salsa events this weekend");
      expect(a.route).toBe("unsupported");
    });
  });
});
