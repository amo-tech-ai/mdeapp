#!/usr/bin/env node
// PostToolUse hook for Edit|Write|MultiEdit. **DEFERRED — promote on first Supabase migration (W2+).**
// Runs `supabase gen types typescript --linked` after migration edits, refreshes mdeapp/src/lib/types/database.ts.
// Warn-only. Skips if supabase CLI is missing.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path || "";
if (!filePath) process.exit(0);
const rel = filePath.replace(/^.*?\/mdeai\/(\.claude\/worktrees\/[^/]+\/)?/, "");
if (!/^mdeapp\/supabase\/(migrations|schemas)\//.test(rel)) process.exit(0);

const mdeapp = "/home/sk/mdeai/mdeapp";

// Skip if supabase CLI missing.
const which = spawnSync("which", ["supabase"], { encoding: "utf8" });
if (which.status !== 0) {
  process.stderr.write(`[typegen warn] supabase CLI not installed; skipping. Install with brew or scoop.\n`);
  process.exit(0);
}

const outPath = `${mdeapp}/src/lib/types/database.ts`;
const result = spawnSync(
  "supabase",
  ["gen", "types", "typescript", "--linked", "--schema", "public"],
  { cwd: mdeapp, encoding: "utf8", timeout: 30_000 },
);

if (result.status === 0 && result.stdout) {
  // Write to disk only if changed.
  if (existsSync(outPath)) {
    let prev;
    try { prev = readFileSync(outPath, "utf8"); } catch { prev = ""; }
    if (prev === result.stdout) {
      process.stderr.write(`[typegen ok] no schema change → ${outPath} unchanged.\n`);
      process.exit(0);
    }
  }
  // Defer to manual write — do not auto-overwrite without user consent.
  process.stderr.write(
    `[typegen warn] schema change detected in ${rel}.\n` +
      `Run manually: cd mdeapp && supabase gen types typescript --linked --schema public > src/lib/types/database.ts\n`,
  );
} else if (result.stderr) {
  process.stderr.write(`[typegen warn] ${result.stderr.split("\n").slice(0, 5).join("\n")}\n`);
}

process.exit(0);
