import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-015";
const MOCK_ORDER_ID = "c164ba66-7e51-4ba4-be34-690180248d1c";
const MOCK_QR = "eyJhbGciOiJIUzI1NiIs.test.qr.token";

const MOCK_WALLET = {
  order: {
    id: MOCK_ORDER_ID,
    short_id: "MDE-62A0B5D169",
    status: "paid",
    total_cents: 4000000,
    currency: "cop",
    buyer_name: "Andres Test",
    buyer_email: "andres.test@mdeai.co",
    quantity: 1,
  },
  event: {
    id: "22222222-2222-2222-2222-000000000001",
    name: "Reina de Antioquia 2026 Finals",
    address: "Hotel Intercontinental",
    city: "Medellín",
    event_start_time: "2027-02-24T01:00:00+00:00",
  },
  attendees: [
    {
      id: "fe8f5388-efc2-43b5-bbec-f85f41f51b80",
      full_name: "Andres Test",
      email: "andres.test@mdeai.co",
      status: "active",
      qr_token: MOCK_QR,
    },
  ],
};

test.describe(`${SCREEN_ID} my tickets + QR`, () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/tickets/wallet**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_WALLET),
      });
    });
  });

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("wallet list empty state", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/me/tickets", { waitUntil: "domcontentloaded" });
      await expect(page.locator('[data-testid="my-tickets-empty"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-empty.png");
      assertConsoleClean(errors);
    });

    test("QR detail with token", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/me/tickets/${MOCK_ORDER_ID}?token=mock-token`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator('[data-testid="my-tickets-qr"]')).toBeVisible();
      await expect(page.locator('[data-testid="my-tickets-detail"]')).toContainText(
        "Reina de Antioquia",
      );
      await expect(
        page.locator('[data-testid="my-tickets-qr"]'),
      ).toHaveAttribute("data-qr-state", "valid");
      await expect(
        page.locator('[data-testid="my-tickets-pass-actions"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="my-tickets-action-directions"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="my-tickets-action-share"]'),
      ).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "desktop-qr.png");
      assertConsoleClean(errors);
    });

    test("used ticket greys the QR", async ({ page }) => {
      await page.route("**/api/tickets/wallet**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ...MOCK_WALLET,
            attendees: [{ ...MOCK_WALLET.attendees[0], status: "checked_in" }],
          }),
        });
      });
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/me/tickets/${MOCK_ORDER_ID}?token=mock-token`, {
        waitUntil: "domcontentloaded",
      });
      await expect(
        page.locator('[data-testid="my-tickets-qr"]'),
      ).toHaveAttribute("data-qr-state", "used");
      await expect(
        page.locator('[data-testid="my-tickets-qr-overlay"]'),
      ).toContainText("Already scanned");
      await captureScreenEvidence(page, SCREEN_ID, "desktop-qr-used.png");
      assertConsoleClean(errors);
    });

    test("ended event greys the QR as expired", async ({ page }) => {
      await page.route("**/api/tickets/wallet**", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ...MOCK_WALLET,
            event: {
              ...MOCK_WALLET.event,
              event_start_time: "2020-01-01T01:00:00+00:00",
              event_end_time: "2020-01-01T04:00:00+00:00",
            },
          }),
        });
      });
      const errors = watchCriticalConsoleErrors(page);
      await page.goto(`/me/tickets/${MOCK_ORDER_ID}?token=mock-token`, {
        waitUntil: "domcontentloaded",
      });
      await expect(
        page.locator('[data-testid="my-tickets-qr"]'),
      ).toHaveAttribute("data-qr-state", "expired");
      await expect(
        page.locator('[data-testid="my-tickets-qr-overlay"]'),
      ).toContainText("Event ended");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("mobile QR renders", async ({ page }) => {
      await page.goto(`/me/tickets/${MOCK_ORDER_ID}?token=mock-token`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator('[data-testid="my-tickets-qr"]')).toBeVisible();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-qr.png");
    });
  });
});
