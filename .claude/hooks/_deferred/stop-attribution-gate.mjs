#!/usr/bin/env node
// Stop hook. **DEFERRED — style polish, promote at W10 cutover.**
// Warns if a commit was made during the session whose message lacks a `Co-Authored-By: Claude` line.
// Warn-only.

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

if (payload?.stop_hook_active) process.exit(0);

const mdeapp = "/home/sk/mdeai/mdeapp";

function sh(args) {
  const r = spawnSync("git", args, { cwd: mdeapp, encoding: "utf8", timeout: 5000 });
  return r.status === 0 ? (r.stdout || "").trim() : "";
}

// Only check commits made today (avoids noise on rebase/cherry-pick).
const todayCommits = sh(["log", "--since=12 hours ago", "--pretty=%H%n%B%n---END---"])
  .split("---END---")
  .map((c) => c.trim())
  .filter(Boolean);

if (todayCommits.length === 0) process.exit(0);

const missing = todayCommits.filter((c) => !/Co-Authored-By:\s*Claude/i.test(c));
if (missing.length === 0) process.exit(0);

process.stderr.write(
  `\n🟡 stop-attribution-gate: ${missing.length} recent commit(s) lack \`Co-Authored-By: Claude\` line.\n` +
    `Per house style, AI-assisted commits should include attribution.\n` +
    `Reword with: git commit --amend (only if not yet pushed).\n`,
);
process.exit(0);
