#!/usr/bin/env node
/**
 * Fail if two live migrations share the same 14-digit prefix (PR-17 / #23 collision guard).
 * Ignores supabase/migrations/_archive-not-on-remote/
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const migrationsDir = join(process.cwd(), "supabase/migrations");

function listSqlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "_archive-not-on-remote") continue;
      out.push(...listSqlFiles(full));
      continue;
    }
    if (ent.name.endsWith(".sql")) out.push(full);
  }
  return out;
}

let files;
try {
  files = listSqlFiles(migrationsDir);
} catch {
  // No migrations dir yet (pre-C1 main) — pass.
  process.exit(0);
}

if (files.length === 0) process.exit(0);

const byPrefix = new Map();
for (const file of files) {
  const base = file.split("/").pop() ?? file;
  const prefix = base.split("_")[0];
  if (!/^\d{14}$/.test(prefix)) {
    console.error(`check-migration-timestamps: skip non-standard name ${base}`);
    continue;
  }
  const list = byPrefix.get(prefix) ?? [];
  list.push(base);
  byPrefix.set(prefix, list);
}

const collisions = [...byPrefix.entries()].filter(([, names]) => names.length > 1);
if (collisions.length === 0) {
  console.log(`check-migration-timestamps: OK (${files.length} files, unique prefixes)`);
  process.exit(0);
}

console.error("check-migration-timestamps: DUPLICATE prefix(es) in supabase/migrations/:");
for (const [prefix, names] of collisions) {
  console.error(`  ${prefix}:`);
  for (const n of names) console.error(`    - ${n}`);
}
process.exit(1);
