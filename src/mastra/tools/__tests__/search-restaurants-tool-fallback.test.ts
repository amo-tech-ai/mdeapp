import { describe, expect, it, vi } from "vitest";
import {
  restaurantSchema,
  searchRestaurantsTool,
} from "../search-restaurants";

describe("searchRestaurants fallback + envelope", () => {
  it("MA-P0-05 returns curated fallback when Supabase client unavailable", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.resetModules();
    const { searchRestaurants: search } = await import("../search-restaurants.js");

    const out = await search({ neighborhood: "Laureles", cuisine: "cafe", limit: 3 });

    expect(out.source).toBe("fallback");
    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results.every((r) => restaurantSchema.safeParse(r).success)).toBe(true);
    vi.unstubAllEnvs();
  });

  it("MA-P0-07 envelope includes results, total, and source", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.resetModules();
    const { searchRestaurants: search } = await import("../search-restaurants.js");

    const out = await search({ limit: 2 });

    expect(out).toMatchObject({
      results: expect.any(Array),
      total: expect.any(Number),
      source: "fallback",
    });
    vi.unstubAllEnvs();
  });
});

describe("searchRestaurantsTool execute", () => {
  it("UX-T-014 returns structured envelope for CopilotKit disabled render (no writer.custom)", async () => {
    const custom = vi.fn().mockResolvedValue(undefined);
    const out = (await searchRestaurantsTool.execute?.(
      { neighborhood: "Laureles", limit: 2 },
      { writer: { custom } },
    )) as { results: unknown[]; total: number; source: string };

    expect(out.results.length).toBeGreaterThan(0);
    expect(out).toMatchObject({
      results: expect.any(Array),
      total: expect.any(Number),
      source: expect.any(String),
    });
    expect(custom).not.toHaveBeenCalled();
  });

  it("MA-P0-06 execute returns safe envelope without throwing when Supabase unavailable", async () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    vi.resetModules();
    const { searchRestaurantsTool: tool } = await import("../search-restaurants.js");

    await expect(
      tool.execute?.({ neighborhood: "Laureles", limit: 3 }, {}),
    ).resolves.toMatchObject({
      results: expect.any(Array),
      total: expect.any(Number),
      source: "fallback",
    });
    vi.unstubAllEnvs();
  });
});
