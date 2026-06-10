---
title: Forensic audit — F01–F08 implementation vs task specs
date: 2026-05-20
auditor: Senior software specialist / forensic analyst
scope:
  - /home/sk/mdeai/tasks/core/F01-bootstrap-mdeapp.md through F08-supabase-auth-login-page.md
  - /home/sk/mdeai/mdeapp/ (on-disk verification)
  - PRD alignment: plan/prd/08-delivery.md §50–51 (W1–W2)
tests_run:
  - mdeapp npm run build → exit 0
  - mdeapp npm run audit → 2 moderate (postcss via next)
  - mdeapp npm test → 4/4 pass (F09)
  - Shell/file probes (see per-task)
legend:
  dot_green: "🟢 Implemented & matches spec (allowing intended lifecycle drift)"
  dot_yellow: "🟡 Mostly done — doc drift, partial DoD, or spec contradiction"
  dot_red: "🔴 Not implemented or blocking failure"
  dot_grey: "⚪ Explicitly not started"
verdict:
  not_100_percent_any_task: true
  aggregate_execution_f01_f05: "~91%"
  aggregate_execution_f06_f08: "~18%"
  plan_will_succeed: "Yes after F06 Vercel closeout, then F07→F08 per dependencies"
---

# Implementation audit — Tasks F01–F08

## Executive summary

**None of F01–F08 are “100% correct” against a strict reading of every checkbox, hook, and wording** — mostly because: (1) task markdown **DoD boxes are still unchecked** despite `status: Done`; (2) **F05’s own spec contradicts F03/CLAUDE.md** on English vs Spanish UI; (3) **F06** diverged from the original private `mdeai/mdeai-app` target; (4) **F07–F08 are not started**.

**What is genuinely solid:** **F01–F04 + F02 core + F01b + wiring** — `mdeapp` builds, `pingAgent` + Gemini 3.5 Flash works, English shell, env keys present, CopilotKit pinned, no OpenAI SDK in app deps, `.env.local` not tracked.

**Dot legend:** 🟢 complete · 🟡 in progress / gaps · 🔴 failed or blocked · ⚪ not started

---

## Scorecard (all eight)

| ID | Task | Impl % | Dot | PRD W1–W2 alignment |
|----|------|-------:|:---:|---------------------|
| **F01** | Bootstrap mdeapp | **90%** | 🟡 | W1 foundation — met |
| **F01b** | Vulnerability triage | **93%** | 🟢 | Security posture — met (0 high via `audit` script) |
| **F02** | pingAgent + Gemini | **97%** | 🟢 | W1 — met |
| **F03** | Strip demos / shell | **88%** | 🟡 | W1 — met; minor test noise |
| **F04** | .env.local wiring | **96%** | 🟢 | W1 — met |
| **F05** | Boot + echo verify | **82%** | 🟡 | W1 — wiring OK; **spec text wrong** vs product |
| **F06** | Git + GitHub + Vercel | **55%** | 🟡 | W1 — **GitHub done, Vercel not** |
| **F07** | shadcn + Paisa | **0%** | ⚪ | W2 — not started |
| **F08** | Supabase Auth + /login | **0%** | ⚪ | W2 — not started |

**Aggregate (weighted F01→F08): ~62%** — dominated by ⚪⚪ plus partial F06.

**Will the dependency chain succeed?** **Yes** if: close **F06** (preview URL + env sync) → **F07** → **F08**. **F07 spec** should be updated for **Tailwind v4** (`tailwind.config` often empty — see [shadcn Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind/v4)).

---

## Tests executed (audit session)

| Check | Command / probe | Result |
|-------|------------------|--------|
| CopilotKit route exists | `test -f mdeapp/src/app/api/copilotkit/route.ts` | OK |
| package name | `node -p require('./package.json').name` | `mdeapp` |
| CK pin | `@copilotkit/react-core` | `1.55.2` |
| Docker clutter | none of `docker/`, `Dockerfile`, `fixtures` | Stripped |
| weatherAgent | not in `src/mastra/` | OK |
| `pingAgent` in layout | `grep agent=` | OK |
| `lang="en"` | layout | OK |
| OpenAI SDK in deps | grep `@ai-sdk/openai` in package.json | absent |
| F04 key count | 5 required + LOG_LEVEL | 5 + 1 |
| No VITE_ keys | `.env.local` | 0 |
| Build | `npm run build` | exit 0 |
| Audit | `npm run audit` | 2 moderate (postcss/next chain) |
| Vitest smoke | `npm test` | 4/4 |
| Vercel link | `.vercel/project.json` | **missing** |
| shadcn | `components.json` | **missing** |
| Supabase SSR | `@supabase/ssr` in package.json | **missing** |

