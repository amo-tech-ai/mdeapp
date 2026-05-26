import { test, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  gotoHome,
  GROUNDING_QUERY,
  sendConciergeMessage,
  waitForGroundingAttribution,
} from "./helpers/maps-layout";

test.describe("MAP-007 grounding UI", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("grounding attribution visible after café query", async ({ page }) => {
    const errors: string[] = [];
    const networkSources: string[] = [];

    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", async (res) => {
      const url = res.url();
      if (url.includes("mapstools.googleapis.com/mcp")) {
        networkSources.push(url);
      }
      if (url.includes("places.googleapis.com") && res.request().method() === "POST") {
        const fromBrowser =
          res.request().headers()["x-browser-channel"] != null ||
          res.frame()?.page() === page;
        if (fromBrowser && !url.includes("localhost")) {
          errors.push(`browser Places call: ${url}`);
        }
      }
    });

    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForGroundingAttribution(page);

    await expect(
      page.locator(
        '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
      ).first(),
    ).toBeVisible();
    const pins = await page.locator('[data-testid="map-pin"]').count();
    expect(pins).toBeGreaterThanOrEqual(1);

    const rating = page.locator('[data-testid="grounded-card-rating"]');
    const ratingCount = await rating.count();
    if (ratingCount > 0) {
      await expect(rating.first()).toContainText("★");
    }

    expect(collectCriticalConsoleErrors(errors)).toEqual([]);
  });
});
