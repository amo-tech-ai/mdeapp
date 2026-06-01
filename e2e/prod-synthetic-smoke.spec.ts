import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForCopilotIdle,
  waitForRentalCards,
  waitForEventCards,
} from "./helpers/maps-layout";
import fs from "node:fs";
import path from "node:path";

const isProdRun = Boolean(process.env.PROD_SMOKE_BASE_URL?.trim());
const outDir =
  process.env.PROD_SMOKE_OUT_DIR ??
  path.join(process.cwd(), "tmp", "prod-synthetic-smoke");

const QUERIES = {
  rentals: "1BR apartment in Laureles under 80 dollars per night",
  events: "salsa events this weekend in Medellín",
  restaurants: "suggest restaurants medellin",
  cafes: "good specialty coffee in Laureles",
} as const;

test.describe("UX-034 prod synthetic smoke", () => {
  test.skip(!isProdRun, "Set PROD_SMOKE_BASE_URL (e.g. https://www.mdeai.co)");

  test("4-query matrix + POST budget", async ({ page }) => {
    test.setTimeout(600_000);
    fs.mkdirSync(outDir, { recursive: true });

    const ckPosts: { query: string; count: number }[] = [];
    page.on("response", (res) => {
      if (
        res.url().includes("/api/copilotkit") &&
        res.request().method() === "POST"
      ) {
        const last = ckPosts[ckPosts.length - 1];
        if (last) last.count += 1;
      }
    });

    function trackQuery(name: string) {
      ckPosts.push({ query: name, count: 0 });
    }

    await gotoHome(page);

    trackQuery("rentals");
    await sendConciergeMessage(page, QUERIES.rentals);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "01-rentals.png"), fullPage: true });
    expect(await page.locator('[data-testid="rental-card"]').count()).toBeGreaterThan(0);

    trackQuery("events");
    await sendConciergeMessage(page, QUERIES.events);
    await waitForEventCards(page);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "02-events.png"), fullPage: true });
    expect(await page.locator('[data-testid="event-card"]').count()).toBeGreaterThan(0);

    trackQuery("restaurants");
    await sendConciergeMessage(page, QUERIES.restaurants);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "03-restaurants.png"), fullPage: true });
    const restaurantCards = await page.locator('[data-testid="restaurant-card"]').count();
    const photoPlaceholders = await page
      .locator('[data-testid="restaurant-card-photo-placeholder"]')
      .count();
    expect(restaurantCards).toBeGreaterThan(0);

    trackQuery("cafes");
    await sendConciergeMessage(page, QUERIES.cafes);
    await waitForCopilotIdle(page, 120_000);
    await page.screenshot({ path: path.join(outDir, "04-cafes.png"), fullPage: true });
    const cafeCards = await page.locator(
      '[data-testid="grounded-card"][data-result-kind="cafe"]',
    );
    expect(await cafeCards.count()).toBeGreaterThan(0);

    await waitForCopilotIdle(page, 32_000);
    const idleCk = await page.evaluate(() => {
      return performance
        .getEntriesByType("resource")
        .filter(
          (e) =>
            e.name.includes("/api/copilotkit") &&
            "initiatorType" in e &&
            (e as PerformanceResourceTiming).responseEnd > performance.now() - 35_000,
        ).length;
    });

    const report = {
      at: new Date().toISOString(),
      baseURL: process.env.PROD_SMOKE_BASE_URL,
      queries: QUERIES,
      copilotkitPostsByQuery: ckPosts,
      restaurantCards,
      restaurantPhotoPlaceholders: photoPlaceholders,
      cafeGroundedCards: await cafeCards.count(),
      note: "idleCk is approximate; prefer ckPosts after last waitForCopilotIdle",
      idleWindowResourceHits: idleCk,
    };

    fs.writeFileSync(
      path.join(outDir, "report.json"),
      JSON.stringify(report, null, 2),
    );

    const restaurantsEntry = ckPosts.find((e) => e.query === "restaurants");
    if (restaurantsEntry && restaurantsEntry.count > 8) {
      test.info().annotations.push({
        type: "warning",
        description: `High CK POST count on restaurants: ${restaurantsEntry.count}`,
      });
    }
  });
});
