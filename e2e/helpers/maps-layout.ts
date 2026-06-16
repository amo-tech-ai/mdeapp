import { expect, type Page } from "@playwright/test";

const RENTAL_QUERY =
  "1BR apartment in Laureles under 80 dollars per night";

const GROUNDING_QUERY = "Quiet cafés near Laureles";

const NIGHTLIFE_GROUNDING_QUERY =
  "Salsa bars and rooftop cocktails locals go to in El Poblado";

const EVENT_QUERY = "salsa events this weekend in Medellín";

/** Marketing homepage — hero search, FAB, no GeoChatShell yet. */
export async function gotoMarketingHome(page: Page) {
  const res = await page.goto("/", { waitUntil: "domcontentloaded" });
  if (!res?.ok()) {
    throw new Error(`GET / failed: ${res?.status()}`);
  }
  await page
    .getByRole("searchbox", { name: /ask the ai concierge/i })
    .waitFor({ state: "visible", timeout: 20_000 });
  await hideCopilotWebInspector(page);
}

/** Hero Ask CTA — client navigates to /chat?q=… */
export async function submitHomeHeroQuery(page: Page, text: string) {
  const input = page.getByRole("searchbox", { name: /ask the ai concierge/i });
  await input.click();
  await input.evaluate((node, value) => {
    const el = node as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(el, value);
    el.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: value,
        inputType: "insertText",
      }),
    );
  }, text);
  const submit = page.getByRole("button", { name: /^search$/i });
  await expect(submit).toBeEnabled({ timeout: 10_000 });
  await Promise.all([
    page.waitForURL(/\/chat/, { timeout: 30_000 }),
    submit.click(),
  ]);
}

/** After home handoff: lands on /chat, ?q stripped, user message sent once. */
export async function waitForHomeToChatHandoff(page: Page, query: string) {
  await page.waitForURL(/\/chat/, { timeout: 30_000 });
  await expect(page).toHaveURL(/\/chat$/, { timeout: 60_000 });
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await waitForCopilotRuntime(page);
  const region = page.locator('[data-testid="copilot-chat-region"]');
  await expect(region.getByText(query, { exact: true })).toHaveCount(1, {
    timeout: 90_000,
  });
}

export async function assertConciergeShellVisible(page: Page) {
  await expect(page.locator('[data-testid="chat-canvas"]')).toBeVisible();
  await expect(page.locator('[data-testid="center-chat-panel"]')).toBeVisible();
  await expect(page.locator('[data-testid="map-panel"]')).toBeVisible();
  await expect(page.locator('[data-testid="chat-map"]')).toBeVisible();
}

/** Generic event query from home may clarify instead of rendering cards. */
export async function waitForHomeEventHandoff(page: Page) {
  const card = page.locator('[data-testid="event-card"]').first();
  const clarify = page.getByText(/What kind of events are you looking for/i);
  try {
    await Promise.race([
      card.waitFor({ state: "visible", timeout: 90_000 }),
      clarify.waitFor({ state: "visible", timeout: 90_000 }),
    ]);
  } catch {
    await waitForEventCards(page);
  }
}

/** Map panel shows at least one pin. */
export async function waitForMapPinsUpdated(page: Page, timeout = 120_000) {
  await page.waitForFunction(
    () => {
      const pins = document.querySelectorAll('[data-testid="map-pin"]');
      return pins.length > 0;
    },
    { timeout },
  );
}

/** Canonical concierge surface — GeoChatShell on /chat (D-13 restore). */
export async function gotoConcierge(page: Page) {
  const res = await page.goto("/chat", { waitUntil: "domcontentloaded" });
  if (!res?.ok()) {
    throw new Error(`GET /chat failed: ${res?.status()}`);
  }
  await page
    .locator('[data-testid="chat-canvas"]')
    .waitFor({ state: "visible", timeout: 20_000 });
  await hideCopilotWebInspector(page);
  await waitForCopilotRuntime(page);
}

/** @deprecated Use gotoConcierge — kept for existing e2e imports. */
export async function gotoHome(page: Page) {
  await gotoConcierge(page);
}

const CPK_INSPECTOR_HIDE_CSS =
  "cpk-web-inspector { display: none !important; pointer-events: none !important; }";

/** CopilotKit dev inspector overlay blocks sheet/modal clicks in e2e. */
export async function hideCopilotWebInspector(page: Page) {
  await page.addInitScript((css) => {
    const id = "mde-e2e-hide-cpk-inspector";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }, CPK_INSPECTOR_HIDE_CSS);
  // Also hide on the current document when called after navigation.
  await page
    .evaluate((css) => {
      const id = "mde-e2e-hide-cpk-inspector";
      if (document.getElementById(id)) return;
      const style = document.createElement("style");
      style.id = id;
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }, CPK_INSPECTOR_HIDE_CSS)
    .catch(() => undefined);
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
  const input = page
    .locator('.copilotKitInput textarea, [role="textbox"][placeholder*="message" i]')
    .first();
  if (await input.isVisible().catch(() => false)) return;
  const open = page.getByRole("button", { name: /open chat/i });
  if (await open.isVisible().catch(() => false)) {
    await open.click();
  }
  await input.waitFor({ state: "visible", timeout: 15_000 });
}

