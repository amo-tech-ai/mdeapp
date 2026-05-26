#!/usr/bin/env node
/**
 * MAP-002 browser smoke: grounded cafés + GroundingAttribution in chat.
 * Requires: UI :3001, ADK :8000, GOOGLE_GENERATIVE_AI_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 *
 * Usage: node --env-file=.env.local scripts/smoke-grounding-attribution.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const ADK_BASE = process.env.ADK_GROUNDING_URL ?? "http://localhost:8000";
const QUERY =
  process.env.SMOKE_GROUNDING_QUERY ?? "Quiet cafés near Laureles";
const TIMEOUT_MS = 120_000;
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

async function assertSidecarGroundingLite() {
  const health = await fetch(`${ADK_BASE}/health`);
  if (!health.ok) fail(`ADK sidecar down at ${ADK_BASE}/health → ${health.status}`);

  const headers = { "Content-Type": "application/json" };
  const token = process.env.ADK_INTERNAL_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${ADK_BASE}/v1/grounding/invoke`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tool: "search_grounded_places",
      query: QUERY,
      pageSize: 3,
      locationBias: { latitude: 6.2442, longitude: -75.5812 },
    }),
  });
  const body = await res.json();
  const source = body.metadata?.source ?? "unknown";
  const pins = body.pins ?? [];
  console.log(`✅ sidecar invoke HTTP ${res.status}`);
  console.log(`   source: ${source}`);
  console.log(`   pins: ${pins.length}`);
  if (source !== "grounding-lite") {
    fail(`Done proof requires metadata.source=grounding-lite, got ${source}`);
  }
  if (pins.length < 1) {
    fail(`sidecar returned 0 pins — ${body.metadata?.reason ?? "unknown"}`);
  }
}

async function main() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    fail("missing GOOGLE_GENERATIVE_AI_API_KEY");
  }
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    fail("missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
  }

  await assertSidecarGroundingLite();

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const screenshotPath = path.join(
    SCREENSHOT_DIR,
    `map-002-grounding-attribution-${Date.now()}.png`,
  );

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error") errors.push(text);
    if (msg.type() === "warning") warnings.push(text);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  try {
    const res = await page.goto(BASE, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    if (!res?.ok()) fail(`GET ${BASE} → ${res?.status()}`);

    const refererHelp = page.locator('[data-testid="map-referer-help"]');
    if (await refererHelp.isVisible().catch(() => false)) {
      fail("RefererNotAllowedMapError — fix GCP HTTP referrers for http://localhost:3001/*");
    }

    await page
      .locator('[data-testid="chat-map"], [data-testid="map-referer-help"]')
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });

    const newChat = page.getByRole("link", { name: /new chat/i });
    if (await newChat.isVisible().catch(() => false)) {
      await newChat.click();
      await page.waitForLoadState("domcontentloaded");
    }

    const input = page.getByRole("textbox", { name: /type a message/i });
    await input.fill(QUERY);
    await page.getByRole("button", { name: /^send$/i }).click();

    await page.getByText(QUERY, { exact: true }).waitFor({
      state: "visible",
      timeout: 15_000,
    });

    await page.locator('[data-testid="grounded-card"]').first().waitFor({
      state: "visible",
      timeout: TIMEOUT_MS,
    });

    await page
      .locator(
        '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
      )
      .first()
      .waitFor({
        state: "visible",
        timeout: 30_000,
      });

    await page.waitForTimeout(2500);

    const groundedCards = await page.locator('[data-testid="grounded-card"]').count();
    const cardTitles = await page.locator('[data-testid="grounded-card"] h3').allTextContents();
    const genericPlaceCards = cardTitles.filter((t) => t.trim() === "Place");
    const attribution = await page.locator(
      '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
    ).count();
    const webCitationLinks = await page.locator(
      '[data-testid="web-citation-link"]',
    ).count();
    const pins = await page.locator('[data-testid="map-pin"]').count();
    const cafeGlyphs = await page.locator('[data-marker-glyph="cafe"]').count();
    const mapClustering = await page
      .locator('[data-testid="chat-map"][data-map-clustering="true"]')
      .count();
    const pinLabels = await page.locator("[data-pin-id]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label")),
    );

    await page.screenshot({ path: screenshotPath, fullPage: true });

    const criticalErrors = errors.filter((e) => !isAllowedConsole(e));
    const blockedPatterns = [
      /RefererNotAllowedMapError/i,
      /Maximum update depth exceeded/i,
      /gemini-maps-grounding/i,
    ];
    const blocked = criticalErrors.filter((e) =>
      blockedPatterns.some((p) => p.test(e)),
    );
    const mapsWarnings = warnings.filter(
      (w) => /maps|google|api key|referer|403|401/i.test(w) && !isAllowedConsole(w),
    );

    console.log(`✅ Chat grounded UI`);
    console.log(`   query: ${QUERY}`);
    console.log(`   card titles: ${cardTitles.join(" | ")}`);
    console.log(`   grounded-card count: ${groundedCards}`);
    console.log(`   grounding-attribution count: ${attribution}`);
    console.log(`   web-citation links: ${webCitationLinks}`);
    console.log(`   map-pin count: ${pins}`);
    console.log(`   cafe-marker-glyph count: ${cafeGlyphs}`);
    console.log(`   pin labels: ${pinLabels.join(" | ")}`);
    console.log(`   screenshot: ${screenshotPath}`);
    console.log(`   console errors (critical): ${criticalErrors.length}`);

    if (groundedCards < 1) fail("Expected ≥1 [data-testid=grounded-card]");
    if (genericPlaceCards.length > 0) {
      fail(`Expected no generic Place cards, got ${genericPlaceCards.length}`);
    }
    if (attribution < 1) {
      fail("Expected grounding attribution footer (compact or full)");
    }
    if (pins < 1) fail(`Expected ≥1 map pin, got ${pins}`);
    if (cafeGlyphs < 1) {
      fail(
        `MAP-030: expected ≥1 cafe marker (data-marker-glyph=cafe), got ${cafeGlyphs}`,
      );
    }
    if (pins >= 4 && mapClustering < 1) {
      fail(
        `MAP-009: expected data-map-clustering=true on chat-map when ≥4 pins, got ${mapClustering}`,
      );
    }

    const noPinsYet = page.locator('[data-testid="results-empty"]');
    const groundedOnMap = page.locator('[data-testid="results-grounded-on-map"]');
    if (await noPinsYet.isVisible().catch(() => false)) {
      fail(
        "MAP-031: Map results strip must not show results-empty when grounded pins are on the map",
      );
    }
    if (!(await groundedOnMap.isVisible().catch(() => false))) {
      fail(
        "MAP-031: expected results-grounded-on-map copy when rich grounded cards hide pin rows",
      );
    }
    if (webCitationLinks > 0) {
      fail(
        `Café query must not show MAP-002D web citations, got ${webCitationLinks}`,
      );
    }
    if (blocked.length) {
      for (const e of blocked) console.log("  •", e.slice(0, 300));
      fail(`${blocked.length} blocked console error(s)`);
    }
    if (criticalErrors.length) {
      for (const e of criticalErrors.slice(0, 10)) console.log("  •", e.slice(0, 300));
      fail(`${criticalErrors.length} critical console error(s)`);
    }
    if (mapsWarnings.length) {
      for (const w of mapsWarnings.slice(0, 5)) console.log("  •", w.slice(0, 300));
      fail(`${mapsWarnings.length} maps-related warning(s)`);
    }

    console.log("\n✅ MAP-002 smoke: grounding attribution + pins (grounding-lite)");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
