#!/usr/bin/env node
/**
 * Export live venue_source_evidence (anchor rows) → idempotent seed SQL (DATA-041-R06).
 * Usage: cd mdeapp && infisical run --silent --env=dev --path=/ -- node scripts/intelligence/export-data041-anchor-evidence.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(
  __dirname,
  "../../../tasks/data/seeds/data041_anchor_evidence.sql",
);

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
  .from("venue_source_evidence")
  .select("*")
  .not("venue_anchor_id", "is", null)
  .order("venue_kind")
  .order("created_at");

if (error) {
  console.error(error.message);
  process.exit(1);
}

const rows = data ?? [];
if (rows.length < 10) {
  console.warn(`WARN: only ${rows.length} anchor evidence rows — seed may be incomplete`);
}

const cols = [
  "id",
  "venue_kind",
  "restaurant_id",
  "venue_anchor_id",
  "source_type",
  "source_url",
  "source_title",
  "extracted_text",
  "confidence",
  "checked_at",
  "created_at",
];

function sqlVal(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
}

const valueRows = rows
  .map((r) => {
    const vals = cols.map((c) => sqlVal(r[c]));
    return `  (${vals.join(", ")})`;
  })
  .join(",\n");

const ids = rows.map((r) => `'${r.id}'`).join(", ");

const sql = `-- DATA-041-R06 — anchor venue_source_evidence seed (${rows.length} rows)
-- Task: DATA-041-R06 — Anchor venue_source_evidence
-- Idempotent: ON CONFLICT (id) DO UPDATE
--
-- Rollback:
--   DELETE FROM public.venue_source_evidence WHERE id IN (${ids || "'00000000-0000-0000-0000-000000000000'"});

BEGIN;

INSERT INTO public.venue_source_evidence (${cols.join(", ")})
VALUES
${valueRows || "  ('00000000-0000-0000-0000-000000000000', 'cafe', NULL, '5975c9b0-1822-47bc-af2d-3f0c4e6880b9', 'editorial', NULL, NULL, 'placeholder', 0.5, now(), now())"}
ON CONFLICT (id) DO UPDATE SET
  venue_kind = EXCLUDED.venue_kind,
  restaurant_id = EXCLUDED.restaurant_id,
  venue_anchor_id = EXCLUDED.venue_anchor_id,
  source_type = EXCLUDED.source_type,
  source_url = EXCLUDED.source_url,
  source_title = EXCLUDED.source_title,
  extracted_text = EXCLUDED.extracted_text,
  confidence = EXCLUDED.confidence,
  checked_at = EXCLUDED.checked_at;

COMMIT;
`;

writeFileSync(outPath, sql);
console.log(`Wrote ${rows.length} rows → ${outPath}`);
