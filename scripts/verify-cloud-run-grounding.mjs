#!/usr/bin/env node
/**
 * Post-deploy smoke: Cloud Run mask v3 + MAP-002E logging fields + search stub.
 * Usage: node --env-file=.env.local scripts/verify-cloud-run-grounding.mjs
 */
const base =
  process.env.ADK_GROUNDING_URL ??
  "https://mdeai-adk-grounding-4huwyjbclq-ue.a.run.app";
const MASK_V3 = "details-v3-links-2026-05-26";

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

async function post(body) {
  const headers = { "Content-Type": "application/json" };
  const token = process.env.ADK_INTERNAL_TOKEN?.trim();
  if (!token) fail("ADK_INTERNAL_TOKEN required for Cloud Run invoke");
  headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}/v1/grounding/invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return { res, body: await res.json() };
}

async function main() {
  const health = await fetch(`${base}/health`);
  if (!health.ok) fail(`health ${health.status}`);
  console.log(`✅ health ${base}`);

  const places = await post({
    tool: "search_grounded_places",
    query: "quiet cafés Laureles Medellín",
    pageSize: 3,
    locationBias: { latitude: 6.2442, longitude: -75.5812 },
  });
  if (!places.res.ok) fail(`places invoke ${places.res.status}`);
  const pins = places.body.pins ?? [];
  const source = places.body.metadata?.source;
  console.log(`✅ places source=${source} pins=${pins.length}`);
  if (pins.length < 1) fail(places.body.metadata?.reason ?? "no pins");

  const enriched = pins.filter((p) => p.fieldMaskVersion === MASK_V3);
  if (enriched.length < 1) {
    fail(
      `expected mask ${MASK_V3}, got ${pins.map((p) => p.fieldMaskVersion).join(",")}`,
    );
  }
  const withLinks = pins.filter(
    (p) => p.directionsUrl || p.reviewsUrl || p.mapsUrl,
  );
  console.log(
    `   mask v3: ${enriched.length}/${pins.length} withLinks=${withLinks.length}`,
  );

  const searchOff = await post({
    tool: "search_grounded_events",
    query: "rooftop events Poblado Friday",
  });
  if (searchOff.body.metadata?.reason !== "search_disabled") {
    console.log(
      "⚠ search without Mastra flag — sidecar ENABLE_SEARCH_GROUNDING may be 1",
    );
  } else {
    console.log("✅ search stub off when sidecar flag unset path OK");
  }

  console.log("\n✅ Cloud Run grounding smoke OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
