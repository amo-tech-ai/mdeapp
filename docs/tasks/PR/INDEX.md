---
title: PR Remediation + active DATA backlog
updated: 2026-06-02T23:45Z
main_sha: bf40ef9
prod_sha: bf40ef9
audit: ./docs/01-06-26-audit.md
plan: ./00-PLAN.md
active_data: ./tasks-data/INDEX-data.md
archived_pr: ./archive/README.md
archived_data: ../data/archive/README.md
verification: ./VERIFICATION.md
spec_accuracy_pct: 100
---

# PR Remediation — INDEX

> **Progress tracker (verified 2026-06-02):** [`PROGRESS-TRACKER.md`](./PROGRESS-TRACKER.md) — rollup tables, % complete, prod proof @ **`bf40ef9`**.  
> **Active:** 3 PR specs ([`tasks/`](./tasks/)) · 5 UX specs ([`ux/`](./ux/)) · 19 DATA/AUTH specs ([`tasks-data/INDEX-data.md`](./tasks-data/INDEX-data.md)).  
> **Archived (2026-06-02):** 15 PR + 9 UX + DATA-048/050 → [`archive/README.md`](./archive/README.md) · verified **`main` / Vercel @ `bf40ef9`**.  
> **Linear:** [MDEAPP project](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · [`LINEAR.md`](./LINEAR.md) · [`tasks/STATUS-2026-06-02.md`](./tasks/STATUS-2026-06-02.md).
> **Done DATA (26):** [`../data/archive/`](../data/archive/README.md) · **Done AUTH (8):** [`../archive/data-A/`](../archive/data-A/README.md).

Status legend: `Not Started` · `In Progress` · `Blocked` · `Verify` · `Done`

---

## Duplicate map (one row per unit of work)

| Work | Canonical spec | Ship vehicle | Do **not** open twice |
|------|----------------|--------------|------------------------|
| Migration realign | [DATA-048](archive/tasks-data/DATA-048-migration-version-prefix-realign.md) | **PR-04** · [#40](https://github.com/amo-tech-ai/mdeapp/pull/40) | Archived |
| Base-table backfill gate | [DATA-050](archive/tasks-data/DATA-050-out-of-band-base-table-migrations.md) | **PR-08** · SAN-445 | Archived |
| #23 edge fns | — | **PR-05** | Merging #23 wholesale |
| #23 seeds | — | **PR-06** | — |
| #23 rollbacks/docs | — | **PR-07** | — |
| Close #23 | — | **PR-09** | After PR-05/06/07 |
| Events try/catch guard | — | **PR-01** (verify #34 landed) | New P0 fix on main |
| Events fast-path UI | [SEARCH-002](tasks-data/SEARCH-002-event-hybrid.md) | GitHub **#38** (open) | **Not** PR-11 |
| Obsolete search PRs | — | **PR-11** · SAN-432 | Rebase/merge **#19** |
| Migration filename lint | — | **PR-17** (preventive) | Re-fixing DATA-048 collision |
| New chat follow-ups | [UX-032](archive/ux/UX-032-new-chat-reset-thread-and-map.md) (Done) | **PR-02**, **PR-03** (archived) | UX-006 stub archived |

---

## Master execution order (dependency-ordered)

```text
 0  PR-13     Split hotfix working tree (unblocks all new branches)
 1  PR-01     Verify #34 closed #32 try/catch gap
 2  PR-08     DATA-050 / restore_post_mvp scope GATE (with SAN-445)
 3  PR-04     DATA-048 — one C1 migrations PR (SAN-446 commit step)
 4  PR-05     C2 edge functions extracted from #23
 5  PR-06     C3 seeds from #23
 6  PR-07     C4 rollbacks + docs from #23
 7  PR-09     Close #23 + supersede comment
 8  PR-02     Hoist ConciergeCoAgentProvider (off main debt)
 9  PR-03     Fix sessionKey remount boundary
10  PR-10     #31 Vercel analytics — merge or drop
11  PR-11     Close obsolete #19; retire #20 (SAN-432)
12  PR-12     #35 anon-key warn follow-up
    —— Stable Beta / UX train: do NOT mix below with soak ——
13  DATA-028  trip_items sync (app; blocked on webhook)
14  DATA-041  venue_signals human QA → archive when closed
15  AUTH-005  Playwright auth smoke
16  AUTH-009  JWT → RequestContext
17  AUTH-011  Production auth checklist
    —— Separate product PRs (not this remediation train) ——
    SEARCH-002 → #38 only after PR-11 clears #19
    SEARCH-001 → SAN-386 app wiring
    AI-003/004, DATA-046 → Phase 1b intelligence
    —— Process hardening (any time; PR-17 before next migration PR) ——
18  PR-17     Migration-filename lint in CI
19  PR-16     Floor + review branch protection
20  PR-18     SHA-pin GitHub Actions
21  PR-14     Remove wave-1 worktrees
22  PR-15     ADK smoke script Phase-2 audit (SAN-444 related)
```

**Blocked / deferred (no PR row):** DATA-008 (backfill cron) · DATA-013–018 · DATA-022/024/025 · DATA-031–033 · P2 events schema.

---

## Archived PR train (Waves 1–4 + PR-17) — **Done**

**15 specs** in [`archive/tasks/`](./archive/tasks/) · manifest [`archive/README.md`](./archive/README.md) · prod @ **`bf40ef9`**.

PR-01 … PR-14, PR-17 (includes #23 supersession #40–#44, chat #41, analytics #31, #46, hotfix split).

---

## Active PR specs (`tasks/`)

| Order | ID | Title | Status | Notes |
|------:|----|-------|--------|-------|
| 19 | [PR-16](tasks/PR-16-floor-merge-gate.md) | Floor + review on `main` | **In Progress** | `floor.yml` on main; **admin:** branch protection |
| 20 | [PR-18](tasks/PR-18-sha-pin-actions.md) | SHA-pin GitHub Actions | Not Started | After **SAN-462** soak |
| 22 | [PR-15](tasks/PR-15-verify-adk-phase2.md) | ADK smoke script audit | Backlog | SAN-444 / Phase 2 |

**GitHub (not PR-row):** [#38](https://github.com/amo-tech-ai/mdeapp/pull/38) SEARCH-002 — [`tasks-data/SEARCH-002-event-hybrid.md`](./tasks-data/SEARCH-002-event-hybrid.md) · do not mix with soak.

---

## Active DATA + AUTH specs (`tasks-data/`)

Full tracker: **[`tasks-data/INDEX-data.md`](./tasks-data/INDEX-data.md)** · forensic notes: [`tasks-data/notes-data.md`](./tasks-data/notes-data.md)

### Implementation order (active folder only)

| Order | ID | Status | Next action |
|------:|-----|--------|-------------|
| 1 | **DATA-048** / **DATA-050** | **Done** | Archived → [`archive/tasks-data/`](./archive/tasks-data/) · #40 |
| 2 | **DATA-028** | Blocked | App webhook → `trip_items` |
| 3 | **DATA-041** | In Review | Human QA → archive |
| 4 | **AUTH-005** | Ready | Playwright smoke |
| 5 | **AUTH-009** | Ready | JWT RequestContext |
| 6 | **AUTH-011** | Ready | Prod checklist |
| 7 | **SEARCH-001** | Not Started | App wire RPC (SAN-386) — **not** Stable Beta |
| 8 | **SEARCH-002** | Not Started | **#38** open |
| 9 | **AI-003** / **AI-004** | Not Started | Phase 1b |
| 10 | **DATA-046** | Not Started | Golden v2 (SAN-384) |
| — | **DATA-007/008** | Blocked | After MAP-005 |
| — | **DATA-013–018, 022–025, 031–033** | Deferred | Phase 2 / P2 |

### Files in `tasks-data/` (25 specs + INDEX)

`DATA-041` · `DATA-046` · `data-007` … `AUTH-011` — **DATA-048/050** archived under [`archive/tasks-data/`](./archive/tasks-data/).

---

## UX specs (`ux/`)

**Active:** UX-023, 024, 029, 033 · **Deferred:** UX-018. **Done/superseded (9):** [`archive/ux/`](./archive/ux/).

---

## Folders

| Path | Contents |
|------|----------|
| [`tasks/`](./tasks/) | **Active** PR-15, PR-16, PR-18 + status snapshot |
| [`archive/`](./archive/) | Done PR + UX + DATA-048/050 (2026-06-02) |
| [`tasks-data/`](./tasks-data/) | Active DATA + AUTH specs + INDEX |
| [`ux/`](./ux/) | Active Stable Beta UX backlog |
| [`docs/`](./docs/) | Forensic audits (01–04) |
| [`../data/archive/`](../data/archive/) | Done DATA specs (25) |
| [`../data/evidence/`](../data/evidence/) | Execution evidence |
