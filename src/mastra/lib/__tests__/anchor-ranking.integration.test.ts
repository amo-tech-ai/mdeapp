import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import {
  searchCafeVenueAnchors,
  searchNightclubVenueAnchors,
} from "../../tools/search-venue-anchors";

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

function namesInclude(results: { name: string }[], ...needles: string[]) {
  const names = results.map((r) => r.name.toLowerCase());
  return needles.some((n) => names.some((name) => name.includes(n.toLowerCase())));
}

describe.skipIf(!hasLiveSupabase())(
  "DATA-041-R05 — Café/Nightlife venue_signals join (live)",
  () => {
    it("quiet specialty coffee Laureles ranks Semilla or Pergamino first", async () => {
      const rows = await searchCafeVenueAnchors({
        queryText: "quiet specialty coffee Laureles",
        neighborhood: "Laureles",
        limit: 5,
      });
      expect(rows.length).toBeGreaterThanOrEqual(2);
      expect(namesInclude(rows, "Semilla", "Pergamino")).toBe(true);
      const top = rows[0]?.name ?? "";
      expect(
        top.toLowerCase().includes("semilla") ||
          top.toLowerCase().includes("pergamino"),
      ).toBe(true);
      expect(rows[0]?.rankScore).toBeDefined();
      expect(rows[0]?.signalSource).toBe("human_qa");
    }, 30_000);

    it("coffee work spot Laureles prefers nomad signal Semilla", async () => {
      const rows = await searchCafeVenueAnchors({
        queryText: "coffee work spot Laureles",
        neighborhood: "Laureles",
        limit: 5,
      });
      expect(rows.length).toBeGreaterThanOrEqual(1);
      expect(namesInclude(rows, "Semilla")).toBe(true);
      expect(rows[0]?.name.toLowerCase()).toContain("semilla");
    }, 30_000);

    it("salsa bars locals go to boosts Son Havana", async () => {
      const rows = await searchNightclubVenueAnchors({
        queryText: "salsa bars locals go to",
        limit: 5,
      });
      expect(rows.length).toBeGreaterThanOrEqual(1);
      expect(namesInclude(rows, "Son Havana", "Havana")).toBe(true);
      const son = rows.find((r) => /son havana|havana/i.test(r.name));
      expect(son?.rankScore).toBeDefined();
    }, 30_000);

    it("rankScore orders descending for nightclub anchors", async () => {
      const rows = await searchNightclubVenueAnchors({
        queryText: "salsa nightlife Provenza",
        neighborhood: "Provenza",
        limit: 5,
      });
      const scores = rows.map((r) => r.rankScore ?? 0);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
      }
    }, 30_000);

    it("browse without queryText keeps stable ordering (VEN-035)", async () => {
      const rows = await searchCafeVenueAnchors({
        neighborhood: "Laureles",
        limit: 5,
      });
      expect(rows.length).toBeGreaterThanOrEqual(1);
      const scores = rows.map((r) => r.rankScore ?? 0);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
      }
    }, 30_000);
  },
);
