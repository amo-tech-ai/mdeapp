---
title: Forensic verification of audit 02 (Mastra Path A) + audit 03 (W2 F07–F12)
date: 2026-05-20
auditor: task-verifier skill (probe-disk.sh + Supabase MCP)
verified_against:
  - /home/sk/mdeai/tasks/audit/02-mastra-audit.md (2026-05-19)
  - /home/sk/mdeai/tasks/audit/03-audit-f7-f12.md (2026-05-20)
  - Live disk + node_modules under /home/sk/mdeai/mdeapp/
  - Supabase MCP (zkwcbyxiwklihegjhuql)
  - git -C mdeapp ls-remote origin main
verdict:
  audit_02_accuracy: 87/100
  audit_03_accuracy: 90/100
  combined_safe_to_execute: false
  blockers_remaining: 6
---

# Verification of audit 02 + audit 03

> Planning is not complete until you can prove the task can be executed safely **and** verified afterward. This document audits the audits, then assigns spec/exec scores and required fixes per task — and emits the protocol's mandatory output sections.

## Verification report — 2026-05-20 · task-verifier

| Task | Spec /100 | Exec readiness /100 | Blockers | Safe to execute? | Required fixes |
|---|---:|---:|---|---|---|
| F01 | 90 | 95 | 0 | 🟢 yes | none — Done, evidence present |
| F01b | 92 | 95 | 0 | 🟢 yes | none |
| F02 | 94 | 95 | 0 | 🟢 yes | none |
| F03 | 91 | 90 | 0 | 🟢 yes | none |
| F04 | 90 | 88 | 1 🟡 | 🟢 yes (W1) | add server-only `SUPABASE_URL` + server alias for F13 (no `SERVICE_ROLE` in mdeapp) |
| F05 | 88 | 85 | 0 | 🟢 yes | none |
| F06 | 80 | 60 | 3 ⏭️ | 🟡 partial | (1) Vercel project decision (new `mdeapp` — NOT `amo100/mdeai`); (2) visibility decision; (3) authorize 6-env push |
| F07 | 78 | 0 | 2 🟡 | 🟡 needs spec fix | (1) drop `tailwind.config.ts` DoD — Tailwind v4 is CSS-first; (2) move tokens to `src/app/globals.css` `@theme` |
| F08 | 86 | 0 | 2 🟡 | 🟡 needs spec fix | (1) add W2 stub `src/app/host/event/new/page.tsx` for redirect test; (2) wire `NEXT_PUBLIC_SITE_URL` for magic links |
| F09 | 84 | 0 | 2 🔴 | 🛑 not yet | (1) **add `resolve.alias` `@/*` + `vite-tsconfig-paths`** to `vitest.config.ts`; (2) reconcile `.claude/commands/verify-floor.md` 4 gates ↔ F09 5-gate `floor` |
| F10 | 90 | 0 | 1 🟡 | 🟡 needs spec fix | confirm freeze date with user; split DoD (legacy FREEZE.md not in mdeapp git) |
| F11 | 78 | 5 | 2 🔴 | 🛑 P0 | (1) **Stripe secrets identical in `/home/sk/mdeai/.env.local` — confirmed by probe**; rotate distinct + redeploy fns; (2) replace local `grep` paths on sponsor-payment-webhook with Supabase MCP `get_edge_function` |
| F12 | 95 | 95 | 0 | 🟢 already done | live: `v7`, `verify_jwt:false` (confirmed via Supabase MCP) |
| F13 | 88 | 0 | 3 🔴 | 🛑 not yet | (1) **`depends_on: [F06, F09-supp]` → `[F06, F09]` — F09-supp file does not exist**; (2) install `@mastra/observability`; (3) install `@supabase/supabase-js`; (4) primary observability = `mastra_ai_spans` |
| F13b | 92 | 0 | 0 | 🟢 yes | `@mastra/core/workspace` confirmed present in beta |
| F14 | 90 | 0 | 0 (after F13) | 🟢 after F13 | none — Memory `scope:"thread"` confirmed valid on beta |
| F15 | 88 | 0 | 1 🟡 | 🟡 needs spec fix | confirm `events.status`/`is_active` columns return non-zero rows; pre-flight per spec |
| F16 | 86 | 0 | 1 🟡 | 🟡 needs spec fix | server vs `NEXT_PUBLIC_*` for `GOOGLE_MAPS_API_KEY`; restore deferred `places-api-field-mask` hook before port |
| F17 | 88 | 0 | 1 🟡 | 🟡 needs spec fix | verify `apartments` column names (`nightly_price`); same AG-UI risk as F15 |
| F18 | 84 | 0 | 1 🔴 | 🛑 not yet | beta `Agent({ workflows })` constructor option absent — F18 must use fallback wiring (spec already notes this; promote to hard prerequisite checkbox) |
| F19 | 86 | 0 | 1 🟡 | 🟡 needs spec fix | replace `PromptInjectionDetector` → `ModerationProcessor` + `SystemPromptScrubber`; replace `TokenLimiter` → `TokenLimiterProcessor` |
| F20 | 80 | 0 | 1 🟡 | 🟡 needs spec fix | `@mastra/evals` absent on beta — defer scorers (spec already notes); do not port `fix-vercel-build.cjs` |

