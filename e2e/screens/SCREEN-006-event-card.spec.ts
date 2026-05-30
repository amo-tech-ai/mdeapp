import { test, expect } from "@playwright/test";
import {
  EVENT_QUERY,
  gotoHome,
  sendConciergeMessage,
  sendEventQuery,
  waitForAssistantReply,
  waitForEventCards,
  waitForNoEventCards,
  activateEventsChip,
} from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-006";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} event card polish`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("generic event query clarifies without cards", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await activateEventsChip(page);
      await sendConciergeMessage(page, "list events medellin");
      await waitForAssistantReply(page);
      await expect(page.getByText(/what kind of events/i)).toBeVisible({
        timeout: 30_000,
      });
      await waitForNoEventCards(page);
      await expect(page.getByTestId("event-sub-chips")).toBeVisible();
      assertConsoleClean(errors);
    });

    test("event query renders cards, buy CTA, and map pins", async ({
      page,
    }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendEventQuery(page, EVENT_QUERY);
      await waitForEventCards(page);
      await page.waitForTimeout(3000);

      const cards = page.locator('[data-testid="event-card"]');
      expect(await cards.count()).toBeGreaterThanOrEqual(1);

      const buyCta = page.locator('[data-testid="event-buy-cta"]').first();
      await expect(buyCta).toBeVisible();
      const href = await buyCta.getAttribute("href");
      expect(href).toMatch(/^\/events\/.+/);

      const pins = await page.locator('[data-testid="map-pin"]').count();
      expect(pins).toBeGreaterThan(0);

      await captureScreenEvidence(page, SCREEN_ID, "desktop-event-cards.png");

      let card = cards.first();
      let pinId = await card.getAttribute("data-pin-id");
      if (
        pinId &&
        (await page
          .locator(`[data-testid="map-pin"][data-pin-id="${pinId}"]`)
          .count()) === 0
      ) {
        const cardCount = await cards.count();
        for (let i = 0; i < cardCount; i++) {
          const candidate = cards.nth(i);
          const candidatePinId = await candidate.getAttribute("data-pin-id");
          if (
            candidatePinId &&
            (await page
              .locator(`[data-testid="map-pin"][data-pin-id="${candidatePinId}"]`)
              .count()) > 0
          ) {
            card = candidate;
            pinId = candidatePinId;
            break;
          }
        }
      }
      if (pinId) {
        await expect(
          page.locator(`[data-testid="map-pin"][data-pin-id="${pinId}"]`).first(),
        ).toBeVisible();
      }
      await card.locator('[data-testid="event-details-cta"]').click();
      await expect(page.locator('[data-testid="venue-detail-sheet"]')).toBeVisible();
      await expect(card).toHaveAttribute("data-selected", "true");

      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("event cards render in center chat", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendEventQuery(page, EVENT_QUERY);
      await waitForEventCards(page);

      await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-event-cards.png");
      assertConsoleClean(errors);
    });
  });
});
