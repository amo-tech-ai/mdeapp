import { test, expect } from "@playwright/test";
import {
  assertNoDuplicateGroundingLists,
  assertNoGenericMapResultsList,
  assertSingleEventCardSurface,
  EVENT_QUERY,
  GROUNDING_QUERY,
  gotoHome,
  RENTAL_QUERY,
  sendConciergeMessage,
  sendEventQuery,
  waitForEventCards,
  waitForGroundedCards,
  waitForRentalCards,
} from "./helpers/maps-layout";

/**
 * Global rule: rich generative cards are the sole primary listing surface.
 * Generic "Map results" pin rows and duplicate attribution lists must stay hidden.
 */
test.describe("Rich card dedup — one listing surface per vertical", () => {
  test.use({ viewport: { width: 1360, height: 900 } });

  test("cafés — cards only, no Map results or sources list", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForGroundedCards(page);

    await expect(
      page.locator('[data-testid="grounded-card"]').first(),
    ).toBeVisible();
    await assertNoGenericMapResultsList(page);
    await assertNoDuplicateGroundingLists(page);
  });

  test("events — chat cards only, no Map results or panel card dupes", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendEventQuery(page, EVENT_QUERY);
    await waitForEventCards(page);

    await assertSingleEventCardSurface(page);
    await assertNoGenericMapResultsList(page);
  });

  test("rentals — cards only, no Map results strip", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);

    await expect(page.locator('[data-testid="rental-card"]').first()).toBeVisible();
    await assertNoGenericMapResultsList(page);
  });
});
