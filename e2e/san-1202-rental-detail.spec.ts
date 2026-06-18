/**
 * SAN-1202 · RE-DES-007 — Consumer rental detail page.
 *   PW_SKIP_WEBSERVER=1 SMOKE_BASE_URL=http://localhost:3021 \
 *     infisical run --silent --env=dev --path=/ -- \
 *     npx playwright test e2e/san-1202-rental-detail.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";

test.describe("SAN-1202 · consumer rental detail", () => {
  test("results card → detail page renders core content + opens viewing drawer", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    // Results → click first card link → detail
    await page.goto("/rentals", { waitUntil: "domcontentloaded" });
    const cardLink = page.locator('[data-testid^="rental-card-link-"]').first();
    await expect(cardLink).toBeVisible();
    await cardLink.click();

    // Detail core content
    await expect(page.locator('[data-testid="rental-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="rental-availability-calendar"]')).toBeVisible();
    await expect(page.getByText("Request only — payment is handled directly with the host.").first()).toBeVisible();

    // Request-viewing drawer opens from the detail CTA
    await page.locator('[data-testid="rental-detail-request-cta"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();

    expect(errors, `console errors: ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("unknown id renders the not-found state", async ({ page }) => {
    await page.goto("/rentals/does-not-exist-zzz", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-testid="rental-detail-not-found"]')).toBeVisible();
  });
});
