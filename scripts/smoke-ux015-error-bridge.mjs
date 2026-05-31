/** UX-015 browser smoke — error bubble after mocked CopilotKit failure. */
import { chromium } from "playwright";

const URL = process.env.SMOKE_URL ?? "http://localhost:3001/";
const QUERY = "test error bridge smoke";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.addStyleTag({
  content:
    "cpk-web-inspector { display: none !important; pointer-events: none !important; }",
});

let failCopilotPosts = false;
await page.route("**/api/copilotkit**", async (route) => {
  const req = route.request();
  if (failCopilotPosts && req.method() === "POST") {
    await route.abort("failed");
    return;
  }
  await route.continue();
});

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30_000 });
await page.locator('[data-testid="chat-canvas"]').waitFor({ timeout: 20_000 });
await page
  .waitForResponse((r) => r.url().includes("/api/copilotkit") && r.status() === 200, {
    timeout: 30_000,
  })
  .catch(() => undefined);

const input = page.locator(".copilotKitInput textarea").first();
await input.waitFor({ state: "visible", timeout: 15_000 });
await input.click();
await input.evaluate((node, value) => {
  const textarea = node;
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  setter?.call(textarea, value);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));
}, QUERY);

const send = page.getByRole("button", { name: /^send$/i });
await send.waitFor({ state: "visible", timeout: 10_000 });
if (await send.isEnabled().catch(() => false)) {
  failCopilotPosts = true;
  await send.click();
} else {
  failCopilotPosts = true;
  await input.press("Enter");
}

const errorNotice = page.locator('[data-testid="concierge-error-notice"]');
const errorCaught = await errorNotice
  .waitFor({ state: "visible", timeout: 45_000 })
  .then(() => true)
  .catch(() => false);

const screenshotPath =
  "/home/sk/mdeai/tasks/testing/evidence/ux-015-error-bridge-smoke.png";
await page.screenshot({ path: screenshotPath, fullPage: false });

console.log(
  JSON.stringify({
    url: URL,
    query: QUERY,
    errorCaught,
    screenshotPath,
    pass: errorCaught,
  }),
);

await browser.close();
process.exit(errorCaught ? 0 : 1);
