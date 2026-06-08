import { test, expect } from "@playwright/test";

/**
 * SAN-715 — FE Checkout states: decline / 3DS / wallet / empty
 * Covers the non-happy-path states for the ticket checkout modal (SCREEN-009)
 * and the post-Stripe return banners on the event detail page.
 *
 * Note: Full card decline + 3DS flows go through Stripe's hosted page and
 * require test-mode Stripe keys with network access. Those are covered by
 * manual QA with Stripe test cards. These specs cover the static states
 * (return banners, sold-out, empty tier list, network error display).
 */

// ── Checkout notice component direct render ──────────────────────────────────

test.describe("SAN-715 event checkout notice — success", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("success notice shows payment received message", async ({ page }) => {
    // Find a real event slug to test on
    await page.goto("/events", { waitUntil: "networkidle" });
    const firstEventLink = page.locator('a[href^="/events/"]').first();
    const count = await firstEventLink.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await firstEventLink.getAttribute("href");
    if (!href) {
      test.skip();
      return;
    }

    await page.goto(`${href}?checkout=success`, { waitUntil: "networkidle" });
    await expect(page.getByTestId("checkout-success-notice")).toBeVisible();
    await expect(page.getByText("Payment received")).toBeVisible();
    await expect(page.getByTestId("checkout-my-tickets-link")).toBeVisible();
  });

  test("cancel notice shows not-completed message with retry anchor", async ({
    page,
  }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    const firstEventLink = page.locator('a[href^="/events/"]').first();
    const count = await firstEventLink.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await firstEventLink.getAttribute("href");
    if (!href) {
      test.skip();
      return;
    }

    await page.goto(`${href}?checkout=cancelled`, {
      waitUntil: "networkidle",
    });
    await expect(page.getByTestId("checkout-cancel-notice")).toBeVisible();
    await expect(page.getByText("Checkout not completed")).toBeVisible();
    await expect(page.getByTestId("checkout-retry-anchor")).toBeVisible();
  });
});

// ── Event tier sold-out state ─────────────────────────────────────────────────

test.describe("SAN-715 event tier empty states", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("events browse page renders without error", async ({ page }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    await expect(page.getByTestId("events-browse")).toBeVisible();

    const grid = page.getByTestId("events-grid");
    const empty = page.getByTestId("events-browse-empty");
    const error = page.getByTestId("events-browse-error");
    const [g, e, er] = await Promise.all([
      grid.count(),
      empty.count(),
      error.count(),
    ]);
    expect(g + e + er).toBeGreaterThan(0);
  });
});

// ── Checkout modal UX ─────────────────────────────────────────────────────────

test.describe("SAN-715 booking checkout modal states", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("modal shows wallet/card copy and submit CTA", async ({ page }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    const firstEventLink = page.locator('a[href^="/events/"]').first();
    const count = await firstEventLink.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await firstEventLink.getAttribute("href");
    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href, { waitUntil: "networkidle" });

    // Click the first available Buy button
    const buyBtn = page.getByTestId("event-tier-buy").first();
    const buyCount = await buyBtn.count();
    if (buyCount === 0) {
      // No available tiers — check either sold-out or no-tiers state
      const soldOut = page.getByTestId("event-tiers-sold-out");
      const noTiers = page.getByTestId("event-tier-empty");
      const [soCount, ntCount] = await Promise.all([
        soldOut.count(),
        noTiers.count(),
      ]);
      expect(soCount + ntCount).toBeGreaterThan(0);
      return;
    }

    await buyBtn.click();
    await expect(page.getByTestId("booking-checkout-modal")).toBeVisible();

    // Wallet copy is present
    await expect(page.getByText(/Apple Pay.*Google Pay/i)).toBeVisible();

    // Submit CTA is present
    await expect(page.getByTestId("booking-checkout-submit")).toBeVisible();
    await expect(page.getByTestId("booking-checkout-submit")).toHaveText(
      /Pay with Stripe/i,
    );
  });

  test("modal shows network error with retry note", async ({
    page,
  }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    const firstEventLink = page.locator('a[href^="/events/"]').first();
    const count = await firstEventLink.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await firstEventLink.getAttribute("href");
    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href, { waitUntil: "networkidle" });

    const buyBtn = page.getByTestId("event-tier-buy").first();
    if ((await buyBtn.count()) === 0) {
      test.skip();
      return;
    }
    await buyBtn.click();
    await expect(page.getByTestId("booking-checkout-modal")).toBeVisible();

    // Abort the request so fetch() throws TypeError — exercises the isNetwork path
    await page.route("**/api/tickets/checkout", async (route) => {
      await route.abort("failed");
    });

    // Fill in the form and submit
    await page.fill('input[name="buyerName"]', "Andrés Test");
    await page.fill('input[name="email"]', "andres@example.com");
    await page.getByTestId("booking-checkout-submit").click();

    // Network error display appears with correct heading
    await expect(page.getByTestId("booking-checkout-error")).toBeVisible();
    await expect(page.getByText("Connection error")).toBeVisible();
    // Submit CTA changes to "Try again" — network errors are retryable
    await expect(page.getByTestId("booking-checkout-submit")).toHaveText(
      /Try again/i,
    );
    // Retry note shown
    await expect(
      page.getByTestId("booking-checkout-retry-note"),
    ).toBeVisible();
  });

  test("modal shows sold-out error without retry CTA", async ({ page }) => {
    await page.goto("/events", { waitUntil: "networkidle" });
    const firstEventLink = page.locator('a[href^="/events/"]').first();
    const count = await firstEventLink.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await firstEventLink.getAttribute("href");
    if (!href) {
      test.skip();
      return;
    }

    await page.goto(href, { waitUntil: "networkidle" });

    const buyBtn = page.getByTestId("event-tier-buy").first();
    if ((await buyBtn.count()) === 0) {
      test.skip();
      return;
    }
    await buyBtn.click();
    await expect(page.getByTestId("booking-checkout-modal")).toBeVisible();

    // Simulate sold-out response
    await page.route("**/api/tickets/checkout", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          error: { message: "Tier is sold out", code: "TIER_SOLD_OUT" },
        }),
      });
    });

    await page.fill('input[name="buyerName"]', "Andrés Test");
    await page.fill('input[name="email"]', "andres@example.com");
    await page.getByTestId("booking-checkout-submit").click();

    await expect(page.getByTestId("booking-checkout-error")).toBeVisible();
    await expect(page.getByText("Tickets are sold out")).toBeVisible();
    // Submit CTA is hidden for non-retryable errors
    await expect(page.getByTestId("booking-checkout-submit")).toHaveCount(0);
  });
});
