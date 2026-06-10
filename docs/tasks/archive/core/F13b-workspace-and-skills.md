---
id: F13b
title: Port Mastra workspace + 5 mdeai workspace skills from my-mastra-app
status: Done
priority: P0
phase: W3 prep — alongside F13/F14 (foundation for agent governance)
effort: 1.5h (1h skills copy + 30 min workspace config)
owner: claude
depends_on: [F13-ai-runs-observability]
skill: [mastra, copilotkit-integrations]
integration_pattern: in-process
copilotkit_docs:
  - https://docs.copilotkit.ai/mastra/quickstart
verified_against:
  - plan/audit/05-copilotkit-mastra-setup-checklist.md
master_plan: /home/sk/mdeai/plan/05-path-a-mastra-migration.md
source_files:
  - /home/sk/mde/my-mastra-app/workspace/skills/mde-prompt-qa/SKILL.md
  - /home/sk/mde/my-mastra-app/workspace/skills/mde-rental-quality/SKILL.md
  - /home/sk/mde/my-mastra-app/workspace/skills/mde-safe-actions/SKILL.md
  - /home/sk/mde/my-mastra-app/workspace/skills/mde-event-review/SKILL.md
  - /home/sk/mde/my-mastra-app/workspace/skills/mde-followup-logic/SKILL.md
  - /home/sk/mde/my-mastra-app/src/mastra/workspaces.ts (config — 28 lines)
target_files:
  - /home/sk/mdeai/mdeapp/workspace/skills/mde-prompt-qa/SKILL.md
  - /home/sk/mdeai/mdeapp/workspace/skills/mde-rental-quality/SKILL.md
  - /home/sk/mdeai/mdeapp/workspace/skills/mde-safe-actions/SKILL.md
  - /home/sk/mdeai/mdeapp/workspace/skills/mde-event-review/SKILL.md
  - /home/sk/mdeai/mdeapp/workspace/skills/mde-followup-logic/SKILL.md
  - /home/sk/mdeai/mdeapp/src/mastra/workspaces.ts
  - /home/sk/mdeai/mdeapp/src/mastra/index.ts (wire workspace)
verified_beta_api:
  - /home/sk/mdeai/mdeapp/node_modules/@mastra/core/dist/workspace/ (exists ✅)
  - /home/sk/mdeai/mdeapp/node_modules/@mastra/core/dist/workspace/skills/workspace-skills.d.ts (exists ✅)
  - /home/sk/mdeai/mdeapp/node_modules/@mastra/core/dist/processors/processors/workspace-instructions.d.ts (exists ✅)
---

# F13b — Port Mastra `Workspace` + 5 mdeai workspace skills

## 1. Purpose

The legacy `my-mastra-app` registers a **read-only `Workspace`** that mounts 5 hand-crafted mdeai governance skills as Markdown files. These skills encode **Medellín-specific knowledge** (neighborhood pricing, event categories, nightlife safety) and **agent safety rules** (propose-only, no fake confirmations, conversation continuity). All 5 SKILL.md files are pure mdeai IP — months of distilled product knowledge.

Beta `@mastra/core/workspace` confirmed available on disk. Porting captures this knowledge at runtime AND gives a place to add new skills as we learn.

## 2. Goals

- `mdeapp/workspace/skills/` directory with **5 SKILL.md files** (verbatim port)
- `mdeapp/src/mastra/workspaces.ts` exports `workspace` + `workspaceBasePath` (config)
- `mdeapp/src/mastra/index.ts` registers `workspace` in the `Mastra({ workspace })` constructor
- Beta API verified: `Workspace`, `LocalFilesystem`, `WORKSPACE_TOOLS` all importable from `@mastra/core/workspace`
- Read-only enforcement preserved: write/edit/delete/mkdir/ast_edit all disabled (matches PRD §17 "AI proposes; user approves; system commits")
- Workspace loads at runtime — `mastra.getWorkspace()` returns object; `skills` array contains 5 entries

## 3. Features (persona value)

| Persona | Value |
|---|---|
| **Roberto** | `mde-event-review` skill encodes venue/pricing QA before publish |
| **Camila** | `mde-rental-quality` + `mde-followup-logic` for neighborhood + follow-up semantics |
| **Sofía** | Read-only workspace — agents propose, never mutate files (PRD §17) |

## 5. User journeys

- Dev runs `npm run dev` → `mastra.getWorkspace()` resolves → 5 skills readable at runtime (probe in evidence).

## 6. Agents

