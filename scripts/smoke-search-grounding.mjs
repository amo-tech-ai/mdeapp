#!/usr/bin/env node
/**
 * MAP-002D browser smoke — Tourist chat shows "From the web" citation chips.
 * Requires: npm run dev (:3001), ENABLE_SEARCH_GROUNDING=1, ADK + Gemini keys.
 *
 * Usage: node --env-file=.env.local scripts/smoke-search-grounding.mjs
 */
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const QUERY =
  process.env.SMOKE_SEARCH_QUERY ??
  "Nightlife events in Poblado this Friday — search events then verify on the web.";
const TIMEOUT_MS = 240_000;
const SCREENSHOT_DIR =
  process.env.SMOKE_SCREENSHOT_DIR ?? path.join(process.cwd(), "tmp");

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

function isAllowedConsole(text) {
  return (
    /favicon/i.test(text) ||
    /Download the React DevTools/i.test(text) ||
    /Failed to load resource.*favicon/i.test(text)
  );
}

async function main() {
  if (process.env.ENABLE_SEARCH_GROUNDING?.trim() !== "1") {
    fail("ENABLE_SEARCH_GROUNDING=1 required");
  }
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    fail("missing GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const pre = spawnSync(
    "node",
    ["--env-file=.env.local", "scripts/verify-search-grounding.mjs"],
    { cwd: process.cwd(), stdio: "inherit" },
  );
  if (pre.status !== 0) fail("verify-search-grounding failed");

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const screenshotPath = path.join(
    SCREENSHOT_DIR,
    `map-002d-web-citations-${Date.now()}.png`,
  );

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  try {
    const res = await page.goto(BASE, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    if (!res?.ok()) fail(`GET ${BASE} → ${res?.status()}`);

    await page
      .locator('[data-testid="chat-map"], [data-testid="map-referer-help"]')
      .first()
      .waitFor({ state: "visible", timeout: 20_000 });

    const input = page.getByRole("textbox", { name: /type a message/i });
    await input.fill(QUERY);
    await page.getByRole("button", { name: /^send$/i }).click();

    await page.getByText(QUERY, { exact: true }).waitFor({
      state: "visible",
      timeout: 20_000,
    });

    await page
      .locator(
        '[data-testid="web-citation-badge"], [data-testid="event-results-panel"] [data-testid="web-citation-badge"]',
      )
      .first()
      .waitFor({
        state: "visible",
        timeout: TIMEOUT_MS,
      });

    await page.locator('[data-testid="web-citation-link"]').first().waitFor({
      state: "visible",
      timeout: 30_000,
    });

    await page.waitForTimeout(2000);

    const badge = await page.locator('[data-testid="web-citation-badge"]').count();
    const links = await page.locator('[data-testid="web-citation-link"]').count();
    const linkHrefs = await page
      .locator('[data-testid="web-citation-link"]')
      .evaluateAll((els) => els.map((el) => (el instanceof HTMLAnchorElement ? el.href : "")));

    await page.screenshot({ path: screenshotPath, fullPage: true });

    const critical = errors.filter((e) => !isAllowedConsole(e));
    console.log(`✅ MAP-002D chat smoke`);
    console.log(`   query: ${QUERY}`);
    console.log(`   From the web badge: ${badge}`);
    console.log(`   citation links: ${links}`);
    console.log(`   hrefs: ${linkHrefs.slice(0, 3).join(" | ")}`);
    console.log(`   screenshot: ${screenshotPath}`);
    console.log(`   console errors: ${critical.length}`);

    if (badge < 1) fail('Expected [data-testid="web-citation-badge"]');
    if (links < 1) fail('Expected ≥1 [data-testid="web-citation-link"]');
    if (!linkHrefs.some((h) => h.startsWith("http"))) {
      fail("Expected at least one http citation link");
    }
    if (critical.length) {
      for (const e of critical.slice(0, 5)) console.log("  •", e.slice(0, 300));
      fail(`${critical.length} critical console error(s)`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
