#!/usr/bin/env node
// PostToolUse hook for Edit|Write|MultiEdit.
// Runs `npx eslint <file>` on the touched file if it's .ts/.tsx under mdeapp/src/ or mdeapp/supabase/functions/.
// Warn-only: prints output to stderr, never blocks. No-op if eslint config is missing.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path || "";
if (!filePath) process.exit(0);

const isTs = /\.(ts|tsx)$/.test(filePath);
if (!isTs) process.exit(0);

const isInScope = /\/mdeapp\/(src|supabase\/functions)\//.test(filePath);
if (!isInScope) process.exit(0);

// No-op gracefully if mdeapp has no eslint config (Phase 1 W1).
const mdeapp = "/home/sk/mdeai/mdeapp";
const hasEslintConfig =
  existsSync(resolve(mdeapp, ".eslintrc.json")) ||
  existsSync(resolve(mdeapp, ".eslintrc.js")) ||
  existsSync(resolve(mdeapp, ".eslintrc.cjs")) ||
  existsSync(resolve(mdeapp, "eslint.config.js")) ||
  existsSync(resolve(mdeapp, "eslint.config.mjs"));
if (!hasEslintConfig) process.exit(0);

const result = spawnSync("npx", ["--no", "eslint", "--no-warn-ignored", filePath], {
  cwd: mdeapp,
  encoding: "utf8",
  timeout: 20_000,
});

if (result.status !== 0) {
  process.stderr.write(`[lint warn] ${filePath}\n`);
  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
}

process.exit(0); // warn-only
