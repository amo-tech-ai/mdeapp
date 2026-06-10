#!/usr/bin/env node
/**
 * SAN-823 prod browser proof — https://www.mdeai.co
 * Usage: node tasks/testing/scripts/post-merge-san823-prod.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.PROD_BASE ?? "https://www.mdeai.co";
const OUT = process.env.OUT_DIR ?? path.join(process.cwd(), "../tasks/testing/evidence/2026-06-08/post-merge-san823");
const TS = new Date().toISOString();

const JOURNEYS = [
  { id: "J1-hero", surface: "homepage", query: "apartments in laureles", expectClarify: false, expectCards: true },
  { id: "J2-chat", surface: "chat", query: "2BR poblado under 900", expectClarify: false, expectCards: true },
  { id: "J3-chat", surface: "chat", query: "furnished studio estadio", expectClarify: false, expectCards: true },
  { id: "J4-neg", surface: "chat", query: "help me find a place", expectClarify: true, expectCards: false },
  { id: "J5-neg", surface: "chat", query: "I am moving soon", expectClarify: true, expectCards: false },
];

fs.mkdirSync(OUT, { recursive: true });

async function syncInput(page, text) {
  const input = page.getByRole("searchbox", { name: /ask the ai concierge/i });
  await input.click();
  await input.evaluate((node, value) => {
    const el = node;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, text);
}

async function sendChat(page, text) {
  const textarea = page.locator('textarea[placeholder*="Ask"], textarea').first();
  await textarea.waitFor({ state: "visible", timeout: 30_000 });
  await textarea.fill(text);
  await textarea.dispatchEvent("input");
  const send = page.getByRole("button", { name: /^send$/i });
  await send.waitFor({ state: "visible", timeout: 10_000 });
  if (await send.isEnabled()) await send.click();
  else await textarea.press("Enter");
}

const results = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1360, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
const networkFailures = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("response", (res) => {
  const u = res.url();
  if ((u.includes("/api/") || u.includes("copilotkit")) && res.status() >= 400) {
    networkFailures.push(`${res.status()} ${u}`);
  }
});

for (const j of JOURNEYS) {
  const row = { ...j, timestamp: TS, base: BASE, consoleErrors: 0, networkErrors: 0, pass: false, actual: {} };
  consoleErrors.length = 0;
  networkFailures.length = 0;

  try {
    if (j.surface === "homepage") {
      await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await syncInput(page, j.query);
      const submit = page.getByRole("button", { name: /^search$/i });
      await submit.click();
      await page.waitForURL(/\/chat/, { timeout: 60_000 });
    } else {
      await page.goto(BASE + "/chat", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await page.locator('[data-testid="chat-canvas"]').waitFor({ timeout: 30_000 });
      await sendChat(page, j.query);
    }

    await page.waitForTimeout(5000);
    const clarify = await page.getByText(/budget|bedrooms|neighborhood|What kind of|tell me more|clarify/i).first().isVisible().catch(() => false);
    const cards = await page.locator('[data-testid="rental-card"]').count();
    const pins = await page.locator('[data-testid="map-pin"]').count();
    row.actual = { clarify, cards, pins, url: page.url() };
    row.consoleErrors = consoleErrors.length;
    row.networkErrors = networkFailures.length;

    const clarifyOk = j.expectClarify ? clarify : !clarify;
    const cardsOk = j.expectCards ? cards > 0 : true;
    row.pass = clarifyOk && cardsOk;

    await page.screenshot({ path: path.join(OUT, `${j.id}.png`), fullPage: true });
  } catch (err) {
    row.actual = { error: String(err) };
    row.pass = false;
    await page.screenshot({ path: path.join(OUT, `${j.id}-error.png`), fullPage: true }).catch(() => {});
  }

  results.push(row);
  console.log(JSON.stringify(row));
}

await browser.close();
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ timestamp: TS, base: BASE, results }, null, 2));
console.log("Wrote", path.join(OUT, "results.json"));