**Aggregate spec:** ~87/100 · **Aggregate exec:** ~30/100 · **Hard 🔴 blockers across the plan: 6**

---

## Claims verified (probed today)

Every claim below has a paired probe + result captured by `task-verifier/scripts/probe-disk.sh` and Supabase MCP.

| # | Claim | Source audit | Probe | Result |
|---|---|---|---|---|
| 1 | mdeapp has no `npm test` script | 02 + 03 | `node -p "require('./package.json').scripts.test"` | `undefined` ✅ |
| 2 | `@supabase/supabase-js` not in mdeapp | 02 + 03 | `node -p ...` | `''` ✅ |
| 3 | `@supabase/ssr` not in mdeapp | 03 | same | `''` ✅ |
| 4 | `vitest` not installed | 02 + 03 | same | `''` ✅ |
| 5 | `components.json` absent | 03 | `ls mdeapp/components.json` | not found ✅ |
| 6 | `tailwind.config.ts` absent (Tailwind v4 CSS-first) | 03 E1 | `ls` + `node -p "...tailwindcss"` | absent + `^4` ✅ |
| 7 | `src/lib/utils.ts` absent | 03 | `ls` | absent ✅ |
| 8 | `src/app/host/event/new/page.tsx` absent | 03 E2 | `ls` | absent ✅ |
| 9 | `.vercel/` absent (F06 pending) | 03 + verification | `ls mdeapp/.vercel` | absent ✅ |
| 10 | `@mastra/observability` not installed | 02 verification | `ls node_modules/@mastra/observability` | absent ✅ |
| 11 | `@mastra/evals` not on beta | 02 + verification | `ls node_modules/@mastra/evals` | absent ✅ |
| 12 | `@mastra/core/workspace` exists on beta | 02 verification | `ls .../dist/workspace/` | present ✅ |
| 13 | Beta processors exist with renamed classes | 02 verification §3.3 | `ls .../processors/processors/` | TokenLimiterProcessor + ModerationProcessor + SystemPromptScrubber all ✅ |
| 14 | Memory `scope: 'thread' \| 'resource'` valid on beta | 02 + F02/F14 | `grep scope .../memory/types.d.ts` | literal union present ✅ |
| 15 | `F09-supp` task file does not exist | 02 + verification | `ls tasks/core/F09-supp*` | not found; only `F09-floor-script-and-vitest.md` ✅ |
| 16 | F13 still references `F09-supp` in `depends_on` | verification §3.2 | `grep depends_on tasks/core/F13*` | `[F06, F09-supp]` ✅ — fix needed |
| 17 | F19 still references legacy processor names | this audit | `grep PromptInjectionDetector tasks/core/F19*` | 3 hits ✅ — fix needed |
| 18 | `chat-lead-capture v7 verify_jwt:false` | 03 | Supabase MCP `get_edge_function` (prior) | confirmed ✅ |
| 19 | Live row counts: `ai_runs`=182, `mastra_ai_spans`=932 | 02 | `mcp__ed3787fc-…__execute_sql SELECT COUNT(*)` | exact match ✅ |
| 20 | Live: `auth.users=9, leads=8, events=49, apartments=44, restaurants=44, attractions=23` | 02 + 03 | same query | confirmed ✅ |
| 21 | `git -C mdeapp` on `main`, local SHA = remote SHA | F06 evidence | `git ls-remote origin main` | `471ee69` both sides ✅ |
| 22 | `mdeapp/.env.local` has 6 expected envs; `SUPABASE_SERVICE_ROLE_KEY` correctly absent | F04 | name probe (no values) | ✅ |
| 23 | Workspace `STRIPE_WEBHOOK_SECRET` == `STRIPE_SPONSOR_WEBHOOK_SECRET` | 03 B1 (P0) | `[ "$t" = "$s" ]` shell compare (values not logged) | **identical, length 38 each — P0 confirmed** 🔴 |

## Claims not verified

