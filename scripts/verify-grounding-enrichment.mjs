#!/usr/bin/env node
/**
 * MAP-018B smoke: Cloud Run sidecar returns enriched pins (rating/photoName/mask version).
 * Usage: node --env-file=.env.local scripts/verify-grounding-enrichment.mjs
 */
const base = process.env.ADK_GROUNDING_URL ?? "http://localhost:8000";
const EXPECTED_MASK = "details-v3-links-2026-05-26";

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

async function invoke(query, pageSize = 3) {
  const headers = { "Content-Type": "application/json" };
  const token = process.env.ADK_INTERNAL_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}/v1/grounding/invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tool: "search_grounded_places",
      query,
      pageSize,
      locationBias: { latitude: 6.2442, longitude: -75.5812 },
    }),
  });
  const body = await res.json();
  return { res, body };
}

function assertPinShape(pin, label) {
  if (pin.photos != null) {
    fail(`${label}: raw photos[] leaked to client`);
  }
  if (pin.editorialSummary != null) {
    fail(`${label}: editorialSummary present — MVP mask should exclude it`);
  }
  if (pin.fieldMaskVersion && pin.fieldMaskVersion !== EXPECTED_MASK) {
    fail(`${label}: fieldMaskVersion ${pin.fieldMaskVersion} !== ${EXPECTED_MASK}`);
  }
}

async function main() {
  const health = await fetch(`${base}/health`);
  if (!health.ok) fail(`ADK sidecar down at ${base}/health → ${health.status}`);
  console.log(`✅ health ${base}/health`);

  const { res, body } = await invoke("quiet cafés Laureles Medellín", 5);
  if (!res.ok) fail(`invoke HTTP ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);

  const pins = body.pins ?? [];
  const source = body.metadata?.source ?? "unknown";
  console.log(`✅ invoke HTTP ${res.status} source=${source} pins=${pins.length}`);

  if (source !== "grounding-lite") {
    fail(`expected grounding-lite, got ${source}`);
  }
  if (pins.length < 1) {
    fail(`no pins: ${body.metadata?.reason ?? "unknown"}`);
  }

  for (const [i, pin] of pins.entries()) {
    assertPinShape(pin, `pin[${i}]`);
    if (!pin.title || pin.title === "Place") {
      fail(`pin[${i}] generic title: ${pin.title}`);
    }
    if (pin.latitude == null || pin.mapsUrl == null) {
      fail(`pin[${i}] missing latitude or mapsUrl`);
    }
  }

  const enriched = pins.filter(
    (p) =>
      p.fieldMaskVersion === EXPECTED_MASK &&
      (p.rating != null || p.photoName != null || p.openNow != null),
  );
  console.log(`   enriched pins (rating|photo|hours): ${enriched.length}/${pins.length}`);

  if (enriched.length < 1) {
    console.warn(
      "⚠ no enriched fields on any pin — check PLACES_ENRICHMENT_ENABLED + server API key",
    );
    fail("expected ≥1 pin with rating, photoName, or openNow after MAP-018B");
  }

  const sample = enriched[0];
  console.log(`   sample: ${sample.title}`);
  console.log(`     rating: ${sample.rating ?? "—"}`);
  console.log(`     photoName: ${sample.photoName ? "yes" : "—"}`);
  console.log(`     openNow: ${sample.openNow ?? "null"}`);
  console.log(`     fieldMaskVersion: ${sample.fieldMaskVersion}`);
  if (sample.directionsUrl) {
    console.log(`     directionsUrl: yes`);
  }
  if (sample.reviewsUrl) {
    console.log(`     reviewsUrl: yes`);
  }

  // Cache hit: second identical query should be faster and still valid
  const t0 = Date.now();
  const { body: body2 } = await invoke("quiet cafés Laureles Medellín", 5);
  const elapsed = Date.now() - t0;
  const pins2 = body2.pins ?? [];
  const enriched2 = pins2.filter((p) => p.fieldMaskVersion === EXPECTED_MASK);
  console.log(`✅ cache re-invoke ${elapsed}ms enriched=${enriched2.length}`);
  if (enriched2.length < 1) fail("cache re-invoke lost enrichment");

  console.log("\n✅ MAP-018B sidecar enrichment OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