/** Playwright helper — type into the concierge composer and submit (multi-strategy send cascade). */
export async function sendConciergeMessage(page: Page, text: string) {
  await ensureChatInputVisible(page);
  const input = page
    .locator('.copilotKitInput textarea, [role="textbox"][placeholder*="message" i]')
    .first();
  await input.click();
  await input.evaluate((node, value) => {
    const textarea = node as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, value);
    textarea.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: value,
        inputType: "insertText",
      }),
    );
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  }, text);

  // CopilotKit v2 chat layouts differ (center panel, sidebar, welcome screen).
  // Try composer-scoped controls first, then broader fallbacks, then Enter.
  // sendNearComposer — CK-V2 ConciergeChatView mount + .copilotKitInput send
  // sendBesideInput — XPath: nearest ancestor row with buttons (legacy layouts)
  // controlSend — global .copilotKitInputControlButton (no mount testid)
  // namedSend — accessible "Send" label when class names drift
  // Enter — last resort when no send button is clickable
  const sendNearComposer = page
    .locator(
      '[data-testid="concierge-chat-view-mounted"] .copilotKitInputControlButton, [data-testid="concierge-chat-view-mounted"] .copilotKitInput button:not([disabled])',
    )
    .first();
  if (await sendNearComposer.isVisible().catch(() => false)) {
    await expect(sendNearComposer).toBeEnabled({ timeout: 10_000 });
    await sendNearComposer.click();
    return;
  }

  const sendBesideInput = input
    .locator("xpath=ancestor::div[.//button][1]//button[not(@disabled)]")
    .last();
  if (await sendBesideInput.isVisible().catch(() => false)) {
    await sendBesideInput.click();
    return;
  }

  const controlSend = page.locator(".copilotKitInputControlButton").first();
  if (await controlSend.isVisible().catch(() => false)) {
    await expect(controlSend).toBeEnabled({ timeout: 10_000 });
    await controlSend.click();
    return;
  }

  const namedSend = page.getByRole("button", { name: /^send$/i });
  if (await namedSend.isVisible().catch(() => false)) {
    if (await namedSend.isEnabled().catch(() => false)) {
      await namedSend.click();
      return;
    }
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

/** Café grounding cards — retry with explicit tool nudge on agent flake. */
export async function waitForCafeGroundedCards(page: Page) {
  const cafeCard = page
    .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
    .first();
  try {
    await cafeCard.waitFor({ state: "visible", timeout: 120_000 });
  } catch {
    await sendConciergeMessage(
      page,
      "Show me quiet cafés near Laureles with photos and ratings on the map.",
    );
    await cafeCard.waitFor({ state: "visible", timeout: 120_000 });
  }
}

const COPILOT_SEND_CONTROL =
  '[data-testid="copilot-chat-ready"], [data-testid="copilot-chat-request-in-progress"]';

/** Wait until CopilotKit finishes the current turn (streaming → idle). */
export async function waitForCopilotIdle(page: Page, timeout = 120_000) {
  await ensureChatInputVisible(page);
  const send = page.locator(COPILOT_SEND_CONTROL).first();
  try {
    await send.waitFor({ state: "attached", timeout: 30_000 });
  } catch {
    // Fast-path turns may skip CopilotKit progress attrs — idle = enabled composer.
    const input = page.locator(".copilotKitInput textarea").first();
    await input.waitFor({ state: "visible", timeout: 15_000 });
    await expect(input).toBeEnabled({ timeout });
    return;
  }
  await expect(send)
    .toHaveAttribute("data-copilotkit-in-progress", "true", { timeout: 15_000 })
    .catch(() => undefined);
  await expect(send).toHaveAttribute("data-copilotkit-in-progress", "false", {
    timeout,
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
      "Call search-events for salsa events this weekend in Medellín and show ticketed events.",
    );
    await card.waitFor({ state: "visible", timeout: 120_000 });
  }
}

/** Event fast-path only — no agent nudge (avoids CopilotKit POST storm in budget e2e). */
export async function waitForEventCardsFastPath(page: Page, timeout = 90_000) {
  await page.locator('[data-testid="event-card"]').first().waitFor({
    state: "visible",
    timeout,
  });
}

export const RESTAURANT_FAST_PATH_QUERY = "suggest restaurants medellin";

/** Restaurant cards from fast-path panel (no CopilotKit tool render). */
export async function waitForRestaurantCards(page: Page) {
  const panel = page.locator('[data-testid="restaurant-fast-path-panel"]');
  const card = page.locator('[data-testid="restaurant-card"]').first();
  try {
    await panel.waitFor({ state: "visible", timeout: 90_000 });
    await card.waitFor({ state: "visible", timeout: 30_000 });
  } catch {
    throw new Error(
      "Restaurant fast-path cards did not render — ensure UX-036 feat slice is on disk and dev server restarted.",
    );
  }
}

/** Nightlife grounding cards — retry with explicit tool nudge on agent flake. */
export async function waitForNightlifeGroundedCards(page: Page) {
  const card = page
    .locator('[data-testid="nightlife-card"][data-result-kind="nightlife"]')
    .first();
  try {
    await card.waitFor({ state: "visible", timeout: 120_000 });
  } catch {
    await sendConciergeMessage(
      page,
      "Use search-grounded-places for salsa bars and rooftop cocktails in El Poblado with map pins.",
    );
    await card.waitFor({ state: "visible", timeout: 120_000 });
  }
}

export {
  RENTAL_QUERY,
  GROUNDING_QUERY,
  NIGHTLIFE_GROUNDING_QUERY,
  EVENT_QUERY,
};

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
