/**
 * SAN-896 · CK-V2-008 — Refresh post-cutover v2 evidence (localhost).
 * Evidence → docs/tasks/testing/evidence/SAN-896/screenshots/
 *
 * Run (dev on :3001 with secrets):
 *   infisical run --silent --env=dev --path=/ -- \
 *     PW_SKIP_WEBSERVER=1 npx playwright test e2e/san-896-ck-v2-evidence.spec.ts --project=chromium
 */
import { test, expect } from "@playwright/test";
import path from "node:path";
import {
  activateEventsChip,
  hideCopilotWebInspector,
  sendConciergeMessage,
  waitForCopilotRuntime,
  waitForEventCards,
} from "./helpers/maps-layout";
import {
  assertConsoleClean,
  watchCriticalConsoleErrors,
} from "./helpers/screen-evidence";
import { getTestSession, hasE2eEnv, injectSession } from "./helpers/auth";

const EVIDENCE_DIR = path.resolve(
  process.cwd(),
  "docs/tasks/testing/evidence/SAN-896/screenshots",
);
const HOST_EMAIL = "ai@socialmediaville.ca";
const EVENT_CHIP_QUERY = "salsa events this weekend in Medellín";
const HOST_EVENT_PROMPT =
  "Create a salsa event this Friday in Laureles with general tickets at COP 50000";
const ANALYTICS_PROMPT = "how are my sales?";

async function sendHostChat(page: import("@playwright/test").Page, text: string) {
  const region = page
    .locator(
      '[data-testid="host-copilot-chat-region"], [data-testid="host-ops-chat-region"], [data-testid="host-os-chat-region"]',
    )
    .first();
  const input = region.getByTestId("copilot-chat-textarea");
  await input.waitFor({ state: "visible", timeout: 90_000 });
  await input.click();
  await input.fill(text);
  await input.dispatchEvent("input");

  const sendBtn = region.getByTestId("copilot-send-button");
  await expect(sendBtn).toBeEnabled({ timeout: 10_000 });
  await sendBtn.click();
}

test.describe.configure({ mode: "serial" });

