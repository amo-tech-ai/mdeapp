#!/usr/bin/env node
// PostToolUse hook for Edit|Write|MultiEdit.
// Runs `npx tsc --noEmit` in mdeapp/ when a .ts/.tsx file under mdeapp/src or mdeapp/supabase/functions is touched.
// Warn-only: never blocks. Filters output to the touched file only.

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
if (!/\.(ts|tsx)$/.test(filePath)) process.exit(0);
if (!/\/mdeapp\/(src|supabase\/functions)\/.test(filePath)) process.exit(0);

const mdeapp = "/home/sk/mdeai/mdeapp";
if (!existsSync(resolve(mdeapp, "tsconfig.json"))) process.exit(0);

// Debounce — file lock to avoid concurrent tsc thrash.
const lock = resolve(mdeapp, "node_modules/.cache/.tsc-hook-running");
if (existsSync(lock)) process.exit(0);

const result = spawnSync(
  "npx",
  ["--no", "--", "tsc", "--noEmit", "--pretty", "false", "--incremental", "false"],
  {
    cwd: mdeapp,
    encoding: "utf8",
    timeout: 60_000,
  },
);

if (result.status !== 0) {
  const allOutput = `${result.stdout || ""}${result.stderr || ""}`;
  const lines = allOutput.split("\n").filter(Boolean);
  const relPath = filePath.replace(`${mdeapp}/`, "");
  const relevant = lines.filter((l) => l.includes(relPath));
  const showLines = relevant.length ? relevant : lines.slice(0, 25);

  process.stderr.write(`[tsc warn] ${filePath}\n`);
  process.stderr.write(showLines.join("\n") + "\n");
}

process.exit(0); // warn-only
