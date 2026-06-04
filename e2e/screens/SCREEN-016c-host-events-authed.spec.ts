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
import { cleanupQaEvents, seedEvent } from "../helpers/seed-event";

const SCREEN_ID = "SCREEN-016c";

// Authed integration test — skip (yellow) when Supabase service env is absent
// so secret-less CI doesn't red-fail. Skipping the whole describe also skips hooks.
const describeAuthed = hasE2eEnv() ? test.describe : test.describe.skip;

describeAuthed(`${SCREEN_ID} host events list (authed)`, () => {
  test.describe.configure({ mode: "serial" });

  let session: Session;
  let publishedSlug: string;

  test.beforeAll(async () => {
    session = await getTestSession(QA_HOST_EMAIL);
    await cleanupQaEvents(session.user.id); // clear crashed-run leftovers
    const published = await seedEvent(session.user.id, { status: "published" });
    publishedSlug = published.slug;
    await seedEvent(session.user.id, { status: "draft" });
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

  async function gotoHostEvents(page: Page): Promise<void> {
    await injectSession(page.context(), session);
    // domcontentloaded (not networkidle): the app keeps a CopilotKit connection
    // open, so the network never goes idle. Assertions wait on the list testid.
    await page.goto("/host/events", { waitUntil: "domcontentloaded" });
  }

  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("host sees own published + draft events with correct chips", async ({
      page,
    }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHostEvents(page);

      await expect(page.getByTestId("host-events-list")).toBeVisible();
      await expect(page.getByTestId("host-events-empty")).toHaveCount(0);

      // Published card → "View public event" link to /events/<slug>
      const viewLink = page.getByTestId("host-event-view-link").first();
      await expect(viewLink).toBeVisible();
      await expect(viewLink).toHaveAttribute("href", `/events/${publishedSlug}`);

      // Both status chips present
      await expect(
        page.getByTestId("host-event-status").filter({ hasText: "Published" }),
      ).toBeVisible();
      await expect(
        page.getByTestId("host-event-status").filter({ hasText: "Draft" }),
      ).toBeVisible();

      await captureScreenEvidence(
        page,
        SCREEN_ID,
        "desktop-host-events-populated.png",
      );
      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("populated grid renders on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHostEvents(page);

      await expect(page.getByTestId("host-events-list")).toBeVisible();
      await expect(page.getByTestId("host-event-card").first()).toBeVisible();

      await captureScreenEvidence(
        page,
        SCREEN_ID,
        "mobile-host-events-populated.png",
      );
      assertConsoleClean(errors);
    });
  });
});
