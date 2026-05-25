#!/usr/bin/env node
/**
 * Layout-only console sweep — no AI turn (runs even when Gemini billing is blocked).
 * Use on every MAP/core task before marking Done.
 *
 * Usage: node --env-file=.env.local scripts/verify-localhost-console-boot.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

const ALLOWED = [
  /favicon/i,
  /Download the React DevTools/i,
  /Failed to load resource.*favicon/i,
  /Lit is in dev mode/i,
];

/** Known env blockers — not layout regressions; reported separately. */
const ENV_BLOCKERS = [/Lightning dunning decision is deny/i, /AI_APICallError/i];

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

function classify(text) {
  if (ALLOWED.some((p) => p.test(text))) return "allowed";
  if (ENV_BLOCKERS.some((p) => p.test(text))) return "env";
  return "critical";
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  const res = await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (!res?.ok()) fail(`GET ${BASE} → ${res?.status()}`);

  await page.locator('[data-testid="chat-canvas"]').waitFor({
    state: "visible",
    timeout: 20_000,
  });
  await page.locator('[data-testid="center-chat-panel"]').waitFor({
    state: "visible",
    timeout: 10_000,
  });

  const chatInput = page.locator(".copilotKitInput textarea").first();
  await chatInput.waitFor({ state: "visible", timeout: 15_000 });

  const layout = await page.evaluate(() => ({
    hasCopilotChat: !!document.querySelector(".copilotKitChat"),
    hasSidebar: !!document.querySelector(".copilotKitSidebar"),
    visibleNavRails: [...document.querySelectorAll('[data-testid="nav-rail"]')].filter(
      (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== "none";
      },
    ).length,
    mapPanel: !!document.querySelector('[data-testid="map-panel"]'),
    horizontalOverflow:
      document.documentElement.scrollWidth > window.innerWidth + 2,
  }));

  await page.waitForTimeout(1500);

  const envErrors = errors.filter((e) => classify(e) === "env");
  const critical = errors.filter((e) => classify(e) === "critical");

  console.log(`✅ ${BASE} boot console sweep`);
  console.log(`   layout: centerChat=${layout.hasCopilotChat} sidebar=${layout.hasSidebar} navVisible=${layout.visibleNavRails}`);
  console.log(`   console errors (raw): ${errors.length}`);
  console.log(`   console errors (layout-critical): ${critical.length}`);
  console.log(`   console errors (env/billing): ${envErrors.length}`);

  if (layout.hasSidebar) fail("CopilotSidebar still present — expected MAP-007B center chat");
  if (!layout.hasCopilotChat) fail("Missing .copilotKitChat in center column");
  if (layout.visibleNavRails > 1) fail(`Duplicate visible nav-rail: ${layout.visibleNavRails}`);
  if (!(await chatInput.isVisible())) fail("Chat input not visible on boot");
  if (layout.horizontalOverflow) fail("Horizontal overflow on /");

  if (critical.length) {
    console.log("\nLayout-critical console errors:");
    for (const e of critical.slice(0, 10)) console.log("  •", e.slice(0, 400));
    fail(`${critical.length} layout-critical console error(s)`);
  }

  if (envErrors.length) {
    console.log("\n⚠ Env/billing console errors (not layout — fix GCP billing):");
    for (const e of envErrors.slice(0, 3)) console.log("  •", e.slice(0, 200));
    console.log("\n✅ Layout console clean (Gemini billing blocked — run verify:console after billing fix)");
  } else {
    console.log("\n✅ Boot console clean (no env blockers detected on idle load)");
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
