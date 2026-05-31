import { describe, expect, it } from "vitest";
import { scoreRentalQuery } from "@/lib/rental-query-parser";

describe("rental-query-parser — budget wording", () => {
  it("parses '$80/night' as nightly with neighborhood + bedrooms", () => {
    const s = scoreRentalQuery("1BR in Laureles under $80/night");
    expect(s.budgetType).toBe("nightly");
    expect(s.maxPricePerNight).toBe(80);
    expect(s.minBedrooms).toBe(1);
    expect(s.neighborhood).toBe("Laureles");
  });

  it("parses '$500/night' as a nightly price", () => {
    const s = scoreRentalQuery("$500/night rental in Laureles");
    expect(s.budgetType).toBe("nightly");
    expect(s.maxPricePerNight).toBe(500);
  });

  // Regression: "a night" / "nightly" must behave like "/night", not be
  // misread as monthly by the bare large-amount heuristic.
  it("parses '$500 a night' as nightly, not monthly", () => {
    const s = scoreRentalQuery("$500 a night rental in Laureles");
    expect(s.budgetType).toBe("nightly");
    expect(s.maxPricePerNight).toBe(500);
  });

  it("parses '$500 nightly' as nightly, not monthly", () => {
    const s = scoreRentalQuery("$500 nightly in El Poblado");
    expect(s.budgetType).toBe("nightly");
    expect(s.maxPricePerNight).toBe(500);
  });

  it("still treats an explicit monthly amount as monthly", () => {
    const s = scoreRentalQuery("$2000 per month in El Poblado");
    expect(s.budgetType).toBe("monthly");
  });
});

describe("rental-query-parser — INT-002 hero monthly + dates + city", () => {
  it("hero query gets clarify band not generic-only budget", () => {
    const s = scoreRentalQuery("list rentals in june 1 to 30 $1000 medellin");
    expect(s.budgetType).toBe("monthly");
    expect(s.hasDateRange).toBe(true);
    expect(s.cityWide).toBe(true);
    expect(s.confidence).toBeGreaterThanOrEqual(0.72);
    expect(s.confidence).toBeLessThan(0.85);
  });

  it("Laureles + nightly stays fast-path eligible", () => {
    const s = scoreRentalQuery("1BR in Laureles under $80/night");
    expect(s.confidence).toBeGreaterThanOrEqual(0.85);
  });

  it("Provenza maps to El Poblado neighborhood", () => {
    const s = scoreRentalQuery("2BR provenza under $120/night");
    expect(s.neighborhood).toBe("El Poblado");
  });
});

describe("rental-query-parser — INT-002 multi-vertical hero queries", () => {
  it("digital nomad rental Laureles — nomad + neighborhood band", () => {
    const s = scoreRentalQuery(
      "Find a quiet digital nomad rental in Laureles near cafes",
    );
    expect(s.neighborhood).toBe("Laureles");
    expect(s.hasNomad).toBe(true);
    expect(s.confidence).toBeGreaterThanOrEqual(0.72);
  });

  it("monthly stay Poblado — monthly budget + neighborhood", () => {
    const s = scoreRentalQuery("monthly stay in El Poblado under $2000 per month");
    expect(s.neighborhood).toBe("El Poblado");
    expect(s.budgetType).toBe("monthly");
    expect(s.confidence).toBeGreaterThanOrEqual(0.76);
  });

  it("quiet rental near cafes and gyms — vibe + proximity", () => {
    const s = scoreRentalQuery("quiet rental in Laureles near cafes and gyms");
    expect(s.neighborhood).toBe("Laureles");
    expect(s.hasCafeOrGym).toBe(true);
    expect(s.confidence).toBeGreaterThanOrEqual(0.62);
  });
});
