#!/usr/bin/env node
/**
 * SAN-683 live schema gate (06c §A). Skips when no local DB URL.
 * Usage: supabase db reset && node scripts/verify-partner-schema-gate.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "sql/partner-schema-gate.sql");

// Local gate only — do not use DATABASE_URL from .env.local (points at remote pre-apply).
const dbUrl =
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const EXPECT = {
  partner_tables: 8,
  leads_partner_cols: 3,
  bookings_partner_cols: 5,
  partner_enums: 2,
  partner_rls_tables: 8,
  partner_helpers: 3,
};

const main = async () => {
  const client = new pg.Client({ connectionString: dbUrl });
  try {
    await client.connect();
  } catch (err) {
    console.log(
      `SKIP partner-schema gate (no DB): ${err instanceof Error ? err.message : err}`,
    );
    process.exit(0);
  }

  const sql = readFileSync(sqlPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /select\s+/i.test(s));

  const results = {};
  for (const stmt of statements) {
    const { rows } = await client.query(stmt);
    const key = Object.keys(rows[0] ?? {})[0];
    if (key) results[key] = Number(rows[0][key]);
  }

  let failed = false;
  for (const [key, expected] of Object.entries(EXPECT)) {
    const actual = results[key];
    const ok = actual === expected;
    console.log(`${ok ? "PASS" : "FAIL"} ${key}: expected ${expected}, got ${actual ?? "?"}`);
    if (!ok) failed = true;
  }

  await client.end();
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
