#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// Blocks writes to mdeapp/package.json that change @copilotkit/* away from 1.55.2,
// or writes to source files that introduce v2 CopilotKit imports.
// Per CLAUDE.md: "CopilotKit pinned at 1.55.2 for Phase 1. Do not mix v1 and v2 imports."
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
      // v2 packages (@copilotkit/react, @copilotkit/core, @copilotkit/agent, @copilotkit/sdk-js) are NEVER allowed in Phase 1.
      if (["react", "core", "agent", "sdk-js"].includes(pkg)) {
        process.stderr.write(
          `BLOCKED: @copilotkit/${pkg} is a v2 package. Phase 1 uses v1 only (react-core, react-ui, runtime).\n` +
            `Per CLAUDE.md: do not mix v1 and v2 imports.\n` +
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

// src/ checks — block v2 imports
if (isSrc) {
  const v2Imports = [
    { name: "@copilotkit/react (v2)", re: /from\s+["']@copilotkit\/react["']/ },
    { name: "@copilotkit/core (v2)", re: /from\s+["']@copilotkit\/core["']/ },
    { name: "@copilotkit/agent (v2)", re: /from\s+["']@copilotkit\/agent["']/ },
    { name: "@copilotkit/sdk-js (v2)", re: /from\s+["']@copilotkit\/sdk-js["']/ },
    { name: "useFrontendTool (v2 API)", re: /\buseFrontendTool\b/ },
    { name: "BuiltInAgent (v2 API)", re: /\bBuiltInAgent\b/ },
    { name: "CopilotKitProvider (v2 component)", re: /\bCopilotKitProvider\b/ },
    { name: "createCopilotEndpoint (v2 server)", re: /\bcreateCopilotEndpoint\b/ },
  ];
  for (const text of candidates) {
    for (const { name, re } of v2Imports) {
      const m = text.match(re);
      if (m) {
        process.stderr.write(
          `BLOCKED: CopilotKit v2 reference (${name}) in ${rel}.\n` +
            `Match: ${m[0]}\n` +
            `Phase 1 uses v1 (1.55.2). v1 hook is useCopilotAction. v1 component is <CopilotKit>.\n` +
            `See plan/prd/03-architecture.md §12 callout.\n` +
            `To bypass once: MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE=1\n`,
        );
        if (process.env.MDEAI_ALLOW_COPILOTKIT_VERSION_CHANGE === "1") process.exit(0);
        process.exit(2);
      }
    }
  }
}

process.exit(0);
