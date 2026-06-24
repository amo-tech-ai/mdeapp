#!/usr/bin/env node
// Stop hook — enforces the CLAUDE.md "Response style" contract on the final
// assistant message of every turn.
//
// BLOCKS (exit 2) when a Linear task ID (SAN-NNN) is mentioned but never paired
// with its name (`SAN-NNN · SPEC — name`) anywhere in the message.
// WARNS (stderr, exit 0) on arrow chains (A → B → C) outside code blocks —
// the rule says summaries must use plain sentences instead.
//
// Code fences, inline code, and URLs are stripped before checking, so branch
// names, commit subjects, and grep output never trigger it.

import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

// Loop guard: if we already blocked once this turn, let the corrected message pass.
if (payload?.stop_hook_active) process.exit(0);

// Read last assistant message from the transcript.
let text = "";
if (payload.transcript_path) {
  try {
    const lines = readFileSync(payload.transcript_path, "utf8").split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      let row;
      try { row = JSON.parse(lines[i]); } catch { continue; }
      const m = row?.message;
      if (!m || m.role !== "assistant") continue;
      const blocks = Array.isArray(m.content) ? m.content : [];
      text = blocks
        .filter((b) => b && b.type === "text" && typeof b.text === "string")
        .map((b) => b.text)
      
    }
  } catch {
    process.exit(0);
  }
}
        .join("\n");
      if (text) break;
    }
  } catch {
    /* ignore */
  }
}
if (!text) process.exit(0);

// Strip fenced code blocks, inline code, and URLs — IDs there are quotes, not prose.
const prose = text
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/`[^`\n]*`/g, " ")
  .replace(/https?:\/\/\S+/g, " ");

// --- Rule 1 (blocking): every SAN-NNN must be named at least once. ---
const mentions = [...prose.matchAll(/\bSAN-(\d+)\b/g)];
if (mentions.length > 0) {
  const named = new Set(
    [...prose.matchAll(/\bSAN-(\d+)\s*·/g)].map((m) => m[1]),
  );
  const bare = [...new Set(mentions.map((m) => m[1]))].filter((id) => !named.has(id));
  if (bare.length > 0) {
    console.error(
      `🔴 stop-plain-language-gate: bare task ID(s) in the reply — ` +
        bare.map((id) => `SAN-${id}`).join(", ") +
        `.\n   CLAUDE.md "Response style": every task number must carry its name at least once: ` +
        `\`SAN-NNN · SPEC-ID — full task name\` (e.g. \`SAN-178 · PAY-001 — Live ticket purchase on prod\`).\n` +
        `   Look the name up (Linear MCP or docs/linear/) and restate the reply with IDs named.`,
    );
    process.exit(2); // block the stop; Claude must fix the message
  }
}

// --- Rule 2 (warn-only): arrow chains in prose. ---
const arrowLines = prose
  .split("\n")
  .filter((l) => (l.match(/→/g) || []).length >= 2);
if (arrowLines.length > 0) {
  console.error(
    `🟡 stop-plain-language-gate: ${arrowLines.length} arrow-chain line(s) (A → B → C) in prose. ` +
      `CLAUDE.md "Response style": summaries use plain sentences, not arrow chains. ` +
      `Fine in technical detail sections; rewrite if it's in the summary layer.`,
  );
}

process.exit(0);
