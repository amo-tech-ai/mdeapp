import { test, expect, type Page } from "@playwright/test";
import {
  RESTAURANT_FAST_PATH_QUERY,
  gotoHome,
  sendConciergeMessage,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

/**
 * SAN-494 · EVT-035 — Restaurant card Event Venue CTA — live dual-state e2e.
 *
 * Runs unmocked against the live DB and supports BOTH valid states:
 *   A. no rendered card matches a mapped venue → no CTA, no badge, no crash
 *   B. a card matches a mapped venue (real google_place_id) → CTA + badge
 *      visible, sheet opens with offerings
 * Production maps one real venue (Mamasita Medallo — the SAN-493 seed row
 * remapped to its real place id 2026-06-10), so prod runs can exercise B.
 *
 * There is intentionally NO mocked positive-path e2e here: which cards the
 * concierge returns is LLM-routed and nondeterministic (clarify replies,
 * placeId-less card paths), which made a mocked chat e2e irreducibly flaky.
 * The deterministic positive path is covered by unit tests:
 *   src/components/copilot/__tests__/restaurant-card.test.tsx
 *   src/components/sheets/__tests__/event-venue-offerings-sheet.test.tsx
 *   src/lib/venues/fetch-event-venue-offerings.test.ts
 */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

function collectConsoleErrors(page: Page, sink: string[]) {
  page.on("console", (msg) => {
    if (msg.type() === "error") sink.push(msg.text());
  });
  page.on("pageerror", (err) => sink.push(`pageerror: ${err.message}`));
}

function filterExpectedErrors(errors: string[]) {
  return errors.filter(
    (e) =>
      !/venue_event_offerings|venue_event_packages|PGRST/i.test(e) &&
      !/Failed to load resource.*40[04]/i.test(e) &&
      // headless Chromium lacks WebGL: Maps falls back to raster (env artifact)
      !/Attempted to load a Vector Map, but failed/i.test(e),
  );
}

/**
 * Production-tolerant card wait: no fast-path-panel assumptions, just poll
 * for rendered restaurant cards. The concierge may first ask a clarifying
 * question (cuisine/vibe/budget chips) — answer it once like a real user,
 * then keep waiting. Prod cold starts + Gemini latency can take well over
 * the local helper's budget.
 */
async function waitForCardsLoose(page: Page, timeoutMs = 150_000) {
  const cards = page.locator('[data-testid="restaurant-card"]');
  const deadline = Date.now() + timeoutMs;
  let clarified = false;

  while (Date.now() < deadline) {
    if ((await cards.count()) > 0) return;
    if (!clarified) {
      const clarify = page.getByText(/what kind of restaurant/i).first();
      if (await clarify.isVisible().catch(() => false)) {
        clarified = true;
        await sendConciergeMessage(page, "fine dining in El Poblado");
      }
    }
    await page.waitForTimeout(2_000);
  }
  expect(await cards.count(), "restaurant cards rendered").toBeGreaterThan(0);
}

async function assertSheetFlow(page: Page) {
  const cta = page.locator('[data-testid="event-venue-cta"]').first();
  await expect(cta).toBeVisible();

  const box = await cta.boundingBox();
  expect(box, "CTA bounding box").toBeTruthy();
  expect(
    box ? box.height : 0,
    "CTA touch target height >= 44px",
  ).toBeGreaterThanOrEqual(44);
  expect(
    box ? box.width : 0,
    "CTA touch target width >= 44px",
  ).toBeGreaterThanOrEqual(
    44,
  );

  await cta.click();
  const sheet = page.locator('[data-testid="event-venue-offerings-sheet"]');
  await expect(sheet).toBeVisible();
  await expect(
    page.locator('[data-testid="event-venue-offerings-list"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="event-venue-offering-card"]').first(),
  ).toBeVisible();

  const proposalBtn = page.locator('[data-testid="request-proposal-btn"]');
  await expect(proposalBtn).toBeVisible();
  await proposalBtn.click();
  const proposalShell = page.locator('[data-testid="event-proposal-shell"]');
  await expect(proposalShell).toBeVisible();
  await expect(
    page.locator('[data-testid="event-proposal-hitl-panel"]'),
  ).toBeVisible();
  await page.locator('[data-testid="event-proposal-cancel-btn"]').click();
  await expect(proposalShell).not.toBeVisible();

  await page.keyboard.press("Escape");
  await expect(sheet).not.toBeVisible();
}

test.describe("SAN-494 live DB dual state (no mocks)", () => {
  test("cards render; CTA flow if a venue is mapped, clean absence otherwise", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const consoleErrors: string[] = [];
    collectConsoleErrors(page, consoleErrors);

    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForCardsLoose(page);

    await expect(
      page.locator('[data-testid="restaurant-card"]').first(),
    ).toBeVisible();

    // The offerings fetch is async per card; give it a beat to settle.
    await page.waitForTimeout(5_000);
    const ctaCount = await page
      .locator('[data-testid="event-venue-cta"]')
      .count();

    if (ctaCount > 0) {
      // State B — a rendered card matched a mapped, verified venue.
      await expect(
        page.locator('[data-testid="restaurant-hosts-events-badge"]').first(),
      ).toBeVisible();
      await assertSheetFlow(page);
    } else {
      // State A — no mapped venue among the rendered cards.
      await expect(
        page.locator('[data-testid="restaurant-hosts-events-badge"]'),
      ).toHaveCount(0);
    }

    expect(filterExpectedErrors(consoleErrors), "console errors").toEqual([]);
  });
});
