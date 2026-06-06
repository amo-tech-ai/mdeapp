#!/usr/bin/env node
/**
 * Task-scoped verification — floor + task-specific vitest/e2e/smoke.
 * Usage: node scripts/verify-task.mjs VEN-031 [--skip-floor] [--base http://localhost:3001]
 * Docs: scripts/verify-task.md · tasks/notes/improve.md §5
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");

const taskId = process.argv.find((a) => /^[A-Z][A-Z0-9-]+$/i.test(a) && !a.startsWith("--"));
const skipFloor = process.argv.includes("--skip-floor");
const baseIdx = process.argv.indexOf("--base");
const smokeBase =
  baseIdx >= 0 ? process.argv[baseIdx + 1] : "http://localhost:3001";

/** @type {Record<string, { vitest?: string[]; e2e?: string[]; smoke?: boolean; extra?: string[] }>} */
const REGISTRY = {
  "SAN-462": {
    e2e: ["e2e/prod-synthetic-smoke.spec.ts"],
    smoke: true,
  },
  "SAN-589": {
    vitest: [
      "src/mastra/lib/mastra-telemetry.test.ts",
      "src/mastra/lib/mastra-telemetry-flows.test.ts",
      "src/mastra/lib/run-audited-search.test.ts",
      "src/mastra/lib/tool-audit-context.test.ts",
      "src/mastra/lib/log-agent-run.test.ts",
    ],
  },
  "OPS-JOURNEY": {
    e2e: [
      "e2e/prod-synthetic-smoke.spec.ts",
      "e2e/prod-venues-journey.spec.ts",
    ],
    smoke: true,
  },
  "SEARCH-003": {
    vitest: [
      "src/mastra/lib/__tests__/intelligence-restaurant-search.test.ts",
      "src/mastra/lib/__tests__/search-003-ranking.integration.test.ts",
    ],
    extra: ["npm run smoke:golden-queries"],
  },
  "INT-021": {
    vitest: [
      "src/mastra/lib/__tests__/intelligence-restaurant-venue-wrapper.test.ts",
      "src/mastra/lib/__tests__/intelligence-restaurant-search.test.ts",
      "src/mastra/lib/__tests__/intelligence-anchor-search.test.ts",
      "src/lib/__tests__/restaurant-search-fast-path.test.ts",
      "src/lib/__tests__/cafe-search-fast-path.test.ts",
    ],
  },
  "DATA-041": {
    vitest: ["src/mastra/lib/__tests__/intelligence-restaurant-search.test.ts"],
    extra: ["npm run verify:mis-phase1"],
  },
  "VEN-012": {
    vitest: [
      "src/lib/__tests__/parse-grounded-tool-result.test.ts",
      "src/lib/__tests__/grounded-venue-kind.test.ts",
    ],
    e2e: ["e2e/maps-grounding.spec.ts"],
  },
  "VEN-021": {
    vitest: [
      "src/app/api/venue-booking/request/route.test.ts",
      "src/lib/venues/venue-booking-core.test.ts",
    ],
  },
  "VEN-020": {
    vitest: ["src/components/venues/__tests__/venue-booking-status-chip.test.tsx"],
  },
  "VEN-031": {
    vitest: ["src/components/venues/", "src/lib/venues/"],
    e2e: ["e2e/screens/VEN-035-venue-release.spec.ts"],
  },
  "MAP-008B": {
    vitest: ["src/lib/__tests__/google-maps-map-id.test.ts"],
    extra: ["npm run verify:maps-env"],
  },
  "MAP-002B": {
    vitest: ["src/mastra/lib/adk-grounding-client.test.ts"],
    extra: [
      "npm run verify:cloud-run-grounding",
      "npm run verify:grounding",
    ],
  },
  "AUTH-011": {
    extra: ["npm run verify:console:boot"],
  },
  "SCREEN-023": {
    vitest: ["src/app/api/restaurants/search/route.test.ts"],
    e2e: ["e2e/screens/SCREEN-023-restaurant-listings.spec.ts"],
  },
  "SCREEN-005": {
    vitest: ["src/app/api/rentals/search/"],
    e2e: ["e2e/maps-layout-desktop.spec.ts"],
  },
};

const PROD_E2E = /^e2e\/prod-/;

/** @type {{ label: string; ok: boolean }[]} */
const stepLog = [];

