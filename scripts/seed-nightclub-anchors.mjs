#!/usr/bin/env node
/**
 * DATA-005 — Verify nightclub/bar anchors via Places Text Search and emit SQL inserts.
 * Usage:
 *   node --env-file=.env.local scripts/seed-nightclub-anchors.mjs --dry-run
 *   node --env-file=.env.local scripts/seed-nightclub-anchors.mjs --write-sql supabase/migrations/<timestamp>_data005_venue_anchors_nightclubs.sql
 *
 * Requires GOOGLE_PLACES_API_KEY (server-only). Never prints full API keys.
 */
import { readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CURATED = join(ROOT, "supabase/seeds/venues/nightclubs-medellin.curated.json");
const VERIFY_LOG = join(ROOT, "../tasks/testing/evidence/DATA-005-places-verify.log");
const CSV_OUT = join(ROOT, "supabase/seeds/venues/nightclubs-medellin.csv");
const FIELD_MASK = "places.id,places.displayName,places.location";

const placesKey =
  process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
const dryRun = process.argv.includes("--dry-run");
const writeSqlIdx = process.argv.indexOf("--write-sql");
const sqlOut =
  writeSqlIdx >= 0 ? resolve(process.argv[writeSqlIdx + 1]) : null;

function sqlEscape(s) {
  return s.replace(/'/g, "''");
}

function jsonSql(obj) {
  return `'${sqlEscape(JSON.stringify(obj))}'::jsonb`;
}

async function searchPlace(textQuery) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": placesKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 1,
      languageCode: "en",
      regionCode: "CO",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places searchText ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const place = data.places?.[0];
  if (!place?.id) return null;
  const id = place.id.replace(/^places\//, "");
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  const displayName =
    place.displayName?.text ?? place.displayName ?? textQuery;
  return { placeId: id, lat, lng, displayName };
}

function buildMetadata(anchor, verify) {
  return {
    schema_version: 1,
    place_type: anchor.place_type ?? "nightclub",
    why_special: anchor.why_special ?? null,
    ai_vibe_summary: anchor.ai_vibe_summary ?? null,
    contact: anchor.contact ?? {},
    confidence_score: anchor.confidence_score ?? 70,
    listing_sources: anchor.listing_sources ?? [],
    verified_at: new Date().toISOString(),
    places_verify: {
      place_id: verify.placeId,
      mask: FIELD_MASK,
      display_name: verify.displayName,
    },
    disambiguation: "venue_anchor_not_event — not ticketed events table",
  };
}

async function main() {
  if (!placesKey) {
    console.error("Missing GOOGLE_PLACES_API_KEY — set in mdeapp/.env.local");
    process.exit(1);
  }

  const pack = JSON.parse(readFileSync(CURATED, "utf8"));
  const anchors = pack.anchors ?? [];
  if (anchors.length < 10) {
    console.error(`Expected ≥10 anchors, got ${anchors.length}`);
    process.exit(1);
  }

  mkdirSync(dirname(VERIFY_LOG), { recursive: true });
  writeFileSync(VERIFY_LOG, `# DATA-005 Places verify ${new Date().toISOString()}\n`);

  const inserts = [];
  const csvRows = [
    "name,neighborhood,place_type,google_place_id,latitude,longitude,places_display_name,tags",
  ];
  let ok = 0;
  let fail = 0;

  for (const anchor of anchors) {
    const q =
      anchor.search_query ??
      `${anchor.name} ${anchor.neighborhood} Medellín Colombia nightclub bar`;
    process.stdout.write(`Verify: ${anchor.name} … `);
    try {
      const verify = await searchPlace(q);
      if (!verify?.placeId || verify.lat == null || verify.lng == null) {
        console.log("SKIP (no place)");
        appendFileSync(VERIFY_LOG, `FAIL ${anchor.name}\tno_result\t${q}\n`);
        fail++;
        continue;
      }
      const metadata = buildMetadata(anchor, verify);
      const tags = `{${(anchor.tags ?? []).map((t) => `"${t}"`).join(",")}}`;
      const sql = `INSERT INTO public.venue_anchors (
  kind, name, google_place_id, neighborhood, city, latitude, longitude,
  tags, is_active, source, metadata
) VALUES (
  'nightclub',
  '${sqlEscape(anchor.name)}',
  '${sqlEscape(verify.placeId)}',
  '${sqlEscape(anchor.neighborhood)}',
  'Medellín',
  ${verify.lat},
  ${verify.lng},
  '${tags}'::text[],
  true,
  'curated',
  ${jsonSql(metadata)}
)
ON CONFLICT (google_place_id, kind) DO UPDATE SET
  name = EXCLUDED.name,
  neighborhood = EXCLUDED.neighborhood,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  tags = EXCLUDED.tags,
  metadata = EXCLUDED.metadata,
  updated_at = now();`;
      inserts.push(sql);
      appendFileSync(
        VERIFY_LOG,
        `OK ${anchor.name}\t${verify.placeId}\t${verify.displayName}\n`,
      );
      csvRows.push(
        [
          anchor.name,
          anchor.neighborhood,
          anchor.place_type ?? "nightclub",
          verify.placeId,
          verify.lat,
          verify.lng,
          verify.displayName.replace(/,/g, " "),
          (anchor.tags ?? []).join("|"),
        ].join(","),
      );
      console.log(`OK ${verify.placeId}`);
      ok++;
      await new Promise((r) => setTimeout(r, 120));
    } catch (err) {
      console.log(`ERR ${err.message}`);
      appendFileSync(VERIFY_LOG, `ERR ${anchor.name}\t${err.message}\n`);
      fail++;
    }
  }

  console.log(`\nVerified: ${ok}/${anchors.length} (failed/skipped: ${fail})`);

  const fullSql = `-- DATA-005 nightclub venue_anchors seed\n-- Generated ${new Date().toISOString()}\n-- NOT sourced from events table\n\n${inserts.join("\n\n")}\n`;

  writeFileSync(CSV_OUT, `${csvRows.join("\n")}\n`);
  console.log(`Wrote ${CSV_OUT}`);

  if (sqlOut) {
    writeFileSync(sqlOut, fullSql);
    console.log(`Wrote ${sqlOut}`);
  }

  if (dryRun) {
    console.log("Dry run — no DB apply. Use Supabase MCP or psql with generated SQL.");
    process.exit(fail > 0 ? 1 : 0);
  }

  if (!sqlOut) {
    console.log("Pass --write-sql path to emit SQL, then apply via Supabase MCP.");
  }

  process.exit(fail > 0 ? 1 : 0);
}

main();
