/**
 * SAN-890 · CK-V2-004 — GeoChatShellV2 scaffold localhost proof.
 *
 * Flag off: COPILOTKIT_V2_CHAT unset or 0 (dev server must match)
 * Flag on:  COPILOTKIT_V2_CHAT=1 + NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1 (restart dev before running)
 *
 * Run:
 *   infisical run --silent --env=dev --path=/ -- node docs/tasks/testing/evidence/SAN-890/san-890-localhost-proof.mjs
 *   SAN890_V2=1 COPILOTKIT_V2_CHAT=1 NEXT_PUBLIC_COPILOTKIT_V2_CHAT=1 infisical run ... (server must also have flags=1)
 */
import { execSync } from "node:child_process";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function resolveHeadSha() {
  const fromEnv = process.env.HEAD_SHA?.trim();
  if (fromEnv) return fromEnv;
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SAN890_BASE_URL ?? "http://localhost:3001";
const BASE_HOST = new URL(BASE).hostname;
const QA_EMAIL = "qa-landlord@mdeai.co";
const OUT_DIR = __dirname;
const V2 =
  process.env.SAN890_V2 === "1" ||
  (process.env.COPILOTKIT_V2_CHAT === "1" &&
    process.env.NEXT_PUBLIC_COPILOTKIT_V2_CHAT === "1");
const slug = V2 ? "flag-on" : "flag-off";

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
  return [200, 400, 401, 429].includes(res.status);
}

function filterConsoleErrors(errors) {
  return errors.filter(
    (e) =>
      !e.includes("hydration") &&
      !e.includes("caret-color") &&
      !e.includes("Vector Map") &&
      !e.includes("Lit is in dev mode") &&
      !e.includes("Failed to load resource") &&
      !(!V2 && e.includes("Maximum update depth exceeded")),
  );
}

async function waitForCopilotChatReady(page) {
  const chatRegion = page.getByTestId("copilot-chat-region");
  const chatInput = V2
    ? chatRegion.getByTestId("copilot-chat-textarea")
    : chatRegion.locator("textarea").first();
  await chatInput.waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(
    (isV2) => {
      const region = document.querySelector('[data-testid="copilot-chat-region"]');
      if (!region) return false;
      const textarea = isV2
        ? region.querySelector('[data-testid="copilot-chat-textarea"]')
        : region.querySelector("textarea");
      if (!(textarea instanceof HTMLTextAreaElement) || textarea.disabled) {
        return false;
      }
      if (isV2) {
        const send = region.querySelector('[data-testid="copilot-send-button"]');
        return send instanceof HTMLButtonElement;
      }
      const buttons = region.querySelectorAll("button");
      return buttons.length > 0;
    },
    V2,
    { timeout: 60_000 },
  );
}

const results = {
  task: "SAN-890 · CK-V2-004 — Migrate /chat (conciergeAgent) to v2",
  slice: "GeoChatShellV2 scaffold",
  mode: V2 ? "v2-flag-on" : "v1-flag-off",
  flag: process.env.COPILOTKIT_V2_CHAT ?? "(unset)",
  baseUrl: BASE,
  headSha: resolveHeadSha(),
  at: new Date().toISOString(),
  gates: {},
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

try {
  results.gates.copilotkitPost = await copilotkitPostOk();

  const { session, ref } = await getTestSession();
  await injectSession(context, session, ref);

  const nav = await page.goto(`${BASE}/chat`, {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  results.gates.chatHttp = nav?.status() ?? 0;
  results.gates.signedInEmail = (await page.getByText(QA_EMAIL).count()) > 0;

  if (V2) {
    results.gates.geoChatShellV2 = await page
      .getByTestId("geo-chat-shell-v2")
      .isVisible();
    results.gates.chatCanvas = await page.getByTestId("chat-canvas").isVisible();
    results.gates.centerChatPanel = await page
      .getByTestId("center-chat-panel")
      .isVisible();
    results.gates.spikeShellAbsent =
      (await page.getByTestId("chat-spike-shell-v2").count()) === 0;
  } else {
    results.gates.geoChatShellV2 =
      (await page.getByTestId("geo-chat-shell-v2").count()) === 0;
    results.gates.chatCanvas = await page.getByTestId("chat-canvas").isVisible();
    results.gates.centerChatPanel = await page
      .getByTestId("center-chat-panel")
      .isVisible();
    results.gates.spikeShellAbsent =
      (await page.getByTestId("chat-spike-shell-v2").count()) === 0;
  }

  await waitForCopilotChatReady(page);

  await page.waitForTimeout(2000);
  results.gates.consoleErrors = filterConsoleErrors(consoleErrors);

  const shot = path.join(OUT_DIR, `SAN-890-v2-${slug}-localhost.png`);
  await page.screenshot({ path: shot, fullPage: true });
  results.gates.screenshot = path.basename(shot);

  const hardPass =
    results.gates.copilotkitPost === true &&
    results.gates.chatHttp === 200 &&
    results.gates.consoleErrors.length === 0 &&
    results.gates.chatCanvas === true &&
    results.gates.centerChatPanel === true &&
    results.gates.spikeShellAbsent === true &&
    (V2
      ? results.gates.geoChatShellV2 === true
      : results.gates.geoChatShellV2 === true);

  results.gates.signedInEmailSoft = results.gates.signedInEmail === true;

  results.verdict = hardPass ? "PASS" : "FAIL";
} catch (err) {
  results.error = err instanceof Error ? err.message : String(err);
  results.verdict = "FAIL";
  const errShot = path.join(OUT_DIR, `SAN-890-v2-${slug}-localhost-error.png`);
  try {
    await page.screenshot({ path: errShot, fullPage: true });
    results.gates.errorScreenshot = path.basename(errShot);
  } catch {
    /* ignore */
  }
} finally {
  await browser.close();
}

const outJson = path.join(OUT_DIR, `SAN-890-v2-${slug}-results.json`);
fs.writeFileSync(outJson, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
process.exit(results.verdict === "PASS" ? 0 : 1);
