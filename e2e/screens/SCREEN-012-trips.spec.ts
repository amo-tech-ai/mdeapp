import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  expectProtectedRouteLoginRedirect,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-012";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} trips dashboard`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("logged-out /trips redirects to login with next", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/trips");
      await captureScreenEvidence(page, SCREEN_ID, "desktop-trips-login-redirect.png");
      assertConsoleClean(errors);
    });

    test("nav trips link reaches login gate", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByTestId("nav-trips-link").click();
      await expect(page).toHaveURL(/\/login/);
      expect(page.url()).toContain("next=%2Ftrips");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("logged-out /trips redirects on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/trips");
      await captureScreenEvidence(page, SCREEN_ID, "mobile-trips-login-redirect.png");
      assertConsoleClean(errors);
    });
  });
});
