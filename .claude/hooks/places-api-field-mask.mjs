#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit. **DEFERRED — promote in W5 when Maps code lands.**
// Blocks Places API New (places.googleapis.com/v1) writes that lack an X-Goog-FieldMask header.
// Per CLAUDE.md hard rule: "EVERY Places API New call includes X-Goog-FieldMask".
// Exit 2 = block. Bypass: MDEAI_ALLOW_PLACES_NO_FIELDMASK=1.

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

if (!/^mdeapp\/(src|supabase\/functions)\//.test(rel)) process.exit(0);
if (/\.claude\/hooks\//.test(rel) || /\.test\.tsx?$/.test(rel) || /__mocks__\//.test(rel)) process.exit(0);

const candidates = [];
if (typeof input.content === "string") candidates.push(input.content);
if (typeof input.new_string === "string") candidates.push(input.new_string);
if (Array.isArray(input.edits)) {
  for (const e of input.edits) {
    if (typeof e?.new_string === "string") candidates.push(e.new_string);
  }
}

const PLACES_NEW_URL = /places\.googleapis\.com\/v1/;
const FIELD_MASK_HEADER = /X-Goog-FieldMask/i;

for (const text of candidates) {
  if (!PLACES_NEW_URL.test(text)) continue;
  if (FIELD_MASK_HEADER.test(text)) continue;
  process.stderr.write(
    `BLOCKED: Places API (New) call without X-Goog-FieldMask in ${rel}.\n` +
      `Cost lever — unmasked Places call is up to 30× more expensive.\n` +
      `Add: headers: { "X-Goog-FieldMask": "places.id,places.displayName,places.location" }\n` +
      `To bypass once: MDEAI_ALLOW_PLACES_NO_FIELDMASK=1\n`,
  );
  if (process.env.MDEAI_ALLOW_PLACES_NO_FIELDMASK === "1") process.exit(0);
  process.exit(2);
}

process.exit(0);
