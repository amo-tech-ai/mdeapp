import { test, expect } from "@playwright/test";
import path from "node:path";
import {
  EVENT_QUERY,
  GROUNDING_QUERY,
  RENTAL_QUERY,
  gotoHome,
  sendConciergeMessage,
  sendEventQuery,
  waitForCafeGroundedCards,
  waitForCopilotIdle,
  waitForEventCards,
  waitForRentalCards,
} from "./helpers/maps-layout";
import {
  DESKTOP_VIEWPORT,
  assertConsoleClean,
  watchCriticalConsoleErrors,
} from "./helpers/screen-evidence";

const DINNER_QUERY = "quiet rooftop dinner in Provenza";
const EVIDENCE_DIR = path.join(
  process.cwd(),
  "..",
  "tasks/testing/evidence/live-audit-verticals",
);

async function shot(page: import("@playwright/test").Page, name: string) {
  await page.screenshot({
    path: path.join(EVIDENCE_DIR, `${name}.png`),
    fullPage: true,
  });
}

/** UX-T-031 / UX-031 — serial 4-vertical matrix from 23-live-audit §1. */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("Live audit — 4 vertical matrix", () => {
  test.beforeAll(async () => {
    const fs = await import("node:fs/promises");
    await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  });

  test("1 rental — cards + rentals API", async ({ page }) => {
    test.setTimeout(180_000);
    const errors = watchCriticalConsoleErrors(page);

    const rentalResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/api/rentals/search") &&
        r.request().method() === "POST" &&
        r.status() === 200,
      { timeout: 120_000 },
    );

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await rentalResponse;
    await waitForRentalCards(page);

    expect(await page.locator('[data-testid="rental-card"]').count()).toBeGreaterThan(
      0,
    );
    await expect(
      page.locator('[data-testid="rental-card"]').first(),
    ).toHaveAttribute("data-result-kind", "rental");

    await shot(page, "01-rental");
    assertConsoleClean(errors);
  });

  test("2 events — cards + events API", async ({ page }) => {
    test.setTimeout(180_000);
    const errors = watchCriticalConsoleErrors(page);

    const eventResponse = page.waitForResponse(
      (r) =>
        r.url().includes("/api/events/search") &&
        r.request().method() === "POST" &&
        r.status() === 200,
      { timeout: 120_000 },
    );

    await gotoHome(page);
    await sendEventQuery(page, EVENT_QUERY);
    await eventResponse;
    await waitForEventCards(page);

    expect(await page.locator('[data-testid="event-card"]').count()).toBeGreaterThan(
      0,
    );
    await expect(
      page.locator('[data-testid="event-card"]').first(),
    ).toHaveAttribute("data-result-kind", "event");

    await shot(page, "02-events");
    assertConsoleClean(errors);
  });

  test("3 restaurant after events — no event hijack (B-09)", async ({ page }) => {
    test.setTimeout(240_000);
    const errors = watchCriticalConsoleErrors(page);

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

    await gotoHome(page);
    await sendEventQuery(page, EVENT_QUERY);
    await waitForEventCards(page);
    await waitForCopilotIdle(page, 90_000);

    dinnerQuerySent = true;
    await sendConciergeMessage(page, DINNER_QUERY);
    await waitForCopilotIdle(page, 120_000);

    expect(eventsSearchAfterDinner).toBe(false);
    await expect(page.locator("#copilot-chat-region")).not.toContainText(
      /Found \d+ events/i,
    );

    const restaurantCards = await page.locator('[data-testid="restaurant-card"]').count();
    const placeCards = await page.locator('[data-testid="place-card"]').count();
    const groundedCards = await page.locator('[data-testid="grounded-card"]').count();
    expect(restaurantCards + placeCards + groundedCards).toBeGreaterThan(0);

    await shot(page, "03-dinner");
    assertConsoleClean(errors);
  });

  test("4 café — ADK down still shows cards (UX-013 fallback)", async ({ page }) => {
    test.setTimeout(240_000);
    const errors = watchCriticalConsoleErrors(page);

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

    const cafeCards = page.locator(
      '[data-testid="grounded-card"][data-result-kind="cafe"]',
    );
    expect(await cafeCards.count()).toBeGreaterThan(0);
    await expect(page.getByText("No places found")).toHaveCount(0);

    await shot(page, "04-cafe");
    assertConsoleClean(errors);
  });
});
