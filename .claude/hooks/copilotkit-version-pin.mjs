#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes to mdeapp/package.json that change @copilotkit/* away from 1.55.2,
// or writes to source files that introduce the v2 FULL-REWRITE package line.
// mdeai uses the v2 API via the /v2 subpath of the pinned 1.55.2 packages
// (@copilotkit/react-core/v2) — that is allowed; the @copilotkit/react|core|agent|sdk-js line is not.
// Per CLAUDE.md (post CK-V2 cutover, SAN-886 · CK-V2-000): keep packages pinned at 1.55.2; subpath /v2 only.
// Exit 2 = block. Bypass: MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1.

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

const isPackageJson = /(^|\/)mdeapp\/package\.json$/.test(rel);
const isSrc = /^mdeapp\/(src|supabase\/functions)\//.test(rel) && /\.(ts|tsx|js|jsx|mjs)$/.test(rel);
if (!isPackageJson && !isSrc) process.exit(0);

// Allow this hook itself + tests.
if (/\.claude\/hooks\//.test(rel) || /\.test\.tsx?$/.test(rel) || /__mocks__\//.test(rel)) {
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

const PINNED = "1.55.2";

// package.json checks
if (isPackageJson) {
  for (const text of candidates) {
    // Find @copilotkit/* "<ver>" declarations and ensure they all match 1.55.2.
    const re = /"@copilotkit\/(react-core|react-ui|runtime|agent|core|react|sdk-js)"\s*:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      const [, pkg, ver] = m;
      // strip caret/tilde/range
      const clean = ver.replace(/^[\^~>=<]+/, "").trim();
      // The v2 FULL-REWRITE packages (@copilotkit/react|core|agent|sdk-js) are not used by mdeai (subpath /v2 only).
      if (["react", "core", "agent", "sdk-js"].includes(pkg)) {
        process.stderr.write(
          `BLOCKED: @copilotkit/${pkg} is a v2 FULL-REWRITE package.\n` +
            `mdeai uses the v2 API via the /v2 subpath of the pinned 1.55.2 packages (react-core, runtime) — not the @copilotkit/react|core|agent|sdk-js line.\n` +
            `Remove @copilotkit/${pkg} from dependencies.\n` +
            `To bypass once: MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1\n`,
        );
        if (process.env.MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE === "1") process.exit(0);
        process.exit(2);
      }
      if (clean !== PINNED) {
        process.stderr.write(
          `BLOCKED: @copilotkit/${pkg} version "${ver}" drifts from pinned "${PINNED}".\n` +
            `Per CLAUDE.md: Phase 1 pins all CopilotKit packages at ${PINNED}.\n` +
            `To bypass once: MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1\n`,
        );
        if (process.env.MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE === "1") process.exit(0);
        process.exit(2);
      }
    }
  }
}

// src/ checks — block the v2 FULL-REWRITE line only.
// mdeai is on the v2 /v2 subpath (useAgent, useFrontendTool, useAgentContext, <CopilotKit>,
// <CopilotChat> from @copilotkit/react-core/v2 — all ALLOWED). Block only the full-rewrite
// package line + its server/agent APIs, which mdeai does NOT use (would break the Mastra runtime).
if (isSrc) {
  const fullRewriteMarkers = [
    { name: "bare @copilotkit/react-core (no /v2)", re: /from\s+["']@copilotkit\/react-core["']/ },
    { name: "@copilotkit/react (full-rewrite pkg)", re: /from\s+["']@copilotkit\/react["']/ },
    { name: "@copilotkit/core (full-rewrite pkg)", re: /from\s+["']@copilotkit\/core["']/ },
    { name: "@copilotkit/agent (full-rewrite pkg)", re: /from\s+["']@copilotkit\/agent["']/ },
    { name: "@copilotkit/sdk-js (full-rewrite pkg)", re: /from\s+["']@copilotkit\/sdk-js["']/ },
    { name: "BuiltInAgent (full-rewrite agent API)", re: /\bBuiltInAgent\b/ },
    { name: "createCopilotEndpoint (full-rewrite server)", re: /\bcreateCopilotEndpoint\b/ },
  ];
  for (const text of candidates) {
    for (const { name, re } of fullRewriteMarkers) {
      const m = text.match(re);
      if (m) {
        process.stderr.write(
          `BLOCKED: CopilotKit v2 FULL-REWRITE reference (${name}) in ${rel}.\n` +
            `Match: ${m[0]}\n` +
            `mdeai uses the v2 API via the /v2 subpath (@copilotkit/react-core/v2): useAgent, useFrontendTool, useAgentContext, <CopilotKit>, <CopilotChat>.\n` +
            `Do NOT introduce the @copilotkit/react|core|agent|sdk-js package line (breaks the Mastra runtime).\n` +
            `To bypass once: MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1\n`,
        );
        if (process.env.MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE === "1") process.exit(0);
        process.exit(2);
      }
    }
  }
}

process.exit(0);
