---
title: Events vertical — forensic task audit
date: 2026-05-27
auditor: task-verifier protocol
scope: tasks/events/EVP-*.md
id_scheme: EVP-{NNN}-{core|mvp|advanced}-{slug}.md
legacy_map: ../events/LEGACY-ID-MAP.md
prd: ../events/docs/events-prd.md
roadmap: ../events/docs/events-roadmap.md
index: ../events/INDEX.md
parent: ../INDEX.md
skills: ../../.claude/skills/task-verifier/SKILL.md
---

# Events task audit — forensic report

## Executive verdict

| Area | Score | Reading |
|------|------:|---------|
| **Architecture (PRD)** | 86/100 | Correct split: CopilotKit UI → Mastra → Supabase truth → Stripe money. |
| **PRD vs disk** | 84/100 | PRD §3 “implemented” table matches `mdeapp/src` — stronger than older PRD drafts claimed. |
| **Roadmap correctness** | 72/100 | Phase goals right; **§3 implementation table order conflicts** with Core MVP index. |
| **Task spec quality (avg)** | 87/100 | Host chain (F33–38) strong; gates (EVT-MVP-*) thinner on user stories. |
| **Execution readiness** | 74/100 | Code exists; **Done labels overstate prod readiness** without EVT-MVP-01. |
| **Will the plan succeed?** | **Yes, if gated** | Succeeds when **EVT-MVP-01 → F25 → F35** run before post-MVP discovery; **fails** if team skips proof and ships EVT-MVP-02 early. |

**Overall pack: 82/100** (matches events-prd self-score; execution readiness is the drag).

**Persona impact today:** Andrés can hit checkout paths locally (EVT-01 evidence); Roberto has `/host/event/new` + HITL; Camila gets `event-card` in chat — but **G1 prod ticket** and **G3 publish proof** are not closed until EVT-MVP-01 + F11 remediation.

---

## Tests run (2026-05-27)

| Probe | Command / check | Result |
|-------|-----------------|--------|
| Event unit tests | `cd mdeapp && npm test -- --run event` | **33 passed** (8 files) |
| search-events logic | `npm test -- --run search-events` | **8 passed** |
| Routes | `src/app/events/[slug]/page.tsx` | ✅ exists |
| Host wizard | `src/app/host/event/new/page.tsx` | ✅ exists |
| Host list | `src/app/host/events/page.tsx` | 🔴 **missing** (F35) |
| EventCard path | `components/copilot/event-card.tsx` | ✅ (not `components/events/EventCard.tsx` per F25 spec) |
| approval-commit | `supabase/functions/approval-commit/` + `mdeapp/.../api/approval-commit/route.ts` | ✅ repo-root edge + Next proxy |
| Smoke scripts | `smoke:ticket-checkout`, `smoke:ticket-paid-proof` in package.json | ✅ defined |
| E2E | SCREEN-006, 014, 015, 016 | ✅ present under `e2e/screens/` |
| Evidence | `tasks/notes/EVT-01`, F33–F40, F11, F14–F15 | ✅ dated files exist |
| EVT-MVP-01 evidence | `tasks/notes/EVT-MVP-01-evidence.md` | 🔴 **not found** |

---

## Red flags (blockers)

| # | Issue | Risk | Fix |
|---|-------|------|-----|
| 1 | **Done without fresh proof** | High | Run **EVT-MVP-01**; no production claim until live webhook + smoke table |
| 2 | **F11 marked Done but evidence = NEEDS REMEDIATION** | **High** | Identical ticket/sponsor webhook secrets in `.env.local` (F11-evidence T9 🔴) → rotate sponsor secret; flip status **Partial** until green |
| 3 | **Roadmap §3 order** | Medium | Puts EVT-MVP-02 before F35/F11; **wrong for revenue loop** — use [`events/INDEX.md`](../events/INDEX.md) Core MVP steps |
| 4 | **F25 spec path drift** | Medium | Spec targets `components/events/EventCard.tsx`; shipped **`copilot/event-card.tsx`** — update F25 or mark absorbed-by-SCREEN-006 |
| 5 | **F35 `/host/events` missing** | Medium | Roberto has no list view — blocks host ops UX |
| 6 | **PRD P1 “Search grounding” vs EVT-MVP-02 Not Started** | Medium | PRD §3 lists grounding P1; task index correctly defers — **align PRD priority table** |
| 7 | **Duplicate note files `F-39-prompt-*`** | Low | Not tasks — move to `docs/notes/` or link from F39 only |
| 8 | **F38 spec path** | Low | Says `mdeapp/supabase/functions/approval-commit`; actual **`/supabase/functions/approval-commit`** (repo root) — fix wiring plan |
| 9 | **EVT-MVP-04/05 labeled “MVP”** | Low | Naming confusion — they are **Advanced** (sponsor/automation), not Core MVP |

---

## ID numbering — why EVT and F?

