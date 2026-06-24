#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes whose content contains recognisable secret patterns.
// Exit 2 = block; print reason to stderr (value redacted to 12 chars).
// Bypass for one turn: MDEAI_ALLOW_SECRET_LITERAL=1

import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const input = payload?.tool_input || {};
const candidates = [];
if (typeof input.content === "string") candidates.push(input.content);
if (typeof input.new_string === "string") candidates.push(input.new_string);
if (Array.isArray(input.edits)) {
  for (const e of input.edits) {
    if (typeof e?.new_string === "string") candidates.push(e.new_string);
  }
}
if (candidates.length === 0) process.exit(0);

const filePath = input.file_path || input.path || "";
const rel = filePath.replace(/^.*?\/mdeai\/(\.claude\/worktrees\/[^/]+\/)?/, "");

// Allow this hook itself and example/lock files to mention patterns.
const allowPath =
  \/\.claude\/hooks\/scan-secrets\\.mjs$\/.test(rel) ||
  /\.env\.example$/.test(rel) ||
  /(^|\/)package-lock\.json$/.test(rel) ||
  /(^|\/)pnpm-lock\.yaml$/.test(rel) ||
  /(^|\/)yarn\.lock$/.test(rel);
if (allowPath) process.exit(0);

const patterns = [
  { name: "Stripe live secret", re: /\bsk_live_[A-Za-z0-9]{20,}\b/ },
  { name: "Stripe webhook secret", re: /\bwhsec_[A-Za-z0-9]{20,}\b/ },
  { name: "OpenAI key", re: /\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/ },
  { name: "Anthropic key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/ },
  { name: "Google API key (literal)", re: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { name: "GitHub PAT", re: /\bghp_[A-Za-z0-9]{30,40}\b/ },
  { name: "GitHub fine-grained PAT", re: /\bgithub_pat_[A-Za-z0-9_]{60,}\b/ },
  { name: "Bearer token (long)", re: /\bBearer\s+[A-Za-z0-9_\-.=]{40,}/ },
  { name: "Paperclip API key", re: /\bpcp_[A-Za-z0-9_-]{20,}\b/ },
  // Known leaks from legacy audit — never re-introduce.
  { name: "Known leaked: OpenClaw gateway token", re: /h7MjQwcIxQzlehyAp1PgOTE6J5qOHiDc/ },
  { name: "Known leaked: admin password", re: /Toronto2026#/ },
];

for (const text of candidates) {
  for (const { name, re } of patterns) {
    const m = text.match(re);
    if (m) {
      process.stderr.write(
        `BLOCKED: secret pattern detected (${name}) in write to ${rel || "<unknown>"}.\n` +
          `Match: ${m[0].slice(0, 12)}…\n` +
          `Use an Infisical reference or env var name (e.g. \${SUPABASE_ANON_KEY}) instead.\n` +
          `If this is a deliberate test fixture, set MDEAI_ALLOW_SECRET_LITERAL=1 for this turn.\n`,
      );
      if (process.env.MDEAI_ALLOW_SECRET_LITERAL === "1") process.exit(0);
      process.exit(2);
    }
  }
}

process.exit(0);
