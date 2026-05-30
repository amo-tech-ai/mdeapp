#!/usr/bin/env npx tsx
/**
 * MIS-M1 golden query smoke — requires Supabase env in mdeapp/.env.local
 * Run: cd mdeapp && npx tsx scripts/intelligence/golden-queries-smoke.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { searchRestaurantsIntelligent } from "../../src/mastra/lib/intelligence-restaurant-search";

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

async function main() {
  loadEnv();
  const queryText = "quiet rooftop Provenza";
  const result = await searchRestaurantsIntelligent({
    queryText,
    limit: 5,
  });

  const names = result.results.map((r) => r.name);
  console.log("query:", queryText);
  console.log("hybridUsed:", result.hybridUsed);
  console.log("results:", names.join(", ") || "(none)");
  console.log("rankExplanation:", JSON.stringify(result.rankExplanation, null, 2));

  const expected = ["Relato", "Sambombi"];
  const hit = expected.some((e) =>
    names.some((n) => n.toLowerCase().includes(e.toLowerCase())),
  );

  if (!result.hybridUsed) {
    console.error("FAIL: hybridUsed is false");
    process.exit(1);
  }
  if (result.results.length < 2) {
    console.error("FAIL: expected at least 2 results");
    process.exit(1);
  }
  if (!hit) {
    console.error(
      `FAIL: expected one of ${expected.join(", ")} in top results`,
    );
    process.exit(1);
  }

  console.log("PASS: golden query smoke");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
