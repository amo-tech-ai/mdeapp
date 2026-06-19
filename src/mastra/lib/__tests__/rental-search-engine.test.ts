import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getRentalSearchInvocationCount,
  rentalSearchEngine,
  resetRentalSearchEngineForTests,
} from "@/mastra/lib/rental-search-engine";

vi.mock("@/mastra/tools/search-rentals", () => ({
  searchRentals: vi.fn(() =>
    Promise.resolve({
      results: [{ id: "r1" }],
      total: 1,
      source: "mock" as const,
    }),
  ),
}));

describe("MASTRA-RE-002 · RentalSearchEngine", () => {
  beforeEach(() => {
    resetRentalSearchEngineForTests();
    vi.clearAllMocks();
  });

  it("dedupes identical concurrent search queries", async () => {
    const query = { neighborhood: "Laureles", minBedrooms: 1, maxPricePerNight: 80 };
    const [a, b] = await Promise.all([
      rentalSearchEngine.search(query),
      rentalSearchEngine.search(query),
    ]);
    expect(a.total).toBe(1);
    expect(b.total).toBe(1);
    expect(getRentalSearchInvocationCount()).toBe(1);
  });

  it("counts distinct queries separately", async () => {
    await rentalSearchEngine.search({ neighborhood: "Laureles" });
    await rentalSearchEngine.search({ neighborhood: "Envigado" });
    expect(getRentalSearchInvocationCount()).toBe(2);
  });
});
