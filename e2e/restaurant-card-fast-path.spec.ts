import { test, expect } from "@playwright/test";
import {
  RESTAURANT_FAST_PATH_QUERY,
  assertNoGenericMapResultsList,
  gotoHome,
  sendConciergeMessage,
  waitForAssistantReply,
  waitForRestaurantCards,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

/** UX-T-037 — restaurant fast path: cards, no event misroute (not a POST-budget canary). */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("Restaurant card fast path", () => {
  test("suggest restaurants medellin shows cards, not events", async ({ page }) => {
    test.setTimeout(180_000);

    await gotoHome(page);
    await page.waitForTimeout(8_000);

    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);
    await waitForAssistantReply(page, 60_000);

    const assistantText = await page
      .locator(".copilotKitMessage.copilotKitAssistantMessage")
      .last()
      .innerText();
    expect(assistantText).not.toMatch(/Found 6 events/i);
    expect(assistantText).not.toMatch(/Found \d+ events/i);

    const eventCards = await page.locator('[data-testid="event-card"]').count();
    expect(eventCards, "restaurant query must not dominate with event cards").toBe(0);

    const restaurantCards = await page.locator('[data-testid="restaurant-card"]').count();
    expect(restaurantCards, "restaurant fast path card count").toBeGreaterThan(0);

    await expect(page.locator('[data-testid="restaurant-fast-path-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="restaurant-card-empty"]')).toHaveCount(0);
    await assertNoGenericMapResultsList(page);

    const firstCard = page.locator('[data-testid="restaurant-card"]').first();
    await expect(firstCard).toHaveAttribute("data-pin-id", /.+/);
    await expect(firstCard).toHaveAttribute("data-result-kind", "restaurant");
    await expect(
      page.locator('[data-testid="restaurant-card-photo"], [data-testid="restaurant-card-photo-placeholder"]').first(),
    ).toBeVisible();
  });
});
