#!/usr/bin/env node
// PreToolUse hook for Edit|Write|MultiEdit.
// - Blocks writes to .env / .env.local / .env.production (allows .env.example).
// - Blocks writes under supabase/migrations/** unless MDEAI_ALLOW_MIGRATION_EDIT=1.
// - Blocks any edit under /home/sk/mde/** (legacy is read-only).
// Reads the hook payload from stdin (JSON with tool_input.file_path).
// Exit 2 = block; print reason to stderr.

import { readFileSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const filePath = String(payload?.tool_input?.file_path || payload?.tool_input?.path || "");
if (!filePath) process.exit(0);

// 0. Legacy /home/sk/mde/ is read-only per CLAUDE.md
if (/^\/home\/sk\/mde\/(?!.*\/mdeai\/)/.test(filePath)) {
  process.stderr.write(
    `BLOCKED: edits to /home/sk/mde/ (legacy) are forbidden.\n` +
      `That tree is frozen reference per CLAUDE.md.\n` +
      `Path: ${filePath}\n`,
  );
  process.exit(2);
}

// Normalise to a workspace-relative path for mdeai/.
const rel = filePath.replace(/^.*?\/mdeai\/(\.claude\/worktrees\/[^/]+\/)?/, "");

// 1. .env protection (allow .env.example)
const isEnvFile = /(^|\/)\.env(\.[^./]+)?$/.test(rel);
const isEnvExample = /(^|\/)\.env\.example$/.test(rel);
if (isEnvFile && !isEnvExample) {
  if (process.env.MDEAI_ALLOW_ENV_EDIT === "1") process.exit(0);
  process.stderr.write(
    `BLOCKED: writes to .env files are forbidden. Secrets live in Infisical or Supabase dashboard.\n` +
      `If this is an .env.example update, name the file .env.example.\n` +
      `To allow once: MDEAI_ALLOW_ENV_EDIT=1.\n` +
      `Path: ${rel}\n`,
  );
  process.exit(2);
}

// 2. supabase/migrations/** protection (read-only outside explicit consent)
const isMigration = /(^|\/)supabase\/migrations\//.test(rel);
if (isMigration && process.env.MDEAI_ALLOW_MIGRATION_EDIT !== "1") {
  process.stderr.write(
    `BLOCKED: edits to supabase/migrations/** require explicit approval.\n` +
      `Migrations are irreversible in prod. To proceed, ask the user to run with MDEAI_ALLOW_MIGRATION_EDIT=1.\n` +
      `Path: ${rel}\n`,
  );
  process.exit(2);
}

process.exit(0);
