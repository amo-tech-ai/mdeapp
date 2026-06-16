/**
 * CK-V2-015 — Events chip agent path: category resolution + card render.
 * Evidence → docs/tasks/testing/evidence/CK-V2-015/screenshots/
 *
 * Run (dev on :3001 with secrets):
 *   infisical run --silent --env=dev --path=/ -- \
 *     PW_SKIP_WEBSERVER=1 npx playwright test e2e/ck-v2-015-events-chip.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";
import path from "node:path";
import {
  activateEventsChip,
  hideCopilotWebInspector,
  sendConciergeMessage,
  waitForCafeGroundedCards,
  waitForCopilotRuntime,
  waitForEventCards,
  waitForRentalCards,
} from "./helpers/maps-layout";
import {
  assertConsoleClean,
  watchCriticalConsoleErrors,
} from "./helpers/screen-evidence";

const EVIDENCE_DIR = path.resolve(
  process.cwd(),
  "docs/tasks/testing/evidence/CK-V2-015/screenshots",
);
const EVENT_CHIP_QUERY = "salsa events this weekend in Medellín";
const RENTAL_QUERY = "1BR in Laureles under $80/night";
const CAFE_QUERY = "Quiet cafés near Laureles";

test.describe.configure({ mode: "serial" });

test.describe("CK-V2-015 — Events chip category resolution", () => {
  test.use({ viewport: { width: 1400, height: 900 } });
  test.setTimeout(240_000);

  test.beforeEach(async ({ page }) => {
    await hideCopilotWebInspector(page);
  });

  test("Events chip + salsa query renders event-card (no empty state)", async ({
    page,
  }) => {
    const errors = watchCriticalConsoleErrors(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await waitForCopilotRuntime(page);
    await activateEventsChip(page);
    await sendConciergeMessage(page, EVENT_CHIP_QUERY);
    await waitForEventCards(page);

    expect(await page.locator('[data-testid="events-empty"]').count()).toBe(0);
    expect(
      await page.locator('[data-testid="event-card"]').count(),
    ).toBeGreaterThanOrEqual(1);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "01-events-chip-agent-path.png"),
      fullPage: true,
    });
    assertConsoleClean(errors);
  });

  test("regression — rentals still render", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await waitForCopilotRuntime(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    expect(
      await page.locator('[data-testid="rental-card"]').count(),
    ).toBeGreaterThanOrEqual(1);
    assertConsoleClean(errors);
  });

  test("regression — cafés still render", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await waitForCopilotRuntime(page);
    await sendConciergeMessage(page, CAFE_QUERY);
    await waitForCafeGroundedCards(page);
    expect(
      await page
        .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
        .count(),
    ).toBeGreaterThanOrEqual(1);
    assertConsoleClean(errors);
  });

  test("regression — events without chip still render cards", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await waitForCopilotRuntime(page);
    await sendConciergeMessage(page, EVENT_CHIP_QUERY);
    await waitForEventCards(page);
    expect(
      await page.locator('[data-testid="event-card"]').count(),
    ).toBeGreaterThanOrEqual(1);
    assertConsoleClean(errors);
  });
});
