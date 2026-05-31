import { test, expect } from "@playwright/test";
import { gotoHome, sendConciergeMessage } from "./helpers/maps-layout";
import {
  watchCriticalConsoleErrors,
  assertConsoleClean,
  captureScreenEvidence,
  DESKTOP_VIEWPORT,
} from "./helpers/screen-evidence";

test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

test.describe("UX-016 concierge RUN_ERROR error bubble", () => {
  test("shows error notice when CopilotKit POST fails after send", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors = watchCriticalConsoleErrors(page);
    let failCopilotPosts = false;
    let postCount = 0;

    await page.route("**/api/copilotkit**", async (route) => {
      if (route.request().method() === "POST") postCount++;
      if (failCopilotPosts && route.request().method() === "POST") {
        await route.abort("failed");
        return;
      }
      await route.continue();
    });

    await gotoHome(page);
    failCopilotPosts = true;
    await sendConciergeMessage(page, "test error bridge smoke");

    await expect(
      page.locator('[data-testid="concierge-error-notice"]'),
    ).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText("Something went wrong")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();

    const body = await page.locator("#copilot-chat-region").innerText();
    expect(body).not.toMatch(/RUN_ERROR|EAUTHTIMEOUT|INCOMPLETE_STREAM/);

    await page.getByRole("button", { name: "Try again" }).click();
    await expect.poll(() => postCount).toBeGreaterThan(1);

    await captureScreenEvidence(page, "UX-016", "run-error-notice.png", {
      fullPage: false,
    });

    assertConsoleClean(errors);
  });
});
