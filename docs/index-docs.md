---
title: mdeapp/docs — master index
updated: 2026-06-10
verified: 2026-06-10 (post PR #158 squash merge — 3,460 `docs/` paths tracked on `main`)
rule: when a root-level file and a subdir file share a name, the subdir copy wins (relocation leftovers)
---

# mdeapp/docs — master index

> Git home for everything here is the **mdeapp repo** (the outer planning repo ignores `/mdeapp/`).
> `tasks/events/` is also reachable from the outer workspace via the compat symlink
> `/home/sk/mdeai/tasks/events` — same files either way.
> Freshness dots: 🟢 synced 2026-06-09 · 🟡 days old, usable · 🔴 stale, verify before trusting.

## Start here

| Need | File | Fresh |
|------|------|:-----:|
| App architecture onboarding | [`ARCHITECTURE.md`](ARCHITECTURE.md) | 🟢 |
| Docs router (this repo's tasks) | [`tasks/README.md`](tasks/README.md) | 🟢 |
| Events Platform — everything | [`tasks/events/`](tasks/events/) (see below) | 🟢 |
| Local QA runbook | [`localhost-qa-runbook.md`](localhost-qa-runbook.md) | 🟡 May 24 |

## Events Platform (SoT — moved here 2026-06-09)

| Doc | Owns | Fresh |
|-----|------|:-----:|
| [`tasks/events/`](tasks/events/) · compat [`docs/events/`](../events/) → same tree | Platform router — 301 files (`plans/`, `tasks/`, `specs/`) | 🟢 |
| [`tasks/events/todo.md`](tasks/events/todo.md) | Execution order; cites main, PR #146, SAN-135/510/511 Done, 512–514 In Review | 🟢 |
| [`tasks/events/index-events.md`](tasks/events/index-events.md) | Platform state (~46%), per-journey readiness, live counts | 🟢 |
| [`tasks/events/changelog.md`](tasks/events/changelog.md) | Graded shipped-task history (grade + % correct per task) | 🟢 |
| [`tasks/events/data/VENUE-DATA-MODEL.md`](tasks/events/data/VENUE-DATA-MODEL.md) | SAN-492 · EVT-033 schema SoT + Appendix A SQL | 🟢 |
| [`tasks/events/data/data-model-audit.md`](tasks/events/data/data-model-audit.md) | **Current forensic audit** (85% · B; E0 anon-RLS trap + E1 seed gap — both must land before sign-off) | 🟢 |
| [`tasks/events/data/ALL-EVENTS-DATA-MODEL.md`](tasks/events/data/ALL-EVENTS-DATA-MODEL.md) | All 15 live tables, FKs, RLS, ERD | 🟢 |
| [`tasks/events/audit/`](tasks/events/audit/) | Audits 01–05 (04 = B1/B2/B3 structural; 05 = live data quality) | 🟢 |
| ⚠ Root-level `06-*.md`, `04-*.md`, `VENUE-DATA-MODEL.md`, `ALL-EVENTS-…` in `tasks/events/` | Stale relocation duplicates — use the `audit/` / `data/` copies | 🔴 |

## Task backlog (non-events)

| Doc | Owns | Fresh |
|-----|------|:-----:|
| [`tasks/INDEX.md`](tasks/INDEX.md) | Slim status metrics | 🔴 updated 2026-06-02; still cites frozen MVP-EXECUTION |
| [`tasks/MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md) | MVP queue + ADV/post-MVP split | 🟡 |
| [`tasks/progres.md`](tasks/progres.md) | Progress tracker (~78% audit) | 🔴 updated 2026-06-04 |
| [`tasks/CONVENTIONS.md`](tasks/CONVENTIONS.md) | Task-file conventions | 🟡 |
| Domain task dirs | `tasks/{payments,maps,ux,venues,restaurants,nightlife,real-estate,trips,partners,ecommerce,intelligence,testing,linear,…}` | varies — check each dir's index |
| [`tasks/evidence/`](tasks/evidence/) + outer `tasks/testing/evidence/` | Runtime/prod proof per task (`SAN-NNN-*.md` + PNGs) | 🟢 |

## Domain & strategy docs

| Dir / doc | Owns | Fresh |
|-----------|------|:-----:|
| [`ecommerce/`](ecommerce/) | Medusa commerce direction (kept; single `medusa` skill) | 🟡 |
| [`partners/`](partners/) | Partner stack (ptr001–014) docs | 🟡 |
| [`linear/`](linear/) | Linear sync plans + queues | 🟡 |
| [`wireframes/`](wireframes/) | AI-native marketplace wireframes (June 2026) | 🟢 |
| [`wireframes-design/`](wireframes-design/) · [`design/wireframes/`](design/wireframes/) | Legacy D-track SCR/WIRE specs (`04-detail-booking` → `mobile/events/`) | 🟢 |
| [`design/wireframe/`](design/wireframe/) | HTML lo-fi mockups (cafes · restaurants · nightlife) | 🟢 |
| [`prd/`](prd/) | PRD chunks (canonical PRD lives at outer `plan/prd.md`) | 🟡 |
| [`audits/`](audits/) | `concierge-audit.md` · `launch-readiness.md` | 🟡 Jun 8 |
| [`strategy/`](strategy/) + [`docs-vault/`](docs-vault/) | Bulk research vaults (≈9K files) — reference only, never SoT | ⚪ |
| [`revenue-strategy.md`](revenue-strategy.md) / `-v2` · [`strategic-audit.md`](strategic-audit.md) · [`task-backlog.md`](task-backlog.md) | Strategy snapshots (Jun 4) | 🟡 |
| [`copilotkit-mastra/`](copilotkit-mastra/) | Integration reference notes | 🟡 |
| [`notes/`](notes/) | Session notes (June 8–9 chat/docs-rebase) | 🟢 |
| [`dashboard.md`](dashboard.md) · [`graphify-reference.md`](graphify-reference.md) | One-off references | 🟡 |

## Known gaps (as of 2026-06-10)

1. 🟢 `docs/` restored on `main` via PR #158 (`6542210`) — **3,460** paths tracked; local-only notes/archives may sit untracked beside git (see [`index.md`](../index.md) restore table).
2. 🔴 Stale root-level duplicates in `tasks/events/` (see ⚠ row) — delete after confirming subdir copies.
3. 🔴 `tasks/INDEX.md` + `tasks/progres.md` predate recent merges — refresh or read `tasks/events/todo.md` + Linear instead.
