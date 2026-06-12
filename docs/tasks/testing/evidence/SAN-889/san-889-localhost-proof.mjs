/**
 * SAN-889 · CK-V2-003 — localhost runtime proof (flag on + off).
 *
 * Flag off: COPILOTKIT_V2_HOST_EVENT unset or 0 (dev server must match)
 * Flag on:  COPILOTKIT_V2_HOST_EVENT=1 (restart dev before running)
 *
 * Run:
 *   infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-889/san-889-localhost-proof.mjs
 *   SAN889_V2=1 COPILOTKIT_V2_HOST_EVENT=1 infisical run ... (server must also have flag=1)
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN889_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const V2 =
  process.env.SAN889_V2 === "1" || process.env.COPILOTKIT_V2_HOST_EVENT === "1";
const slug = V2 ? "flag-on" : "flag-off";

const ROBERTO_PROMPT =
  "Startup mixer March 15 in Provenza, 200 cap, GA free + VIP 50000 COP";

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

async function copilotkitPostOk() {
  const res = await fetch(`${BASE}/api/copilotkit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return res.status;
}

const results = {
  task: "SAN-889 · CK-V2-003 — Host event v2 migration",
  mode: V2 ? "v2-flag-on" : "v1-flag-off",
  flag: process.env.COPILOTKIT_V2_HOST_EVENT ?? "(unset)",
  baseUrl: BASE,
  mainSha: "aaff138",
  at: new Date().toISOString(),
  gates: {},
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  results.gates.copilotkitPost = await copilotkitPostOk();

  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  const nav = await page.goto(`${BASE}/host/event/new`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  results.gates.wizardHttp = nav?.status() ?? 0;
  results.gates.signedInEmail = (await page.getByText(QA_EMAIL).count()) > 0;
  results.gates.hostEventWizard = await page.getByTestId("host-event-wizard").isVisible();
  results.gates.hostEventForm = await page.getByTestId("host-event-form").isVisible();

  const chatRegion = page.getByTestId("host-copilot-chat-region");
  await chatRegion.waitFor({ timeout: 30_000 });

  const chatInput = V2
    ? chatRegion.getByTestId("copilot-chat-textarea")
    : chatRegion.locator("textarea").first();
  await chatInput.waitFor({ timeout: 30_000 });
  await chatInput.fill(ROBERTO_PROMPT);

  if (V2) {
    await chatRegion.getByTestId("copilot-send-button").click();
  } else {
    await chatRegion.locator("button").last().click();
  }

  // Manual form parity — works in both modes without waiting for agent
  const titleField = page.getByTestId("host-event-field-title");
  await titleField.fill("QA Mixer v2 proof");
  results.gates.manualTitleEdit =
    (await titleField.inputValue()) === "QA Mixer v2 proof";

  // Agent form-fill — allow up to 2 min for hostEventAgent tool round-trip
  try {
    const neighborhoodField = page.getByTestId("host-event-field-neighborhood");
    await neighborhoodField.waitFor({ timeout: 120_000 });
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="host-event-field-neighborhood"]');
        return el instanceof HTMLInputElement && el.value.trim() !== "";
      },
      { timeout: 120_000 },
    );
    results.gates.agentFilledNeighborhood = true;
  } catch {
    results.gates.agentFilledNeighborhood = false;
  }

  // HITL panel may appear when draft complete — soft gate (agent-dependent)
  const approvalCount = await page.getByTestId("host-event-approval-panel").count();
  results.gates.approvalPanelVisible = approvalCount > 0;

  await page.waitForTimeout(2000);
  results.gates.consoleErrors = consoleErrors.filter(
    (e) => !e.includes("Vector Map") && !e.includes("Lit is in dev mode"),
  );

  const shot = path.join(OUT_DIR, `SAN-889-v2-${slug}-localhost.png`);
  await page.screenshot({ path: shot, fullPage: true });
  results.gates.screenshot = path.basename(shot);

  const hardPass =
    results.gates.copilotkitPost === true &&
    results.gates.wizardHttp === 200 &&
    results.gates.hostEventWizard &&
    results.gates.hostEventForm &&
    results.gates.manualTitleEdit &&
    results.gates.consoleErrors.length === 0;

  results.verdict = hardPass
    ? results.gates.agentFilledNeighborhood || results.gates.approvalPanelVisible
      ? "PASS"
      : "PARTIAL"
    : "FAIL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  const errShot = path.join(OUT_DIR, `SAN-889-v2-${slug}-localhost-error.png`);
  await page.screenshot({ path: errShot, fullPage: true }).catch(() => {});
  results.gates.screenshot = path.basename(errShot);
} finally {
  const jsonPath = path.join(OUT_DIR, `SAN-889-v2-${slug}-results.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
process.exit(results.verdict === "FAIL" ? 1 : 0);
