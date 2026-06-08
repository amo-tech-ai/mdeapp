import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SAN-660";

test.describe(`${SCREEN_ID} /host marketing landing`, () => {
  test.use({ viewport: DESKTOP_VIEWPORT });

  test("public /host loads with CTAs (not login redirect)", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    const response = await page.goto("/host", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/host$/);
    await expect(page.getByTestId("event-host-landing")).toBeVisible();
    await expect(page.getByTestId("event-host-primary-cta")).toHaveAttribute(
      "href",
      "/partners/signup?type=host",
    );
    await expect(page.getByTestId("event-host-secondary-cta")).toHaveAttribute(
      "href",
      "/host/event/new",
    );
    await captureScreenEvidence(page, SCREEN_ID, "desktop-host-landing.png");
    assertConsoleClean(errors);
  });
});
