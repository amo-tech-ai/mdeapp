/**
 * SAN-891 · CK-V2-005 — v2-only localhost proof (/chat · /host/event/new · /host/analytics).
 *
 * Run:
 *   infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-891/san-891-localhost-proof.mjs
 */
import { execSync } from "node:child_process";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN891_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const RENTAL_PROMPT = "1BR in Laureles under $80/night";
const EVENT_PROMPT = "salsa events this weekend in Medellín";
const ROBERTO_PROMPT =
  "Startup mixer March 15 in Provenza, 200 cap, GA free + VIP 50000 COP";

function resolveHeadSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      cwd: process.cwd(),
    }).trim();
  } catch {
    return "unknown";
  }
}

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] === undefined) {
      process.env[key] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvLocal();

async function getTestSession() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !anon || !serviceKey) {
    throw new Error("Supabase env missing for session mint");
  }
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const client = createClient(url, anon);
  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: QA_EMAIL,
  });
  if (linkErr) throw linkErr;
  const otp = link?.properties?.email_otp;
  if (!otp) throw new Error("missing email_otp");
  const { data, error } = await client.auth.verifyOtp({
    email: QA_EMAIL,
    token: otp,
    type: "email",
  });
  if (error || !data.session) throw error ?? new Error("no session");
  return { session: data.session, ref: new URL(url).hostname.split(".")[0] };
}

