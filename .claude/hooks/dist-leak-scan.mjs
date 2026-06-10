#!/usr/bin/env node
// PreToolUse hook for Bash.
// Blocks deploy-shaped commands (git push, vercel deploy, etc.) if bundle
// directories contain recognisable production secrets.
// Exit 2 = block; print reason to stderr — never the secret value.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const cmd = (payload?.tool_input?.command || "").trim();
if (!cmd) process.exit(0);

// Trigger only on deploy-shaped commands.
const DEPLOY_RE =
  /(\bgit\s+push\b|\bvercel\s+(deploy|--prod)\b|\bnpm\s+(run\s+)?deploy\b|\bnpx\s+vercel\b|\bsupabase\s+functions\s+deploy\b)/;
if (!DEPLOY_RE.test(cmd)) process.exit(0);

// Bundle locations to scan, relative to mdeapp/.
const MDEAPP = "/home/sk/mdeai/mdeapp";
const ROOTS = [
  resolve(MDEAPP, ".next"),
  resolve(MDEAPP, ".vercel/output"),
  resolve(MDEAPP, "dist"),
  resolve(MDEAPP, "build"),
];

// Secret class regexes (shapes — not values).
const PATTERNS = [
  { name: "google-api-key", re: /AIzaSy[A-Za-z0-9_-]{30,40}/ },
  { name: "stripe-live-secret", re: /sk_live_[A-Za-z0-9]{20,}/ },
  { name: "stripe-test-secret", re: /sk_test_[A-Za-z0-9]{20,}/ },
  { name: "stripe-webhook-secret", re: /whsec_[A-Za-z0-9]{20,}/ },
  { name: "github-pat", re: /ghp_[A-Za-z0-9]{30,40}/ },
  { name: "supabase-service-role", re: /SUPABASE_SERVICE_ROLE[A-Z_]*\s*[:=]\s*[A-Za-z0-9._-]+/ },
  { name: "anthropic-key-literal", re: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: "anthropic-key-name", re: /ANTHROPIC_API_KEY\s*[:=]\s*["'`][^"'`]{8,}["'`]/ },
  { name: "gemini-key-name", re: /GOOGLE_GENERATIVE_AI_API_KEY\s*[:=]\s*["'`][^"'`]{8,}["'`]/ },
];

// Narrow allowlist: browser-safe Google Maps JS key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
// is intentionally shipped in client bundle; gated by HTTP referrer in Cloud Console.
const GOOGLE_KEY_SHAPE = /^AIzaSy[A-Za-z0-9_-]{30,40}$/;
const GOOGLE_KEY_GLOBAL = /AIzaSy[A-Za-z0-9_-]{30,40}/g;
function loadMapsKeyAllowlist() {
  const allowed = new Set();
  // Env files + plaintext backups. Live values migrated to Infisical 2026-06-04,
  // leaving .env.local empty — the *.env.local.bak backups keep this allowlist
  // sourced so the browser-safe Maps key stops false-blocking every push.
  for (const f of [
    resolve(MDEAPP, ".env.local"),
    resolve(MDEAPP, ".env.production"),
    resolve(MDEAPP, ".env"),
    resolve(MDEAPP, ".env.local.bak"),
    resolve(MDEAPP, ".env.production.bak"),
    "/home/sk/mdeai/.env.local",
    "/home/sk/mdeai/.env.local.bak",
  ]) {
    if (!existsSync(f)) continue;
    let txt;
    try { txt = readFileSync(f, "utf8"); } catch { continue; }
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(
        /^\s*(NEXT_PUBLIC_GOOGLE_MAPS_API_KEY|VITE_GOOGLE_MAPS_API_KEY)\s*=\s*['"]?([^'"\s#]+)/,
      );
      if (m && GOOGLE_KEY_SHAPE.test(m[2])) allowed.add(m[2]);
    }
  }
  // Also honor an Infisical-injected env (hook may run under `infisical run`).
  for (const v of [
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    process.env.VITE_GOOGLE_MAPS_API_KEY,
  ]) {
    if (v && GOOGLE_KEY_SHAPE.test(v)) allowed.add(v);
  }
  return allowed;
}
const MAPS_KEY_ALLOWLIST = loadMapsKeyAllowlist();

const MAX_FILES = 800;
const MAX_BYTES_PER_FILE = 4 * 1024 * 1024;
function* walk(dir, depth = 0) {
  if (depth > 8) return;
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      // Build caches (turbopack/webpack) are never deployed and store binary
      // intermediate data that over-captures key shapes — skip the whole subtree.
      if (e.name === "cache") continue;
      yield* walk(p, depth + 1);
      continue;
    }
    if (!e.isFile()) continue;
    if (/\.(png|jpe?g|gif|webp|woff2?|ttf|eot|mp4|mp3|zip|gz|br|ico|svg|sst|pack|bin)$/i.test(e.name)) continue;
    yield p;
  }
}

const hits = [];
let scanned = 0;
outer: for (const root of ROOTS) {
  if (!existsSync(root)) continue;
  try { if (!statSync(root).isDirectory()) continue; } catch { continue; }
  for (const f of walk(root)) {
    if (scanned++ > MAX_FILES) break outer;
    let buf;
    try {
      const st = statSync(f);
      if (st.size > MAX_BYTES_PER_FILE) continue;
      buf = readFileSync(f, "utf8");
    } catch { continue; }
    for (const p of PATTERNS) {
      if (!p.re.test(buf)) continue;
      if (p.name === "google-api-key" && MAPS_KEY_ALLOWLIST.size > 0) {
        const all = buf.match(GOOGLE_KEY_GLOBAL) || [];
        const unallowed = all.filter((v) => !MAPS_KEY_ALLOWLIST.has(v));
        if (unallowed.length === 0) break;
      }
      hits.push({ file: f, klass: p.name });
      break;
    }
    if (hits.length >= 10) break outer;
  }
}

if (hits.length === 0) process.exit(0);

console.error(
  `\n🛑 dist-leak-scan blocked deploy command — ${hits.length} secret pattern hit(s) in built artifacts:`,
);
for (const h of hits) console.error(`   ${h.file}  →  class=${h.klass}`);
console.error(
  `\n   Value never printed. Inspect locally with grep against the pattern.\n` +
    `   Fix: rotate the leaked secret AND ensure it's never bundled into the frontend artifact.\n`,
);
process.exit(2);
