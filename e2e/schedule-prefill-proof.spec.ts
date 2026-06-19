/**
 * Schedule-viewing modal prefill — browser proof.
 *
 * Verifies the signed-in prefill added in src/components/modals/schedule-viewing-modal.tsx
 * (helper: src/lib/leads/schedule-prefill.ts):
 *   - signed-in user → name + email seeded from profile/auth; phone blank when unknown
 *   - prefilled fields stay editable
 *   - signed-out user → all fields blank
 *   - no critical console errors
 *
 * Run (against a running dev server on :3001, or let webServer auto-start):
 *   infisical run --silent --env=dev --path=/ -- \
 *     npx playwright test e2e/schedule-prefill-proof.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";
import { hasE2eEnv, signInAs } from "./helpers/auth";
import {
  assertConsoleClean,
  captureScreenEvidence,
  watchCriticalConsoleErrors,
} from "./helpers/screen-evidence";

const SIGNED_IN_EMAIL = "ai@socialmediaville.ca";

/** /rentals → first card → detail → open the request-viewing modal. */
const openModalFromDetail = async (page: import("@playwright/test").Page) => {
  await page.goto("/rentals", { waitUntil: "domcontentloaded" });
  const cardLink = page.locator('[data-testid^="rental-card-link-"]').first();
  await expect(cardLink).toBeVisible();
  await cardLink.click();
  // First navigation to /rentals/[id] compiles the route in dev — allow extra time.
  await expect(page.locator('[data-testid="rental-detail"]')).toBeVisible({ timeout: 30_000 });
  await page.locator('[data-testid="rental-detail-request-cta"]').click();
  await expect(page.locator('[data-testid="schedule-viewing-modal"]')).toBeVisible();
};

test.describe("schedule-viewing prefill", () => {
  test("signed-in user sees name + email prefilled, phone blank, fields editable", async ({
    page,
  }) => {
    test.skip(!hasE2eEnv(), "E2E Supabase env missing");
    const errors = watchCriticalConsoleErrors(page);

    await signInAs(page, SIGNED_IN_EMAIL);
    await openModalFromDetail(page);

    const nameInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="name"]');
    const emailInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="email"]');
    const phoneInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="phone"]');

    // Email is the authoritative identity field — must match the signed-in user.
    await expect(emailInput).toHaveValue(SIGNED_IN_EMAIL);
    // Name comes from the profile (full_name) — non-empty for this seeded user.
    await expect(nameInput).not.toHaveValue("");
    // Phone is unknown for this user and must stay blank (no guessing).
    await expect(phoneInput).toHaveValue("");

    await captureScreenEvidence(page, "schedule-prefill", "signed-in-prefilled.png", {
      fullPage: false,
    });

    // Prefilled fields remain editable.
    await nameInput.fill("Camila Restrepo");
    await expect(nameInput).toHaveValue("Camila Restrepo");
    await phoneInput.fill("+57 300 111 2222");
    await expect(phoneInput).toHaveValue("+57 300 111 2222");

    assertConsoleClean(errors);
  });

  test("signed-out user sees all fields blank", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);

    await page.context().clearCookies();
    await openModalFromDetail(page);

    const nameInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="name"]');
    const emailInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="email"]');
    const phoneInput = page.locator('[data-testid="schedule-viewing-modal"] input[name="phone"]');

    await expect(nameInput).toHaveValue("");
    await expect(emailInput).toHaveValue("");
    await expect(phoneInput).toHaveValue("");

    await captureScreenEvidence(page, "schedule-prefill", "signed-out-blank.png", {
      fullPage: false,
    });

    assertConsoleClean(errors);
  });
});
