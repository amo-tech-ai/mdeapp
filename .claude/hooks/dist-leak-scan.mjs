#!/usr/bin/env node
// PreToolUse hook for Bash.
// Blocks deploy-shaped commands (git push, vercel deploy, etc.) if bundle
// directories contain recognisable production secrets.
// Exit 2 = block; print reason to stderr — never the secret value.
//
// SAN-883 · DEV-SEC — Dist Leak Scanner Public Maps Key Allowlist.
// All Google API keys share the `AIzaSy…` shape, so a browser-PUBLISHABLE Maps key
// is indistinguishable from a private Gemini key by shape alone — only by VALUE.
// We allow a Google-key hit ONLY when its value matches a known publishable Maps
// key (exact value from env/backup, OR a committed SHA-256 in maps-key-allowlist.json).
// Every other Google key (Gemini, arbitrary GOOGLE_*), service-role, Stripe, etc.
// still blocks. The committed hash list makes this deterministic in CI / fresh
// clones / when Infisical env is absent at hook runtime — the gap PR #199 papered
// over by skipping `.next/dev` entirely.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");
const HOOK_DIR = dirname(fileURLToPath(import.meta.url));

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
// DIST_LEAK_SCAN_ROOTS (colon-separated absolute dirs) overrides for tests.
const MDEAPP = "/home/sk/mdeai/mdeapp";
const ROOTS = process.env.DIST_LEAK_SCAN_ROOTS
  ? process.env.DIST_LEAK_SCAN_ROOTS.split(":").filter(Boolean).map((r) => resolve(r))
  : [
      resolve(MDEAPP, ".next"),
      resolve(MDEAPP, ".vercel/output"),
      resolve(MDEAPP, "dist"),
      resolve(MDEAPP, "build"),
    ];

// Secret class regexes (shapes — not values).
const PATTERNS = [
  { name: "google-api-key", re: /AIzaSy[A-Za-z0-9_-]{30,40}/ },
  // Newer Google/Gemini API key format `AQ.A…` (the `AIzaSy` shape misses it).
  // Always private — never allowlisted. The literal `.` at index 2 keeps this
  // from matching base64/hex bundle blobs (which contain no dot).
  { name: "google-aq-key", re: /AQ\.A[A-Za-z0-9_-]{30,}/ },
  { name: "stripe-live-secret", re: /sk_live_[A-Za-z0-9]{20,}/ },
  { name: "stripe-test-secret", re: /sk_test_[A-Za-z0-9]{20,}/ },
  { name: "stripe-webhook-secret", re: /whsec_[A-Za-z0-9]{20,}/ },
  { name: "github-pat", re: /ghp_[A-Za-z0-9]{30,40}/ },
  { name: "supabase-service-role", re: /SUPABASE_SERVICE_ROLE[A-Z_]*\s*[:=]\s*[A-Za-z0-9._-]+/ },
  { name: "anthropic-key-literal", re: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { name: "anthropic-key-name", re: /ANTHROPIC_API_KEY\s*[:=]\s*["'`][^"'`]{8,}["'`]/ },
  { name: "gemini-key-name", re: /GOOGLE_GENERATIVE_AI_API_KEY\s*[:=]\s*["'`][^"'`]{8,}["'`]/ },
];

// Browser-safe Google Maps JS key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY / VITE_*) is
// intentionally shipped in the client bundle, gated by HTTP referrer in Cloud
// Console. We recognise it by exact VALUE only — never by shape.
const GOOGLE_KEY_SHAPE = /^AIzaSy[A-Za-z0-9_-]{30,40}$/;
const GOOGLE_KEY_GLOBAL = /AIzaSy[A-Za-z0-9_-]{30,40}/g;

/**
 * Publishable Maps key allowlist:
 *  - `values`: exact key strings recovered from env files / *.bak / Infisical env
 *    (works on a dev box; absent in CI / fresh clone post-Infisical-migration).
 *  - `hashes`: SHA-256 of publishable keys, committed in maps-key-allowlist.json.
 *    Deterministic everywhere; no raw key in the repo (so GitHub push-protection
 *    and human reviewers never see a key-shaped string).
 */
function loadMapsKeyAllowlist() {
  const values = new Set();
  const hashes = new Set();

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
      if (m && GOOGLE_KEY_SHAPE.test(m[2])) values.add(m[2]);
    }
  }

  // Honor an Infisical-injected env (hook may run under `infisical run`).
  for (const v of [
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    process.env.VITE_GOOGLE_MAPS_API_KEY,
  ]) {
    if (v && GOOGLE_KEY_SHAPE.test(v)) values.add(v);
  }

  // Committed SHA-256 allowlist — the deterministic source of truth.
  // DIST_LEAK_SCAN_ALLOWLIST_FILE overrides the path for tests.
  const allowFile =
    process.env.DIST_LEAK_SCAN_ALLOWLIST_FILE ||
    resolve(HOOK_DIR, "maps-key-allowlist.json");
  if (existsSync(allowFile)) {
    try {
      const json = JSON.parse(readFileSync(allowFile, "utf8"));
      for (const h of json.publishableMapsKeySha256 || []) {
        if (typeof h === "string" && /^[0-9a-f]{64}$/i.test(h)) hashes.add(h.toLowerCase());
      }
    } catch {
      // Malformed allowlist → ignore (fail closed: nothing extra allowed).
    }
  }

  return { values, hashes };
}
const MAPS_ALLOW = loadMapsKeyAllowlist();

/** A Google-key candidate is allowed only if it is a known publishable Maps key. */
function isAllowedPublishableMapsKey(candidate) {
  if (MAPS_ALLOW.values.has(candidate)) return true;
  if (MAPS_ALLOW.hashes.has(sha256(candidate))) return true;
  return false;
}

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
      // `.next/dev/` is the LOCAL dev build (`next dev`) — it never deploys (Vercel
      // builds prod fresh) and inlines dev env, so it is noise. Skip it; prod
      // artifacts (.next/static, .next/server) are still scanned.
      if (e.name === "dev" && basename(dir) === ".next") continue;
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
      if (p.name === "google-api-key") {
        const all = buf.match(GOOGLE_KEY_GLOBAL) || [];
        const unallowed = all.filter((v) => !isAllowedPublishableMapsKey(v));
        // All Google keys present are approved publishable Maps keys → not a leak.
        // `continue` (NOT break) so a real Stripe/other secret in the SAME file is
        // still caught — the allowed Maps key must never mask another class.
        if (unallowed.length === 0) continue;
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
    `   Fix: rotate the leaked secret AND ensure it's never bundled into the frontend artifact.\n` +
    `   Publishable Maps key false-positive? Add its SHA-256 to .claude/hooks/maps-key-allowlist.json.\n`,
);
process.exit(2);
