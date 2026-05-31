#!/usr/bin/env npx tsx
/**
 * AI-004 — fail if intelligence cards lack evidence/source.
 * Run: cd mdeapp && npx tsx scripts/intelligence/verify-grounding-cards.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyCardGrounding } from "../../src/mastra/lib/verify-card-grounding";
import { searchRestaurantsIntelligent } from "../../src/mastra/lib/intelligence-restaurant-search";
import { searchRentalsIntelligent } from "../../src/mastra/lib/intelligence-rental-search";
import { searchEventsIntelligent } from "../../src/mastra/lib/intelligence-event-search";

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

  const restaurant = await searchRestaurantsIntelligent({
    queryText: "quiet rooftop Provenza",
    limit: 3,
  });
  const rental = await searchRentalsIntelligent({
    queryText: "digital nomad rental Laureles near cafes",
    limit: 3,
  });
  const events = await searchEventsIntelligent({
    queryText: "salsa this weekend",
    limit: 3,
  });

  const cards = [
    ...restaurant.results.map((r) => ({
      id: r.id,
      title: r.name,
      signalSource: r.signalSource,
      source_url: r.sourceUrl,
      evidence: r.evidence,
    })),
    ...rental.results.map((r) => ({
      id: r.id,
      title: r.title,
      evidenceText: r.evidenceText,
      signalSource: r.signalSource,
      source_url: r.source_url,
    })),
    ...events.results.map((r) => ({
      id: r.id,
      title: r.title,
      evidenceText: r.evidenceText,
      signalSource: r.signalSource,
      sourceUrl: r.sourceUrl,
      mapsUrl: r.mapsUrl,
    })),
  ];

  const result = verifyCardGrounding(cards);
  console.log("verified:", result.verified, "failures:", result.failures.length);
  if (result.failures.length) {
    for (const f of result.failures) console.error("FAIL:", f);
    process.exit(1);
  }
  console.log("PASS: all cards have evidence or source");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
