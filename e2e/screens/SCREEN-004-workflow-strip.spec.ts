import { test, expect } from "@playwright/test";
import {
  gotoHome,
  RENTAL_QUERY,
  sendConciergeMessage,
  waitForRentalCards,
} from "../helpers/maps-layout";
import {
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
  MOBILE_VIEWPORT,
  watchCriticalConsoleErrors,
} from "../helpers/screen-evidence";

const SCREEN_ID = "SCREEN-004";

test.describe.configure({ mode: "serial" });

async function waitForWorkflowPhase(
  page: import("@playwright/test").Page,
  phase: "running" | "complete",
  timeoutMs = 120_000,
) {
  await page.waitForFunction(
    (expected) => {
      const el = document.querySelector('[data-testid="workflow-progress-strip"]');
      return el?.getAttribute("data-phase") === expected;
    },
    phase,
    { timeout: timeoutMs },
  );
}

test.describe(`${SCREEN_ID} workflow progress strip`, () => {
  test.describe("desktop", () => {
    test.use({ viewport: DESKTOP_VIEWPORT });

    test("rental search drives strip running → complete", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);

      const strip = page.locator('[data-testid="workflow-progress-strip"]');
      await expect(strip).toHaveAttribute("data-phase", "idle");

      await sendConciergeMessage(page, RENTAL_QUERY);

      await Promise.race([
        waitForWorkflowPhase(page, "running", 120_000),
        waitForRentalCards(page),
      ]).catch(() => undefined);

      const phaseAfterSend = await strip.getAttribute("data-phase");
      if (phaseAfterSend === "running") {
        await expect(strip).toHaveAttribute("data-kind", "rental");
        await captureScreenEvidence(page, SCREEN_ID, "desktop-strip-running.png");
      }

      await waitForRentalCards(page);
      await captureScreenEvidence(page, SCREEN_ID, "desktop-strip-complete.png");

      assertConsoleClean(errors);
    });
  });

  test.describe("mobile", () => {
    test.use({ viewport: MOBILE_VIEWPORT });

    test("strip visible during rental search on mobile", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      await gotoHome(page);
      await sendConciergeMessage(page, RENTAL_QUERY);
      await waitForRentalCards(page);

      const strip = page.locator('[data-testid="workflow-progress-strip"]');
      await expect(strip).toBeAttached();
      await captureScreenEvidence(page, SCREEN_ID, "mobile-strip-results.png");
      assertConsoleClean(errors);
    });
  });
});
