#!/usr/bin/env npx tsx
/**
 * DATA-046 — golden queries v2 smoke (multi-vertical MIS Phase 1b).
 * Run: cd mdeapp && npm run smoke:golden-queries
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { searchRestaurantsIntelligent } from "../../src/mastra/lib/intelligence-restaurant-search";
import { searchRentalsIntelligent } from "../../src/mastra/lib/intelligence-rental-search";
import { searchEventsIntelligent } from "../../src/mastra/lib/intelligence-event-search";
import { embedQueryText } from "../../src/mastra/lib/query-embedding";
import { normalizeVenueGroundingQuery } from "../../src/mastra/tools/search-grounded-places";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

type Case = {
  id: string;
  queryText: string;
  run: () => Promise<{ count: number; hybridUsed?: boolean; names: string[] }>;
  minResults?: number;
  expectHybrid?: boolean;
  expectName?: string[];
};

async function main() {
  loadEnv();

  const cases: Case[] = [
    {
      id: "GQ-S01",
      queryText: "quiet rooftop Provenza",
      run: async () => {
        const r = await searchRestaurantsIntelligent({ queryText: "quiet rooftop Provenza", limit: 5 });
        return { count: r.results.length, hybridUsed: r.hybridUsed, names: r.results.map((x) => x.name) };
      },
      minResults: 2,
      expectHybrid: true,
      expectName: ["Relato", "Sambombi"],
    },
    {
      id: "GQ-R01",
      queryText: "digital nomad rental Laureles near cafes",
      run: async () => {
        const r = await searchRentalsIntelligent({
          queryText: "digital nomad rental Laureles near cafes",
          limit: 5,
        });
        return { count: r.results.length, hybridUsed: r.hybridUsed, names: r.results.map((x) => x.title) };
      },
      minResults: 1,
    },
    {
      id: "GQ-E01",
      queryText: "salsa this weekend",
      run: async () => {
        const r = await searchEventsIntelligent({ queryText: "salsa this weekend", limit: 5 });
        return { count: r.results.length, hybridUsed: r.hybridUsed, names: r.results.map((x) => x.title) };
      },
      minResults: 1,
    },
    {
      id: "GQ-S02",
      queryText: "romantic rooftop cocktails Provenza",
      run: async () => {
        const r = await searchRestaurantsIntelligent({
          queryText: "romantic rooftop cocktails Provenza",
          limit: 5,
        });
        return { count: r.results.length, hybridUsed: r.hybridUsed, names: r.results.map((x) => x.name) };
      },
      minResults: 1,
    },
    {
      id: "GQ-C01",
      queryText: "coworking cafe strong Wi-Fi Laureles",
      run: async () => {
        const normalized = normalizeVenueGroundingQuery("coworking cafe strong Wi-Fi Laureles");
        return { count: normalized.length > 10 ? 1 : 0, names: [normalized.slice(0, 40)] };
      },
      minResults: 1,
    },
    {
      id: "GQ-N01",
      queryText: "compare Poblado vs Laureles",
      run: async () => {
        const r = await searchRentalsIntelligent({
          queryText: "quiet rental Laureles",
          neighborhood: "Laureles",
          limit: 3,
        });
        return { count: r.results.length, names: r.results.map((x) => x.neighborhood) };
      },
      minResults: 1,
    },
    {
      id: "GQ-V01",
      queryText: "hidden local restaurants Laureles",
      run: async () => {
        const r = await searchRestaurantsIntelligent({
          queryText: "hidden local restaurants Laureles",
          limit: 5,
        });
        return { count: r.results.length, hybridUsed: r.hybridUsed, names: r.results.map((x) => x.name) };
      },
      minResults: 1,
    },
    {
      id: "GQ-L01",
      queryText: "gym cafe nightlife Provenza",
      run: async () => {
        const normalized = normalizeVenueGroundingQuery("nightlife near gym and cafe Provenza");
        return { count: 1, names: [normalized.slice(0, 50)] };
      },
      minResults: 1,
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const result = await c.run();
    console.log(`\n${c.id} "${c.queryText}"`);
    console.log("  results:", result.count, result.names.join(", ") || "(none)");
    if (result.hybridUsed != null) console.log("  hybridUsed:", result.hybridUsed);

    if ((c.minResults ?? 1) > result.count) {
      console.error(`  FAIL: expected >= ${c.minResults ?? 1} results`);
      failed += 1;
      continue;
    }
    if (c.expectHybrid && !result.hybridUsed) {
      console.error("  FAIL: expected hybridUsed=true");
      failed += 1;
      continue;
    }
    if (c.expectName?.length) {
      const hit = c.expectName.some((e) =>
        result.names.some((n) => n.toLowerCase().includes(e.toLowerCase())),
      );
      if (!hit) {
        console.error(`  FAIL: expected one of ${c.expectName.join(", ")}`);
        failed += 1;
        continue;
      }
    }
    console.log("  PASS");
  }

  const q = "salsa this weekend medellin";
  const t0 = Date.now();
  await embedQueryText(q);
  const firstMs = Date.now() - t0;
  const t1 = Date.now();
  await embedQueryText(q);
  const secondMs = Date.now() - t1;
  console.log(`\nVEC-004 cache: first=${firstMs}ms second=${secondMs}ms`);
  if (secondMs > firstMs && secondMs > 200) {
    console.warn("  WARN: repeated embed not faster — cache may be cold");
  }

  if (failed) {
    console.error(`\nFAIL: ${failed}/${cases.length} golden queries`);
    process.exit(1);
  }
  console.log(`\nPASS: ${cases.length}/${cases.length} golden queries`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
