#!/usr/bin/env node
/**
 * Map / pin data smoke — validates API payloads have geo backing before UI.
 * Usage: node tasks/testing/scripts/maps-smoke.mjs [--base http://localhost:3001]
 */
const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3001";

function ok(label, pass, detail = "") {
  const mark = pass ? "PASS" : "FAIL";
  console.log(`${mark}  ${label}${detail ? ` — ${detail}` : ""}`);
  return pass;
}

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, json };
}

function validLatLng(lat, lng) {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

async function main() {
  let failed = 0;

  const home = await fetch(`${base}/`);
  if (!ok("GET / (map shell)", home.status === 200, String(home.status))) failed++;

  const rentals = await post("/api/rentals/search", {
    neighborhood: "Laureles",
    limit: 10,
  });
  const rentalRows = rentals.json?.results ?? [];
  const withCoords = rentalRows.filter((r) => validLatLng(r.latitude, r.longitude));
  ok(
    "Rentals with valid lat/lng (when present)",
    rentals.status === 200,
    `${withCoords.length}/${rentalRows.length} geocoded`,
  );
  const invented = rentalRows.filter(
    (r) =>
      r.latitude != null &&
      r.longitude != null &&
      !validLatLng(r.latitude, r.longitude),
  );
  if (!ok("Rentals no invented coordinates", invented.length === 0, `${invented.length} bad`))
    failed++;

  const events = await post("/api/events/search", { dateWindow: "any", limit: 10 });
  const eventRows = events.json?.results ?? [];
  let geoBacked = 0;
  for (const e of eventRows) {
    if (e.mapsUrl || e.sourceUrl || e.placeId) geoBacked++;
  }
  if (
    !ok(
      "Events venue/map/source backing",
      events.status === 200 && geoBacked === eventRows.length && eventRows.length >= 5,
      `${geoBacked}/${eventRows.length}`,
    )
  )
    failed++;

  console.log(
    "\nNOTE: AdvancedMarker / mapId / pin-click sync — run Playwright maps-grounding + SCREEN-005.",
  );

  console.log(failed ? `\n${failed} check(s) failed` : "\nAll maps smoke checks passed");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
