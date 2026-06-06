#!/usr/bin/env node
/**
 * Export live venue_signals → idempotent seed SQL (DATA-041-R02).
 * Usage: cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/intelligence/export-data041-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../../../tasks/data/seeds/data041_venue_signals.sql");

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("FAIL: missing SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin
  .from("venue_signals")
  .select("*")
  .order("venue_kind")
  .order("id");
if (error) {
  console.error(error.message);
  process.exit(1);
}

const rows = data ?? [];
const restaurantN = rows.filter((r) => r.restaurant_id).length;
const cafeN = rows.filter((r) => r.venue_kind === "cafe").length;
const nightclubN = rows.filter((r) => r.venue_kind === "nightclub").length;

if (rows.length !== 30) {
  console.error(`WARN: expected 30 rows, got ${rows.length}`);
}

function sqlVal(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

const cols = [
  "id",
  "venue_kind",
  "restaurant_id",
  "venue_anchor_id",
  "quiet_score",
  "date_night_score",
  "digital_nomad_score",
  "wifi_score",
  "rooftop_score",
  "cocktail_score",
  "nightlife_score",
  "brunch_score",
  "hidden_gem_score",
  "local_authenticity_score",
  "touristy_score",
  "service_score",
  "value_score",
  "evidence",
  "source",
  "model_version",
  "confidence",
  "generated_at",
  "created_at",
  "updated_at",
];

const ids = rows.map((r) => `'${r.id}'`).join(", ");

const values = rows
  .map((r) => {
    const vals = cols.map((c) => sqlVal(r[c]));
    return `  (${vals.join(", ")})`;
  })
  .join(",\n");

const sql = `-- DATA-041-R02 — venue_signals seed (30 rows)
-- Task: DATA-041 — Venue Signals Human QA Sign-Off
-- Exported: ${new Date().toISOString().slice(0, 10)} from production Supabase
-- Rows: ${restaurantN} restaurant · ${cafeN} cafe · ${nightclubN} nightclub
--
-- Apply (service_role):
--   psql "$DATABASE_URL" -f tasks/data/seeds/data041_venue_signals.sql
--
-- Idempotent: ON CONFLICT (id) DO UPDATE refreshes scores in place.
--
-- Rollback (removes only these ${rows.length} seed rows by primary key):
--   DELETE FROM public.venue_signals WHERE id IN (${ids});

BEGIN;

INSERT INTO public.venue_signals (${cols.join(", ")})
VALUES
${values}
ON CONFLICT (id) DO UPDATE SET
  venue_kind = EXCLUDED.venue_kind,
  restaurant_id = EXCLUDED.restaurant_id,
  venue_anchor_id = EXCLUDED.venue_anchor_id,
  quiet_score = EXCLUDED.quiet_score,
  date_night_score = EXCLUDED.date_night_score,
  digital_nomad_score = EXCLUDED.digital_nomad_score,
  wifi_score = EXCLUDED.wifi_score,
  rooftop_score = EXCLUDED.rooftop_score,
  cocktail_score = EXCLUDED.cocktail_score,
  nightlife_score = EXCLUDED.nightlife_score,
  brunch_score = EXCLUDED.brunch_score,
  hidden_gem_score = EXCLUDED.hidden_gem_score,
  local_authenticity_score = EXCLUDED.local_authenticity_score,
  touristy_score = EXCLUDED.touristy_score,
  service_score = EXCLUDED.service_score,
  value_score = EXCLUDED.value_score,
  evidence = EXCLUDED.evidence,
  source = EXCLUDED.source,
  model_version = EXCLUDED.model_version,
  confidence = EXCLUDED.confidence,
  generated_at = EXCLUDED.generated_at,
  updated_at = EXCLUDED.updated_at;

COMMIT;
`;

writeFileSync(outPath, sql, "utf8");
console.log(`Wrote ${rows.length} rows → ${outPath}`);
