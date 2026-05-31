import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForRentalCards,
  waitForEventCards,
  waitForCafeGroundedCards,
  waitForCopilotIdle,
  ensureChatInputVisible,
  hideCopilotWebInspector,
  RENTAL_QUERY,
  EVENT_QUERY,
} from "./helpers/maps-layout";
import {
  watchCriticalConsoleErrors,
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
} from "./helpers/screen-evidence";

const DINNER_QUERY = "quiet rooftop dinner in Provenza";
const CAFE_QUERY = "good specialty coffee in Laureles";

test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

/**
 * UX-031 — 23-live-audit §1 matrix (one browser session).
 * Single test keeps event memory for scenario 3 (B-09).
 */
test.describe("UX-031 live audit verticals", () => {
  test("4-vertical serial matrix — rental → events → dinner → café", async ({
    page,
  }) => {
    test.setTimeout(600_000);
    const errors = watchCriticalConsoleErrors(page);

    // 1 — Rental
    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await expect(page.locator('[data-testid="rental-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="map-empty-state"]')).toHaveCount(0);
    await captureScreenEvidence(page, "UX-031", "01-rental.png");
    await waitForCopilotIdle(page);

    // 2 — Events (sets lastEventQuery memory for scenario 3)
    await hideCopilotWebInspector(page);
    await ensureChatInputVisible(page);
    await sendConciergeMessage(page, EVENT_QUERY);
    await waitForEventCards(page);
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();
    await captureScreenEvidence(page, "UX-031", "02-events.png");
    await waitForCopilotIdle(page);

    // 3 — Dinner must not hijack event fast-path (UX-019)
    let dinnerQuerySent = false;
    let eventsSearchAfterDinner = false;
    page.on("response", (res) => {
      if (
        dinnerQuerySent &&
        res.url().includes("/api/events/search") &&
        res.request().method() === "POST"
      ) {
        eventsSearchAfterDinner = true;
      }
    });

    await ensureChatInputVisible(page);
    dinnerQuerySent = true;
    await sendConciergeMessage(page, DINNER_QUERY);
    await page.waitForTimeout(12_000);

    expect(eventsSearchAfterDinner).toBe(false);
    await expect(page.locator("#copilot-chat-region")).not.toContainText(
      /Found \d+ events/i,
    );
    await captureScreenEvidence(page, "UX-031", "03-dinner.png");

    // 4 — Café with ADK down → venue_anchors fallback (UX-013)
    await ensureChatInputVisible(page);
    await sendConciergeMessage(page, CAFE_QUERY);
    await waitForCafeGroundedCards(page);
    const cafeCard = page
      .locator(
        '[data-testid="grounded-card"][data-result-kind="cafe"], [data-testid="grounded-card"]',
      )
      .first();
    await expect(cafeCard).toBeVisible();
    const chatText = await page.locator("#copilot-chat-region").innerText();
    expect(chatText).not.toMatch(/No places found/i);
    await captureScreenEvidence(page, "UX-031", "04-cafe.png");

    assertConsoleClean(errors);
  });
});
