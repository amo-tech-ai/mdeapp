# Lean workflow — mdeai

**Status:** Cursor config canonical at `.cursor/` · workspace **`/home/sk/mdeai/mdeapp`**  
**Orchestrator:** [`.cursor/rules/mdeai-workflow.mdc`](./.cursor/rules/mdeai-workflow.mdc)  
**Setup guide:** [04-subagents-hooks-setup.md](./.cursor/docs/04-subagents-hooks-setup.md) · **Worktrees:** [05-worktrees.md](./.cursor/docs/05-worktrees.md) · **Automations:** [06-automations.md](./.cursor/docs/06-automations.md) · **Dashboard MCP:** [07-dashboard-mcp.md](./.cursor/docs/07-dashboard-mcp.md)

---

## Health check (weekly — replaces the old 100-pt rubric)

The 100-point weighted grading rubric was retired 2026-06-18 (per [`docs/ai-second-brain/lean-plan.md`](./docs/ai-second-brain/lean-plan.md) §10 — a rubric to *measure* leanness was the least-lean artifact here). Track 5 operational numbers instead, ~2 min/week. All green → the workflow is lean enough.

| Metric | Target | Catches |
|--------|-------:|---------|
| Open PRs | < 10 | review backlog / unmerged drift |
| Dirty worktrees | < 5 | the "8 legacy, 4 frozen dirty" sprawl |
| Failed CI | 0 | broken main |
| Prod incidents | 0 | real-user breakage (Camila / Andrés) |
| P0 blockers | < 3 | launch-critical stalls |

No grade, no weighting. The lean wins that the old rubric tracked are **already banked**: 3 always-on rules, glob-demoted rest, D/C/U/S orchestrator, hooks, Browser matrix, 6 MCP servers. The only open tooling item is the post-deploy prod-smoke automation (Vercel webhook) — see [06-automations.md](./.cursor/docs/06-automations.md).

---

## Suggested additional agents

Keep **≤8 custom** total (Cursor docs: vague agents don’t trigger). Priority order:

| Priority | Agent | Class | ● | Description snippet |
|----------|-------|-------|---|---------------------|
| P0 | `localhost-probe` | C/U | 🟢 | Dev boot + curl — **scaffolded** |
| P0 | `events-preflight` | C/U | 🟢 | Canon + todo order — **scaffolded** |
| P1 | `diagram-auditor` | D | 🟢 | Mermaid vs 04-AI-native — **scaffolded** |
| P1 | `migration-guardian` | C/S | 🟢 | RLS on migrations — **scaffolded** |
| P1 | `ci-investigator` | S | 🟢 | One red check → root cause — **scaffolded** |
| P2 | `linear-sync` | S | ⚫ | Evidence MD → suggested Linear comment + status (In Review / Done). Never flip Done without user OK. |
| P2 | `playwright-runner` | U | ⚫ | Run named e2e spec; screenshot to `tasks/testing/evidence/`. Background. |

**Already sufficient (don’t duplicate):** `task-verifier`, `prod-smoke`, `pr-scope-reviewer`, `mdeai-auto-reviewer`, `security-reviewer` + built-in **Explore / Bash / Browser**.

---

## Problem (before)

~13 `alwaysApply: true` rules repeated the same 14-step workflow (pre-flight → skills → MCP → L1–L5 → cubic → CodeRabbit → ledger → persona → Linear). Every doc typo paid ship-class tax.

## Solution

**3 always-on rules** (~100 lines):

| Rule | Purpose |
|------|---------|
| `mdeai-workflow.mdc` | Classify D/C/U/S, ≤3 skills, verify by tier |
| `mdeai-response-style.mdc` | Verdict-first replies |
| `karpathy-guidelines.mdc` | Surgical scope |

Everything else loads by **glob** or **class S / P0**.

## Change classes

| Class | Examples | Minimum verify | Evidence |
|-------|----------|----------------|----------|
| **D** | specs, plans, diagrams | links + mermaid if needed | none |
| **C** | lib, API, migration | vitest subset + dev + curl | optional |
| **U** | chat, cards, maps, agents | + Browser or Playwright + screenshot | `tasks/testing/evidence/…/SAN-###-RESULTS.md` |
| **S** | PR merge, P0, prod claim | + prod smoke + PR bot pass | full RESULTS + Events changelog if applicable |

Agents **state class in the first reply**.

## PR bot policy (lean)

| PR | Bots |
|----|------|
| Docs-only, ≤15 files | CI green only |
| UI/agent | **cubic OR CodeRabbit** on PR — not both local pre-PR |
| P0 `phase:launch` | Full loop — see `mdeai-proof-driven-delivery.mdc` |

## Evidence (simplified)