test.describe("SAN-896 · CK-V2-008 evidence", () => {
  test.use({ viewport: { width: 1400, height: 900 } });
  test.setTimeout(240_000);

  test.beforeEach(async ({ page }) => {
    await hideCopilotWebInspector(page);
  });

  test("B — Events chip renders event-card (CK-V2-015)", async ({ page }) => {
    const errors = watchCriticalConsoleErrors(page);
    await page.goto("/chat", { waitUntil: "domcontentloaded" });
    await waitForCopilotRuntime(page);
    await activateEventsChip(page);
    await sendConciergeMessage(page, EVENT_CHIP_QUERY);
    await waitForEventCards(page);

    expect(await page.locator('[data-testid="events-empty"]').count()).toBe(0);
    expect(await page.locator('[data-testid="event-card"]').count()).toBeGreaterThanOrEqual(1);

    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "05-events-chip-agent-path.png"),
      fullPage: true,
    });
    assertConsoleClean(errors);
  });

  test.describe("A — Authenticated host (ai@socialmediaville.ca)", () => {
    test.skip(!hasE2eEnv(), "Supabase service key required for authed e2e");

    test("/host/event/new wizard shell (signed-in)", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      const session = await getTestSession(HOST_EMAIL);
      await injectSession(page.context(), session);

      await page.goto("/host/event/new", { waitUntil: "domcontentloaded" });
      await waitForCopilotRuntime(page);

      await expect(page.getByTestId("host-event-wizard")).toBeVisible();
      await expect(page.getByTestId("host-copilot-chat-region")).toBeVisible();
      await expect(page.getByTestId("host-event-form")).toBeVisible();
      await expect(page.getByText(`Signed in as ${HOST_EMAIL}`)).toBeVisible();

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "06-host-event-wizard-shell.png"),
        fullPage: true,
      });
      assertConsoleClean(errors);
    });

    test("/host/event/new agent fill or HITL (best-effort)", async ({ page }) => {
      test.slow();
      const errors = watchCriticalConsoleErrors(page);
      const session = await getTestSession(HOST_EMAIL);
      await injectSession(page.context(), session);

      await page.goto("/host/event/new", { waitUntil: "domcontentloaded" });
      await waitForCopilotRuntime(page);

      const assistantMessages = page.locator(
        ".copilotKitAssistantMessage, [data-message-role='assistant']",
      );
      const baselineAssistants = await assistantMessages.count();

      await sendHostChat(page, HOST_EVENT_PROMPT);
      await page
        .waitForResponse(
          (r) =>
            r.url().includes("/api/copilotkit") &&
            r.request().method() === "POST",
          { timeout: 180_000 },
        )
        .catch(() => undefined);

      const titleField = page.getByTestId("host-event-field-title");
      const neighborhoodField = page.getByTestId("host-event-field-neighborhood");
      const hitlPanel = page.getByTestId("host-event-approval-panel");

      let agentProgress = false;
      try {
        await expect
          .poll(
            async () => {
              const title = (await titleField.inputValue().catch(() => "")).trim();
              const hood = (await neighborhoodField.inputValue().catch(() => "")).trim();
              const hitl = await hitlPanel.isVisible().catch(() => false);
              const assistants = await assistantMessages.count();
              return (
                Boolean(title || hood || hitl) ||
                assistants > baselineAssistants
              );
            },
            { timeout: 180_000 },
          )
          .toBe(true);
        agentProgress = true;
      } catch {
        agentProgress = false;
      }

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "06-host-event-wizard-agent.png"),
        fullPage: true,
      });

      test.info().annotations.push({
        type: "host-event-agent",
        description: agentProgress
          ? "PASS — form fill or HITL after prompt"
          : "FAIL — shell OK; hostEventAgent did not fill form / HITL within 180s (track separately from CK-V2-015)",
      });

      expect(agentProgress).toBe(true);
      assertConsoleClean(errors);
    });

    test("/host/analytics shell + sales prompt", async ({ page }) => {
      const errors = watchCriticalConsoleErrors(page);
      const session = await getTestSession(HOST_EMAIL);
      await injectSession(page.context(), session);

      await page.goto("/host/analytics", { waitUntil: "domcontentloaded" });
      await waitForCopilotRuntime(page);

      await expect(page.getByTestId("host-analytics")).toBeVisible();
      await expect(page.getByTestId("host-os-chat-region")).toBeVisible();

      const kpiEmpty = page.getByTestId("host-kpi-empty");
      const kpiGrid = page.getByTestId("host-kpi-grid");
      await expect
        .poll(
          async () => {
            const empty = await kpiEmpty.isVisible().catch(() => false);
            const grid = await kpiGrid.isVisible().catch(() => false);
            return empty || grid;
          },
          { timeout: 15_000 },
        )
        .toBe(true);

      const hasGridOnLoad = await kpiGrid.isVisible().catch(() => false);
      if (!hasGridOnLoad) {
        await expect(page.getByTestId("host-analytics-prompt-chips")).toBeVisible();
      }

      await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes("/api/copilotkit") &&
            r.request().method() === "POST" &&
            r.status() === 200,
          { timeout: 180_000 },
        ),
        sendHostChat(page, ANALYTICS_PROMPT),
      ]);

      const salesLoaded = page.getByText("Sales loaded ✓");
      await expect
        .poll(
          async () => {
            const loaded = await salesLoaded.isVisible().catch(() => false);
            const grid = await kpiGrid.isVisible().catch(() => false);
            return loaded || grid;
          },
          { timeout: 180_000 },
        )
        .toBe(true);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "07-host-analytics.png"),
        fullPage: true,
      });
      assertConsoleClean(errors);
    });
  });
});
