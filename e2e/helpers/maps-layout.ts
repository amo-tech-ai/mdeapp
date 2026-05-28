import { expect, type Page } from "@playwright/test";

const RENTAL_QUERY =
  "1BR apartment in Laureles under 80 dollars per night";

const GROUNDING_QUERY = "Quiet cafés near Laureles";

const EVENT_QUERY = "salsa events this weekend in Medellín";

export async function gotoHome(page: Page) {
  const res = await page.goto("/", { waitUntil: "domcontentloaded" });
  if (!res?.ok()) {
    throw new Error(`GET / failed: ${res?.status()}`);
  }
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await hideCopilotWebInspector(page);
  await waitForCopilotRuntime(page);
}

/** CopilotKit dev inspector overlay blocks sheet/modal clicks in e2e. */
export async function hideCopilotWebInspector(page: Page) {
  await page.addStyleTag({
    content:
      "cpk-web-inspector { display: none !important; pointer-events: none !important; }",
  });
}

/** Wait for CopilotKit runtime handshake before co-agent / chat actions. */
export async function waitForCopilotRuntime(page: Page) {
  await page
    .waitForResponse(
      (r) => r.url().includes("/api/copilotkit") && r.status() === 200,
      { timeout: 30_000 },
    )
    .catch(() => undefined);
  await ensureChatInputVisible(page);
}

export async function ensureChatInputVisible(page: Page) {
  const input = page.locator(".copilotKitInput textarea").first();
  if (await input.isVisible().catch(() => false)) return;
  const open = page.getByRole("button", { name: /open chat/i });
  if (await open.isVisible().catch(() => false)) {
    await open.click();
  }
  await input.waitFor({ state: "visible", timeout: 15_000 });
}

export async function sendConciergeMessage(page: Page, text: string) {
  await ensureChatInputVisible(page);
  const input = page.locator(".copilotKitInput textarea").first();
  await input.click();
  await input.evaluate((node, value) => {
    const textarea = node as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  }, text);

  const send = page.getByRole("button", { name: /^send$/i });
  await send.waitFor({ state: "visible", timeout: 10_000 });
  if (await send.isEnabled().catch(() => false)) {
    await send.click();
    return;
  }

  await input.press("Enter");
}

export async function waitForRentalCards(page: Page) {
  const card = page.locator('[data-testid="rental-card"]').first();
  try {
    await card.waitFor({ state: "visible", timeout: 120_000 });
  } catch {
    await sendConciergeMessage(
      page,
      "Run search-rentals now for 1BR in Laureles under $80 per night.",
    );
    await card.waitFor({ state: "visible", timeout: 120_000 });
  }
}

export async function activateEventsChip(page: Page) {
  await page.getByRole("button", { name: /^events$/i }).click();
}

export async function sendEventQuery(page: Page, text = EVENT_QUERY) {
  await activateEventsChip(page);
  await sendConciergeMessage(page, text);
}

/** Wait for assistant prose without requiring event cards (F39 clarify path). */
export async function waitForAssistantReply(page: Page, timeout = 120_000) {
  await page
    .locator(".copilotKitMessage.copilotKitAssistantMessage")
    .last()
    .waitFor({ state: "visible", timeout });
}

export async function waitForNoEventCards(page: Page, settleMs = 8_000) {
  await page.waitForTimeout(settleMs);
  const count = await page.locator('[data-testid="event-card"]').count();
  if (count > 0) {
    throw new Error(`Expected no event cards, found ${count}`);
  }
}

export async function waitForGroundedCards(page: Page) {
  await page.locator('[data-testid="grounded-card"]').first().waitFor({
    state: "visible",
    timeout: 120_000,
  });
}

/** @deprecated Use waitForGroundedCards — café cards replace attribution footer. */
export async function waitForGroundingAttribution(page: Page) {
  await waitForGroundedCards(page);
}

export function collectCriticalConsoleErrors(
  errors: string[],
): string[] {
  const allowed = [/favicon/i, /Download the React DevTools/i];
  const blocked = [
    /RefererNotAllowedMapError/i,
    /Maximum update depth exceeded/i,
    /Hydration failed/i,
  ];
  return errors.filter(
    (e) =>
      !allowed.some((p) => p.test(e)) &&
      (blocked.some((p) => p.test(e)) ||
        /maps|google|copilot|error/i.test(e)),
  );
}

export async function waitForEventCards(page: Page) {
  const card = page.locator('[data-testid="event-card"]').first();
  try {
    await card.waitFor({ state: "visible", timeout: 120_000 });
  } catch {
    await sendConciergeMessage(
      page,
      "Call search-events for salsa nightlife this weekend in Medellín and show ticketed events.",
    );
    await card.waitFor({ state: "visible", timeout: 120_000 });
  }
}

export { RENTAL_QUERY, GROUNDING_QUERY, EVENT_QUERY };

/** Rich cards own the list — generic Map results strip must stay hidden. */
export async function assertNoGenericMapResultsList(page: Page) {
  await expect(page.locator('[data-testid="results-column"]')).toHaveCount(0);
}

/** Event cards live in chat only — panel is attribution-only. */
export async function assertSingleEventCardSurface(page: Page) {
  const chatCards = page.locator(
    '#copilot-chat-region [data-testid="event-card"]',
  );
  const panelCards = page.locator(
    '[data-testid="event-results-panel"] [data-testid="event-card"]',
  );
  await expect(chatCards.first()).toBeVisible();
  await expect(panelCards).toHaveCount(0);
}

export async function assertNoDuplicateGroundingLists(page: Page) {
  await expect(
    page.locator(
      '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
    ),
  ).toHaveCount(0);
}
