import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForRestaurantCards,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("Restaurant filter chips", () => {
  test("suggest restaurants shows filter chips then search on tap", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await gotoHome(page);
    await page.waitForTimeout(4_000);

    await sendConciergeMessage(page, "suggest restaurants");
    await expect(page.locator('[data-testid="restaurant-clarify"]')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator('[data-testid="restaurant-filter-chips"]')).toBeVisible();

    await page.locator('[data-testid="restaurant-filter-c-italian"]').click();
    await waitForRestaurantCards(page);

    const restaurantCards = await page.locator('[data-testid="restaurant-card"]').count();
    expect(restaurantCards).toBeGreaterThan(0);
  });

  test("fine dining modern poblado searches immediately without chips", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await gotoHome(page);
    await page.waitForTimeout(4_000);

    await sendConciergeMessage(page, "fine dining modern poblado");
    await waitForRestaurantCards(page);

    await expect(page.locator('[data-testid="restaurant-filter-chips"]')).toHaveCount(
      0,
    );
    expect(
      await page.locator('[data-testid="restaurant-card"]').count(),
    ).toBeGreaterThan(0);
  });
});
