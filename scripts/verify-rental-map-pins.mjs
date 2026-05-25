#!/usr/bin/env node
/**
 * Data-layer smoke: search-rentals → normalizeToolOutput → pins (no browser).
 * Usage: node --env-file=.env.local scripts/verify-rental-map-pins.mjs
 */
import { readFileSync } from "node:fs";

const errors = [];
const warnings = [];

if (process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) {
  errors.push(
    "remove NEXT_PUBLIC_GOOGLE_PLACES_API_KEY — browser uses NEXT_PUBLIC_GOOGLE_MAPS_API_KEY only (MAP-013)",
  );
}
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  if (process.env.GOOGLE_MAPS_API_KEY) {
    warnings.push(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY unset — set from GOOGLE_MAPS_API_KEY for vis.gl (browser Maps JS key)",
    );
  } else {
    errors.push("missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
  }
}

const page = readFileSync("src/app/page.tsx", "utf8");
if (!page.includes("MapContextProvider")) {
  errors.push("page.tsx must wrap CopilotSidebar with MapContextProvider");
}
if (!/MapContextProvider[\s\S]*CopilotSidebar/.test(page)) {
  errors.push("MapContextProvider must wrap CopilotSidebar (sidebar tool renders need pin context)");
}

const renders = readFileSync("src/components/copilot/search-tool-renders.tsx", "utf8");
if (
  !renders.includes("MASTRA_COPILOT_TOOL_ACTIONS.rentals") ||
  !renders.includes("MASTRA_TOOL_IDS.rentals")
) {
  errors.push(
    "search-tool-renders must register MASTRA_COPILOT_TOOL_ACTIONS.rentals and MASTRA_TOOL_IDS.rentals",
  );
}

const { searchRentals } = await import("../src/mastra/tools/search-rentals.ts");

const query = await searchRentals({
  neighborhood: "Laureles",
  maxPricePerNight: 34,
  limit: 5,
});

if (query.results.length === 0) {
  errors.push("search-rentals returned 0 Laureles rows");
} else {
  console.log(`✅ search-rentals: ${query.results.length} row(s), source=${query.source}`);
}

const pinRows = query.results.filter(
  (r) =>
    r.latitude != null &&
    r.longitude != null &&
    !Number.isNaN(r.latitude) &&
    !Number.isNaN(r.longitude),
);

if (pinRows.length === 0) {
  errors.push("no rows with latitude/longitude — map pins cannot render");
} else {
  console.log(`✅ pin-ready rows: ${pinRows.length}`);
  for (const r of pinRows) {
    console.log(`   · ${r.title} (${r.latitude}, ${r.longitude})`);
  }
}

if (warnings.length) {
  console.log("\nWarnings:");
  for (const w of warnings) console.log("  ⚠", w);
}
if (errors.length) {
  console.log("\nErrors:");
  for (const e of errors) console.log("  ✗", e);
  process.exit(1);
}
console.log("\n✅ Rental → map pin data path OK");
