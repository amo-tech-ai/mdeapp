#!/usr/bin/env node
/**
 * MAP-002D API verification — Mastra flags + sidecar search_grounded_events.
 * Usage: node --env-file=.env.local scripts/verify-search-grounding.mjs
 */
const ADK_BASE = process.env.ADK_GROUNDING_URL?.trim();
const QUERY =
  process.env.VERIFY_SEARCH_QUERY ??
  "rooftop events in Poblado Medellín this Friday";

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

function ok(msg) {
  console.log("✅", msg);
}

async function main() {
  if (process.env.ENABLE_SEARCH_GROUNDING?.trim() !== "1") {
    fail("ENABLE_SEARCH_GROUNDING must be 1 in .env.local");
  }
  ok("ENABLE_SEARCH_GROUNDING=1");

  if (!ADK_BASE) fail("missing ADK_GROUNDING_URL");
  const health = await fetch(`${ADK_BASE}/health`);
  if (!health.ok) fail(`ADK health ${health.status} at ${ADK_BASE}`);
  ok(`health ${ADK_BASE}/health`);

  const headers = { "Content-Type": "application/json" };
  const token = process.env.ADK_INTERNAL_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${ADK_BASE}/v1/grounding/invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tool: "search_grounded_events",
      query: QUERY,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) fail(`invoke HTTP ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);

  const reason = body.metadata?.reason;
  const source = body.metadata?.source;
  const citations = Array.isArray(body.citations) ? body.citations : [];

  console.log(`   source: ${source ?? "—"}`);
  console.log(`   reason: ${reason ?? "—"}`);
  console.log(`   citations: ${citations.length}`);

  if (reason === "search_disabled") {
    fail("sidecar returned search_disabled — set ENABLE_SEARCH_GROUNDING=1 on Cloud Run");
  }

  const withUrl = citations.filter(
    (c) => c && typeof c.url === "string" && c.url.startsWith("http"),
  );
  if (withUrl.length < 1) {
    fail(
      `expected ≥1 citation with http URL; got ${citations.length} (reason=${reason ?? "none"})`,
    );
  }

  ok(`search_grounded_events → ${withUrl.length} citation(s) with URLs`);
  console.log(`   sample: ${withUrl[0].title ?? withUrl[0].url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
