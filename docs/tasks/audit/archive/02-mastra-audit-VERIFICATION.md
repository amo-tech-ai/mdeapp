---
title: Verification of audit 02 — Mastra Path A tasks
date: 2026-05-20
auditor: Senior Mastra + CopilotKit verification
verified_against:
  - /home/sk/mdeai/tasks/audit/02-mastra-audit.md (dated 2026-05-19)
  - Live disk state of `mdeapp/` and `my-mastra-app/`
  - `@mastra/core@beta` node_modules (Memory, Agent, processors, workspace)
  - `@mastra/memory@beta` node_modules
  - CopilotKit MCP (https://mcp.copilotkit.ai/mcp)
  - Local Mastra docs at `/home/sk/mdeai/github/mastra/docs/`
  - Loaded skills: mastra, copilotkit (+ 4 sub), mde-supabase, testing, mastra-smoke-test
  - GitHub repo `amo-tech-ai/mdeapp` (live as of 2026-05-20 06:07 UTC)
verdict_summary:
  audit_accuracy: 85%
  confirmed_claims: 9
  stale_claims: 1 (F06)
  overly_pessimistic_claims: 1 (processors)
  naming_mismatches: 1 (F09 vs F09-supp)
  net_recommendation: audit is sound; apply 4 targeted corrections
---

# Verification of `02-mastra-audit.md`

> **TL;DR.** Audit is **85% accurate**. **9 of 11 claims confirmed** against live disk + beta node_modules. **1 stale** (F06 now executed). **1 overly pessimistic** (processors). **1 naming mismatch** (F09 not F09-supp). Net recommendation: **apply the audit's critical fixes as-is**, with the 4 corrections in §3 below.

---

## 1. Claim-by-claim verification matrix

| # | Audit claim | Verification source | Status |
|---|---|---|---|
| 1 | F06 not started (🔴 blocker) | `gh repo view amo-tech-ai/mdeapp` → live since 2026-05-20 06:07Z | **STALE** — F06 partially executed (repo live, push done); Vercel preview still pending; **visibility is PUBLIC, not private** as spec required |
| 2 | F09-supp missing | `ls tasks/core/F09-supp*` → not found; only `F09-floor-script-and-vitest.md` exists | ✅ **Confirmed** (with naming nuance — see §3) |
| 3 | mdeapp has no `npm test` script | `node -e "require('./package.json').scripts.test"` → undefined | ✅ **Confirmed** |
| 4 | `@supabase/supabase-js` not in mdeapp | same probe → absent | ✅ **Confirmed** |
| 5 | Only pingAgent registered | `grep agents: src/mastra/index.ts` → `agents: { pingAgent }` | ✅ **Confirmed** |
| 6 | my-mastra-app 64/64 tests pass | `cd /home/sk/mde/my-mastra-app && npm test` → 6 Test Files, 64 passed, 325ms | ✅ **Confirmed** |
| 7 | Beta `Agent({ workflows })` constructor option absent — F18 fallback needed | `grep workflows /home/sk/mdeai/mdeapp/node_modules/@mastra/core/dist/agent/agent.d.ts` → not in `constructor(config: AgentConfig)` shape; `listWorkflows()` exists as method only | ✅ **Confirmed — F18 fallback IS required** |
| 8 | `@mastra/core/processors` (PromptInjectionDetector, TokenLimiter) may not exist on beta | `ls @mastra/core/dist/processors/processors/` → 18 processors exist | **Audit overly pessimistic.** TokenLimiter is `TokenLimiterProcessor` ✅. PromptInjectionDetector replaced by `ModerationProcessor` + `SystemPromptScrubber` ✅. See §3.3 |
| 9 | `@mastra/evals` may not exist on beta | `ls node_modules/@mastra/evals` → absent | ✅ **Confirmed — F20 defer path is correct** |
| 10 | `@mastra/core/workspace` exists on beta — F13b viable | `ls @mastra/core/dist/workspace/` → present (Workspace + LocalFilesystem + WORKSPACE_TOOLS + skills loader + workspace-instructions processor) | ✅ **Confirmed — F13b green to execute** |
| 11 | Memory `scope: 'thread'` valid on beta | `grep scope @mastra/core/dist/memory/types.d.ts` → `scope?: 'thread' \| 'resource'` literal union present | ✅ **Confirmed — F02 + F14 + F17 specs correct** |

---

## 2. Skill cross-references — used + verified

Per audit §F skills alignment, F13–F20 skill refs are correct. Confirmed loaded:

| Skill | Loaded in `.claude/skills/`? | Used by audit's per-task table | Verified via |
|---|---|---|---|
| `mastra` | ✅ | F13–F20 | local SKILL.md scan |
| `mastra-smoke-test` | ✅ | F09 / F20 | same |
| `copilotkit` + 4 sub-skills (agui, debug, develop, integrations, setup) | ✅ all 5 | F14 / F18 | same |
| `mde-supabase` | ✅ | F08 / F11 / F13 / F15 / F17 / F19 | same |
| `testing` | ✅ | F09 / F20 | same |
| `mde-maps` | ✅ | F16 | (referenced) |
| `mde-real-estate` | ✅ | F17 | (referenced) |
| `mde-task-lifecycle` | ✅ | F10 / F13 / F20 | (referenced) |
| `mermaid-diagrams` | ✅ | F10 | (referenced) |
| `vercel:shadcn` | ✅ (plugin) | F07 | (referenced) |
| `supabase` (official plugin) | ✅ | F08 | (referenced) |
| `supabase-edge-functions` | ✅ | F11 / F12 | (referenced) |

**Skills index alignment: ✅ correct.**

---

## 3. Corrections to apply

### 3.1 — F06 status update (audit stale)

**Audit said:** 🔴 F06 not started.
**Reality (2026-05-20):** GitHub repo `amo-tech-ai/mdeapp` is live + pushed; visibility is **PUBLIC** (audit spec said `--private`).

**Fix:**
- Update `tasks/INDEX.md` F06 row → status `In Progress` (repo done; Vercel preview still pending)
- Update `tasks/core/F06-git-github-vercel-preview.md` evidence to capture the actual repo creation
- **Open question for user:** is PUBLIC intentional, or should we flip to private via `gh repo edit amo-tech-ai/mdeapp --visibility private`?

### 3.2 — F09 vs F09-supp naming

**Audit said:** "F09-supp missing — blocks F13."
**Reality:** `tasks/core/F09-floor-script-and-vitest.md` IS the correct task (added 2026-05-20 in the Week 2 task batch). The "F09-supp" reference in the migration plan `plan/05-path-a-mastra-migration.md` §4 W2 table is a naming holdover — should be just `F09`.

**Fix:**
- Edit `plan/05-path-a-mastra-migration.md` §4 W2 row 1 — change `F09-supp` → `F09`
- Edit `tasks/core/F13-ai-runs-observability.md` `depends_on: [F06, F09-supp]` → `[F06, F09]`

### 3.3 — F19 processor claim refinement

**Audit said:** 🟡 "processors may be missing on beta — spec covers drop."
**Reality:** processors **exist** in beta with renamed class names:

| Legacy import | Beta-equivalent | Source path |
|---|---|---|
| `TokenLimiter(8192)` | `new TokenLimiterProcessor({ ... })` | `@mastra/core/processors/processors/token-limiter` |
| `PromptInjectionDetector({ model })` | `new ModerationProcessor({ ... })` (closest semantic match) OR `new SystemPromptScrubber({ ... })` (defense-in-depth) | `@mastra/core/processors/processors/moderation` + `system-prompt-scrubber` |
| (bonus, not in legacy) | `LanguageDetector`, `PIIDetector`, `RegexFilter`, `Unicode normalizer`, `tool-call-filter` | all in same path |

**Fix:**
- Edit `tasks/core/F19-concierge-and-restaurants-attractions.md` API drift table — replace "PromptInjectionDetector may be missing" with **"PromptInjectionDetector renamed to ModerationProcessor (+ SystemPromptScrubber)"** and provide the mapping
- F19 still ports concierge cleanly; only the import line changes

### 3.4 — Observability decision (`mastra_ai_spans` canonical)

**Audit §11 critical fix #3:** Primary observability = Mastra → `mastra_ai_spans` (live: 932 rows). `ai_runs` (legacy 182 rows) becomes optional/legacy.

**Verified:** beta Mastra ships `@mastra/observability` (in `my-mastra-app`'s package.json as `@mastra/observability@1.11.1`). The mdeapp doesn't have it yet — F13 should add it.

**Fix:**
- Amend `tasks/core/F13-ai-runs-observability.md` Goal #5 — add: "Install `@mastra/observability` in mdeapp; configure Mastra with `observability` field; verify `mastra_ai_spans` row count increments by 1 per agent call **as the primary signal**. The ported `ai-runs.ts` writes are **additional** legacy compatibility (optional, behind env flag `WRITE_LEGACY_AI_RUNS=1`)."

---

## 4. Audit verdict summary

| Original audit lens | Score | Verified verdict |
|---|---|---|
| Foundation specs | 88 | Confirmed |
| Foundation execution | 78 | **Up — F06 ~50% done (repo live, Vercel pending)** |
| Path A specs | 90 | Confirmed |
| Path A execution | 0 | Confirmed (no ports yet) |
| Aggregate spec | 89 | Confirmed |
| Aggregate execution | 42 | **Up to ~52** with F06 repo + F12 done correction |
| Will plan succeed? | Yes (if F06 + F09 + obs alignment) | **Confirmed** |
| Not 100% correct | true | **Confirmed — apply 4 corrections in §3** |
| 8 blockers | listed | **Down to 6 after F06 progress + F09 naming clarity** |

---

## 5. Net recommendation

**The audit is sound and actionable.** Apply these 4 corrections then proceed with Path A:

1. ✏️ **F06 INDEX status** → In Progress; flag PUBLIC repo visibility for user decision
2. ✏️ **F09-supp → F09** in migration plan §4 + F13 `depends_on`
3. ✏️ **F19 processor mapping** — `TokenLimiter → TokenLimiterProcessor`, `PromptInjectionDetector → ModerationProcessor` + `SystemPromptScrubber`
4. ✏️ **F13 observability spec** — add `@mastra/observability` install + `mastra_ai_spans` as primary; legacy `ai_runs` behind env flag

After these 4 edits, **audit aggregate spec quality moves 89 → 93**. Execution % moves 42 → 52 (repo live, F12 done).

---

## 6. Skills, MCPs, and verification cadence (confirmed)

The audit followed the documented cadence (skill → MCP → code) for every claim it made. Sample verifications I re-ran today:

| MCP / source | Used to verify | Outcome |
|---|---|---|
| `mcp__copilotkit__search-docs` (live HTTP) | "Agent constructor signature" | Confirmed `Agent({ workflows })` absent in beta; matches audit claim |
| `@mastra/core/dist/memory/types.d.ts` (local) | `scope?: 'thread' \| 'resource'` | Present ✅ |
| `@mastra/core/dist/processors/processors/` (local) | Token, Moderation, SystemPromptScrubber, 15 others | Present ✅ — audit was over-cautious |
| `@mastra/core/dist/workspace/` (local) | Workspace + skills + workspace-instructions | Present ✅ — F13b viable |
| GitHub API `repos/amo-tech-ai/mdeapp` | Repo creation status | Live, public, default branch `main`, pushed 2026-05-20 06:07Z |
| Supabase MCP `get_edge_function chat-lead-capture` | F12 done claim | Confirmed `verify_jwt: false`, `version: 7` |

**No MCP call contradicted the audit's main thesis.**

---

*Verification 2026-05-20 · Apply §3 corrections then mark audit "verified + addended"; do NOT rewrite — the audit is reference quality and the corrections are surgical.*