async function injectSession(context, session, ref) {
  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: "bearer",
    user: session.user,
  });
  await context.clearCookies();
  await context.addCookies([
    {
      name: `sb-${ref}-auth-token`,
      value: payload,
      domain: BASE_HOST,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

async function copilotkitPostOk() {
  const res = await fetch(`${BASE}/api/copilotkit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return res.status === 200 || res.status === 400;
}

const BENIGN_FAILED_RESOURCE_RE =
  /Failed to load resource:.*(cpk-web-inspector|googletagmanager|vercel\.live\/_next-live)/i;

function filterConsoleErrors(errors) {
  return errors.filter(
    (e) =>
      !e.includes("hydration") &&
      !e.includes("caret-color") &&
      !e.includes("Vector Map") &&
      !e.includes("Lit is in dev mode") &&
      !BENIGN_FAILED_RESOURCE_RE.test(e),
  );
}

async function hideCopilotWebInspector(page) {
  await page.addStyleTag({
    content:
      "cpk-web-inspector, #cpk-web-inspector { display: none !important; pointer-events: none !important; }",
  });
}

async function waitForCopilotRuntime(page) {
  await page
    .waitForResponse(
      (r) => r.url().includes("/api/copilotkit") && r.status() === 200,
      { timeout: 60_000 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(1500);
}

async function waitForCopilotIdle(page, timeout = 120_000) {
  const progress = page.locator('[data-copilotkit-in-progress="true"]');
  try {
    await progress.waitFor({ state: "attached", timeout: 15_000 });
    await progress.waitFor({ state: "detached", timeout });
  } catch {
    await page.waitForTimeout(3000);
  }
}

async function sendInRegion(page, regionTestId, prompt) {
  const chatRegion = page.getByTestId(regionTestId);
  const chatInput = chatRegion
    .getByTestId("copilot-chat-textarea")
    .or(chatRegion.locator(".copilotKitInput textarea").first());
  await chatInput.click();
  await chatInput.evaluate((node, value) => {
    const textarea = node;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, value);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  }, prompt);
  const send = chatRegion.getByTestId("copilot-send-button");
  try {
    await page.waitForFunction(
      (id) => {
        const region = document.querySelector(`[data-testid="${id}"]`);
        if (!region) return false;
        const btn = region.querySelector('[data-testid="copilot-send-button"]');
        return btn instanceof HTMLButtonElement && !btn.disabled;
      },
      regionTestId,
      { timeout: 60_000 },
    );
    await send.click();
  } catch {
    await chatInput.press("Enter");
  }
}

async function waitForChatRegionReady(page, regionTestId) {
  const chatRegion = page.getByTestId(regionTestId);
  const chatInput = chatRegion
    .getByTestId("copilot-chat-textarea")
    .or(chatRegion.locator(".copilotKitInput textarea").first());
  await chatInput.waitFor({ state: "visible", timeout: 90_000 });
}

const results = {
  task: "SAN-891 · CK-V2-005 — Retire @copilotkit/react-ui",
  mode: "v2-only",
  baseUrl: BASE,
  headSha: resolveHeadSha(),
  baselineSha: "078a677c",
  at: new Date().toISOString(),
  routes: {},
  gates: {},
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(180_000);
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  results.gates.copilotkitPost = await copilotkitPostOk();
  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  // --- /chat ---
  const chat = {};
  const chatNav = await page.goto(`${BASE}/chat`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  chat.http = chatNav?.status() ?? 0;
  await hideCopilotWebInspector(page);
  chat.geoChatShell = await page.getByTestId("geo-chat-shell").isVisible();
  chat.chatCanvas = await page.getByTestId("chat-canvas").isVisible();
  chat.centerPanel = await page.getByTestId("center-chat-panel").isVisible();
  await waitForChatRegionReady(page, "copilot-chat-region");
  await waitForCopilotRuntime(page);
  await sendInRegion(page, "copilot-chat-region", RENTAL_PROMPT);
  await waitForCopilotIdle(page);
  chat.rentalCards = (await page.getByTestId("rental-card").count()) > 0;
  if (!chat.rentalCards) {
    await page.waitForTimeout(5000);
    await sendInRegion(
      page,
      "copilot-chat-region",
      "Run search-rentals now for 1BR in Laureles under $80 per night.",
    );
    await waitForCopilotIdle(page, 180_000);
    chat.rentalCards = (await page.getByTestId("rental-card").count()) > 0;
  }
  if (!chat.rentalCards) {
    await page.waitForTimeout(5000);
    await sendInRegion(page, "copilot-chat-region", EVENT_PROMPT);
    await waitForCopilotIdle(page, 180_000);
    chat.eventCards = (await page.getByTestId("event-card").count()) > 0;
  }
  chat.toolCards = chat.rentalCards || chat.eventCards === true;
  chat.screenshot = "SAN-891-chat-localhost.png";
  await page.screenshot({
    path: path.join(OUT_DIR, chat.screenshot),
    fullPage: true,
  });
  results.routes.chat = chat;

  await page.waitForTimeout(8000);

  // --- /host/event/new ---
  const hostEvent = {};
  const eventNav = await page.goto(`${BASE}/host/event/new`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  hostEvent.http = eventNav?.status() ?? 0;
  hostEvent.wizard = await page.getByTestId("host-event-wizard").isVisible();
  hostEvent.form = await page.getByTestId("host-event-form").isVisible();
  await waitForChatRegionReady(page, "host-copilot-chat-region");
  await sendInRegion(page, "host-copilot-chat-region", ROBERTO_PROMPT);
  await waitForCopilotIdle(page, 120_000);
  hostEvent.screenshot = "SAN-891-host-event-new-localhost.png";
  await page.screenshot({
    path: path.join(OUT_DIR, hostEvent.screenshot),
    fullPage: true,
  });
  results.routes.hostEventNew = hostEvent;

  await page.waitForTimeout(8000);

  // --- /host/analytics ---
  const analytics = {};
  const analyticsNav = await page.goto(`${BASE}/host/analytics`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  analytics.http = analyticsNav?.status() ?? 0;
  analytics.shell = await page.getByTestId("host-analytics").isVisible();
  await waitForChatRegionReady(page, "host-ops-chat-region");
  await sendInRegion(page, "host-ops-chat-region", "how are my sales?");
  try {
    await page.getByText("Sales loaded ✓").waitFor({ timeout: 120_000 });
    analytics.salesAck = true;
  } catch {
    analytics.salesAck = false;
  }
  analytics.screenshot = "SAN-891-host-analytics-localhost.png";
  await page.screenshot({
    path: path.join(OUT_DIR, analytics.screenshot),
    fullPage: true,
  });
  results.routes.hostAnalytics = analytics;

  results.gates.consoleErrors = filterConsoleErrors(consoleErrors);

  const hardPass =
    results.gates.copilotkitPost === true &&
    chat.http === 200 &&
    chat.geoChatShell &&
    chat.chatCanvas &&
    chat.centerPanel &&
    chat.toolCards &&
    hostEvent.http === 200 &&
    hostEvent.wizard &&
    hostEvent.form &&
    analytics.http === 200 &&
    analytics.shell &&
    results.gates.consoleErrors.length === 0;

  results.verdict = hardPass ? "PASS" : "FAIL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  await page
    .screenshot({
      path: path.join(OUT_DIR, "SAN-891-localhost-error.png"),
      fullPage: true,
    })
    .catch(() => {});
} finally {
  await browser.close();
}

const jsonPath = path.join(OUT_DIR, "SAN-891-localhost-results.json");
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
process.exit(results.verdict === "PASS" ? 0 : 1);
