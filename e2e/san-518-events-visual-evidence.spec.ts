import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
] as const;

const OUT_DIR =
  process.env.SAN518_EVIDENCE_DIR ??
  "../tasks/testing/evidence/2026-06-06/san-518";

for (const vp of VIEWPORTS) {
  test.describe(`SAN-518 events browse @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("browse page screenshot", async ({ page }) => {
      await page.goto("/events", { waitUntil: "networkidle" });
      await expect(page.getByTestId("events-browse").first()).toBeVisible();

      const cards = page.getByTestId("event-card");
      const empty = page.getByTestId("events-browse-empty");
      const cardCount = await cards.count();
      if (cardCount > 0) {
        await expect(cards.first()).toBeVisible();
      } else {
        await expect(empty).toBeVisible();
      }

      await page.screenshot({
        path: `${OUT_DIR}/${vp.name}-events.png`,
        fullPage: true,
      });
    });
  });
}