---

## Per-task reports

### F01 — Bootstrap `mdeapp`

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **90%** | 🟡 |

**What matches:** Tree exists; `package.json` name `mdeapp`; CK `1.55.2`; docker/fixtures stripped; README mentions mdeai; runtime route present.

**Red flags:** **`.git/` now exists** and **`node_modules/` exists** — both are **correct after F05/F06** but fail the **literal** F01 T3/T5 “no .git / no node_modules” if someone runs old acceptance scripts without lifecycle context.

**Documentation:** §9 DoD checkboxes unchecked in file despite `Done`.

**Real-world analogy:** Buying a modular house kit (example repo), removing pallets (docker junk), renaming the deed to “mdeai” — you still assemble furniture (deps) later; the empty-lot checklist no longer applies after move-in.

**Corrections:** Mark DoD `[x]` in F01 frontmatter/evidence only; annotate T3/T5 as “historical gate; superseded after F06/F05.”

---

### F01b — Vulnerability triage

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **93%** | 🟢 |

**Matches:** `next@16.2.6`; `overrides` for `prismjs` + `langsmith`; `audit` script `npm audit --audit-level=high`; build passes; pins held per prior evidence.

**Gap:** **`npm audit` still lists 2 moderate** (PostCSS via Next). F01b goals allow “≤ 2 moderate” — **aligned**. F07 optionally demands `audit exit 0` without `--audit-level=high`; that **would fail** unless scoped consistently.

**Real-world analogy:** Vaccinating the crew (patch Next + overrides) — you accept mild side effects (moderate transitive) instead of ripping out the hull (audit fix --force).

**Corrections:** None blocking; reconcile F07 §9 “audit exit 0” with `--audit-level=high` wording.

---

### F02 — `pingAgent` + Gemini

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **97%** | 🟢 |

**Matches:** `pingAgent`; `google("gemini-3.5-flash")`; `scope: "thread"`; tools `export {};`; `MdeState` in types; `@ai-sdk/google` present; `@ai-sdk/openai` absent in **package.json** (verify `src/**` separately for imports — quick grep suggests clean).

**Micro-gaps:** DoD MCP line “gemini-api-docs-mcp” not re-run in this audit; hook T11/T12 not re-executed.

**Real-world analogy:** Swapping a rental car’s gasoline engine sticker for EV — wrong fuel line removed, right charging port (Gemini) installed.

---

### F03 — Strip demos + shell

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **88%** | 🟡 |

**Matches:** Demos **`weather.tsx` / `moon.tsx` / `proverbs.tsx`** deleted; `layout` **`pingAgent`**, **`lang="en"`**, mdeai metadata; `page.tsx` English sidebar + **`useCoAgent<MdeState>`** + **`name: "pingAgent"`**.

**Friction:** **`grep WeatherCard|MoonCard|ProverbsCard`** hits **comments** in `PlaceInfoCard` / `SavedItemsCard` / `ApprovalPanel` (amendment from task — acceptable as **no imports**, fails **literal** grep-only T4 if run naively).

**Cross-task conflict:** **F05 §2/§9** still says **“Spanish sidebar / hola reply”** while **F03 + CLAUDE.md Phase 1 = English**. Implemented UI is **English** — **F05 doc is wrong**.

**Real-world analogy:** Removing chain-restaurant decals from a food truck and painting your logo — comments on the receipt template still saying “formerly BigBrand” confuse the accountant if they grep for BigBrand.

**Corrections:** Update **F05** to “English UI; optionally test Spanish message input”; soften F03 grep to exclude comments or clarify “imports only”; tick DoD boxes.

---

### F04 — `.env.local` wiring

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **96%** | 🟢 |

