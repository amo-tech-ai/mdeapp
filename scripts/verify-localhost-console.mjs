#!/usr/bin/env node
/**
 * Localhost console sweep — / and one rental chat turn.
 * Requires dev on :3001.
 */
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const QUERY = "1BR apartment in Laureles under 80 dollars per night";
const ALLOWED_PATTERNS = [
  /favicon/i,
  /Download the React DevTools/i,
  /Failed to load resource.*favicon/i,
  /Lit is in dev mode/i,
];

/** Gemini billing — env issue, not layout (still fails full verify until billing fixed). */
const ENV_BLOCKER_PATTERNS = [/Lightning dunning decision is deny/i, /AI_APICallError/i];

function isAllowed(text) {
  return ALLOWED_PATTERNS.some((p) => p.test(text));
}

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") errors.push(text);
    if (type === "warning") warnings.push(text);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  const res = await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (!res?.ok()) fail(`GET ${BASE} → ${res?.status()}`);

  await page
    .locator('[data-testid="chat-canvas"], [data-testid="center-chat-panel"]')
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });

  const input = page.locator(".copilotKitInput textarea").first();
  await input.waitFor({ state: "visible", timeout: 15_000 });
  await input.fill(QUERY);
  await page.getByRole("button", { name: /^send$/i }).click();

  await page.getByText(QUERY, { exact: true }).waitFor({
    state: "visible",
    timeout: 15_000,
  });

  await page.locator('[data-testid="rental-card"]').first().waitFor({
    state: "visible",
    timeout: 120_000,
  }).catch(async () => {
    const envHit = errors.some((e) => ENV_BLOCKER_PATTERNS.some((p) => p.test(e)));
    if (envHit) {
      fail(
        "Gemini billing blocked (Lightning dunning deny) — fix GCP billing then re-run. Layout/console boot: npm run verify:console:boot",
      );
    }
    throw new Error("rental-card timeout — agent did not return cards");
  });
  await page.waitForTimeout(2000);

  const criticalErrors = errors.filter((e) => !isAllowed(e));
  const criticalWarnings = warnings.filter(
    (w) => /maps|google|api key|referer|403|401/i.test(w) && !isAllowed(w),
  );

  console.log(`✅ ${BASE} loaded`);
  console.log(`   console errors (raw): ${errors.length}`);
  console.log(`   console errors (critical): ${criticalErrors.length}`);
  console.log(`   maps-related warnings: ${criticalWarnings.length}`);

  if (criticalErrors.length) {
    console.log("\nCritical console errors:");
    for (const e of criticalErrors.slice(0, 15)) console.log("  •", e.slice(0, 300));
    fail(`${criticalErrors.length} critical console error(s)`);
  }

  if (criticalWarnings.length) {
    console.log("\nMaps-related warnings:");
    for (const w of criticalWarnings.slice(0, 10)) console.log("  •", w.slice(0, 300));
    fail(`${criticalWarnings.length} maps-related warning(s)`);
  }

  console.log("\n✅ No critical console errors on / + rental chat turn");
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