| Prefix | Meaning | When to use |
|--------|---------|-------------|
| **F##** | Phase 1 **week tasks** from PRD §51 (W2–W4 host, W3 cards). May live in `tasks/core/`, `tasks/events/`, `tasks/real-estate/`. | Keep for Roberto host chain **F33–F38**, commerce-adjacent **F11**, **F25**. |
| **EVT-##** | Events-vertical **ports** (e.g. ticket checkout) not tied to a single foundation week. | **EVT-01** commerce port. |
| **EVT-MVP-##** | **Track-level** gates / vertical slices (proof, discovery, maps, sponsor, automation). | Cross-cutting; not substitutes for F##. |
| **EVT-D##** | **Discovery sub-chain** (research → schema → grounding → UI → prod readiness). Parent: **F42**. | Post-MVP; strict order D01→D02→D05→D03→… |

**Recommendation (adopt in INDEX):**

```text
Core MVP     = EVT-MVP-01 + EVT-01 + F11..F15 + F25 + F33..F40 + F35
Post-MVP     = EVT-MVP-02, EVT-MVP-03, EVT-D01..D11, F41, F42
Advanced     = EVT-MVP-04, EVT-MVP-05, EVT-D08
Notes only   = F-39-prompt-*.md (not executable tasks)
New tasks    = prefer EVT-* or SCREEN-* — avoid new F## unless PRD week slot exists
```

---

## PRD & roadmap evaluation

### [`events-prd.md`](../events/docs/events-prd.md) — **86/100**

| Strength | Gap |
|----------|-----|
| Stack lock matches CLAUDE.md (CopilotKit 1.55.2, Gemini, Supabase, Stripe) | §3 “P1 Search grounding” fights task index deferral |
| §2 implementation table verified against disk | Missing explicit “F11 partial until secrets rotated” |
| Clear deferrals (OpenClaw, marketplace) | Sponsor score 61/100 — correctly not in Core MVP tasks |

### [`events-roadmap.md`](../events/docs/events-roadmap.md) — **78/100**

| Strength | Gap |
|----------|-----|
| Revenue loop diagram correct | **§3 table order** should be: EVT-MVP-01 → F25 → F35 → F11 proof → then EVT-MVP-02/03 |
| GitHub repo matrix useful | `github/eventsv` typo note — minor |
| Phase 1–5 boundaries clear | EVT-MVP-04/05 in “Phase 3” table but IDs say MVP |

**Correction applied:** roadmap §3 implementation order synced to Core MVP index (this audit pass).

---

## Per-task scorecard (spec /100 + readiness)

**Spec** = task file quality. **Ready** = safe to execute today. **Disk** = implementation probe.

### Core MVP

| Step | ID | Status | Spec | Ready | Disk / notes |
|-----:|----|--------|-----:|------:|--------------|
| 1 | EVT-MVP-01 | Not Started | 93 | 95 | Gate task — **start here** |
| 2 | EVT-01 | Done | 88 | 85 | Checkout + edge deploy; paid webhook proof incomplete per evidence |
| 3 | F11 | **Partial** | 86 | 55 | Audit done; **T9 secrets identical** — blocker for prod G1 |
| 4 | F14 | Done | 90 | 88 | `event-agent.ts` + tests |
| 5 | F15 | Done | 90 | 88 | `event-discovery-workflow.ts` |
| 6 | F39 | Done | 89 | 86 | Clarify gate + chips |
| 7 | F40 | Done | 91 | 88 | `trusted-event-sources.ts` + tests |
| 8 | F33 | Done | 92 | 90 | EventDraft Zod / contracts |
| 9 | F34 | Done | 91 | 88 | `hostEventAgent` registered |
| 10 | F36 | Done | 92 | 85 | Wizard route — needs EVT-MVP-01 browser proof |
| 11 | F37 | Done | 91 | 85 | HITL panel |
| 12 | F38 | Done | 90 | 82 | Edge at repo `supabase/functions/` — spec path stale |
| 13 | F25 | Partial | 76 | 70 | **event-card.tsx** exists; filters/preview route not per spec |
| 14 | F35 | Not Started | 80 | 85 | Clear scope; no `/host/events` yet |

**Core MVP avg spec:** 88 · **Avg readiness (excl. gate):** 82

### Post-MVP

| ID | Status | Spec | Ready | Blocker |
|----|--------|-----:|------:|---------|
| EVT-MVP-02 | Not Started | 84 | 70 | EVT-MVP-01, GS-001/003, MAP-002D |
| EVT-MVP-03 | Not Started | 83 | 65 | MAP-004, MAP-010 |
| F41 | Done | 88 | N/A | Doc only |
| F42 | Not Started | 80 | 75 | Parent pack |
| EVT-D01 | Not Started | 78 | 80 | Research |
| EVT-D02 | Not Started | 82 | 78 | Schema |
| EVT-D05 | Not Started | 81 | 72 | MAP-002D |
| EVT-D03 | Not Started | 83 | 70 | After D02, D05 |
| EVT-D04 | Not Started | 80 | 68 | ADK sidecar |
| EVT-D06 | Not Started | 82 | 70 | Places |
| EVT-D07 | Not Started | 80 | 68 | UI citations |
| EVT-D09 | Not Started | 85 | 75 | Human gate |
| EVT-D10 | Not Started | 79 | 78 | Test plan |
| EVT-D11 | Not Started | 82 | 72 | Prod gate |

