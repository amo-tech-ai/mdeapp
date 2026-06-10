#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes to mdeapp/src/** that reference deprecated/wrong AI models.
// Per CLAUDE.md hard rule: "Production AI is Gemini only. No @anthropic-ai/* SDK in mdeapp/."
// Current model: gemini-3.5-flash (released 2026-05-19). Deprecated: 2.0-flash*, 2.5-flash*, 3-flash-preview.
// Exit 2 = block. Bypass: MDEAI_ALLOW_MODEL_DRIFT=1.

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

// Only police mdeapp/src/** and mdeapp/supabase/functions/** edits. Skip plan/, docs/, tasks/.
if (!/^mdeapp\/(src|supabase\/functions)\//.test(rel)) process.exit(0);

// Allow this hook itself, CLAUDE.md, .env.example, docs/, plan/, tests.
if (
  /\.claude\/hooks\//.test(rel) ||
  /\.test\.tsx?$/.test(rel) ||
  /\.spec\.tsx?$/.test(rel) ||
  /__mocks__\//.test(rel)
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

// Deprecated / banned model IDs (per CLAUDE.md Gemini model registry).
const banned = [
  { name: "gemini-2.0-flash (shutdown 2026-06-01)", re: /["'`]gemini-2\.0-flash(?:-001|-exp)?["'`]/ },
  { name: "gemini-2.5-flash (supersededby 3.5)", re: /["'`]gemini-2\.5-flash["'`]/ },
  { name: "gemini-2.5-flash-lite", re: /["'`]gemini-2\.5-flash-lite["'`]/ },
  { name: "gemini-2.5-pro", re: /["'`]gemini-2\.5-pro["'`]/ },
  { name: "gemini-3-flash-preview (superseded by 3.5)", re: /["'`]gemini-3-flash-preview["'`]/ },
  { name: "OpenAI SDK in mdeapp/src (Gemini-only project)", re: /from\s+["']@ai-sdk\/openai["']/ },
  { name: "OpenAI gpt-* model literal in mdeapp/src", re: /openai\s*\(\s*["']gpt-[0-9]/ },
  { name: "Anthropic SDK in mdeapp/src (Gemini-only project)", re: /from\s+["']@anthropic-ai\/(?:sdk|client)["']/ },
];

for (const text of candidates) {
  for (const { name, re } of banned) {
    const m = text.match(re);
    if (m) {
      process.stderr.write(
        `BLOCKED: deprecated/forbidden model or SDK reference (${name}) in ${rel}.\n` +
          `Match: ${m[0].slice(0, 80)}\n` +
          `Replace with: google("gemini-3.5-flash") from @ai-sdk/google.\n` +
          `Env var: GOOGLE_GENERATIVE_AI_API_KEY (not GEMINI_API_KEY, not GOOGLE_API_KEY).\n` +
          `See CLAUDE.md Gemini model registry.\n` +
          `To bypass once: MDEAI_ALLOW_MODEL_DRIFT=1\n`,
      );
      if (process.env.MDEAI_ALLOW_MODEL_DRIFT === "1") process.exit(0);
      process.exit(2);
    }
  }
}

process.exit(0);
