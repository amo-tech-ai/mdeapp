import { test, expect } from "@playwright/test";
import {
  EVENT_QUERY,
  GROUNDING_QUERY,
  RENTAL_QUERY,
  RESTAURANT_FAST_PATH_QUERY,
  assertNoGenericMapResultsList,
  gotoHome,
  sendConciergeMessage,
  sendEventQuery,
  waitForCafeGroundedCards,
  waitForEventCards,
  waitForRentalCards,
  waitForRestaurantCards,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

/** UX-T-030 — card surface + data-result-kind + no side-panel dup per vertical. */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("Card unification — one rich surface per domain", () => {
  test("rental cards have pin id + result kind", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);

    const first = page.locator('[data-testid="rental-card"]').first();
    await expect(first).toHaveAttribute("data-pin-id", /.+/);
    await expect(first).toHaveAttribute("data-result-kind", "rental");
    await assertNoGenericMapResultsList(page);
  });

  test("event cards have pin id + result kind", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendEventQuery(page, EVENT_QUERY);
    await waitForEventCards(page);

    const first = page.locator('[data-testid="event-card"]').first();
    await expect(first).toHaveAttribute("data-pin-id", /.+/);
    await expect(first).toHaveAttribute("data-result-kind", "event");
    await assertNoGenericMapResultsList(page);
  });

  test("restaurant cards have pin id + result kind", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await page.waitForTimeout(8_000);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForRestaurantCards(page);

    const first = page.locator('[data-testid="restaurant-card"]').first();
    await expect(first).toHaveAttribute("data-pin-id", /.+/);
    await expect(first).toHaveAttribute("data-result-kind", "restaurant");
    await assertNoGenericMapResultsList(page);
  });

  test("café cards have pin id + result kind", async ({ page }) => {
    test.setTimeout(180_000);
    await page.route("**/v1/grounding/invoke**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          pins: [],
          metadata: { reason: "adk_unavailable" },
        }),
      }),
    );
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCafeGroundedCards(page);

    const first = page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .first();
    await expect(first).toHaveAttribute("data-pin-id", /.+/);
    await assertNoGenericMapResultsList(page);
  });
});
