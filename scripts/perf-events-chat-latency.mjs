#!/usr/bin/env node
/**
 * Measure event list clarify + Music chip latency on localhost.
 * Usage: node scripts/perf-events-chat-latency.mjs
 * Requires: npm run dev on SMOKE_BASE_URL (default http://localhost:3001)
 */
import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

function ms(start) {
  return Math.round(performance.now() - start);
}

function trackUrl(url) {
  return (
    url.includes("/api/copilotkit") ||
    url.includes("/api/events/search") ||
    url.includes("/api/grounding/event-web")
  );
}

async function main() {
  const requests = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("request", (req) => {
    const url = req.url();
    if (trackUrl(url)) {
      requests.push({ url, method: req.method(), t: performance.now() });
    }
  });
  page.on("response", async (res) => {
    const url = res.url();
    if (!trackUrl(url)) return;
    const match = requests.find(
      (r) => r.url === url && r.end == null && r.method === res.request().method(),
    );
    if (match) {
      match.status = res.status();
      match.end = performance.now();
      match.durationMs = Math.round(match.end - match.t);
    }
  });

  await page.addStyleTag({
    content:
      "cpk-web-inspector { display: none !important; pointer-events: none !important; }",
  });

  const bootStart = performance.now();
  const res = await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  if (!res?.ok()) {
    console.error(`FAIL: GET / → ${res?.status()}`);
    process.exit(1);
  }
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await page
    .getByTestId("copilot-chat-ready")
    .waitFor({ state: "attached", timeout: 20_000 });

  requests.length = 0;
  console.log(`Page ready: ${ms(bootStart)}ms (network counter starts after chat-ready)`);

  await page.getByRole("button", { name: /^events$/i }).click();

  const input = page.getByRole("textbox", { name: /type a message/i });
  await input.waitFor({ state: "visible", timeout: 15_000 });
  requests.length = 0;
  const t1Start = performance.now();
  await input.fill("list events medellin");
  await page.getByRole("button", { name: /^send$/i }).click();

  await page.getByTestId("event-clarify").waitFor({
    state: "visible",
    timeout: 10_000,
  });
  const t1Ms = ms(t1Start);
  const clarifyCopilotCalls = requests.filter((r) =>
    r.url.includes("copilotkit"),
  ).length;

  const cardCountAfterClarify = await page
    .locator('[data-testid="event-card"]')
    .count();

  const t2Start = performance.now();
  const searchBeforeChip = requests.filter((r) =>
    r.url.includes("events/search"),
  ).length;
  const copilotBeforeChip = requests.filter((r) =>
    r.url.includes("copilotkit"),
  ).length;
  const groundingBeforeChip = requests.filter((r) =>
    r.url.includes("grounding/event-web"),
  ).length;

  await page.getByTestId("filter-chip-ev-music").click();

  await page.locator('[data-testid="event-card"]').first().waitFor({
    state: "visible",
    timeout: 15_000,
  });
  const t2Ms = ms(t2Start);
  const cardCount = await page.locator('[data-testid="event-card"]').count();

  const searchCalls = requests.filter((r) => r.url.includes("events/search"));
  const copilotCalls = requests.filter((r) => r.url.includes("copilotkit"));
  const groundingCalls = requests.filter((r) =>
    r.url.includes("grounding/event-web"),
  );
  const newSearch = searchCalls.length - searchBeforeChip;
  const newCopilot = copilotCalls.length - copilotBeforeChip;
  const newGrounding = groundingCalls.length - groundingBeforeChip;

  console.log("\n--- Results ---");
  console.log(`T1 clarify visible: ${t1Ms}ms (target <500ms)`);
  console.log(`  copilotkit POSTs during T1: ${clarifyCopilotCalls} (target 0)`);
  console.log(`  event cards after clarify: ${cardCountAfterClarify} (target 0)`);
  console.log(`T2 Music chip → first card: ${t2Ms}ms (target <4000ms)`);
  console.log(`  new /api/events/search: ${newSearch} (target exactly 1)`);
  console.log(`  new copilotkit during T2: ${newCopilot} (target 0)`);
  console.log(`  new /api/grounding/event-web during T2: ${newGrounding} (target 0)`);
  console.log(`  event cards: ${cardCount}`);

  if (searchCalls.length > 0) {
    console.log("\nAPI timings:");
    for (const r of searchCalls) {
      console.log(
        `  events/search ${r.status ?? "?"} ${r.durationMs != null ? `${r.durationMs}ms` : "pending"}`,
      );
    }
  }

  const pass =
    t1Ms < 500 &&
    clarifyCopilotCalls === 0 &&
    cardCountAfterClarify === 0 &&
    t2Ms < 4000 &&
    newSearch === 1 &&
    newCopilot === 0 &&
    newGrounding === 0 &&
    cardCount >= 1;

  console.log(`\n${pass ? "PASS" : "FAIL"} (perf smoke)`);
  await browser.close();
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