function run(cmd, args, opts = {}) {
  const label = [cmd, ...args].join(" ");
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  const ok = r.status === 0;
  stepLog.push({ label, ok });
  if (!ok) {
    console.error(`\n✗ failed: ${label} (exit ${r.status ?? 1})`);
    printSummary("FAIL");
    process.exit(r.status ?? 1);
  }
  console.log(`✓ ${label}`);
}

function runNpm(script) {
  run("npm", ["run", script], { shell: process.platform === "win32" });
}

function planSteps(key, cfg) {
  const steps = [];
  if (!skipFloor) steps.push("npm run floor");
  if (!cfg) {
    steps.push("(no task probes — registry miss)");
    return steps;
  }
  for (const g of cfg.vitest ?? []) steps.push(`vitest --run ${g}`);
  for (const s of cfg.e2e ?? []) steps.push(`playwright test ${s}`);
  if (cfg.smoke) steps.push(`chat-smoke.mjs --base ${smokeBase}`);
  for (const x of cfg.extra ?? []) steps.push(x);
  return steps;
}

function warnProdE2eSkipped(cfg) {
  if (!cfg?.e2e?.some((s) => PROD_E2E.test(s))) return;
  if (process.env.PROD_SMOKE_BASE_URL?.trim()) return;
  console.warn(
    "\n⚠ Prod Playwright specs will SKIP without PROD_SMOKE_BASE_URL.",
  );
  console.warn(
    "  PROD_SMOKE_BASE_URL=https://www.mdeai.co npm run verify:task -- " +
      `${taskId?.toUpperCase()}${skipFloor ? " --skip-floor" : ""}`,
  );
}

function printSummary(result) {
  console.log("\n── verify:task summary ──");
  console.log(`  task:       ${taskId?.toUpperCase() ?? "(none)"}`);
  console.log(`  floor:      ${skipFloor ? "skipped (--skip-floor)" : "included"}`);
  console.log(`  smoke base: ${smokeBase}`);
  console.log(`  steps:      ${stepLog.length} ran, ${stepLog.filter((s) => s.ok).length} passed`);
  for (const s of stepLog) {
    console.log(`    ${s.ok ? "✓" : "✗"} ${s.label}`);
  }
  console.log(`  result:     ${result}`);
  console.log("────────────────────────\n");
}

function main() {
  if (!taskId) {
    console.error("Usage: npm run verify:task -- <TASK-ID> [--skip-floor] [--base URL]");
    console.error("Docs:  mdeapp/scripts/verify-task.md");
    console.error("Registered:", Object.keys(REGISTRY).sort().join(", "));
    process.exit(1);
  }

  const key = taskId.toUpperCase();
  const cfg = REGISTRY[key];

  console.log("\n══════════════════════════════════════");
  console.log(`  verify:task  ${key}`);
  console.log(`  floor:      ${skipFloor ? "SKIP" : "RUN"}`);
  console.log(`  registry:   ${cfg ? "hit" : "miss (floor only)"}`);
  console.log("══════════════════════════════════════");

  const planned = planSteps(key, cfg);
  console.log("\nPlanned steps:");
  planned.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

  warnProdE2eSkipped(cfg);

  if (!skipFloor) {
    runNpm("floor");
  }

  if (!cfg) {
    console.warn(
      `\n⚠ No registry entry for ${key} — floor only. Add to scripts/verify-task.mjs REGISTRY.`,
    );
    printSummary("PASS (floor only)");
    return;
  }

  for (const glob of cfg.vitest ?? []) {
    run("npm", ["test", "--", "--run", glob]);
  }

  for (const spec of cfg.e2e ?? []) {
    run("npx", [
      "playwright",
      "test",
      spec,
      "--project=chromium",
      "--workers=1",
    ]);
  }

  if (cfg.smoke) {
    const smokeScript = path.join(
      REPO_ROOT,
      "tasks/testing/scripts/chat-smoke.mjs",
    );
    run("node", [smokeScript, "--base", smokeBase]);
  }

  for (const script of cfg.extra ?? []) {
    if (script.startsWith("npm run ")) {
      runNpm(script.slice("npm run ".length));
    } else {
      const parts = script.split(" ");
      run(parts[0], parts.slice(1));
    }
  }

  printSummary("PASS");
}

main();