- All agents registered in `mastra/index.ts` may attach `WorkspaceInstructionsProcessor` in F19; F13b only registers `workspace` on the Mastra instance.

## 7. Integrations

- `@mastra/core/workspace` — `Workspace`, `LocalFilesystem`, `WORKSPACE_TOOLS`
- Does not write to `ai_runs` (F13)

## 3. Source files — port verbatim

The 5 SKILL.md files are pure Markdown with YAML frontmatter — no code, no API surface. Direct copy.

`workspaces.ts` uses three exports from `@mastra/core/workspace`: `Workspace`, `LocalFilesystem`, `WORKSPACE_TOOLS`. Beta has all three (verified above).

## 4. Workflow

1. **Pre-flight (beta verification):**
   ```bash
   # Already confirmed: ls .../node_modules/@mastra/core/dist/workspace/ exists
   # Check workspace.d.ts for any API drift:
   grep -A 5 "class Workspace" /home/sk/mdeai/mdeapp/node_modules/@mastra/core/workspace.d.ts | head -20
   grep "WORKSPACE_TOOLS" /home/sk/mdeai/mdeapp/node_modules/@mastra/core/dist/workspace/index.d.ts 2>/dev/null | head -5
   ```
   Verify constructor accepts `{ filesystem, skills, tools }` shape.

2. **Create directory + copy skills:**
   ```bash
   mkdir -p /home/sk/mdeai/mdeapp/workspace/skills/{mde-prompt-qa,mde-rental-quality,mde-safe-actions,mde-event-review,mde-followup-logic}
   cp /home/sk/mde/my-mastra-app/workspace/skills/*/SKILL.md  /home/sk/mdeai/mdeapp/workspace/skills/<dest>/SKILL.md
   ```

3. **Copy + adapt `workspaces.ts`:**
   - `cp /home/sk/mde/my-mastra-app/src/mastra/workspaces.ts /home/sk/mdeai/mdeapp/src/mastra/workspaces.ts`
   - Verify the `packageRoot` derivation works in the new path:
     ```ts
     const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
     // From mdeapp/src/mastra/workspaces.ts → packageRoot = mdeapp/
     // workspace path = mdeapp/workspace ✅ matches our directory above
     ```
   - Rename env var override from `MDE_MASTRA_WORKSPACE` to `MDEAPP_WORKSPACE` (matches our env naming convention).

4. **Register workspace in `mdeapp/src/mastra/index.ts`:**
   ```ts
   import { workspace } from './workspaces';
   export const mastra = new Mastra({
     agents: { pingAgent /*, eventAgent (F14), ... */ },
     workspace,            // ← NEW
     storage: new LibSQLStore({ id: "mastra-storage", url: ":memory:" }),
     logger: new ConsoleLogger({ level: LOG_LEVEL }),
   });
   ```

5. **Optional: enable `workspace-instructions` processor** on agents (F14/F17/F19) so the skills' rules surface into agent context:
   ```ts
   import { WorkspaceInstructionsProcessor } from '@mastra/core/processors';
   // In agent constructor:
   inputProcessors: [new WorkspaceInstructionsProcessor({ skills: ['mde-safe-actions', 'mde-followup-logic'] })],
   ```
   **(Defer to F19 if processor exists in beta — same risk as F19 task.)**

## 5. API drift adjustments

| Risk | Check | Mitigation |
|---|---|---|
| `Workspace` constructor option shape changed | `cat node_modules/@mastra/core/dist/workspace/workspace.d.ts \| head -30` | Adapt to new shape |
| `LocalFilesystem({ basePath })` API renamed | same | If `basePath` renamed, use new field name |
| `WORKSPACE_TOOLS.FILESYSTEM.*` enum changed | same | Verify enum values (`WRITE_FILE`, `EDIT_FILE`, etc.); rename if needed |
| `Mastra({ workspace })` constructor option dropped | Look in `node_modules/@mastra/core/dist/mastra/index.d.ts` for the Mastra constructor type | If absent, register workspace via `mastra.setWorkspace(workspace)` or whatever API exists |
| `WorkspaceInstructionsProcessor` exists but signature differs | Defer to F19 | — |

## 6. Tests