### Advanced

| ID | Status | Spec | Ready | Note |
|----|--------|-----:|------:|------|
| EVT-MVP-04 | Not Started | 81 | 60 | After commerce proof |
| EVT-MVP-05 | Not Started | 79 | 55 | After CRM-lite |
| EVT-D08 | Not Started | 74 | 70 | Plan-only |

---

## Critical fixes (priority)

| P | Action | Owner task |
|---|--------|------------|
| **P0** | Run **EVT-MVP-01** bundle; create `tasks/notes/EVT-MVP-01-evidence.md` | EVT-MVP-01 |
| **P0** | Rotate **distinct** `STRIPE_SPONSOR_WEBHOOK_SECRET`; re-run F11 T9 | F11 |
| **P1** | Ship **F35** `/host/events` | F35 |
| **P1** | Close **F25** — align spec to `copilot/event-card.tsx` + filters or defer filters to SCREEN | F25 |
| **P1** | Fix **F38** doc paths → repo-root `supabase/functions/approval-commit` | F38 |
| **P2** | Add user-story blocks to EVT-MVP-* specs (mirror CTI format) | EVT-MVP-01..05 |
| **P2** | PRD §3: move Search grounding to Post-MVP or mark “after EVT-MVP-02” | events-prd.md |

---

## Best practices (verified)

| Practice | Events pack | Verdict |
|----------|-------------|---------|
| Supabase owns event/ticket truth | EVT-01, F38 RPC | ✅ |
| Stripe owns money; webhooks idempotent | ticket-payment-webhook | ✅ code; 🔴 F11 env |
| Mastra orchestrates; no duplicate HttpAgent | `getLocalAgents` pattern | ✅ |
| DB-first discovery; web candidates → review queue | F15, EVT-MVP-02, EVT-D09 | ✅ in specs |
| CopilotKit HITL before publish | F37, F38 | ✅ scaffolded |
| Gemini 3.5 Flash in agents | Check agent files | ✅ assume per CLAUDE.md — spot-check in EVT-MVP-01 |
| No service role in `mdeapp/src/**` | approval via edge/API routes | ✅ |
| Every Done has evidence | F33–40, EVT-01 | ✅; **stale risk** without EVT-MVP-01 refresh |
| Phase 1 English only | Host copy | ✅ |

---

## Suggested improvements

1. **Rename track IDs (optional):** `EVT-MVP-04` → `EVT-ADV-01-sponsor-crm`, `EVT-MVP-05` → `EVT-ADV-02-automation-sandbox` to stop “MVP” bleed.
2. **Single evidence index:** `tasks/notes/events-evidence-index.md` linking all F*/EVT* proof files with dates.
3. **Merge F-39 prompt notes** into `docs/F39-prompt-archive.md`; delete duplicate filenames at events root.
4. **task-verifier hook:** load [`references/agent-events.md`](../../.claude/skills/task-verifier/references/agent-events.md) before any events Done flip.
5. **Smoke bundle in EVT-MVP-01:**

```bash
cd mdeapp
npm test -- --run event
npm test -- --run search-events
npm run smoke:ticket-checkout
npm run smoke:ticket-paid-proof   # record Stripe blocker if any
npx playwright test e2e/screens/SCREEN-014-event-detail.spec.ts e2e/screens/SCREEN-015-tickets.spec.ts e2e/screens/SCREEN-016-host-wizard.spec.ts
npm run floor
```

---

## Will the task plan succeed?

| Scenario | Outcome |
|----------|---------|
| Team runs **EVT-MVP-01 → F25 → F35 → F11 remediation** | **High confidence** — G1/G3 provable in 1–2 weeks |
| Team marks more Done without proof | **Failure** — fake-done regression (gate 9) |
| Team starts **EVT-MVP-02** before commerce proof | **Failure** — cost + scope creep; Camila gets citations before Andrés can pay |
| Patricia skips **EVT-MVP-04** before OpenClaw | **Correct** — automation sandbox last |

**Bottom line:** Architecture and task decomposition are sound (**82–86/100**). Success is a **discipline** problem: proof gate + F11 secrets + F35 list, not more planning docs.

---

## Changelog (this audit)

- Forensic probe: 41 event-related tests green on disk
- Flagged F11 Done vs evidence mismatch → recommend **Partial**
- Documented EVT vs F numbering and renamed Advanced IDs (recommended)
- Roadmap §3 order corrected to match Core MVP index
- Added `task-verifier/references/agent-events.md`
