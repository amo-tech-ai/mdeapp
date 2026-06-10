#!/usr/bin/env node
/**
 * Fast-path routing smoke — unit tests + API shape (no full CopilotKit agent turn).
 * Usage: node tasks/testing/scripts/mastra-routing-smoke.mjs [--base http://localhost:3001]
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3001";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../mdeapp");

function ok(label, pass, detail = "") {
  const mark = pass ? "PASS" : "FAIL";
  console.log(`${mark}  ${label}${detail ? ` — ${detail}` : ""}`);
  return pass;
}

function runVitest(pattern) {
  const r = spawnSync(
    "npm",
    ["test", "--", "--run", pattern],
    { cwd: root, encoding: "utf8", shell: false },
  );
  return { code: r.status ?? 1, out: (r.stdout || "") + (r.stderr || "") };
}

async function post(path, body) {
  const t0 = performance.now();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const ms = Math.round(performance.now() - t0);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, json, ms };
}

async function main() {
  let failed = 0;

  console.log("--- Vitest routing classifiers ---\n");

  const rentalVt = runVitest("src/lib/__tests__/rental-search-fast-path.test.ts");
  if (!ok("Vitest rental-search-fast-path", rentalVt.code === 0, `exit ${rentalVt.code}`))
    failed++;

  const eventVt = runVitest("src/lib/__tests__/event-search-fast-path.test.ts");
  if (!ok("Vitest event-search-fast-path", eventVt.code === 0, `exit ${eventVt.code}`))
    failed++;

  const cafeVt = runVitest("src/mastra/tools/__tests__/search-grounded-places-quality.test.ts");
  if (
    !ok(
      "Vitest search-grounded-places-quality",
      cafeVt.code === 0,
      `exit ${cafeVt.code}`,
    )
  )
    failed++;

  console.log("\n--- API fast paths (inventory) ---\n");

  const ck = await post("/api/copilotkit", {});
  if (!ok("CopilotKit runtime reachable", ck.status === 400, `${ck.status} ${ck.ms}ms`))
    failed++;

  const rentals = await post("/api/rentals/search", {
    neighborhood: "Laureles",
    maxPricePerNight: 80,
    limit: 5,
  });
  if (
    !ok(
      "Rental prompt → /api/rentals/search",
      rentals.status === 200 && (rentals.json?.results?.length ?? 0) >= 1,
      `${rentals.ms}ms`,
    )
  )
    failed++;

  const events = await post("/api/events/search", { dateWindow: "any", limit: 5 });
  if (
    !ok(
      "Event inventory → /api/events/search",
      events.status === 200 && (events.json?.results?.length ?? 0) >= 1,
      `${events.ms}ms`,
    )
  )
    failed++;

  console.log(
    "\nNOTE: Full conciergeAgent tool routing requires Browser/Playwright (see 05-mastra-copilot-routing-smoke.md).",
  );

  console.log(failed ? `\n${failed} check(s) failed` : "\nAll routing smoke checks passed");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
