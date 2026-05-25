import { test, expect } from "@playwright/test";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  expectProtectedRouteLoginRedirect,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-011";

test.describe.configure({ mode: "serial" });

test.describe(`${SCREEN_ID} saved collections`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("logged-out /saved redirects to login with next", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/saved");
      await captureScreenEvidence(page, SCREEN_ID, "desktop-saved-login-redirect.png");
      assertConsoleClean(errors);
    });

    test("nav saved link reaches login gate", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.getByTestId("nav-saved-link").click();
      await expect(page).toHaveURL(/\/login/);
      expect(page.url()).toContain("next=%2Fsaved");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("logged-out /saved redirects on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await expectProtectedRouteLoginRedirect(page, "/saved");
      await captureScreenEvidence(page, SCREEN_ID, "mobile-saved-login-redirect.png");
      assertConsoleClean(errors);
    });
  });
});