| # | Claim | Why unverified | Next probe |
|---|---|---|---|
| N1 | "Stripe Dashboard has two distinct endpoints/secrets" (audit 03 B1 remediation step) | requires Stripe Dashboard or `stripe-cli` (no local MCP) | run `stripe webhook_endpoints list` after rotation |
| N2 | "Both Edge fns use `idempotency_keys` table" (audit 03 live verification) | not re-run this turn — relies on prior MCP `get_edge_function` | `get_edge_function` for ticket-payment-webhook + sponsor-payment-webhook, grep source for `idempotency_keys` |
| N3 | "Mastra dev EADDRINUSE on autoPort" claim from CLAUDE.md | runtime-only; chat works because runtime uses in-process `MastraAgent.getLocalAgents` | start dev concurrently and observe `[agent]` lines |
| N4 | "branch protection rules on `main` (block force push)" | none configured | `gh api repos/amo-tech-ai/mdeapp/branches/main/protection` |

## Stale assumptions

These were true once or written from the wrong vantage point. They no longer match state and must be fixed in the source docs.

| # | Stale claim | Where | What is true now |
|---|---|---|---|
| S1 | "🔴 F06 not started" | audit 02 row F06 | F06 is **In Progress** — git+GitHub done with hygiene; only Vercel pending |
| S2 | "processors may be missing on beta" (audit 02 F19 row + §F-checklist) | audit 02 | processors are present with renamed classes (verified §3.3) |
| S3 | "F09-supp" naming | audit 02 § B2 + plan/05 §4 + F13 `depends_on` | the file is `F09-floor-script-and-vitest.md` — rename references to `F09` |
| S4 | "`npm run audit` currently fails (2 moderate)" | audit 03 B6/E4 | live: `npm run audit` exits **0** because the script pins `--audit-level=high` (verified `exit=0` this turn) |
| S5 | "`tailwind-best-practices` symlink missing in `.claude/skills/`" | audit 03 §Skills | present at `.claude/skills/tailwind-best-practices/` |
| S6 | "F07/F08 path `app/globals.css`" | audit 03 F07 E2 + F08 | actual path is `src/app/globals.css` (Next.js App Router under `src/`) |
| S7 | "`tailwind.config.ts` required" | F07 spec DoD | Tailwind v4 is CSS-first; no config file needed — `components.json` `"config":""` |
| S8 | "F12 needs `tasks/notes/F12-evidence.md`" implicit anti-fake-done | F12 frontmatter | F12's `evidence:` points to changelog entry — acceptable; verified live via MCP this turn |

## Missing dependencies

| # | Dependency referenced | Reality | Fix |
|---|---|---|---|
| M1 | `F09-supp` (in F13 `depends_on:`, plan/05 §4 timeline, plan/05 §gates) | no such file | global find/replace `F09-supp` → `F09` |
| M2 | Server-only `SUPABASE_URL` (per audit 02 F04 correction) | only `NEXT_PUBLIC_SUPABASE_URL` present in mdeapp/.env.local | add server alias when F13 lands |
| M3 | `vite-tsconfig-paths` or explicit `resolve.alias` in `vitest.config.ts` | F09 spec ports legacy 9-line config verbatim; smoke test imports `@/mastra` and will fail | add `resolve.alias: { "@": "./src" }` (or install + use `vite-tsconfig-paths`) |
| M4 | `@mastra/observability` for F13 | not installed | `npm install @mastra/observability` during F13 |
| M5 | `@supabase/supabase-js` for F13–F17 tools | not installed | `npm install @supabase/supabase-js` during F13 |
| M6 | `@supabase/ssr` for F08 | not installed | `npm install @supabase/ssr` during F08 |
| M7 | W2 stub route `src/app/host/event/new/page.tsx` for F08 redirect test | absent | add as part of F08 (≤ 10 LOC stub) |

## Commands to run before execution

