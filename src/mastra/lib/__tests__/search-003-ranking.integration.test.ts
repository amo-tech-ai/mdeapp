import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { searchRestaurantsIntelligent } from "../intelligence-restaurant-search";

/** Load mdeapp/.env.local when vitest runs without --env-file (CI skip path). */
function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

const hasLiveSupabase = () =>
  Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );

loadEnvLocal();

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function namesInclude(results: { name: string }[], ...needles: string[]) {
  const names = results.map((r) => r.name.toLowerCase());
  return needles.some((n) => names.some((name) => name.includes(n.toLowerCase())));
}

describe.skipIf(!hasLiveSupabase())("SEARCH-003 — Hybrid Restaurant Search + Venue Signals (live)", () => {
  it("GQ-S01: quiet rooftop Provenza ranks Relato or Sambombi with human_qa signals", async () => {
    const r = await searchRestaurantsIntelligent({
      queryText: "quiet rooftop dinner Provenza",
      limit: 5,
    });

    expect(r.results.length).toBeGreaterThanOrEqual(2);
    expect(r.source).toBe("supabase");
    expect(namesInclude(r.results, "Relato", "Sambombi")).toBe(true);
    for (const row of r.results.slice(0, 3)) {
      expect(isUuid(row.id)).toBe(true);
    }
    const withSignal = r.results.find((x) => x.signalSource === "human_qa");
    expect(withSignal).toBeDefined();
    expect(r.slots.neighborhood).toBe("Provenza");
    expect(r.slots.wantsRooftop).toBe(true);
    expect(r.slots.wantsQuiet).toBe(true);
  }, 60_000);

  it("cocktail restaurant Poblado returns signal-backed fine-dining peers", async () => {
    const r = await searchRestaurantsIntelligent({
      queryText: "cocktail restaurant Poblado",
      limit: 5,
    });

    expect(r.results.length).toBeGreaterThanOrEqual(1);
    expect(namesInclude(r.results, "Alambique", "O.C.I.", "Carmen", "Dos Santos")).toBe(true);
    expect(r.slots.wantsCocktails).toBe(true);
    const boosted = r.results.filter((x) => x.rankScore != null && x.rankScore > 0);
    expect(boosted.length).toBeGreaterThan(0);
  }, 60_000);

  it("romantic dinner uses date_night slot boost (signal path, city-wide)", async () => {
    const r = await searchRestaurantsIntelligent({
      queryText: "romantic dinner Medellín",
      limit: 5,
    });

    expect(r.results.length).toBeGreaterThanOrEqual(1);
    expect(r.slots.wantsDateNight).toBe(true);
    expect(r.slots.wantsCocktails).toBeUndefined();
    expect(r.results.every((x) => isUuid(x.id))).toBe(true);
    expect(r.results.some((x) => x.signalSource === "human_qa")).toBe(true);
    expect(namesInclude(r.results, "Carmen", "El Cielo", "O.C.I.")).toBe(true);
  }, 60_000);

  it("anti-touristy local query prefers Mondongos over high-touristy peers", async () => {
    const r = await searchRestaurantsIntelligent({
      queryText: "local authentic not touristy Laureles",
      limit: 5,
    });

    expect(r.slots.wantsAntiTouristy).toBe(true);
    expect(r.slots.wantsHiddenGem).toBe(true);
    expect(namesInclude(r.results, "Mondongos")).toBe(true);
  }, 60_000);

  it("rankScore orders results descending when signals present", async () => {
    const r = await searchRestaurantsIntelligent({
      queryText: "quiet rooftop Provenza",
      limit: 5,
    });

    const scores = r.results.map((x) => x.rankScore ?? 0);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
    }
  }, 60_000);
});

describe("SEARCH-003 integration env gate", () => {
  it("documents skip when Supabase env missing", () => {
    if (!hasLiveSupabase()) {
      expect(hasLiveSupabase()).toBe(false);
      return;
    }
    expect(hasLiveSupabase()).toBe(true);
  });
});