**Matches:** `.env.local` present; **5 required keys + `LOG_LEVEL`**; **0× `VITE_`**; **0× bare `GEMINI_API_KEY=` / `GOOGLE_API_KEY=`** as standalone lines; `.env.example` tracked in git (`git ls-files`); `.env.local` **not** in git index.

**Real-world analogy:** Putting the venue’s wifi password on staff phones only — clipboard (`.env.example`) shows placeholders, not passwords.

---

### F05 — Boot verification

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **82%** | 🟡 |

**Matches structurally:** `npm install` has run; deps present from prior work; `npm run dev` pattern in package.json; build works; Gemini path exists via env + agent.

**Spec errors (not disk):** **Spanish UI requirement conflicts with F03/implemented page** (“Hi”, English copy). Prefer **functional** test: any message → short reply via Gemini &lt;5s **in user’s language** per agent instructions.

**Real-world analogy:** Acceptance said “kitchen speaks French to inspectors” but the restaurant is legally required to greet in English Phase 1 — the **fire marshal pass** is “meal gets cooked,” not the wrong language checklist.

**Corrections:** Rewrite F05 Goals/DoD to match CLAUDE.md Phase 1 English; keep “Gemini echoes” smoke.

---

### F06 — Git + GitHub + Vercel

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **55%** | 🟡 |

**Matches:** `.git`; `origin` → **`https://github.com/amo-tech-ai/mdeapp.git`**; commits exist; `.env.example` tracked; `.env.local` untracked.

**Misses vs original spec:** **Private repo `mdeai/mdeai-app`** → **PUBLIC `amo-tech-ai/mdeapp`** (documented decision in task §11/frontmatter — **acceptable** if product agreed). **`vercel link` incomplete** — **`.vercel/project.json` absent** → **no preview URL smoke**.

**Risk:** **`dist-leak-scan`** blocked pushes when `.next` caches held key-shaped bytes — procedural fix (clear cache / stop dev) already known.

**Real-world analogy:** Shipping product to the right harbor (GitHub) but the exhibition booth rental (Vercel) still unpaid — demos work on laptops only.

---

### F07 — shadcn + Paisa brand

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **0%** | ⚪ |

**Status:** Explicitly Not Started — no `components.json`, no `src/components/ui/`, no `lib/utils.ts` `cn`, cards still hex + Tailwind primitives only.

**Spec note:** **`tailwind.config.ts` + `app/globals.css`** paths are stale vs **Tailwind v4 + `src/app/globals.css`**; update task before executing.

---

### F08 — Supabase Auth + `/login`

| Metric | Score | Dot |
|--------|------:|:---:|
| Spec vs disk | **0%** | ⚪ |

**Status:** No `@supabase/ssr`, no `src/lib/supabase/*`, no `middleware.ts`, no `/login`.

**Blocked by:** **F06** (site URL for magic link) **+ F07** (shadcn form components per task — could relax to raw HTML if needed).

---

## Global blockers & fixes

| # | Issue | Severity | Fix |
|---|--------|----------|-----|
| B1 | **F06**: no Vercel project linkage | 🔴 prod preview | `vercel link`, push env vars, deploy |
| B2 | **F07/F08**: not started | 🔴 PRD W2 | Execute after F06 |
| B3 | **F05/F03**: Spanish vs English in docs | 🟡 confusion | Align F05 to English-only Phase 1 |
| B4 | **Task DoD** `[ ]` while `Done` | 🟡 hygiene | Tick or remove boxes |
| B5 | F03 strict grep hits comment tokens | 🟡 false positive | Narrow grep / document amendment |

---

## PRD linkage

| PRD expectation (§50–51) | Status |
|--------------------------|--------|
| W1 bootstrap + ping Gemini | 🟢 met |
| W1 Git + preview | 🟡 half (git yes, preview no) |
| W2 Supabase Auth + shadcn | 🔴 open (F07/F08) |
| Stripe / lead-capture hygiene | 🔴/`F11` separate | 

---

## Bottom line

- **Strict “100% correct” for F01–F08?** **No.**
- **Foundation (F01–F05) usable for daily dev?** **Yes (~90%).**
- **Week 2 path ready?** **No** until **F06** closes, then **F07 → F08**.

Use this alongside [`tasks/progres.md`](../progres.md) and [`tasks/audit/03-audit-f7-f12.md`](./03-audit-f7-f12.md).
