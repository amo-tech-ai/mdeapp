---
title: Forensic audit — Week 2 tasks (F07–F12)
date: 2026-05-20
auditor: Senior software specialist / forensic auditor
scope:
  - /home/sk/mdeai/tasks/core/F07–F12.md
  - /home/sk/mdeai/tasks/INDEX.md
  - /home/sk/mdeai/mdeapp/ (on-disk execution)
  - /home/sk/mdeai/index-skills.md (skills grading)
plan_refs:
  - /home/sk/mdeai/plan/prd/08-delivery.md §50–51 (W2)
  - /home/sk/mdeai/plan/prd/01-foundation.md §3 (test count ≥ 90)
  - /home/sk/mdeai/plan/data/04-checklist.md (Supabase 87/100)
verified_sources:
  - Supabase MCP: auth.users=9, auth.sessions=45, chat-lead-capture v7 verify_jwt=false
  - Supabase MCP: ticket-payment-webhook v27, sponsor-payment-webhook v19 (deployed source)
  - mdeapp: npm run build exit 0; npm audit 2 moderate; no vitest/floor/shadcn
  - shadcn/ui official: Tailwind v4 → empty `tailwind.config` in components.json
  - index-skills.md: Phase 1 pack (mde-supabase, testing, mde-stripe, shadcn via vercel plugin)
live_tests:
  - "cd mdeapp && npm run build → exit 0"
  - "cd mdeapp && npm run audit → exit 1 (2 moderate CVEs)"
  - "npm test → Missing script"
  - "WEBHOOK_SECRETS_IDENTICAL in workspace .env.local (names only in report)"
verdict:
  task_specs_aggregate: 86/100
  execution_vs_specs: 14/100
  will_plan_succeed: "Yes — after F11 secret remediation, F06 Vercel closeout, F09 before F13, and F07 Tailwind v4 doc fixes"
  not_100_percent_correct: true
blockers: 9
---

# Forensic audit — Week 2 tasks (F07–F12)

> **TL;DR.** Task **specs are strong (~86/100)** and align with PRD W2 (auth, design system, test floor, freeze docs, Stripe audit). **Execution is ~14/100** — only **F12** is done on live Supabase; **F07–F11 are not started** on disk; **F06 is half-done** (GitHub push to `amo-tech-ai/mdeapp`, no Vercel per spec). **🔴 P0:** workspace `.env.local` has **identical** `STRIPE_WEBHOOK_SECRET` and `STRIPE_SPONSOR_WEBHOOK_SECRET` values — F11 must treat as **crossed until Stripe Dashboard proves two distinct signing secrets**. **Not 100% correct** — nine blockers and per-task corrections below.

---

## Status dot legend

| Dot | Meaning |
|-----|---------|
| 🟢 | Spec or execution meets bar |
| 🟡 | Fix before marking Done / before dependent work |
| 🔴 | Blocker — will break chain or revenue if ignored |
| ⚪ | N/A — deferred or already shipped |

---

## Executive scorecard

| ID | Title | Spec % | Exec % | INDEX | Disk / live | Dot | Will achieve PRD goal? |
|----|-------|-------:|-------:|-------|-------------|:---:|------------------------|
| **F07** | shadcn + Paisa tokens | 78 | 0 | Not Started | No shadcn, hex in cards | 🟡 | Yes — after Tailwind v4 doc fixes |
| **F08** | Supabase Auth + `/login` | 88 | 0 | Not Started | No `@supabase/*` in mdeapp | 🟡 | Yes — SSR pattern is correct |
| **F09** | `floor` + Vitest | 85 | 0 | Not Started | No test/floor/lint scripts | 🔴 | Yes — blocks F13+ ports |
| **F10** | FREEZE + ARCHITECTURE.md | 90 | 0 | Not Started | No FREEZE.md / docs | 🟢 | Yes — doc-only |
| **F11** | Stripe webhook audit | 82 | 5 | Not Started | Live fns OK; **env crossed** | 🔴 | **At risk** until secrets fixed |
| **F12** | chat-lead-capture JWT | 95 | 95 | Done | v7, verify_jwt false | 🟢 | **Done** — PRD goal 2 unblocked |
| **F06** | Git + Vercel (dep) | 75 | 45 | Not Started | GitHub ✅, Vercel ❌ | 🟡 | Partial — blocks F07–F11 “done” chain |

