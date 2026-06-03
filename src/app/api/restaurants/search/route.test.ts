import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/mastra/tools/search-restaurants", () => ({
  searchRestaurants: vi.fn(),
}));

vi.mock("@/lib/restaurant-place-photo", () => ({
  prepareRestaurantSearchResults: vi.fn(async (rows: unknown[]) => rows),
}));

import { POST } from "./route";
import { searchRestaurants } from "@/mastra/tools/search-restaurants";

describe("POST /api/restaurants/search", () => {
  beforeEach(() => {
    vi.mocked(searchRestaurants).mockReset();
  });

  it("returns restaurant results for Laureles filter", async () => {
    vi.mocked(searchRestaurants).mockResolvedValue({
      results: [
        {
          id: "rst_lau_001",
          name: "Hatoviejo Laureles",
          cuisine: "paisa",
          neighborhood: "Laureles",
          priceTier: "$$",
          avgPricePerPerson: 18,
          currency: "USD",
          rating: 4.5,
          vibe: ["traditional"],
          imageUrl: "https://example.com/hatoviejo.jpg",
          sourceUrl: "https://mdeai.co/restaurants/rst_lau_001",
        },
      ],
      total: 1,
      source: "supabase",
    });

    const res = await POST(
      new Request("http://localhost/api/restaurants/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ neighborhood: "Laureles", limit: 12 }),
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toHaveLength(1);
    expect(json.results[0].name).toBe("Hatoviejo Laureles");
    expect(searchRestaurants).toHaveBeenCalledWith(
      expect.objectContaining({ neighborhood: "Laureles", limit: 12 }),
    );
  });

  it("rejects invalid cuisine", async () => {
    const res = await POST(
      new Request("http://localhost/api/restaurants/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuisine: "not-a-cuisine" }),
      }),
    );

    expect(res.status).toBe(400);
    expect(searchRestaurants).not.toHaveBeenCalled();
  });
});
