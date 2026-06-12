#!/usr/bin/env node
/**
 * SAN-881 · VEB-MVP-010 — fail CI when integration lane is enabled but proof cannot run.
 */
import { spawnSync } from "node:child_process";

if (process.env.VEB_MVP_010_INTEGRATION !== "1") {
  console.error("::error::VEB_MVP_010_INTEGRATION must be 1");
  process.exit(1);
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error(
    "::error::DATABASE_URL secret required when VEB_MVP_010_INTEGRATION_ENABLED=true",
  );
  process.exit(1);
}

const result = spawnSync(
  "npm",
  ["test", "--", "--run", "storage-durability.integration"],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  },
);

process.exit(result.status ?? 1);
