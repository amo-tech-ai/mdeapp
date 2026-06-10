#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes that add <AdvancedMarker> without a sibling/parent <Map> having a mapId prop.
// Per CLAUDE.md hard rule: "EVERY <AdvancedMarker> has a mapId on parent <Map>".
// Promoted from _deferred/ 2026-05-27 (MAP-DOC-001 / maps-audit-plan).
// Heuristic-only (regex). False positives possible for split files — bypass for those.
// Exit 2 = block. Bypass: MDEAI_ALLOW_MAP_NO_MAPID=1.

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

if (!/^mdeapp\/src\//.test(rel)) process.exit(0);
if (!/\.(tsx|jsx)$/.test(rel)) process.exit(0);
if (/\.claude\/hooks\//.test(rel) || /\.test\.tsx?$/.test(rel) || /__mocks__\//.test(rel)) process.exit(0);

const candidates = [];
if (typeof input.content === "string") candidates.push(input.content);
if (typeof input.new_string === "string") candidates.push(input.new_string);
if (Array.isArray(input.edits)) {
  for (const e of input.edits) {
    if (typeof e?.new_string === "string") candidates.push(e.new_string);
  }
}

const HAS_AM = /<AdvancedMarker[\s>]/;
const HAS_MAP_WITH_ID = /<Map\b[^>]*\bmapId=/;
const HAS_MAP_BARE = /<Map\b[^>]*>/;

for (const text of candidates) {
  if (!HAS_AM.test(text)) continue;
  if (HAS_MAP_BARE.test(text) && !HAS_MAP_WITH_ID.test(text)) {
    process.stderr.write(
      `BLOCKED: <AdvancedMarker> requires mapId on parent <Map> in ${rel}.\n` +
        `AdvancedMarker silently fails to render without a vector map id.\n` +
        `Fix: <Map mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID} …>\n` +
        `To bypass (e.g. parent is in another file): MDEAI_ALLOW_MAP_NO_MAPID=1\n`,
    );
    if (process.env.MDEAI_ALLOW_MAP_NO_MAPID === "1") process.exit(0);
    process.exit(2);
  }
}

process.exit(0);
