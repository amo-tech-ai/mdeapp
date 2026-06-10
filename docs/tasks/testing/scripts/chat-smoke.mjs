#!/usr/bin/env node
/**
 * API + shape smoke for mdeai concierge surfaces.
 * Usage: node tasks/testing/scripts/chat-smoke.mjs [--base http://localhost:3001] [--warn-ms 2500]
 */
const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3001";

const warnMs = process.argv.includes("--warn-ms")
  ? Number(process.argv[process.argv.indexOf("--warn-ms") + 1])
  : 2500;

/** Prod CopilotKit route allows same-origin browser requests without Bearer (see copilotkit-auth.ts). */
function requestHeaders(extra = {}) {
  const headers = { ...extra };
  try {
    const origin = new URL(base).origin;
    if (origin.includes("mdeai.co")) {
      headers.Origin = origin;
      headers.Referer = `${origin}/chat`;
    }
  } catch {
    // base may be malformed in tests — skip Origin
  }
  return headers;
}

async function timedFetch(url, init) {
  const t0 = performance.now();
  const res = await fetch(url, init);
  const ms = Math.round(performance.now() - t0);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { res, json, ms };
}

async function post(path, body) {
  return timedFetch(`${base}${path}`, {
    method: "POST",
    headers: requestHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
}

async function get(path) {
  return timedFetch(`${base}${path}`, {
    method: "GET",
    headers: requestHeaders(),
  });
}

function ok(label, pass, detail = "") {
  const mark = pass ? "PASS" : "FAIL";
  console.log(`${mark}  ${label}${detail ? ` — ${detail}` : ""}`);
  return pass;
}

function warnSlow(label, ms) {
  if (ms > warnMs) {
    console.log(`WARN  ${label} — ${ms}ms (>${warnMs}ms)`);
    return true;
  }
  return false;
}

function uniqueIds(rows) {
  const ids = rows.map((r) => r?.id).filter(Boolean);
  return ids.length === new Set(ids).size;
}

async function main() {
  let failed = 0;
  let warns = 0;

  const home = await timedFetch(`${base}/`, {
    method: "GET",
    headers: requestHeaders(),
  });
  if (!ok("GET /", home.res.status === 200, `${home.res.status} ${home.ms}ms`)) failed++;
  else warnSlow("GET /", home.ms) && warns++;

  const ck = await post("/api/copilotkit", {});
  if (!ok("POST /api/copilotkit (empty)", ck.res.status === 400, `${ck.res.status} ${ck.ms}ms`))
    failed++;

  const rentals = await post("/api/rentals/search", {
    neighborhood: "Laureles",
    minBedrooms: 1,
    maxPricePerNight: 80,
    limit: 10,
  });
  const rentalRows = rentals.json?.results ?? [];
  const rentalCount = rentalRows.length;
  if (
    !ok(
      "POST /api/rentals/search",
      rentals.res.status === 200 && rentalCount >= 1,
      `${rentalCount} results ${rentals.ms}ms source=${rentals.json?.source ?? "?"}`,
    )
  )
    failed++;
  else warnSlow("POST /api/rentals/search", rentals.ms) && warns++;

  if (rentalCount > 0) {
    const r0 = rentalRows[0];
    const rentalShape =
      r0.title &&
      typeof r0.nightly_price === "number" &&
      r0.neighborhood &&
      (r0.source_url || r0.schedule_viewing_url);
    if (!ok("Rental card shape", rentalShape, r0.title)) failed++;
    const hasCoords =
      (typeof r0.latitude === "number" && typeof r0.longitude === "number") ||
      rentalRows.every((r) => r.latitude == null || r.longitude == null);
    ok(
      "Rental geo (lat/lng or explicit absence)",
      hasCoords,
      r0.latitude != null ? `${r0.latitude},${r0.longitude}` : "no coords in payload",
    );
    if (!ok("Rental unique IDs", uniqueIds(rentalRows), `${rentalCount} rows`)) failed++;
  }

  const eventsAny = await post("/api/events/search", { dateWindow: "any", limit: 10 });
  const eventRows = eventsAny.json?.results ?? [];
  const countAny = eventRows.length;
  if (
    !ok(
      "POST /api/events/search any×10",
      eventsAny.res.status === 200 && countAny >= 5,
      `${countAny} results ${eventsAny.ms}ms`,
    )
  )
    failed++;
  else warnSlow("POST /api/events/search any", eventsAny.ms) && warns++;

  const eventsWeek = await post("/api/events/search", {
    dateWindow: "this_week",
    limit: 10,
  });
  const countWeek = eventsWeek.json?.results?.length ?? 0;
  ok(
    "POST /api/events/search this_week (info)",
    eventsWeek.res.status === 200,
    `${countWeek} results ${eventsWeek.ms}ms — sparse OK`,
  );

  if (countAny > 0) {
    const first = eventRows[0];
    const hasFields =
      first.title && first.startsAt && (first.venue || first.neighborhood);
    if (!ok("Event card shape", hasFields, first.title)) failed++;
    const hasGeoSource = !!(first.mapsUrl || first.sourceUrl || first.placeId);
    if (!ok("Event geo/source backing", hasGeoSource, first.sourceUrl ?? first.mapsUrl ?? "none"))
      failed++;
    if (!ok("Event unique IDs", uniqueIds(eventRows), `${countAny} rows`)) failed++;
  }

  const placesBad = await get("/api/places/detail?placeId=short");
  if (
    !ok(
      "GET /api/places/detail invalid placeId",
      placesBad.res.status === 400,
      String(placesBad.res.status),
    )
  )
    failed++;

  const placesMissing = await get("/api/places/detail");
  if (
    !ok(
      "GET /api/places/detail missing placeId",
      placesMissing.res.status === 400,
      String(placesMissing.res.status),
    )
  )
    failed++;

  console.log(
    failed
      ? `\n${failed} check(s) failed${warns ? `, ${warns} slow warning(s)` : ""}`
      : `\nAll checks passed${warns ? ` (${warns} slow warning(s))` : ""}`,
  );
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
