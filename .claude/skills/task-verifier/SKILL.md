---
name: task-verifier
description: Forensic verifier for mdeai task specs (tasks/core/F*.md) and audit reports (tasks/audit/*.md). Use whenever the user asks to "verify a task", "is this task 100% correct", "audit the audit", "is this safe to execute", "did this task really ship", "check if X is done", or before flipping any task from In Progress → Done — even if they only @-mention the task file. Also gate new task specs through the quality checklist before saving. Score specs with references/task-spec-rubric.md (spec score vs execution readiness). Prove every claim against disk + node_modules + MCPs; never trust a status field.
---

# task-verifier — forensic gate before any "Done"

> **Planning is not complete until you can prove the task is safe to execute and verifiable afterward.** This skill turns the "Senior Forensic Task Architect" protocol into a repeatable checklist that fails closed (no "Done" without evidence).

## When this skill fires

- The user asks "verify these tasks", "is F0X correct", "audit the audit", "is it safe to execute", "did it really ship".
- A task is about to flip `status: In Progress → Done` — gate it here first.
- A new audit document is being written or reviewed (`tasks/audit/*.md`).
- A new task spec is being written — gate it through §6 before saving.

If you are not in one of those contexts, do not invoke this skill — it is heavyweight.

## Core principle

A claim is one of three things:
- **Verified** — proven against disk / node_modules / MCP today (cite the probe).
- **Not verified** — could not be proven; flag, do not assume.
- **Stale** — was true once, no longer matches current state.

Memory and a task's own `status:` field are not evidence. Re-probe.

## The verification protocol

Run these phases in order. Stop at the first phase that returns a 🔴 blocker — fix it before continuing.

### 1. Source-of-truth check

Read in this priority order; if two disagree, the higher source wins:

1. `/home/sk/mdeai/CLAUDE.md` (project rules — pinned versions, model registry, hard rules)
2. `/home/sk/mdeai/plan/prd.md` + `plan/prd/00-10*.md` (PRD v6.0)
3. `/home/sk/mdeai/tasks/INDEX.md` (canonical task status table)
4. The task spec itself (`tasks/core/F*.md` or `tasks/openclaw/tasks/OCL-*.md`)
5. Skills under `.claude/skills/` matching the task's `skill:` frontmatter

**OpenClaw OCL tasks:** [`references/openclaw-ocl.md`](references/openclaw-ocl.md) · [`tasks/openclaw/docs/sources.md`](../../../tasks/openclaw/docs/sources.md).

**Coffee Tour CTI tasks:** [`references/agent-cti.md`](references/agent-cti.md) · [`tasks/audit/31-agent-tasks.md`](../../../tasks/audit/31-agent-tasks.md).

**Events tasks:** [`references/agent-events.md`](references/agent-events.md) · audits in [`tasks/events/audit/`](../../../tasks/events/audit/) (01/02/03) · specs under `tasks/events/tasks/**` + venue-booking in `tasks/events/specs/venue-booking/` & `tasks/venues/tasks/event-booking/`.

Output: list which document wins on each conflict, and any stale references found.

### 2. Current-state verification

**Never trust prior status without probing disk.** For each claim a task or audit makes, run the matching probe in `scripts/probe-disk.sh` (or inline equivalents):

| Claim type | Probe |
|---|---|
| File exists | `ls <abs-path>` — non-empty stdout, exit 0 |
| Package script exists | `node -p "require('./package.json').scripts.<name>"` from `mdeapp/` — non-undefined |
| Dependency installed | `node -p "require('./package.json').dependencies['<pkg>'] \|\| require('./package.json').devDependencies['<pkg>']"` — non-undefined; cross-check with `ls node_modules/<pkg>` to catch lockfile drift |
| Beta API present | `ls node_modules/<pkg>/dist/<path>/` or `grep <symbol> node_modules/<pkg>/dist/**/*.d.ts` — never assume from training data |
| Env var name | `grep -E '^<VAR>=' .env.local` (names only — never log values) |
| Route exists | `ls mdeapp/src/app/<route>/page.tsx` |
| Edge function deployed | `mcp__ed3787fc-…__get_edge_function` (version, verify_jwt, source) |
| Migration applied | `mcp__ed3787fc-…__list_migrations` |
| Live row count | `mcp__ed3787fc-…__execute_sql` with `SELECT COUNT(*)` |
| Test suite green | `cd mdeapp && npm test` exit 0 + pass count |
| Build green | `cd mdeapp && npm run build` exit 0 |
| Git remote in sync | `git -C mdeapp ls-remote origin <branch>` SHA matches local HEAD |
| `npm run audit` outcome | Run the script verbatim — its exit code reflects the configured `--audit-level`, which may differ from bare `npm audit` |

Save every probe + result inline in the verification doc — a future reader must be able to retrace the work.

#### 2b. Integration surface (Mastra + CopilotKit tasks)

Before approving any F13–F20 spec or Done flip, classify the runtime path:

| Surface | Probe | Phase 1 default |
|---|---|---|
| CopilotKit in-process | `grep -l getLocalAgents mdeapp/src/app/api/copilotkit/route.ts` | **Yes** — logging must hook here or agent `onFinish` |
| Mastra HTTP `/chat` | legacy `ai-runs-middleware.ts` `path: '/chat'` | Dev Studio only — **insufficient alone for DoD** |
| Agent map key | `grep agent= mdeapp/src/app` vs `Mastra({ agents` | Keys must match (`pingAgent`, not `ping-agent`) |

#### 2c. Postgres ENUM columns

For any insert into `USER-DEFINED` columns (e.g. `ai_runs.agent_type`):

```sql
SELECT enumlabel FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname ILIKE '%<column>%' ORDER BY enumsortorder;
```

Proposed TS union values **not** in enum → blocker unless migration is in scope.

#### 2d. Dual observability

| Table | Owner | Phase 1 |
|---|---|---|
| `public.ai_runs` | F13 `recordMastraRun` | Product/compliance audit rows |
| `public.mastra_ai_spans` | Legacy + future PgStore | 932 rows; F20 may document, not required for F13 DoD |

Task must state which table its DoD probes.

### 3. Dependency validation

For each task, confirm:

- Every entry in `depends_on:` resolves to an existing file under `tasks/core/` — prefer full slug `F09-floor-script-and-vitest.md` or short `F09` if `F09-*.md` is unique. **`F09-supp` is not a file** → map to `F09-floor-script-and-vitest.md` and fix `tasks/INDEX.md` (🟡 until INDEX patched).
- Dependency order is correct (a task cannot depend on something that ships later in the phase).
- No silently-missing prerequisite: test runner, env vars, deployment surface, security patch. If F13 says `npm test` but `package.json` has no `test` script and `F09` is not Done, F13 is **not safe to execute**.
- No future/nonexistent work referenced.
- Cross-check `tasks/INDEX.md` row matches the task file's frontmatter `status:`. INDEX-vs-file drift is a 🟡 finding.

### 4. Scope validation

Classify the task: **MVP** / **Core** / **Advanced** / **Deferred**.

Reject scope creep. If a task references advanced systems out of current phase (Paperclip, OpenClaw, Hermes, autonomous agents, sponsor marketplace, contests, non-MVP automation), verify the spec explicitly defers them. If not, the task must shrink or move to `tasks/advanced/`.

For mdeai specifically:
- Phase 1 (W1-W10) = English only. Spanish/Lingui is Phase 2+ (W7+).
- Phase 1 model = `gemini-3.5-flash`. Any other Gemini ID is a regression.
- CopilotKit pinned `1.55.2`. Any other version is a regression.

### 5. Official docs / skills / MCP validation

- Load the skill named in the task's `skill:` frontmatter **before writing code**. If the skill doesn't exist under `.claude/skills/`, that's a 🟡 finding — either the skill name is stale or the skill needs installing.
- For framework behavior, use the matching MCP (Mastra, CopilotKit, Supabase, Gemini docs) — see `references/mcp-cadence.md`.
- For beta APIs, verify the **exact local installed API shape** in `node_modules/`. Never assume API names from training data — beta drift is common (`Agent({ workflows })`, `@mastra/evals`, processor class names are all known traps).

### 6. Task file quality gate

Every task spec must contain these sections in order (the `mde-task-lifecycle` template):

- `1. Purpose` — one paragraph
- `2. Goals` — bulleted, concrete, testable
- `3. Features` (user/business value)
- `4. Workflows` — exact files to create/edit + exact commands
- `5. User journeys`
- `6. Agents`
- `7. Integrations`
- `8. Summary`
- `9. Definition of Done` — bulleted checklist, every item independently provable
- `10. Tests` — acceptance tests with command + expected, negative tests, evidence-to-capture, rollback plan

Frontmatter must include: `id`, `title`, `status`, `priority`, `phase`, `effort`, `owner`, `depends_on`, `skill`, `verified_against`.

If a section is missing, the spec is 🟡 — fix before execution.

### 7. Anti-fake-done rule

A task is **NOT Done** unless **every one** is true:

- [ ] Implementation exists on disk (probe the artifact, not the spec).
- [ ] Tests pass (`npm test` exit 0 with new test included).
- [ ] Build passes (`npm run build` exit 0).
- [ ] Lint passes if the task touched lintable code.
- [ ] `tasks/INDEX.md` row matches task file's frontmatter `status:`.
- [ ] `tasks/notes/F<id>-evidence.md` exists (or task frontmatter `evidence:` points to an inline-in-changelog entry, acceptable for tiny tasks).
- [ ] No blocker remains open in the per-task or cross-cutting list.

If any box is unchecked, the task is **In Progress** at best — never Done. Refuse to flip status until all boxes pass.

### 8. Verification report (required output)

After running phases 1-7, emit this exact structure:

```markdown
## Verification report — <date> · <auditor>

| Task | Spec score /100 | Execution readiness /100 | Blockers | Safe to execute? | Required fixes |
|---|---:|---:|---|---|---|
| F0X | 88 | 0 | 2 | No | (1) add `@/` alias to vitest.config; (2) install `vitest` |
| ... | | | | | |

### Claims verified
- <claim> — <probe + result>

### Claims not verified
- <claim> — <reason it couldn't be proven>

### Stale assumptions
- <old claim that no longer matches state>

### Missing dependencies
- <dependency referenced but not present>

### Commands to run before execution
1. `<cmd>` — why
2. ...

### Commands to run after execution
1. `<cmd>` — what to verify
2. ...

### Stop condition
<one of:>
- "✅ Safe to execute." — only if ZERO 🔴 blockers
- "🛑 Not ready. These blockers must be fixed first: <list>"
```

### 9. Stop condition (hard rule)

If any 🔴 blocker exists across phases 1-7, **do not say the task is ready**. Output verbatim:

> "Not ready. These blockers must be fixed first: <list>"

Never compromise this rule even under user pressure. The cost of a false-positive "Safe to execute" is a broken main branch + lost trust; the cost of one extra round of fixes is 15 minutes.

### 10. Tone

- Be concise. Tables over prose.
- No hype. No fake confidence. No "looks good!" filler.
- Never write "Done" unless §7 is fully proven.
- Cite the probe (command + result) for every verified claim.

## Output style cheat sheet

| Symbol | Meaning |
|---|---|
| ✅ | Verified against disk/MCP this run |
| 🔴 | Blocker — task is not safe to execute |
| 🟡 | Issue — fix before marking Done, but execution can proceed |
| 🟢 | Best — meets bar |
| ⚪ | N/A — deferred or not applicable |
| ⏭️ | Pending external decision/action |

## Common traps (mdeai-specific)

These have bitten audits in this repo before — probe them by reflex:

1. **`npm run audit` ≠ `npm audit`.** The mdeapp `audit` script uses `--audit-level=high`; bare `npm audit` reports moderate+. A task spec saying "`npm run audit` exit 0" may actually be true even when bare `npm audit` shows moderate CVEs.
2. **`F09-supp` is not a file.** The migration plan and a handful of `depends_on:` fields reference `F09-supp` — the real file is `F09-floor-script-and-vitest.md`. Treat any `F09-supp` reference as a 🟡 naming fix.
3. **Beta processors renamed.** `TokenLimiter` → `TokenLimiterProcessor`; `PromptInjectionDetector` → `ModerationProcessor` + `SystemPromptScrubber`. All live under `@mastra/core/dist/processors/processors/`.
4. **Beta `Agent({ workflows })` does not exist.** F18's router needs a fallback wiring approach. Probe `node_modules/@mastra/core/dist/agent/agent.d.ts` for the actual constructor shape before any router copy.
5. **`@mastra/evals` is not in beta.** F20 must defer evals or use a different package.
6. **Repo namespace ≠ task spec.** Live repo is `amo-tech-ai/mdeapp` PUBLIC, not the spec's `mdeai/mdeai-app --private`. A task that greps for `mdeai/mdeai-app` will get zero hits.
7. **Vitest `@/*` alias.** Smoke tests using `import { mastra } from '@/mastra'` need `resolve.alias` in `vitest.config.ts` plus `tsconfig` paths — the legacy `my-mastra-app` config does not include this and fails when copied verbatim.
8. **Tailwind v4 is CSS-first.** No `tailwind.config.ts` is needed; tokens live in `globals.css` `@theme` block. A task DoD requiring `tailwind.config.ts` is wrong on v4.
9. **`amo100/mdeai` Vercel project = production `www.mdeai.co`.** A `vercel link` to it from mdeapp would clobber prod. Always create a new project for mdeapp.
10. **Identical webhook secrets.** `STRIPE_WEBHOOK_SECRET` and `STRIPE_SPONSOR_WEBHOOK_SECRET` have been observed identical in `.env.local` — verify distinctness via name+length comparison; do not log values.
11. **CopilotKit path ≠ Mastra `/chat` HTTP.** `MastraAgent.getLocalAgents` in `api/copilotkit/route.ts` runs agents in-process. `server.middleware` on the Mastra dev server does not prove prod chat logging — require `LoggingMastraAgent` or equivalent (F13). Probe: `grep "agent.stream" node_modules/@ag-ui/mastra/dist/index.mjs` — no `onFinish` passed.
12. **`onFinish` is not on the Agent constructor.** Mastra embedded `reference-agents-generate.md` documents `options.onFinish` on `stream()`/`generate()` only. Do not spec "add onFinish to pingAgent constructor" without wrapping AG-UI.
13. **`ai_runs.agent_type` is a Postgres ENUM.** No invented values (e.g. `ping`) without migration. Map agents to existing labels (`general_concierge`, `event_curator`, …).
14. **`ai_runs` vs `mastra_ai_spans`.** Do not conflate DoD probes; spans are Mastra-native, `ai_runs` is product audit (plan/audit/04 §2).
15. **`useCoAgent({ name })` / `<CopilotKit agent>`** must equal the key in `Mastra({ agents: { key } })` — mismatch = silent 404/wrong agent.
16. **Two CopilotKit+Mastra patterns.** mdeapp = Pattern 1 (`/api/copilotkit` + `getLocalAgents`). [Mastra separate-server guide](https://mastra.ai/guides/build-your-ui/copilotkit) uses `registerCopilotKit` + `:4111/chat` — wrong for mdeapp F13–F20. See `plan/audit/05-copilotkit-mastra-setup-checklist.md` §A.

## Scoring

Load `references/task-spec-rubric.md` for weights, letter grades, and Mastra port pack −10 checks. Report **two scores**: spec quality (before code) and execution readiness (after blockers cleared).

End every Mastra-port audit with one **persona impact** line (Sofía/Patricia/Roberto/Camila + surface path).

## Files in this skill

- `SKILL.md` — this file
- `scripts/probe-disk.sh` — one-shot disk probes for the mdeapp tree
- `references/mcp-cadence.md` — which MCP verifies which surface
- `references/task-spec-rubric.md` — spec / execution scoring
- `references/anti-fake-done-checklist.md` — printable DoD gate