**Vitest unit (`workspaces.test.ts`):**
```ts
import { describe, it, expect } from 'vitest';
import { workspace, workspaceBasePath } from './workspaces';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Mastra workspace', () => {
  it('exports workspace + workspaceBasePath', () => {
    expect(workspace).toBeDefined();
    expect(workspaceBasePath).toBeTruthy();
  });
  it('workspace directory contains 5 skill folders', () => {
    expect(existsSync(join(workspaceBasePath, 'skills'))).toBe(true);
    expect(existsSync(join(workspaceBasePath, 'skills/mde-prompt-qa/SKILL.md'))).toBe(true);
    expect(existsSync(join(workspaceBasePath, 'skills/mde-rental-quality/SKILL.md'))).toBe(true);
    expect(existsSync(join(workspaceBasePath, 'skills/mde-safe-actions/SKILL.md'))).toBe(true);
    expect(existsSync(join(workspaceBasePath, 'skills/mde-event-review/SKILL.md'))).toBe(true);
    expect(existsSync(join(workspaceBasePath, 'skills/mde-followup-logic/SKILL.md'))).toBe(true);
  });
  it('mutation tools are disabled', () => {
    // Inspect workspace config; expect 5 tools disabled (WRITE_FILE, EDIT_FILE, DELETE, MKDIR, AST_EDIT)
  });
});
```

**Runtime probe (no special test, just verify import):**
```bash
cd mdeapp && node --experimental-strip-types -e "
  import('./src/mastra/index.js').then(m => {
    console.log('mastra ready, workspace:', !!m.mastra.workspace);
  });
"
```
Expect `mastra ready, workspace: true`.

## 7. Acceptance criteria

- [ ] 5 SKILL.md files under `mdeapp/workspace/skills/` (one per subfolder)
- [ ] `mdeapp/src/mastra/workspaces.ts` exists; exports `workspace` + `workspaceBasePath`
- [ ] `mdeapp/src/mastra/index.ts` passes `workspace` to `new Mastra({ workspace })`
- [ ] Build green; lint green; tsc green
- [ ] 3+ new Vitest tests pass
- [ ] Beta API check (`workspace.d.ts` constructor signature) documented in evidence
- [ ] If `Mastra({ workspace })` option exists, **chat still works on `mdeapp:dev`** (no regression — verified by re-running F05 smoke "hi" → Gemini reply)
- [ ] If `Mastra({ workspace })` is dropped in beta: workspace registered via alternate API, documented in evidence
- [ ] Evidence at `tasks/notes/F13b-evidence.md` with `head -30 workspace.d.ts` output

## 8. Rollback

`git revert HEAD` removes 5 SKILL.md files + workspaces.ts + index.ts wiring. mdeapp continues working without workspace (agents fall back to their hardcoded instructions which already include subset of these rules).

## 9. Definition of Done

All ACs pass. Commit: `feat(mastra): port workspace + 5 mdeai governance skills (F13b)`. Evidence file written.

## 10. Why this matters

| Skill | What it encodes | Where it's referenced |
|---|---|---|
| `mde-prompt-qa` | 7 hallucination checks + propose-only rules | Useful for QA on F14 (eventAgent) prompt updates |
| `mde-rental-quality` | Neighborhood pricing realism for Laureles / Poblado / Envigado / Manila / Provenza + 10 rental QA checks | F17 (rentalAgent) — these rules already partially in agent prompt; skill is the canonical source |
| `mde-safe-actions` | 13 high-risk action list + "never claim success unless tool confirms" policy | F18/F19 (router + concierge) — PRD §17 HITL backbone |
| `mde-event-review` | 10 event QA checks + 5 nightlife neighborhood guides | F14/F15 (eventAgent + tool) — pricing/timing/venue rules |
| `mde-followup-logic` | 6 follow-up interpretation categories (price refine, quality upgrade, similarity, comparison, location, time) | F18/F19 — encodes the "show cheaper" / "compare 1 and 3" semantics that legacy prompts already embed |

Net: **5 skills × roughly 100 lines each = 500 lines of distilled mdeai product knowledge** that runtime agents can reference without bloating individual prompts.

## 11. Phase-1 vs Phase-2 split

| Item | Phase 1 (F13b) | Phase 2 |
|---|---|---|
| Copy 5 SKILL.md files | ✅ | — |
| Register `Workspace` in Mastra constructor | ✅ | — |
| Read-only filesystem (skills lookup only) | ✅ | — |
| `WorkspaceInstructionsProcessor` per agent | optional (defer if `@mastra/core/processors` shape differs) | enable everywhere |
| Skills authoring UI / runtime editing | — | Phase 3 |
| Add new skills (e.g. `mde-stripe-safety`, `mde-host-onboarding`) | as W3-W9 needs arise | — |
