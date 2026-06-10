#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes to mdeapp/src/** that reference Supabase service-role credentials.
// Service-role keys are admin-only and must never reach the browser bundle.
// Per CLAUDE.md hard rule: "NEVER put service-role keys in mdeapp/src/**".
// Exit 2 = block; print reason to stderr. Bypass: MDEAI_ALLOW_SERVICE_ROLE_IN_SRC=1.

import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const input = payload?.tool_input || {};
const filePath = String(input.file_path || input.path || "");
const rel = filePath.replace(/^.*?\/mdeai\/(\.claude\/worktrees\/[^/]+\/)?/, "");

// Police writes under mdeapp/src/** only. Edge functions, scripts, tests can use service role.
if (!/^mdeapp\/src\//.test(rel)) process.exit(0);

// F13 carve-out: server-only Mastra lib (ai_runs writer). Never bundled to browser.
if (/^mdeapp\/src\/mastra\/lib\//.test(rel)) process.exit(0);
// F13 carve-out: centralized service-role client (imported only from server routes / mastra lib).
if (/^mdeapp\/src\/lib\/supabase\/service(-env)?\.ts$/.test(rel)) process.exit(0);

// Allowlist test fixtures, mocks, this hook itself.
if (
  /\.test\.tsx?$/.test(rel) ||
  /\.spec\.tsx?$/.test(rel) ||
  /__mocks__\//.test(rel) ||
  /__tests__\//.test(rel) ||
  /\.claude\/hooks\//.test(rel)
) {
  process.exit(0);
}

const candidates = [];
if (typeof input.content === "string") candidates.push(input.content);
if (typeof input.new_string === "string") candidates.push(input.new_string);
if (Array.isArray(input.edits)) {
  for (const e of input.edits) {
    if (typeof e?.new_string === "string") candidates.push(e.new_string);
  }
}
if (candidates.length === 0) process.exit(0);

const patterns = [
  { name: "SUPABASE_SERVICE_ROLE_KEY env reference", re: /SUPABASE_SERVICE_ROLE_KEY/ },
  { name: "service_role literal", re: /\bservice_role\b/i },
  { name: "supabaseAdmin import (admin client)", re: /\bsupabaseAdmin\b/ },
  { name: "createClient with service-role token", re: /createClient\s*\([^)]*SERVICE_ROLE/i },
];

for (const text of candidates) {
  for (const { name, re } of patterns) {
    const m = text.match(re);
    if (m) {
      process.stderr.write(
        `BLOCKED: service-role reference (${name}) detected in client-side write to ${rel}.\n` +
          `Match: ${m[0].slice(0, 60)}\n` +
          `Service-role credentials must stay in mdeapp/supabase/functions/** or scripts/**.\n` +
          `Use the anon client (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) and a Supabase Edge Function for privileged work.\n` +
          `If intentional (rare), set MDEAI_ALLOW_SERVICE_ROLE_IN_SRC=1 for this turn.\n`,
      );
      if (process.env.MDEAI_ALLOW_SERVICE_ROLE_IN_SRC === "1") process.exit(0);
      process.exit(2);
    }
  }
}

process.exit(0);
