/** UX-005 browser smoke — thinking indicator must appear after agent send. */
import { chromium } from "playwright";

const URL = process.env.SMOKE_URL ?? "http://localhost:3001/";
const QUERY =
  "How does the Medellín metro connect Laureles to the city center?";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="copilot-chat-ready"]', { timeout: 30_000 });
await page.getByPlaceholder("Type a message...").fill(QUERY);

const thinkingPromise = page
  .waitForSelector('[data-testid="concierge-thinking"]', { timeout: 20_000 })
  .then(() => true)
  .catch(() => false);

await page.getByRole("button", { name: "Send" }).click();

const [thinkingCaught, inProgressCaught] = await Promise.all([
  thinkingPromise,
  page
    .waitForSelector('[data-testid="copilot-chat-request-in-progress"]', {
      timeout: 20_000,
    })
    .then(() => true)
    .catch(() => false),
]);

await page.waitForTimeout(2000);
const screenshotPath = "/home/sk/mdeai/tasks/testing/evidence/ux-005-thinking-smoke.png";
await page.screenshot({ path: screenshotPath, fullPage: false });

console.log(
  JSON.stringify({
    url: URL,
    query: QUERY,
    thinkingCaught,
    inProgressCaught,
    screenshotPath,
    pass: thinkingCaught,
  }),
);

await browser.close();
process.exit(thinkingCaught ? 0 : 1);
