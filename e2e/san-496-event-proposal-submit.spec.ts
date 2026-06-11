import { test, expect, type Page } from "@playwright/test";
import {
  RESTAURANT_FAST_PATH_QUERY,
  gotoHome,
  sendConciergeMessage,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

/**
 * SAN-496 · EVT-037 — Proposal modal submit happy path (mocked API).
 *
 * Proves form → POST /api/events/proposal → success UI without requiring
 * signed-in user or live bookings insert (network route intercept).
 * CTA/sheet navigation reuses the SAN-494 dual-state pattern.
 */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

const PROPOSAL_BODY = {
  partnerLocationId: "00000000-0000-4001-8201-000000000001",
  partnerId: "00000000-0000-4001-8101-000000000001",
  eventType: "Birthday",
  startDate: "2026-07-15",
  startTime: "19:00",
  partySize: 30,
  contactName: "Camila Test",
  contactEmail: "camila.test@example.com",
  venueTitle: "Mamacita Provenza",
};

async function waitForCardsLoose(page: Page, timeoutMs = 150_000) {
  const cards = page.locator('[data-testid="restaurant-card"]');
  const deadline = Date.now() + timeoutMs;
  let clarified = false;

  while (Date.now() < deadline) {
    if ((await cards.count()) > 0) return;
    if (!clarified) {
      const clarify = page.getByText(/what kind of restaurant/i).first();
      if (await clarify.isVisible().catch(() => false)) {
        clarified = true;
        await sendConciergeMessage(page, "fine dining in El Poblado");
      }
    }
    await page.waitForTimeout(2_000);
  }
  expect(await cards.count()).toBeGreaterThan(0);
}

async function openProposalModal(page: Page) {
  const cta = page.locator('[data-testid="event-venue-cta"]').first();
  await expect(cta).toBeVisible({ timeout: 30_000 });
  await cta.click();
  await expect(
    page.locator('[data-testid="event-venue-offerings-sheet"]'),
  ).toBeVisible();
  await page.locator('[data-testid="request-proposal-btn"]').click();
  await expect(page.locator('[data-testid="event-proposal-shell"]')).toBeVisible();
  await expect(
    page.locator('[data-testid="event-proposal-hitl-panel"]'),
  ).toBeVisible();
}

async function fillProposalForm(page: Page) {
  await page.locator("#ep-event-type").fill(PROPOSAL_BODY.eventType);
  await page.locator("#ep-start-date").fill(PROPOSAL_BODY.startDate);
  await page.locator("#ep-party-size").fill(String(PROPOSAL_BODY.partySize));
  await page.locator("#ep-start-time").fill(PROPOSAL_BODY.startTime);
  await page.locator("#ep-name").fill(PROPOSAL_BODY.contactName);
  await page.locator("#ep-email").fill(PROPOSAL_BODY.contactEmail);
}

test.describe("SAN-496 proposal submit (mocked API)", () => {
  test("happy path: fill form → submit → success screen", async ({ page }) => {
    test.setTimeout(240_000);

    let postCount = 0;
    await page.route("**/api/events/proposal", async (route) => {
      postCount += 1;
      const body = route.request().postDataJSON() as Record<string, unknown>;
      expect(body.eventType).toBe(PROPOSAL_BODY.eventType);
      expect(body.partySize).toBe(PROPOSAL_BODY.partySize);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          bookingId: "e2e-booking-uuid",
          message: "Proposal sent — Patricia will review with the venue.",
        }),
      });
    });

    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForCardsLoose(page);
    await page.waitForTimeout(3_000);

    const ctaCount = await page.locator('[data-testid="event-venue-cta"]').count();
    test.skip(
      ctaCount === 0,
      "No mapped venue in rendered cards — State A; run when Mamacita seed is mapped",
    );

    await openProposalModal(page);
    await fillProposalForm(page);
    await page.locator('[data-testid="event-proposal-submit-btn"]').click();

    await expect(page.locator('[data-testid="event-proposal-success"]')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/proposal sent/i)).toBeVisible();
    expect(postCount).toBe(1);
  });

  test("duplicate submit shows error (409 passthrough)", async ({ page }) => {
    test.setTimeout(240_000);

    await page.route("**/api/events/proposal", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: { message: "You already submitted this event proposal." },
        }),
      });
    });

    await gotoHome(page);
    await sendConciergeMessage(page, RESTAURANT_FAST_PATH_QUERY);
    await waitForCardsLoose(page);
    await page.waitForTimeout(3_000);

    const ctaCount = await page.locator('[data-testid="event-venue-cta"]').count();
    test.skip(ctaCount === 0, "No mapped venue — State A");

    await openProposalModal(page);
    await fillProposalForm(page);
    await page.locator('[data-testid="event-proposal-submit-btn"]').click();

    await expect(page.locator('[data-testid="event-proposal-error"]')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/already submitted/i)).toBeVisible();
  });
});
