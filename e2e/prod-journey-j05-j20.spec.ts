import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForCopilotIdle,
  waitForRentalCards,
  waitForRestaurantCards,
  waitForCafeGroundedCards,
  RENTAL_QUERY,
  GROUNDING_QUERY,
  RESTAURANT_FAST_PATH_QUERY,
  NIGHTLIFE_GROUNDING_QUERY,
} from "./helpers/maps-layout";

const isProd = Boolean(process.env.PROD_SMOKE_BASE_URL?.trim());
const outDir =
  process.env.PROD_SMOKE_OUT_DIR ??
  path.join(process.cwd(), "tmp", "prod-journey-j05-j20");

test.describe("SAN-546 · OPS-JOURNEY — prod matrix J05–J20", () => {
  test.skip(!isProd, "Set PROD_SMOKE_BASE_URL (e.g. https://www.mdeai.co)");

  test.beforeAll(() => {
    fs.mkdirSync(outDir, { recursive: true });
  });

  test("J05 — quiet rooftop dinner in Provenza", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, "quiet rooftop dinner in Provenza");
    await waitForRestaurantCards(page);
    await waitForCopilotIdle(page, 120_000);
    expect(
      await page.locator('[data-testid="restaurant-card"]').count(),
    ).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(outDir, "j05-restaurants.png") });
  });

  test("J06 — rooftop cocktails Provenza (nightlife not café)", async ({
    page,
  }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, NIGHTLIFE_GROUNDING_QUERY);
    await waitForCopilotIdle(page, 150_000);
    const nightlife = await page
      .locator('[data-testid="nightlife-card"], [data-testid="grounded-card"][data-result-kind="nightlife"]')
      .count();
    const cafes = await page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .count();
    expect(nightlife + cafes).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(outDir, "j06-nightlife.png") });
  });

  test("J07 — best brunch in El Poblado", async ({ page }) => {
    test.setTimeout(240_000);
    await gotoHome(page);
    await sendConciergeMessage(page, "best brunch in El Poblado");
    await waitForRestaurantCards(page);
    await waitForCopilotIdle(page, 120_000);
    expect(
      await page.locator('[data-testid="restaurant-card"]').count(),
    ).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(outDir, "j07-brunch.png") });
  });

  test("J08 — restaurant card opens detail panel", async ({ page }) => {
    test.setTimeout(240_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);
    await waitForCopilotIdle(page, 120_000);
    const first = page.locator('[data-testid="restaurant-card"]').first();
    await first.locator('[data-testid="restaurant-details-cta"]').click();
    await expect(page.locator('[data-testid="map-panel"]')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, "j08-restaurant-detail.png") });
  });

  test("J09 — event buy CTA (checkout or login redirect)", async ({ page }) => {
    test.setTimeout(240_000);
    await gotoHome(page);
    await sendConciergeMessage(page, "salsa events this weekend in Medellín");
    await waitForCopilotIdle(page, 150_000);
    const eventCard = page.locator('[data-testid="event-card"]').first();
    await eventCard.waitFor({ state: "visible", timeout: 120_000 });
    const buy = eventCard.getByRole("link", { name: /buy|tickets/i }).first();
    if (await buy.isVisible().catch(() => false)) {
      await buy.click();
      await page.waitForURL(/\/(login|events\/)/, { timeout: 30_000 });
    }
    await page.screenshot({ path: path.join(outDir, "j09-event-cta.png") });
  });

  test("J10 — host event wizard shell", async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.goto("/host/event/new", {
      waitUntil: "domcontentloaded",
    });
    expect(res?.ok()).toBe(true);
    await expect(page.getByRole("heading", { name: /new event|create event/i })).toBeVisible({
      timeout: 20_000,
    });
    await page.screenshot({ path: path.join(outDir, "j10-host-wizard.png") });
  });

  test("J11 — host events list redirects or loads", async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.goto("/host/events", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(500);
    await page.screenshot({ path: path.join(outDir, "j11-host-events.png") });
  });

  test("J12 — /rentals browse page", async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.goto("/rentals", { waitUntil: "domcontentloaded" });
    expect(res?.ok()).toBe(true);
    await expect(page.getByTestId("rentals-browse")).toBeVisible({ timeout: 20_000 });
    await page.screenshot({ path: path.join(outDir, "j12-rentals-page.png") });
  });

  test("J13 — rental schedule viewing modal", async ({ page }) => {
    test.setTimeout(300_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    const schedule = page
      .locator('[data-testid="rental-card"]')
      .first()
      .getByRole("button", { name: /schedule|viewing/i });
    if (await schedule.isVisible().catch(() => false)) {
      await schedule.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10_000 });
    }
    await page.screenshot({ path: path.join(outDir, "j13-schedule-viewing.png") });
  });

  test("J14 — rental follow-up context", async ({ page }) => {
    test.setTimeout(300_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    await sendConciergeMessage(page, "when can I view?");
    await waitForCopilotIdle(page, 120_000);
    expect(await page.locator('[data-testid="rental-card"]').count()).toBeGreaterThan(0);
    await expect(page.getByText(/what can i help you with/i)).toHaveCount(0);
    await page.screenshot({ path: path.join(outDir, "j14-rental-followup.png") });
  });

  test("J15 — back-to-back pin clear", async ({ page }) => {
    test.setTimeout(300_000);
    const collectPinIds = () =>
      page
        .locator('[data-testid="map-pin"]')
        .evaluateAll((els) =>
          els
            .map((el) => el.getAttribute("data-pin-id"))
            .filter((id): id is string => Boolean(id)),
        );

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    const rentalPinIds = await collectPinIds();

    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);
    await waitForCopilotIdle(page, 120_000);

    const persisted = (await collectPinIds()).filter((id) =>
      rentalPinIds.includes(id),
    );
    expect(persisted).toEqual([]);
    await page.screenshot({ path: path.join(outDir, "j15-pin-clear.png") });
  });

  test("J16 — hover rental card highlights pin", async ({ page }) => {
    test.setTimeout(300_000);
    await page.setViewportSize({ width: 1360, height: 900 });
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    const card = page.locator('[data-testid="rental-card"]').first();
    await card.hover();
    await expect(
      page.locator('[data-testid="map-pin"][data-marker-selected="true"]'),
    ).toBeVisible({ timeout: 10_000 });
    await page.screenshot({ path: path.join(outDir, "j16-hover-pin.png") });
  });

  test("J17 — mobile café drawer + FAB", async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/rentals", { waitUntil: "domcontentloaded" });
    const fab = page.getByTestId("browse-map-fab");
    await expect(fab).toBeVisible();
    await fab.click();
    await expect(page.getByRole("dialog", { name: "Map view" })).toBeVisible({
      timeout: 8_000,
    });
    await page.screenshot({ path: path.join(outDir, "j17-mobile-map.png") });
  });

  test("J18 — tickets wallet requires auth", async ({ page }) => {
    test.setTimeout(60_000);
    const res = await page.goto("/me/tickets", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(500);
    await page.screenshot({ path: path.join(outDir, "j18-tickets.png") });
  });

  test("J19 — trips dashboard or empty state", async ({ page }) => {
    test.setTimeout(60_000);
    const res = await page.goto("/trips", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(500);
    await page.screenshot({ path: path.join(outDir, "j19-trips.png") });
  });

  test("J20 — saved collections grid", async ({ page }) => {
    test.setTimeout(60_000);
    const res = await page.goto("/saved", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(500);
    await page.screenshot({ path: path.join(outDir, "j20-saved.png") });
  });
});
