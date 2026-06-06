import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1360, height: 900 },
] as const;

const OUT_DIR =
  process.env.SAN575_EVIDENCE_DIR ??
  "../tasks/testing/evidence/2026-06-05/san-575";

for (const vp of VIEWPORTS) {
  test.describe(`SAN-575 restaurants re-skin @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("browse page screenshot", async ({ page }) => {
      await page.goto("/restaurants");
      await expect(page.getByTestId("restaurants-browse")).toBeVisible();
      await expect(page.locator('[data-testid^="restaurant-card-"]').first()).toBeVisible();
      await page.screenshot({
        path: `${OUT_DIR}/${vp.name}-restaurants.png`,
        fullPage: true,
      });
    });
  });
}