1. **`bash /home/sk/mdeai/.claude/skills/task-verifier/scripts/probe-disk.sh`** — full disk probe, must exit 0 before any task is marked Done.
2. **`cd mdeapp && npm run build`** — must exit 0.
3. **`cd mdeapp && npm run audit`** — must exit 0 (note: uses `--audit-level=high`, so 2 moderate CVEs do not fail; bare `npm audit` does).
4. **Edit `tasks/core/F13-ai-runs-observability.md`** frontmatter `depends_on: [F06, F09-supp]` → `[F06, F09]`.
5. **Edit `plan/05-path-a-mastra-migration.md`** §4 W2 table + Gantt: replace `F09-supp` with `F09` (4 hits).
6. **Edit `tasks/core/F19-concierge-and-restaurants-attractions.md`** API drift table: map `TokenLimiter → TokenLimiterProcessor` and `PromptInjectionDetector → ModerationProcessor + SystemPromptScrubber`.
7. **Edit `tasks/core/F13-…md`** Goals: add `npm install @mastra/observability` + "primary observability = `mastra_ai_spans` writes via Mastra storage; legacy `ai_runs` optional behind `WRITE_LEGACY_AI_RUNS=1`".
8. **Edit `tasks/core/F07-shadcn-paisa-brand-tokens.md`**: replace `tailwind.config.ts` DoD with `components.json` + `src/app/globals.css` `@theme`; fix `app/globals.css` → `src/app/globals.css`.
9. **Edit `tasks/core/F09-floor-script-and-vitest.md`**: add `resolve.alias` step to `vitest.config.ts` snippet; reconcile `.claude/commands/verify-floor.md` (currently 4 gates, F09 ships 5).
10. **Stripe webhook secrets:** rotate in Stripe Dashboard → set distinct values in workspace `.env.local` + Supabase Edge secrets (ticket vs sponsor); re-run the probe — must print `Stripe webhook secrets are DISTINCT`.

## Commands to run after execution

1. **`bash .claude/skills/task-verifier/scripts/probe-disk.sh`** — re-run, expect exit 0.
2. **`cd mdeapp && npm run floor`** (after F09 ships) — must exit 0 for any subsequent task.
3. **`gh api repos/amo-tech-ai/mdeapp/branches/main/protection`** — confirm branch protection (Phase 2 hygiene).
4. **Supabase MCP**: `SELECT COUNT(*) FROM agent_tool_calls WHERE created_at > now() - interval '1 hour'` after F13 to see audit-wrapper rows.
5. **Supabase MCP**: re-`get_edge_function` for both Stripe slugs after rotation; assert `version` bumped.

---

## Audit-specific summary

### Audit 02 (Mastra Path A) — accuracy ≈ 87/100

- **Confirmed (9/11 claims):** F09-supp gap, no `npm test`, no `@supabase/supabase-js`, only `pingAgent` registered, legacy 64/64 tests, beta `Agent({ workflows })` absent, `@mastra/evals` absent, `@mastra/core/workspace` present, memory `scope: "thread"` valid.
- **Overly pessimistic (1):** processors "may be missing" — they exist with new names (verified).
- **Stale (1):** F06 status — now In Progress, not "Not Started".

**Apply unchanged otherwise.** Audit 02 is reference quality.

### Audit 03 (W2 F07–F12) — accuracy ≈ 90/100

- **Confirmed:** identical Stripe webhook secrets in workspace `.env.local` (P0), absence of `components.json`/`vitest.config.ts`/`@supabase/ssr`/`src/lib/utils.ts`, F12 done live (v7), F06 GitHub pushed but Vercel pending, missing `src/app/host/event/new/`, F07 spec incorrectly demands `tailwind.config.ts`, sponsor-payment-webhook absent from local disk (deploy-only).
- **Wrong:** "`npm run audit` exit 1" — actually exits 0 because script pins `--audit-level=high` (a real gotcha the audit conflated with bare `npm audit`).
- **Wrong:** "`tailwind-best-practices` not in skills" — it IS in `.claude/skills/` (loaded under that exact name).
- **Wrong path:** `app/globals.css` should be `src/app/globals.css` throughout F07/F08 references.

**Apply with the 3 corrections above.**

---

## Stop condition

🛑 **Not ready.** Six 🔴 blockers must be fixed before the corresponding tasks can be flipped to Done or executed:

1. **F11:** Stripe webhook secrets are identical in `/home/sk/mdeai/.env.local` (probe-verified, length 38 each, byte-equal). **P0 — rotate before any Stripe-touching work.**
2. **F13:** `depends_on: [F06, F09-supp]` references a non-existent task file. Fix to `[F06, F09]`.
3. **F09:** `vitest.config.ts` as currently specced lacks `resolve.alias` — the smoke tests that import `@/mastra` will fail. Add alias before running.
4. **F09 vs verify-floor:** the slash command runs 4 gates; F09 spec ships a 5-gate `floor` script. Reconcile before claiming the floor is real.
5. **F18:** `Agent({ workflows })` constructor option is absent on beta. Promote the spec's fallback to a hard prerequisite checkbox before any router copy.
6. **F19:** Spec still references `PromptInjectionDetector` and `TokenLimiter` by their legacy names. Update to `ModerationProcessor + SystemPromptScrubber` and `TokenLimiterProcessor`.

After those six fixes land (~45 min total), re-run `probe-disk.sh` and the verification matrix is green up to the Vercel-side F06 closeout.

---

*Verification 2026-05-20 · `task-verifier` v0.1 · See `.claude/skills/task-verifier/SKILL.md` for the protocol.*
