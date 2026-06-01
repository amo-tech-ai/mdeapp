import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForEventCardsFastPath,
} from "./helpers/maps-layout";
import { DESKTOP_VIEWPORT } from "./helpers/screen-evidence";

const EVENT_FAST_PATH_QUERY = "salsa events this weekend";
const IDLE_POST_MAX = 10;
const EVENT_BURST_POST_MAX = 10;

/** CK-P0-07 — CopilotKit POST budget only (no restaurant agent path). */
test.describe.configure({ mode: "serial" });
test.use({ viewport: DESKTOP_VIEWPORT });

function isCopilotKitPost(url: string, method: string): boolean {
  return url.includes("/api/copilotkit") && method === "POST";
}

test.describe("CK-P0-07 CopilotKit request budget", () => {
  test("idle + event fast-path stay within POST budget", async ({ page }) => {
    test.setTimeout(180_000);

    let postCount = 0;
    const consoleErrors: string[] = [];
    let agentNotFoundCount = 0;
    let runtimeInfoFailCount = 0;

    page.on("request", (req) => {
      if (isCopilotKitPost(req.url(), req.method())) postCount++;
    });

    page.on("requestfailed", (req) => {
      const failure = req.failure()?.errorText ?? "";
      if (
        req.url().includes("/api/copilotkit") &&
        /ERR_INSUFFICIENT_RESOURCES|FAILED/i.test(failure)
      ) {
        consoleErrors.push(`requestfailed: ${failure} ${req.url()}`);
      }
    });

    page.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("ERR_INSUFFICIENT_RESOURCES")) {
        consoleErrors.push(text);
      }
      if (text.includes("Agent conciergeAgent not found")) {
        agentNotFoundCount++;
      }
      if (/runtime info.*Failed to fetch/i.test(text)) {
        runtimeInfoFailCount++;
      }
      if (/Failed to load runtime info/i.test(text)) {
        runtimeInfoFailCount++;
      }
    });

    await gotoHome(page);
    postCount = 0;
    await page.waitForTimeout(8_000);

    const idlePosts = postCount;
    expect(idlePosts, "idle CopilotKit POST budget").toBeLessThanOrEqual(IDLE_POST_MAX);

    postCount = 0;
    await sendConciergeMessage(page, EVENT_FAST_PATH_QUERY);
    await page.waitForTimeout(10_000);
    const eventBurstPosts = postCount;
    expect(
      eventBurstPosts,
      "event fast-path burst should not invoke conciergeAgent storm",
    ).toBeLessThanOrEqual(EVENT_BURST_POST_MAX);

    await waitForEventCardsFastPath(page);
    await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible();

    expect(
      consoleErrors.filter((e) => e.includes("ERR_INSUFFICIENT_RESOURCES")),
      "no ERR_INSUFFICIENT_RESOURCES",
    ).toHaveLength(0);
    expect(agentNotFoundCount, "no repeated Agent conciergeAgent not found").toBeLessThanOrEqual(
      1,
    );
    expect(runtimeInfoFailCount, "no repeated runtime info fetch failures").toBeLessThanOrEqual(
      1,
    );
  });
});
