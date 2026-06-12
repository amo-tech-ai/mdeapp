/**
 * SAN-889 · CK-V2-003 — v2 HITL publish proof (flag on only).
 *
 * Server must run with COPILOTKIT_V2_HOST_EVENT=1:
 *   COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- npm run dev
 *
 * Run:
 *   COPILOTKIT_V2_HOST_EVENT=1 infisical run --silent --env=dev --path=/ -- \
 *     node docs/tasks/testing/evidence/SAN-889/san-889-hitl-proof.mjs
 */
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN889_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const STAMP = Date.now();
const EVENT_TITLE = `QA HITL v2 ${STAMP}`;

function commitSha() {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
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

async function getTestSession() {
  loadEnvLocal();
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

function filterConsoleErrors(errors) {
  return errors.filter(
    (e) =>
      !e.includes("Vector Map") &&
      !e.includes("Lit is in dev mode") &&
      !e.includes("Failed to load resource"),
  );
}

async function fillCompleteDraft(page, title) {
  await page.getByTestId("host-event-field-title").fill(title);
  await page.getByTestId("host-event-field-neighborhood").fill("Provenza");
  await page
    .getByTestId("host-event-field-date")
    .fill("2026-07-15T19:00:00-05:00");
  await page.getByTestId("host-event-field-venue").fill("Hotel Movich");
  await page.getByTestId("host-event-field-capacity").fill("150");
  await page.getByTestId("host-event-field-price").fill("50000");
  await page
    .getByTestId("host-event-field-description")
    .fill("QA SAN-889 v2 HITL proof — networking mixer.");
}

async function sendPublishRequest(page) {
  const chatRegion = page.getByTestId("host-copilot-chat-region");
  const chatInput = chatRegion.getByTestId("copilot-chat-textarea");
  await chatInput.waitFor({ timeout: 30_000 });
  await chatInput.fill(
    "The event draft is complete. Call preview_and_publish now so I can review and publish.",
  );
  await chatRegion.getByTestId("copilot-send-button").click();
}

async function waitForApprovalPanel(page, timeoutMs = 180_000) {
  await page.getByTestId("host-event-approval-panel").waitFor({
    timeout: timeoutMs,
  });
}

const results = {
  task: "SAN-889 · CK-V2-003 — v2 HITL publish proof",
  mode: "v2-flag-on-hitl",
  flag: process.env.COPILOTKIT_V2_HOST_EVENT ?? "(unset)",
  baseUrl: BASE,
  commitSha: commitSha(),
  at: new Date().toISOString(),
  matrix: {},
  consoleErrors: [],
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  if (process.env.COPILOTKIT_V2_HOST_EVENT !== "1") {
    throw new Error(
      "COPILOTKIT_V2_HOST_EVENT must be 1 on server and script env",
    );
  }

  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  // --- Reject path ---
  await page.goto(`${BASE}/host/event/new`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  results.matrix.wizardLoads = await page.getByTestId("host-event-wizard").isVisible();
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-wizard-filled.png"),
    fullPage: true,
  });

  await fillCompleteDraft(page, `${EVENT_TITLE} reject`);
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-draft-complete.png"),
    fullPage: true,
  });

  await sendPublishRequest(page);
  await waitForApprovalPanel(page);
  results.matrix.hitlPanelVisible = true;
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-panel-visible.png"),
    fullPage: true,
  });

  await page.getByTestId("host-event-reject").click();
  await page.waitForTimeout(3000);
  results.matrix.rejectNoPublishedLink =
    (await page.getByText(/^Published:/).count()) === 0;
  results.matrix.rejectClicked = true;
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-reject.png"),
    fullPage: true,
  });

  // --- Approve path (fresh navigation) ---
  await page.goto(`${BASE}/host/event/new`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  const approveTitle = `${EVENT_TITLE} approve`;
  await fillCompleteDraft(page, approveTitle);
  await sendPublishRequest(page);
  await waitForApprovalPanel(page);
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-approve-panel.png"),
    fullPage: true,
  });

  await page.getByTestId("host-event-approve").click();
  await page.getByText(/^Published:/).waitFor({ timeout: 120_000 });
  const publishedText = await page.getByText(/^Published:/).innerText();
  results.matrix.approvePublishedLink = /Published:/.test(publishedText);
  results.matrix.approveNoPendingApprovalRace =
    !publishedText.toLowerCase().includes("pending");
  await page.screenshot({
    path: path.join(OUT_DIR, "SAN-889-hitl-approve.png"),
    fullPage: true,
  });

  results.consoleErrors = filterConsoleErrors(consoleErrors);
  results.matrix.zeroConsoleErrors = results.consoleErrors.length === 0;

  const allPass = Object.values(results.matrix).every(Boolean);
  results.verdict = allPass ? "PASS" : "PARTIAL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  results.consoleErrors = filterConsoleErrors(consoleErrors);
  await page
    .screenshot({
      path: path.join(OUT_DIR, "SAN-889-hitl-error.png"),
      fullPage: true,
    })
    .catch(() => {});
} finally {
  const jsonPath = path.join(OUT_DIR, "SAN-889-hitl-results.json");
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
process.exit(results.verdict === "PASS" ? 0 : 1);
