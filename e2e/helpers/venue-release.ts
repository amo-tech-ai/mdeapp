import { expect, type Page } from "@playwright/test";
import {
  assertNoDuplicateGroundingLists,
  assertNoGenericMapResultsList,
  collectCriticalConsoleErrors,
  ensureChatInputVisible,
  GROUNDING_QUERY,
  hideCopilotWebInspector,
  NIGHTLIFE_GROUNDING_QUERY,
  sendConciergeMessage,
  waitForCopilotRuntime,
} from "./maps-layout";

/** While SAN-368 is blocked — flip when prod ADK grounding-lite ships. */
export const EXPECT_CURATED_GROUNDING_FALLBACK = true;

const AGENT_CARD_TIMEOUT_MS = 90_000;

export function attachConsoleWatcher(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

export function assertConsoleHygiene(errors: string[]): void {
  const critical = collectCriticalConsoleErrors(errors);
  expect(critical, critical.join(" | ")).toEqual([]);
}

export async function gotoChatHome(page: Page): Promise<void> {
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

/** Single wait — no agent nudge retry (SAN-314 release gate). */
export async function waitForCafeCardsStrict(page: Page): Promise<void> {
  await page
    .locator('[data-testid="grounded-card"][data-result-kind="cafe"]')
    .first()
    .waitFor({ state: "visible", timeout: AGENT_CARD_TIMEOUT_MS });
}

export async function waitForNightlifeCardsStrict(page: Page): Promise<void> {
  await page
    .locator('[data-testid="nightlife-card"][data-result-kind="nightlife"]')
    .first()
    .waitFor({ state: "visible", timeout: AGENT_CARD_TIMEOUT_MS });
}

/**
 * Curated fallback (venue_anchors / ADK down) — not real grounding-lite.
 * Do not treat absence of attribution as ADK success while SAN-368 blocked.
 */
export async function assertCuratedFallbackGrounding(page: Page): Promise<void> {
  if (!EXPECT_CURATED_GROUNDING_FALLBACK) {
    await expect(
      page.locator(
        '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
      ).first(),
    ).toBeVisible();
    return;
  }

  await expect(
    page.locator(
      '[data-testid="grounding-attribution"], [data-testid="grounding-attribution-compact"]',
    ),
  ).toHaveCount(0);

  const card = page
    .locator(
      '[data-testid="grounded-card"][data-result-kind="cafe"], [data-testid="nightlife-card"][data-result-kind="nightlife"]',
    )
    .first();
  await expect(card).toContainText(/Google-verified candidate/);
}

export async function assertNoDuplicateVenueSurfaces(page: Page): Promise<void> {
  await assertNoGenericMapResultsList(page);
  await assertNoDuplicateGroundingLists(page);
  await expect(page.locator('[data-testid="results-column"]')).toHaveCount(0);
}

export async function sendCafeGroundingQuery(page: Page): Promise<void> {
  await sendConciergeMessage(page, GROUNDING_QUERY);
  await waitForCafeCardsStrict(page);
}

export async function sendNightlifeGroundingQuery(page: Page): Promise<void> {
  await sendConciergeMessage(page, NIGHTLIFE_GROUNDING_QUERY);
  await waitForNightlifeCardsStrict(page);
}

export async function assertChatComposerUsable(page: Page): Promise<void> {
  await ensureChatInputVisible(page);
  const input = page.locator(".copilotKitInput textarea").first();
  await input.click({ timeout: 5_000 });
  await expect(input).toBeFocused();
}

export async function gotoBrowseRoute(
  page: Page,
  path: string,
): Promise<void> {
  const res = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(res?.ok(), `${path} must respond 2xx (got ${res?.status()})`).toBeTruthy();
}
