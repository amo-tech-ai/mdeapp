/**
 * Isolated pass-through test: verifies searchRentals forwards checkIn/checkOut/stayType
 * to searchRentalsIntelligent when queryText is present.
 *
 * Must live in its own file so vi.mock is hoisted before any module is cached.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("../../lib/intelligence-rental-search", () => ({
  searchRentalsIntelligent: vi.fn().mockResolvedValue({
    results: [],
    total: 0,
    source: "supabase" as const,
    hybridUsed: false,
    rankExplanation: [],
    slots: {},
  }),
  parseRentalIntelligenceSlots: vi.fn().mockReturnValue({}),
}));

describe("searchRentals — date params pass-through to intelligent path", () => {
  it("forwards checkIn/checkOut/stayType when queryText is present", async () => {
    const { searchRentalsIntelligent } = await import("../../lib/intelligence-rental-search");
    const { searchRentals } = await import("../search-rentals");

    await searchRentals({
      queryText: "digital nomad rental Laureles june 1 to 30",
      checkIn: "2026-06-01",
      checkOut: "2026-06-30",
      stayType: "monthly",
    });

    expect(searchRentalsIntelligent).toHaveBeenCalledWith(
      expect.objectContaining({
        checkIn: "2026-06-01",
        checkOut: "2026-06-30",
        stayType: "monthly",
        queryText: "digital nomad rental Laureles june 1 to 30",
      }),
    );
  });

  it("does not call searchRentalsIntelligent when queryText is absent", async () => {
    const { searchRentalsIntelligent } = await import("../../lib/intelligence-rental-search");
    vi.mocked(searchRentalsIntelligent).mockClear();
    const { searchRentals } = await import("../search-rentals");

    // No queryText → goes to structured Supabase path, not intelligent path
    await searchRentals({ neighborhood: "Laureles", checkIn: "2026-06-01", checkOut: "2026-06-30" });

    expect(searchRentalsIntelligent).not.toHaveBeenCalled();
  });
});