**Aggregate:** Specs **86/100** · Execution **14/100** · Gap **72 pts** (F12 + partial F06 only).

**Will the W2 plan succeed?** **Yes (🟢)** for PRD §51 W2 themes *if* you run **F11 remediation first**, then **F09 → F10** (parallel), then **F07 → F08**, and **close F06 (Vercel)**. **No (🔴)** for revenue-safe Stripe cutover while webhook signing secrets share one value in workspace env.

**Are steps, commands, dependencies correct?** **~84%** — Supabase SSR, Vitest port, shadcn component list, and MCP SQL checks are sound. **Wrong or stale:** F07 `tailwind.config.ts` DoD (Tailwind v4 is CSS-first); F07 skill refs `tailwind-best-practices` / `vercel:shadcn` not in repo skills index; F11 local `grep` paths for sponsor fn; F11 T4 shell logic; F09 vs `.claude/commands/verify-floor.md` gate mismatch; INDEX still says F06 Not Started.

---

## Skills index alignment (`index-skills.md`)

| F-task skills | In Phase 1 pack? | Audit note |
|---------------|------------------|------------|
| F07: `tailwind-best-practices`, `react-best-practices`, `vercel:shadcn` | Partial | `testing`/`mde-supabase` 🟢; **no `tailwind-best-practices` symlink** in `.claude/skills/` — use **Vercel plugin shadcn** + [ui.shadcn.com/docs/tailwind/v4](https://ui.shadcn.com/docs/tailwind/v4) |
| F08: `mde-supabase`, `supabase` | 🟢 | Correct |
| F09: `testing`, `mde-task-lifecycle` | 🟢 | Correct |
| F10: `mermaid-diagrams`, `mde-task-lifecycle` | 🟢 | Correct |
| F11: `mde-stripe`, `mde-supabase`, `supabase-edge-functions` | 🟢 | Add **Stripe plugin** `stripe-best-practices` for dashboard steps |
| F12: `mde-supabase`, `supabase-edge-functions` | 🟢 | Executed correctly via MCP deploy |

---

## Live verification (MCP + shell — 2026-05-20)

| Check | Result | Dot |
|-------|--------|:---:|
| `auth.users` count | **9** | 🟢 |
| `auth.sessions` count | **45** | 🟢 |
| `chat-lead-capture` | **v7**, `verify_jwt: false` | 🟢 |
| `ticket-payment-webhook` | **v27**, `verify_jwt: false` | 🟢 |
| `sponsor-payment-webhook` | **v19**, `verify_jwt: false`, uses `STRIPE_SPONSOR_WEBHOOK_SECRET` in deployed source | 🟢 |
| Ticket fn idempotency | `idempotency_keys` in `/home/sk/mde/supabase/functions/ticket-payment-webhook/` | 🟢 |
| Sponsor fn idempotency | `idempotency_keys` in deployed sponsor source (MCP) | 🟢 |
| mdeapp `npm run build` | exit **0** | 🟢 |
| mdeapp `npm run audit` | **2 moderate**, exit **1** | 🟡 |
| mdeapp `npm test` | **Missing script** | 🔴 |
| shadcn / `components.json` | **absent** | 🔴 |
| `@supabase/ssr` in mdeapp | **not installed** | 🔴 |
| Workspace webhook secrets | **`WEBHOOK_SECRETS_IDENTICAL`** (awk compare, values not logged) | 🔴 |
| Legacy sponsor source on disk | `/home/sk/mde/supabase/functions/sponsor-payment-webhook/` **missing** (deploy-only) | 🟡 |
| `mdeai/supabase/functions/chat-lead-capture/` | **present** (source of truth for redeploy) | 🟢 |

---

## Global blockers (fix before calling W2 “done”)

| # | Blocker | Impact | Fix |
|---|---------|--------|-----|
| **B1** | **Stripe webhook secrets identical in `.env.local`** | Sponsor events may verify against ticket secret (or vice versa) — F11’s core risk **materialized in workspace** | Stripe Dashboard → two endpoints → two signing secrets → update Supabase function secrets + `.env.local`; document in `F11-evidence.md` |
| **B2** | **F09 not executed** — no Vitest / `floor` | F13–F20 and INDEX `depends_on: F09-supp` blocked | Ship F09; rename or add `F09-supp.md` alias |
| **B3** | **F06 incomplete** — no Vercel preview | W2 “shareable preview” PRD goal unmet; F07–F11 depend on F06 in specs | `vercel link` + env push + preview smoke |
| **B4** | **INDEX vs reality** — F06 Not Started, F01–F05 Done but F06 git actually pushed | Agents pick wrong next task | Sync INDEX: F06 → In Progress (git done, Vercel pending) |
| **B5** | **F07 DoD vs Tailwind v4** — requires `tailwind.config.ts` | False failures on a correct v4 setup | DoD: `components.json` with `"config": ""` + tokens in `globals.css` `@theme` |
| **B6** | **F07 DoD: `npm run audit` exit 0** | Currently **fails** (2 moderate) | Triage CVEs or change DoD to `audit-level=high` with documented exceptions |
| **B7** | **F11 automated greps** target missing local sponsor tree | T2/T4/T7 fail in CI | Use Supabase MCP `get_edge_function` or mirror fn under `mdeai/supabase/functions/` |
| **B8** | **F08 Tm6** needs `/host/event/new` | Route does not exist until W3 | Add W2 **placeholder** route + middleware redirect test |
| **B9** | **`verify-floor.md` ≠ F09 `floor` script** | Two different “floor” definitions | Unify: 5-gate `npm run floor` **or** update command doc |

---

## Per-task audit

### F07 — shadcn/ui init + Paisa brand tokens

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **78%** | 🟡 |
| Execution | **0%** | 🔴 |
| PRD alignment (§20 generative UI) | **90%** | 🟢 |

**What’s right**

- Correctly targets the three amended cards that **exist** on disk (`PlaceInfoCard`, `SavedItemsCard`, `ApprovalPanel`).
- Paisa palette matches product (teal `#0f766e`, gold accent) and PRD §20 card composition model.
- Pre-flight Tailwind v4 check matches `mdeapp/package.json` (`tailwindcss@^4`).

**Errors / red flags**

| # | Issue | Severity |
|---|--------|----------|
| E1 | DoD requires **`tailwind.config.ts`** — Tailwind v4 + shadcn use **CSS `@theme`**; official docs: leave `tailwind.config` **empty** in `components.json` | 🔴 spec |
| E2 | Workflow step 4 path `app/globals.css` — actual path is **`src/app/globals.css`** | 🟡 |
| E3 | Skills `tailwind-best-practices`, `vercel:shadcn` — **not** in `index-skills.md` native list; use Vercel plugin **shadcn** skill | 🟡 |
| E4 | DoD **`npm run audit` exit 0** — live run has **2 moderate**, exit 1 | 🟡 |
| E5 | T7 build grep `'Generating'` — fragile; prefer `exit 0` only | 🟡 |
| E6 | Cards still use **inline hex** (`themeColor = "#0f766e"`) — T5 would fail today | 🟡 expected |

**Real-world example**

> You’re rebranding a food-delivery app: F07 is “install Material-style buttons and brand colors before building menu cards.” Skipping it means every W3 screen invents its own button styles — 2× UI dev time and inconsistent trust on checkout.

**Corrections (to reach ~95% spec)**

1. Replace DoD bullet `tailwind.config.ts` → **`components.json` + `src/app/globals.css` `@theme` / `:root` tokens**.
2. Fix all paths to `src/app/`, `src/components/`, `src/lib/utils.ts`.
3. Add `vitest` path alias in `vitest.config.ts` when F09 lands (F07 T8 chrome smoke can stay manual).
4. Change audit DoD to match F01b: `npm run audit` **or** documented waiver file.
5. Map skill to **`shadcn` (Vercel plugin)** + `react-best-practices` from index.

**Will it succeed?** **Yes** — if implementer follows [shadcn Tailwind v4](https://ui.shadcn.com/docs/tailwind/v4), not v3 config file patterns.

---

### F08 — Supabase Auth + `/login` page

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **88%** | 🟢 |
| Execution | **0%** | 🔴 |
| PRD alignment (W2 auth, §14) | **92%** | 🟢 |

**What’s right**

- **`@supabase/ssr`** (not deprecated auth-helpers) matches [Supabase Next.js SSR guide](https://supabase.com/docs/guides/auth/server-side/nextjs).
- Middleware matcher **excludes** `/api/copilotkit` — chat keeps working unauthenticated in W2.
- Pre-flight SQL `auth.users = 9` — **verified live**.
- Service-role boundary + hook alignment — correct.

**Errors / red flags**

| # | Issue | Severity |
|---|--------|----------|
| E1 | **`signInWithOtp`** vs PKCE **`exchangeCodeForSession`** — ensure Site URL / redirect URLs include `mdeapp` Vercel preview hosts | 🟡 |
| E2 | Tm6 **`/host/event/new`** — route not in mdeapp yet | 🟡 |
| E3 | F08 depends on **F06 + F07** — F06 Vercel URL needed for `emailRedirectTo` | 🟡 |
| E4 | T1 test `require('mdeapp/package.json')` — invalid path; use `node -p` from `cd mdeapp` | 🟡 |
| E5 | “Session ≤ 7 days” — confirm Supabase Auth settings in dashboard (not in task) | 🟡 |

**Real-world example**

> Airbnb hosts must log in before listing a home. F08 is the deadbolt: magic link email → cookie session → Roberto can open `/host/event/new` in W3 without rebuilding auth.

**Corrections**

1. Add dashboard checklist: Auth → URL Configuration → redirect allowlist for localhost + Vercel `*.vercel.app`.
2. Add W2 stub: `src/app/host/event/new/page.tsx` (“Coming W3”) for redirect test.
3. Fix automated test commands to run from `mdeapp/`.
4. Document `NEXT_PUBLIC_SITE_URL` env for magic links (Vercel).

**Will it succeed?** **Yes** — standard pattern; cookie `getAll`/`setAll` must be copy-paste from docs (task already warns).

---

### F09 — `floor` npm script + Vitest

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **85%** | 🟡 |
| Execution | **0%** | 🔴 |
| PRD alignment (goal 6: tests → 90) | **95%** | 🟢 |

**What’s right**

- Vitest port from `my-mastra-app` (9-line config) is proven (**64/64** tests there).
- Smoke tests match real exports: `pingAgent.id === "ping-agent"`, `MdeState` Zod schema.
- `floor` = lint + typecheck + build + test + audit — correct quality gate philosophy.

**Errors / red flags**

| # | Issue | Severity |
|---|--------|----------|
| E1 | **`verify-floor.md`** has **4 gates** (no lint, no test) — conflicts with F09 §2 | 🔴 |
| E2 | `vitest.config.ts` needs **`resolve.alias` for `@/*`** or tests fail on `@/mastra` imports | 🔴 |
| E3 | `floor` will **fail today** on audit (2 moderate) unless triaged first | 🟡 |
| E4 | INDEX / F13 reference **`F09-supp`** — no task file; this **is** F09 | 🟡 |
| E5 | Including **`npm run build` in floor** — slow (~10s+); acceptable but document for hooks | 🟡 |

**Real-world example**

> CI at Stripe runs “lint + unit tests + typecheck” before merge. F09 is that button on your laptop: one command before commit so you don’t discover a broken build on Vercel.

**Corrections**

1. Update `verify-floor.md` to call `npm run floor` or list same 5 steps.
2. Add to `vitest.config.ts`:
   ```ts
   resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
   ```
3. Add `F09-supp.md` symlink → `F09-...md` **or** fix F13 `depends_on: [F09]`.
4. Run F01b triage before first green `floor`.

**Will it succeed?** **Yes** — smoke tests are well-scoped; critical for Path A ports.

---

### F10 — Legacy freeze + `docs/ARCHITECTURE.md`

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **90%** | 🟢 |
| Execution | **0%** | 🟡 |
| PRD alignment (§1 hard-freeze) | **95%** | 🟢 |

**What’s right**

- FREEZE.md + hook `guard-sensitive-paths.mjs` — coherent enforcement story.
- ARCHITECTURE.md cap **&lt; 200 lines** — anti-bloat.
- Mermaid + “Where do I add X?” matrix — excellent onboarding.
- Notes `MDEAI_ALLOW_LEGACY_EDIT=1` — accurate.

**Errors / red flags**

| # | Issue | Severity |
|---|--------|----------|
| E1 | Freeze date **2026-05-26** — confirm with user (W1 end); today W2 start | 🟡 |
| E2 | Commit scope says “both files” but includes **CLAUDE.md** + README — three repos paths | 🟡 |
| E3 | FREEZE under `/home/sk/mde/` — **not in mdeapp git**; F10 DoD “committed to mdeapp git” only applies to ARCHITECTURE | 🟡 |
| E4 | Tm1 references non-existent MCP `mcp__b357a9fa__validate_and_render_mermaid` | 🟡 |

**Real-world example**

> After an acquisition, the old codebase gets a “no new features” wiki page. F10 is that sign — stops engineers from fixing bugs in the wrong repo.

**Corrections**

1. Split DoD: FREEZE.md (legacy, one-time env bypass) vs `mdeapp/docs/ARCHITECTURE.md` (git commit).
2. Use `mermaid-diagrams` skill or GitHub preview for Tm1.
3. Link ARCHITECTURE to live stack: CopilotKit 1.55.2, Mastra beta, project `zkwcbyxiwklihegjhuql`.

**Will it succeed?** **Yes** — documentation-only, low risk.

---

### F11 — P0 Stripe webhook secret audit

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **82%** | 🟡 |
| Execution | **5%** | 🔴 |
| PRD alignment (§49 Stripe drift risk) | **70%** | 🔴 |

**What’s right**

- Audit-only scope — appropriate.
- Live deployed functions use **correct env var names** (`STRIPE_WEBHOOK_SECRET` vs `STRIPE_SPONSOR_WEBHOOK_SECRET`).
- Both use **`idempotency_keys`** (verified ticket on disk, sponsor via MCP).
- Both `verify_jwt: false` — correct for Stripe HMAC auth.
- Evidence file requirements — good for W9 cutover.

**Errors / red flags**

| # | Issue | Severity |
|---|--------|----------|
| **E1** | **Workspace `.env.local`: ticket and sponsor webhook secrets are IDENTICAL** | 🔴 **P0** |
| E2 | Local path `/home/sk/mde/supabase/functions/sponsor-payment-webhook/` **missing** — T1–T4 greps fail | 🔴 |
| E3 | T4 shell: `grep STRIPE_WEBHOOK_SECRET` on sponsor file matches **`STRIPE_SPONSOR_WEBHOOK_SECRET`** substring | 🔴 |
| E4 | Tm3 ticket events list may not match **live** handler (verify against deployed v27 source) | 🟡 |
| E5 | `STRIPE_WEBHOOK_DESTINATION_ID` — task mentions but no mapping row in inventory table | 🟡 |
| E6 | **`tasks/notes/F11-evidence.md`** — not created | 🟡 |

**Real-world example**

> Two store registers sharing one PIN: anyone with sponsor receipts could “sign” ticket refunds. Separate webhook signing secrets are separate PINs — F11 proves they’re not shared.

**Corrections**

1. **Immediate:** Rotate secrets in Stripe; set distinct values in Supabase Edge secrets; re-run awk identity check (must print `WEBHOOK_SECRETS_DISTINCT`).
2. Replace local grep tests with **MCP `get_edge_function`** for both slugs (already works).
3. Fix T4: `grep -w STRIPE_WEBHOOK_SECRET` or exclude `SPONSOR_`.
4. Add row for **deployed secret parity** (Supabase dashboard secrets vs Stripe — names only in evidence).
5. Complete manual Tm1–Tm4 screenshots.

**Will it succeed?** **Only after E1 remediated** — code paths are isolated by variable name, but **identical secret values negate isolation**.

---

### F12 — chat-lead-capture verify_jwt fix

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec correctness | **95%** | 🟢 |
| Execution | **95%** | 🟢 |
| PRD alignment (goal 2, lead funnel) | **98%** | 🟢 |

**What’s right**

- **Done** on live: v7, `verify_jwt: false`.
- Source mirrored in `mdeai/supabase/functions/chat-lead-capture/`.
- Rate limit via `check_rate_limit` RPC — matches security model.
- Changelog + freeze list updated (per task).

**Residual risks**

| # | Issue | Severity |
|---|--------|----------|
| E1 | Regression guard in F12 §10 — not wired to F09 `floor` yet | 🟡 |
| E2 | T4 rate-limit smoke — destructive in prod; mark “staging only” | 🟡 |
| E3 | CORS in deployed `_shared/http.ts` includes localhost:3001 — good for mdeapp dev | 🟢 |

**Real-world example**

> A restaurant comment card blocked anonymous pens — no feedback. F12 removed the wrong lock so tourists can submit “looking for apartment in Laureles” without creating an account first.

**Corrections**

1. Add Vitest or shell smoke in F09: HTTP 200 anon POST with mocked URL (optional).
2. Mark task Done in INDEX — **already Done** ✅

**Will it succeed?** **Already succeeded** — maintain via freeze list + redeploy checklist.

---

## F06 dependency note (not in scope but blocks INDEX)

| Spec | Actual |
|------|--------|
| `mdeai/mdeai-app` private repo | **`amo-tech-ai/mdeapp` public**, pushed |
| Vercel preview + env | **Not verified** |
| INDEX status | **Not Started** — should be **In Progress** |

---

## Recommended execution order (W2)

```text
F12 ✅ → F11 (remediate secrets + evidence) → F09 (Vitest/floor)
    → F10 (docs, parallel) → F06 (Vercel) → F07 (shadcn) → F08 (auth)
```

**Critical path for PRD W3:** F06 Vercel URL → F07 UI → F08 auth → F09 tests → F13 ports.

---

## Grading summary

| Task | Spec % | Exec % | Combined | Dot |
|------|-------:|-------:|----------|:---:|
| F07 | 78 | 0 | 39 | 🟡 |
| F08 | 88 | 0 | 44 | 🟡 |
| F09 | 85 | 0 | 43 | 🔴 |
| F10 | 90 | 0 | 45 | 🟢 |
| F11 | 82 | 5 | 44 | 🔴 |
| F12 | 95 | 95 | 95 | 🟢 |
| F06 (dep) | 75 | 45 | 60 | 🟡 |
| **Aggregate** | **86** | **14** | **50** | 🟡 |

**“100% correct”?** **No.** Specs need Tailwind v4, F11 secret remediation, F09/floor unification, and INDEX/F06 truth. **Execution** is almost entirely ahead.

---

## Test log (this audit)

| Test | Result |
|------|--------|
| `npm run build` (mdeapp) | ✅ pass |
| `npm run audit` (mdeapp) | ❌ 2 moderate |
| `npm test` | ❌ missing script |
| Supabase `auth.users` | ✅ 9 |
| `chat-lead-capture` JWT | ✅ false @ v7 |
| Webhook secret distinctness (workspace) | ❌ **identical** |
| shadcn components | ❌ not initialized |
| Sponsor fn local grep | ❌ path missing |

---

## Sources

- [shadcn/ui — Tailwind v4](https://ui.shadcn.com/docs/tailwind/v4)
- [shadcn/ui — Next.js installation](https://ui.shadcn.com/docs/installation/next)
- [Supabase — Auth SSR for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- `/home/sk/mdeai/index-skills.md`
- `/home/sk/mdeai/plan/prd/08-delivery.md` §49–51
- Supabase MCP live queries (2026-05-20)
