#!/usr/bin/env node
/**
 * C-010d prod pin-clear gate — skips unless SMOKE_BASE_URL is production.
 */
import { spawnSync } from "node:child_process";

const base = process.env.SMOKE_BASE_URL ?? "";
const prod = "https://www.mdeai.co";

if (base !== prod) {
  console.log(
    `test-prod-gate: skip (SMOKE_BASE_URL=${base || "(unset)"}, need ${prod})`,
  );
  process.exit(0);
}

const r = spawnSync(
  "npx",
  [
    "playwright",
    "test",
    "e2e/prod/pr12-pin-clear-prod-gate.spec.ts",
    "--project=chromium",
  ],
  {
    stdio: "inherit",
    env: { ...process.env, PW_SKIP_WEBSERVER: "1" },
  },
);

process.exit(r.status ?? 1);
