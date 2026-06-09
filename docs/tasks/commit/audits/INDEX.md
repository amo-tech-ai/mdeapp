---
title: Pre-push commit audits — ship/may27-maps-events
date: 2026-05-28
base_sha: a4c1ecb
main_tip: e8d2a60
branch_shipped: ship/may27-maps-events
skills: ../../../index-skills.md (mde-worktree-pr-flow, task-verifier, testing)
verdict_commit: SHIPPED_THROUGH_PR12
verdict_push: SHIPPED
open_tasks: ../may-27/tasks/INDEX.md
---

# Commit audit index

## Post-ship status (main @ e8d2a60)

| PR | Merge SHA | Purpose | Floor |
|----|-----------|---------|-------|
| [#1](https://github.com/amo-tech-ai/mdeapp/pull/1) | `7ee9431` | C-000–C-006 maps/events stack | PASS |
| [#2](https://github.com/amo-tech-ai/mdeapp/pull/2) | `a5c3e54` | `dev:ui` webpack default | PASS |
| [#3](https://github.com/amo-tech-ai/mdeapp/pull/3) | `2a83425` | Mastra dev LibSQL (EMAXCONN fix) | PASS |
| [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) | `fa8be0c` | C-004 web citations | PASS |
| [#5](https://github.com/amo-tech-ai/mdeapp/pull/5) | `4e50f67` | Event clarify stale filter clear | PASS |
| [#6](https://github.com/amo-tech-ai/mdeapp/pull/6) | `57a36ab` | Event panel dedupe + scroll cap | PASS |
| [#7](https://github.com/amo-tech-ai/mdeapp/pull/7) | `f37291d` | Rental/café classifier hijack fix | PASS |
| [#8](https://github.com/amo-tech-ai/mdeapp/pull/8) | `85c4f1d` | C-008 CopilotKit inspector | PASS |
| [#9](https://github.com/amo-tech-ai/mdeapp/pull/9) | `c44f766` | C-009 rich-card dedup | PASS |
| [#10](https://github.com/amo-tech-ai/mdeapp/pull/10) | `7b3d58e` | C-010 rental fast-path | PASS |
| [#11](https://github.com/amo-tech-ai/mdeapp/pull/11) | `1be547f` | C-010b CodeRabbit safety | PASS |
| [#12](https://github.com/amo-tech-ai/mdeapp/pull/12) | `e8d2a60` | C-010c pin clear on empty search | PASS |

**2026-05-28 floor on `main`:** lint + typecheck + build + **298/298** tests + audit. Tracker: [../PROGRESS-TASK-TRACKER.md](../PROGRESS-TASK-TRACKER.md).

**Open commit tasks:** [../may-27/tasks/INDEX.md](../may-27/tasks/INDEX.md) · Forensic: [../may-27/AUDIT-2026-05-28-remaining-commits.md](../may-27/AUDIT-2026-05-28-remaining-commits.md)

**Open (ops, not code):** Andrés live Stripe payment → `paid` row evidence.

---

## Pre-push forensic archive

Forensic review **before** the May ship stack landed. Historical — all C-000–C-006 rows **shipped**.

| Audit | Commit | Files (plan) | Lines (est.) | Standalone? | Prod readiness |
|-------|--------|-------------:|-------------:|-------------|---------------:|
| [C-000](./C-000-lint.md) | fix lint | 2 | ~8 | ✅ | 95 |
| [C-001](./C-001-maps.md) | feat maps | 26 | ~700 | ⚠️ mid-stack | 88 |
| [C-002](./C-002-places.md) | feat places | 17 | ~450 | ⚠️ needs C-001 map context for full UI | 85 |
| [C-003](./C-003-grounding.md) | feat grounding | 30 | ~550 | ⚠️ needs Mastra + env | 82 |
| [C-004](./C-004-chat.md) | feat chat citations | 8 | ~310 | ✅ PR [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) @ `fa8be0c` | 85 |
| [C-005](./C-005-events.md) | feat events | 11 | ~350 | ❌ needs C-004 | 90 |
| [C-006](./C-006-chore.md) | chore | 5 | ~200 | ✅ last | 75 |

**Exclude always:** `supabase/.temp/**`, `.env.local`, `tmp/**`, `test-results/**`, `/home/sk/mdeai/screenshots/**`

---

## Per-commit forensic table (C-000 … C-006)

| ID | Intended message | Files to include | Files to exclude | Tests required | Pass/Fail | % complete | Risks | Blockers | Rollback | Prod score |
|----|------------------|------------------|------------------|----------------|-----------:|-----------:|-------|----------|----------|------------:|
| C-000 | `chore: ignore supabase CLI temp (C-000)` | `.gitignore` only | map new files | `npm run lint` | **PASS** | 90% | mis-stage temp | branch | revert 1 file | 98 |
| C-001 | `feat(maps): category markers… (C-001)` | ~32 maps/platform/e2e | chat, mastra, events API | maps unit; smokes optional | UNIT **PASS** / SMOKE **FAIL** | 100% disk | >20 files; rental smoke | C-000 | map UI revert | 88 |
| C-002 | `feat(places): Places client… (C-002)` | ~18 places API+cards | chat shell, grounding | places unit | **PASS** | 100% disk | API quota | soft C-001 | photo route revert | 85 |
| C-003 | `feat(agent): router + ADK… (C-003)` | ~35 mastra+grounding API | chat, events fast path | unit + `smoke:grounding-attribution` | **PASS** | 100% disk | >20 files; ADK env | C-002 | router revert | 82 |
| C-004 | `feat(chat): wire event web citations` | 8 citation paths (PR #4) | package.json, route.ts, `git add chat/` | floor + events smoke | **PASS** | **100%** shipped | — | PR #1 shell | revert PR #4 | 85 |
| C-005 | `feat(events): fast path (C-005)` | ~10 events API+hooks | mastra tools | `perf-events-chat-latency.mjs` | **PASS** | 100% disk | Gate 9 CONDITIONAL | C-004 | API route revert | 78 |
| C-006 | `chore: lockfile + docs (C-006)` | package, lock, .env.example | all `src/**` | `npm run floor` | **PASS** | 90% disk | lockfile drift | C-000–005 | lockfile revert | 90 |

Detail + staging commands: linked audit docs above. Master tracker: [../PROGRESS-TASK-TRACKER.md](../PROGRESS-TASK-TRACKER.md).

---

## Global verification (2026-05-27)

| Command | Result |
|---------|--------|
| `git status` | `main...origin/main`, 43 M + ~65 ??, 0 staged |
| `git diff --stat` | 43 tracked, **+1843 / −252** |
| `supabase/.temp/**` | present — **must not stage** |
| `git log -1 origin/main` | `a4c1ecb` 2026-05-25 |
| `npm run lint` | **PASS** (after C-000 fix on disk) |
| `npm run typecheck` | **PASS** |
| `npm test -- --run` | **PASS** 263/263 |
| `npm run build` | **PASS** |
| `npm run smoke:map-pins` | **FAIL** — rental-card timeout (agent/Gemini, not lint) |
| `npm run smoke:f50-pin-sync` | **FAIL** — same rental path |
| `SMOKE_GROUNDING_QUERY=… smoke:grounding-attribution` | **PASS** |
| `node scripts/perf-events-chat-latency.mjs` | **PASS** (Gate 9 events) |
| `npm run floor` | **PASS** (lint+build+test+audit; 10 moderate npm advisories) |

---

## Executive verdict (historical pre-push)

| Gate | Status |
|------|--------|
| **GO committing** | **SHIPPED** — C-000→C-006 on `main`; PR #2–#7 merged |
| **GO pushing** | **SHIPPED** — `main` @ `f37291d`; floor green (278 tests) |

---

## Exact commit order

`C-000` → `C-001` → `C-002` → `C-003` → `C-004` → `C-005` → `C-006`

## Exact test order (after each commit)

See per-audit doc **Verification ladder** sections. Minimum on tip: `npm run floor` + `smoke:grounding-attribution` + `perf-events-chat-latency.mjs`.

## Blockers first

1. Create branch: `git checkout -b ship/may27-maps-events`
2. Stage only C-000 files → commit (lint fix not yet committed)
3. Map rental smokes — **CONDITIONAL** (CopilotKit agent path; not blocking events fast path)
4. C-001 + C-003 exceed 20 files — acceptable if one domain; optional split noted in audits

## Safest next command

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b ship/may27-maps-events
git add src/components/maps/ClusteredCategoryMarkers.tsx src/lib/__tests__/map-clustering.test.ts
git commit -m "fix(maps): clear ESLint unused vars for floor gate (C-000)"
npm run lint
```

Then follow [C-001-maps.md](./C-001-maps.md) staging list.
