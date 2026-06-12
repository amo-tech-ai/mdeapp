/**
 * SAN-888 · CK-V2-002 — localhost runtime proof (flag on + off).
 *
 * Flag off: COPILOTKIT_V2_ANALYTICS unset or 0 (dev server must match)
 * Flag on:  COPILOTKIT_V2_ANALYTICS=1 (restart dev before running)
 *
 * Run:
 *   infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-888/san-888-localhost-proof.mjs
 *   SAN888_V2=1 COPILOTKIT_V2_ANALYTICS=1 infisical run ... (server must also have flag=1)
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN888_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const V2 = process.env.SAN888_V2 === "1" || process.env.COPILOTKIT_V2_ANALYTICS === "1";
const slug = V2 ? "flag-on" : "flag-off";

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
  task: "SAN-888 · CK-V2-002 — Host Analytics prototype",
  mode: V2 ? "v2-flag-on" : "v1-flag-off",
  flag: process.env.COPILOTKIT_V2_ANALYTICS ?? "(unset)",
  baseUrl: BASE,
  mainSha: "b9a4f70",
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

  const nav = await page.goto(`${BASE}/host/analytics`, {
    waitUntil: "networkidle",
    timeout: 120_000,
  });
  results.gates.analyticsHttp = nav?.status() ?? 0;
  results.gates.signedInEmail = (await page.getByText(QA_EMAIL).count()) > 0;
  results.gates.hostAnalyticsTestId = await page.getByTestId("host-analytics").isVisible();

  const chatRegion = page.getByTestId("host-ops-chat-region");
  const chatInput = V2
    ? chatRegion.getByTestId("copilot-chat-textarea")
    : chatRegion.locator("textarea").first();
  await chatInput.waitFor({ timeout: 30_000 });
  await chatInput.fill("How are my sales?");
  if (V2) {
    await chatRegion.getByTestId("copilot-send-button").click();
  } else {
    const sendBtn = chatRegion.locator("button").last();
    await sendBtn.click();
  }

  await page.getByText("Sales loaded ✓").waitFor({ timeout: 120_000 });
  results.gates.salesLoadedAck = true;

  await page.waitForTimeout(3000);
  const kpiText = await page.locator('[data-testid="host-analytics"]').innerText();
  results.gates.kpiPanelHasRevenue = /revenue|COP|ticket/i.test(kpiText);
  results.gates.consoleErrors = consoleErrors.filter(
    (e) => !e.includes("Vector Map") && !e.includes("Lit is in dev mode"),
  );

  const shot = path.join(OUT_DIR, `SAN-888-v2-${slug}-localhost.png`);
  await page.screenshot({ path: shot, fullPage: true });
  results.gates.screenshot = path.basename(shot);

  results.verdict =
    results.gates.analyticsHttp === 200 &&
    results.gates.hostAnalyticsTestId &&
    results.gates.salesLoadedAck &&
    results.gates.kpiPanelHasRevenue &&
    results.gates.consoleErrors.length === 0
      ? "PASS"
      : "PARTIAL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  const errShot = path.join(OUT_DIR, `SAN-888-v2-${slug}-localhost-error.png`);
  await page.screenshot({ path: errShot, fullPage: true }).catch(() => {});
  results.gates.screenshot = path.basename(errShot);
} finally {
  const jsonPath = path.join(OUT_DIR, `SAN-888-v2-${slug}-results.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  process.exit(results.verdict === "PASS" ? 0 : 1);
}
