import { test, expect } from "@playwright/test";
import {
  gotoHome,
  sendConciergeMessage,
  waitForCopilotIdle,
  waitForRentalCards,
  RENTAL_QUERY,
  GROUNDING_QUERY,
} from "../helpers/maps-layout";

/** SAN-860 — localhost pin clear before prod deploy gate. */
test.describe("SAN-860 · UX-033 — J15 pin clear (localhost)", () => {
  test("rental then café clears rental and event pins", async ({ page }) => {
    test.setTimeout(300_000);

    const collectPins = () =>
      page.locator('[data-testid="map-pin"]').evaluateAll((els) =>
        els.map((el) => ({
          id: el.getAttribute("data-pin-id") ?? "",
          category: el.getAttribute("data-pin-category") ?? "",
        })),
      );

    await gotoHome(page);
    await sendConciergeMessage(page, RENTAL_QUERY);
    await waitForRentalCards(page);
    await waitForCopilotIdle(page, 120_000);
    const rentalPins = await collectPins();
    expect(rentalPins.some((p) => p.category === "rental")).toBe(true);

    await sendConciergeMessage(page, GROUNDING_QUERY);
    await waitForCopilotIdle(page, 120_000);

    const cafeCards = await page
      .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
      .count();
    expect(cafeCards).toBeGreaterThan(0);

    const afterPins = await collectPins();
    const toolPins = afterPins.filter((p) => p.id && p.category !== "mock");
    expect(toolPins.every((p) => p.category === "grounded")).toBe(true);
    expect(toolPins.some((p) => rentalPins.some((r) => r.id === p.id))).toBe(
      false,
    );
  });
});
