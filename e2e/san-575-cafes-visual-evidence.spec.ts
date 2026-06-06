import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
] as const;

const OUT_DIR =
  process.env.SAN575_EVIDENCE_DIR ??
  "../tasks/testing/evidence/2026-06-06/san-575-cafes";

for (const vp of VIEWPORTS) {
  test.describe(`SAN-575 cafés re-skin @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("browse page screenshot", async ({ page }) => {
      await page.goto("/cafes", { waitUntil: "networkidle" });
      await expect(page.getByTestId("cafes-browse").first()).toBeVisible();
      await expect(
        page.locator('[data-testid^="cafe-card-"]').first(),
      ).toBeVisible();
      await page.screenshot({
        path: `${OUT_DIR}/${vp.name}-cafes.png`,
        fullPage: true,
      });
    });
  });
}
