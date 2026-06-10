#!/usr/bin/env node
// SessionStart hook — emits a small situational preamble when a session begins.
// Stdout is injected into the session as additional context (per Claude Code hook spec).
// Keep output short: branch + ahead/behind + 5 recent commits + tasks/INDEX status if present.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 5000, ...opts });
  if (r.status !== 0) return "";
  return (r.stdout || "").trim();
}

const workspaceRoot = "/home/sk/mdeai";
const cwd = process.cwd();
const inMdeapp = existsSync(resolve(workspaceRoot, "mdeapp/package.json"));

// Workspace itself is not a git repo (per CLAUDE.md); mdeapp/ may have a .git.
const mdeappGit = existsSync(resolve(workspaceRoot, "mdeapp/.git"));
const gitCwd = mdeappGit ? resolve(workspaceRoot, "mdeapp") : cwd;

const branch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: gitCwd }) || "(none)";
const log = sh("git", ["log", "--oneline", "-5", "--no-decorate"], { cwd: gitCwd });
const status = sh("git", ["status", "--porcelain"], { cwd: gitCwd });
const dirty = status ? `${status.split("\n").length} changed file(s)` : "clean";

let tasksSection = "";
const tasksIndex = resolve(workspaceRoot, "tasks/INDEX.md");
if (existsSync(tasksIndex)) {
  try {
    const head = readFileSync(tasksIndex, "utf8").split("\n").slice(0, 25).join("\n");
    tasksSection = `\n## tasks/INDEX.md (first 25 lines)\n\n${head}\n`;
  } catch {
    /* ignore */
  }
}

const reminders = [
  "Phase 1, Week 1. App: mdeapp/. CopilotKit pinned at 1.55.2. Gemini model: gemini-3.5-flash.",
  "Hard rules: no service-role keys in mdeapp/src/**; RLS + ≥1 policy on every new table; X-Goog-FieldMask on every Places call; mapId on every Map; v1 CopilotKit imports only.",
  "Legacy /home/sk/mde/ is read-only reference. Do not edit it.",
];

let skillsSection = "";
const agentsLink = resolve(workspaceRoot, ".agents/skills/copilotkit/SKILL.md");
const brokenSkills = sh("bash", ["-c", `find "${resolve(workspaceRoot, ".claude/skills")}" -maxdepth 1 -type l ! -exec test -e {} \\; -print 2>/dev/null | head -3`]);
const verifyHint = "ln -sf .claude/agents/.agents .agents && ./scripts/verify-skills.sh --manifest";
if (!existsSync(agentsLink)) {
  skillsSection = `\n## ⚠ Skills integrity\n\n- **FAIL:** \`.agents\` broken. Restore: \`${verifyHint}\`\n`;
} else if (brokenSkills) {
  skillsSection = `\n## ⚠ Skills integrity\n\n- Broken symlinks: \`${brokenSkills.split("\n").join("`, `")}\`\n- Run: \`${verifyHint}\`\n`;
} else {
  const topicInScan = sh("bash", ["-c", `for s in copilotkit-develop ui-ux-pro-max 21st-dev-builder-v2; do test -e "${resolve(workspaceRoot, ".claude/skills")}/$s" && echo $s; done | head -3`]);
  if (topicInScan) {
    skillsSection = `\n## ⚠ Skills scan root\n\n- Topic-only skills in scan (prune): \`${topicInScan.split("\n").join("`, `")}\`\n- Run: \`./scripts/prune-scan-root.sh\`\n`;
  } else {
    skillsSection = `\n## Skills\n\n- Scan root OK (Phase 1 default) · \`./scripts/verify-skills.sh --manifest\`\n`;
  }
}

const out = `# Session preamble

- Branch (mdeapp): \`${branch}\`
- Working tree: ${dirty}
- mdeapp present: ${inMdeapp ? "yes" : "no"}

## Recent commits

\`\`\`
${log || "(no commits)"}
\`\`\`
${tasksSection}${skillsSection}
## Reminders

${reminders.map((r) => `- ${r}`).join("\n")}

Use \`mde-task-lifecycle\` to plan/ship a task. Floor before shipping: \`/verify-floor\`.
`;

process.stdout.write(out);
process.exit(0);
