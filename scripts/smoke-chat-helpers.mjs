/**
 * Shared Playwright helpers for browser smokes (map-pins, f50, verify:console).
 */

export const SMOKE_BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
export const SMOKE_RENTAL_QUERY =
  process.env.SMOKE_RENTAL_QUERY ??
  "1BR apartment in Laureles under 80 dollars per night";
export const SMOKE_CARD_TIMEOUT_MS = 120_000;

export function smokeFail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

export function assertSmokeEnv() {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    smokeFail("missing GOOGLE_GENERATIVE_AI_API_KEY");
  }
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    smokeFail(
      "missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (set in mdeapp/.env.local)",
    );
  }
}

export async function hideCopilotWebInspector(page) {
  await page.addStyleTag({
    content:
      "cpk-web-inspector { display: none !important; pointer-events: none !important; }",
  });
}

export async function waitForCopilotRuntime(page) {
  await page
    .waitForResponse(
      (r) => r.url().includes("/api/copilotkit") && r.status() === 200,
      { timeout: 30_000 },
    )
    .catch(() => undefined);
}

export async function ensureChatInputVisible(page) {
  const input = page.locator(".copilotKitInput textarea").first();
  if (await input.isVisible().catch(() => false)) return input;
  const open = page.getByRole("button", { name: /open chat/i });
  if (await open.isVisible().catch(() => false)) {
    await open.click();
  }
  await input.waitFor({ state: "visible", timeout: 15_000 });
  return input;
}

export async function waitForHome(page) {
  const res = await page.goto(SMOKE_BASE, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  if (!res?.ok()) smokeFail(`GET ${SMOKE_BASE} → ${res?.status()}`);

  const refererHelp = page.locator('[data-testid="map-referer-help"]');
  if (await refererHelp.isVisible().catch(() => false)) {
    smokeFail(
      "Maps referer error — fix GCP HTTP referrers for http://localhost:3001/*",
    );
  }

  await page
    .locator(
      '[data-testid="chat-canvas"], [data-testid="center-chat-panel"], [data-testid="chat-map"]',
    )
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });

  await hideCopilotWebInspector(page);
  await waitForCopilotRuntime(page);
}

export async function sendConciergeMessage(page, text) {
  const input = await ensureChatInputVisible(page);
  await input.fill(text);
  await page.getByRole("button", { name: /^send$/i }).click();
  await page.getByText(text, { exact: true }).waitFor({
    state: "visible",
    timeout: 15_000,
  });
}

/** Wait for rental cards; nudge agent to call search-rentals on first timeout. */
export async function waitForRentalCards(page, { timeoutMs = SMOKE_CARD_TIMEOUT_MS } = {}) {
  const card = page.locator('[data-testid="rental-card"]').first();
  try {
    await card.waitFor({ state: "visible", timeout: timeoutMs });
    return;
  } catch {
    await sendConciergeMessage(
      page,
      "Run search-rentals now for 1BR in Laureles under $80 per night.",
    );
    await card.waitFor({ state: "visible", timeout: timeoutMs });
  }
}

export async function logChatExcerptOnFailure(page) {
  const snippet = await page.locator("main").innerText().catch(() => "");
  console.error("   chat excerpt:", snippet.slice(0, 800));
}
