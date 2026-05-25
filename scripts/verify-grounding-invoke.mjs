#!/usr/bin/env node
/**
 * MAP-002 smoke: ADK sidecar invoke returns pins (MCP or Gemini fallback).
 * Usage: node --env-file=.env.local scripts/verify-grounding-invoke.mjs
 */
const base = process.env.ADK_GROUNDING_URL ?? "http://localhost:8000";

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

async function main() {
  const health = await fetch(`${base}/health`);
  if (!health.ok) fail(`ADK sidecar down at ${base}/health → ${health.status}`);

  const headers = { "Content-Type": "application/json" };
  const token = process.env.ADK_INTERNAL_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${base}/v1/grounding/invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tool: "search_grounded_places",
      query: "quiet cafés Laureles Medellín",
      pageSize: 3,
    }),
  });
  const body = await res.json();
  const pins = body.pins ?? [];
  const source = body.metadata?.source ?? "unknown";

  console.log(`✅ invoke HTTP ${res.status}`);
  console.log(`   source: ${source}`);
  console.log(`   pins: ${pins.length}`);
  if (body.metadata?.reason && pins.length === 0) {
    fail(`no pins: ${body.metadata.reason} — ${body.metadata.message ?? ""}`);
  }
  if (source !== "grounding-lite") {
    fail(`Done proof requires metadata.source=grounding-lite, got ${source}`);
  }
  if (pins.length < 1) fail("expected ≥1 pin");
  const first = pins[0];
  if (first.latitude == null || first.mapsUrl == null) {
    fail("pin missing latitude or mapsUrl");
  }
  if (!first.title || first.title === "Place") {
    fail(`pin title must not be generic Place, got: ${first.title}`);
  }
  console.log(`   first: ${first.title} (${first.latitude}, ${first.longitude})`);
  console.log("\n✅ MAP-002 sidecar invoke OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
