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
