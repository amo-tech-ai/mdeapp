import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForRentalCards,
} from "./helpers/maps-layout";

const RENTAL_QUERY =
  "1BR apartment in Laureles under 80 dollars per night";

test.describe("UX-032 new chat reset", () => {
  test("clears rental cards and map pins", async ({ page }) => {
    test.setTimeout(180_000);

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    expect(await page.locator('[data-testid="rental-card"]').count()).toBeGreaterThan(0);

    await page.getByTestId("nav-new-chat").click();

    await expect(page.locator('[data-testid="rental-card"]')).toHaveCount(0);
    const pins = await page.locator('[data-testid="map-pin"]').count();
    expect(pins).toBeLessThanOrEqual(1);
  });
});
