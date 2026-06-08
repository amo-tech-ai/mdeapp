import { test, expect, type Page } from "@playwright/test";
import type { Session } from "@supabase/supabase-js";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";
import {
  getTestSession,
  hasE2eEnv,
  injectSession,
  QA_HOST_EMAIL,
} from "../helpers/auth";
import { cleanupQaEvents } from "../helpers/seed-event";

const SCREEN_ID = "SAN-730";
const TABLET_VIEWPORT = { width: 834, height: 900 } as const;

const describeAuthed = hasE2eEnv() ? test.describe : test.describe.skip;

describeAuthed(`${SCREEN_ID} host navigation rail`, () => {
  test.describe.configure({ mode: "serial" });

  let session: Session;

  test.beforeAll(async () => {
    session = await getTestSession(QA_HOST_EMAIL);
    await cleanupQaEvents(session.user.id);
  });

  test.afterAll(async () => {
    if (session?.user?.id) {
      try {
        await cleanupQaEvents(session.user.id);
      } catch {
        // best-effort cleanup
      }
    }
  });

  async function gotoHostWizard(page: Page): Promise<void> {
    await injectSession(page.context(), session);
    await page.goto("/host/event/new", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("host-nav-rail")).toBeVisible();
  }

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("Events link navigates to /host/events", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHostWizard(page);

      await expect(page.getByTestId("host-nav-link-events")).toBeVisible();
      await expect(page.getByTestId("host-nav-link-events")).toHaveAttribute(
        "href",
        "/host/events",
      );
      await expect(page.getByTestId("host-nav-analytics-soon")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      await page.getByTestId("host-nav-link-events").click();
      await expect(page).toHaveURL(/\/host\/events$/);
      await expect(page.getByTestId("host-events")).toBeVisible();
      await expect(page.getByTestId("host-nav-link-events")).toHaveAttribute(
        "aria-current",
        "page",
      );

      await captureScreenEvidence(page, SCREEN_ID, "desktop-host-events-via-nav.png");
      assertConsoleClean(errors);
    });

    test("New event link is active on wizard route", async ({ page }) => {
      await gotoHostWizard(page);
      await expect(page.getByTestId("host-nav-link-new-event")).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });

  test.describe("tablet", () => {
    test.use({ viewport: TABLET_VIEWPORT });

    test("nav rail renders and Events link works", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHostWizard(page);

      await expect(page.getByTestId("host-nav-rail")).toBeVisible();
      await page.getByTestId("host-nav-link-events").click();
      await expect(page.getByTestId("host-events")).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "tablet-host-nav-events.png");
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("horizontal nav renders and Events link works", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHostWizard(page);

      const eventsLink = page.getByTestId("host-nav-link-events");
      await expect(eventsLink).toBeVisible();
      await eventsLink.click();
      await expect(page.getByTestId("host-events")).toBeVisible();

      await captureScreenEvidence(page, SCREEN_ID, "mobile-host-nav-events.png");
      assertConsoleClean(errors);
    });
  });
});
