#!/usr/bin/env node
// Stop hook.
// If a Supabase migration was created or modified during this session, require
// evidence that RLS coverage was verified before letting the turn end.
// High-confidence only — only warns when the diff includes migration files AND
// the final assistant message contains no RLS verification marker.
// Warn-only (exit 0 with stderr); turn does not block.

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

if (payload?.stop_hook_active) process.exit(0);

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 5000, ...opts });
  if (r.status !== 0) return "";
  return (r.stdout || "").trim();
}

const mdeapp = "/home/sk/mdeai/mdeapp";

// Detect changed migration/schema files in the working tree (mdeapp/.git).
const changed = (sh("git", ["status", "--porcelain"], { cwd: mdeapp }) || "")
  .split("\n")
  .map((l) => l.slice(3))
  .filter(Boolean);

const MIGRATION_RE = /^supabase\/(migrations|schemas)\//;
const touched = changed.filter((f) => MIGRATION_RE.test(f));
if (touched.length === 0) process.exit(0);

const diffSummary = sh(
  "git",
  ["diff", "--stat", "HEAD", "--", "supabase/migrations", "supabase/schemas"],
  { cwd: mdeapp },
);

// Read last assistant message from the transcript.
let lastAssistantText = "";
if (payload.transcript_path) {
  try {
    const lines = readFileSync(payload.transcript_path, "utf8").split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      let row;
      try { row = JSON.parse(lines[i]); } catch { continue; }
      const m = row?.message;
      if (!m || m.role !== "assistant") continue;
      const blocks = Array.isArray(m.content) ? m.content : [];
      lastAssistantText = blocks
        .filter((b) => b && b.type === "text" && typeof b.text === "string")
        .map((b) => b.text)
        .join("\n");
      if (lastAssistantText) break;
    }
  } catch {
    /* ignore */
  }
}

// RLS verification markers — any one is sufficient.
const RLS_RE = [
  /\bpg_policies\b/i,
  /\brelrowsecurity\b/i,
  /ALTER\s+TABLE\s+\S+\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/i,
  /\bCREATE\s+POLICY\b/i,
  /\bDROP\s+POLICY\b/i,
  /supabase\s+db\s+reset/i,
  /select\s+auth\.uid\(\)/i,
  /\bRLS\b.+(?:enabled|verified|passed|policies?\s+(?:added|checked))/i,
];

const haveMarker =
  RLS_RE.some((re) => re.test(lastAssistantText)) ||
  RLS_RE.some((re) => re.test(diffSummary));

if (haveMarker) process.exit(0);

console.error(
  `\n🟡 stop-rls-gate: ${touched.length} Supabase migration/schema file(s) changed this session ` +
    `but no RLS verification evidence was found in the final message or diff:\n`,
);
touched.slice(0, 10).forEach((f) => console.error(`     • ${f}`));
console.error(
  `\n   Before stopping, paste one of:\n` +
    `     • output of \`SELECT relname, relrowsecurity FROM pg_class WHERE relname IN (...)\`\n` +
    `     • \`SELECT polname, cmd FROM pg_policies WHERE tablename IN (...)\` via Supabase MCP\n` +
    `     • explicit \`ENABLE ROW LEVEL SECURITY\` + \`CREATE POLICY\` lines in the migration.\n` +
    `   If intentionally RLS-free (admin-only schema), state that explicitly.\n`,
);
// Warn-only: do not block the turn.
process.exit(0);