- **One file** when class ≥ U: `tasks/testing/evidence/YYYY-MM-DD/SAN-###-<slug>-RESULTS.md`
- **Only rows for checks run** — no empty template padding
- PREFLIGHT.md, TASK-LEDGER, persona dashboard → **P0 launch / batch audit only**

## Commit policy

Aligned with user rule: **suggest** `git add` + message at slice boundary; **commit only when user asks** (`mdeai-commit-discipline.mdc`).

## Demoted rules (alwaysApply → glob)

- `mdeai-proof-driven-delivery.mdc`
- `mdeai-done-gate.mdc`
- `mdeai-launch-gate.mdc`
- `mdeai-task-skill-mcp-gate.mdc`
- `mdeai-real-world-proof-pr-review.mdc`
- `mdeai-live-prod-check.mdc`
- `mdeai-skills-best-practices.mdc`
- `mdeai-commit-discipline.mdc`
- `mdeai-task-naming.mdc`
- `mdeai-events-task-skill-mcp-gate.mdc`
- `graphify.mdc`

## Kept strict (on purpose)

- One SAN = one PR
- Prod proof before persona-visible **ship** claims (class S)
- Events `todo.md` venue chain order
- CopilotKit/Mastra invariants → skills + `LESSONS.md`, not duplicated in rules

## Rule index

See [`.cursor/rules/README.md`](./.cursor/rules/README.md).

## Skills pairing

Load ≤3 from [`.cursor/docs/02-skills-plan.md`](./.cursor/docs/02-skills-plan.md) §4 — not the full 33-pack.

```text
classify → skills(≤3) → implement → verify(class) → evidence(if U/S) → PR(if S) → In Review
```

---

## Cursor stack roadmap (remaining)

Prioritized to move **Overall** from **66 → 85+ (Grade B)**.

| Priority | Item | ● | Effort | Lifts score ~ |
|----------|------|---|--------|---------------|
| **P0** | Expand [`.cursor/mcp.json`](./.mcp.json) → mastra, gemini, maps, Supabase | 🟢 | Low | Done (6 servers; Supabase = dashboard) |
| **P0** | Verify hooks in Cursor — `/hook-smoke` + IDE read `.env.local` | 🟢 | Done | +3 |
| **P0** | Pin class **U** Browser prompts in `mdeai-workflow.mdc` | 🟢 | Low | Done |
| **P0** | `.cursor/commands/` — verify-floor, classify, prod-quick | 🟢 | Low | Done (+ verify-task, events-preflight) |
| **P1** | Add `diagram-auditor` + `migration-guardian` + `ci-investigator` | 🟢 | Low | Done |
| **P1** | One Automation — post-deploy Tier-1 prod smoke | 🟡 | Medium | Draft [06-automations.md](./.cursor/docs/06-automations.md) — wire Vercel webhook |
| **P1** | Dashboard MCP plugins (Supabase, Linear, Stripe) | 🟢 | Low | [07-dashboard-mcp.md](./.cursor/docs/07-dashboard-mcp.md) |
| **P2** | `.cursor/skills/mdeai-router/SKILL.md` (~80 lines) | ⚫ | Low | +2 |
| **P2** | Refresh [01-best-practices.md](./.cursor/docs/01-best-practices.md) | 🟢 | Low | Done 2026-06-08 |

**Do not add:** 20+ subagents · more alwaysApply rules · cloud agent for Camila chat (needs Infisical + local Mastra).

---

## Persona tie-in

| Persona | Lean + Cursor lane | Effect |
|---------|-------------------|--------|
| **Camila** (U) | Browser matrix + evidence | Cards + pins before merge |
| **Roberto** (host) | MCP mastra + copilotkit + events-preflight agent | No wrong agent/tool names |
| **Sofía** | Hooks + localhost-probe | Same guards as Claude Code |
| **Lucía** (QA) | prod-smoke + playwright-runner | Tier-2 without manual checklist |
| **Patricia** (S) | pr-scope-reviewer + launch globs | No 3000-file PRs |

---

## Changelog

| Date | Overall | Grade | Notes |
|------|--------:|-------|-------|
| 2026-06-09 | 87 | B+ | `.cursor/` canonical at `mdeapp/.cursor/`; parent symlink |
| 2026-06-08 | 87 | B+ | P1 agents + plugins + automation draft + 01-best-practices refresh |
| 2026-06-08 | 83 | B | Hook smoke script + runtime verify (workspace-scoped) |
| 2026-06-08 | 82 | B | Browser matrix in workflow + 6 slash commands |
| 2026-06-09 | 77 | C | Worktree B- locked; removed san692 + mainverify |
| 2026-06-09 | 76 | C | `mdeapp/.worktrees/` + worktrees.json + scripts |
| 2026-06-09 | 66 | C | Lean rules done; hooks + 2 agents wired |
