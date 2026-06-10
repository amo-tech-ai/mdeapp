---
title: PR remediation — archived completed specs
updated: 2026-06-02
main_sha: bf40ef9
prod_sha: bf40ef9
prod_url: https://www.mdeai.co
active_backlog: ../INDEX.md
active_tasks: ../tasks/
active_ux: ../ux/
active_data: ../tasks-data/INDEX-data.md
---

# PR archive — completed tasks

Specs moved here on **2026-06-02** after verification against **`mdeapp` `origin/main` @ `bf40ef9`** (matches **Vercel Production** deploy).

**Gate:** code merged to `main`, production HTTP 200, and Linear row **Done** (or superseded/canceled UX stubs). Do not re-execute unless a regression reopens the work.

## Active backlog (not archived)

| Area | Location | Open items |
|------|----------|------------|
| PR process | [`../tasks/`](../tasks/) | PR-15 (backlog), PR-16 (floor CI done; branch protection admin), PR-18 (after soak) |
| UX Stable Beta | [`../ux/`](../ux/) | UX-023, 024, 029, 033 · UX-018 deferred |
| DATA / AUTH | [`../tasks-data/`](../tasks-data/) | Active backlog only — DATA-048/050 here; DATA-007 → [`../../data/archive/`](../../data/archive/README.md) |

## Archived PR tasks (15)

| ID | File | Ship evidence |
|----|------|---------------|
| PR-01 | [tasks/PR-01-search-events-trycatch.md](./tasks/PR-01-search-events-trycatch.md) | #34 |
| PR-02 | [tasks/PR-02-hoist-concierge-provider.md](./tasks/PR-02-hoist-concierge-provider.md) | #41 |
| PR-03 | [tasks/PR-03-chat-remount-boundary.md](./tasks/PR-03-chat-remount-boundary.md) | #41 |
| PR-04 | [tasks/PR-04-c1-migrations.md](./tasks/PR-04-c1-migrations.md) | #40 |
| PR-05 | [tasks/PR-05-c2-edge-functions.md](./tasks/PR-05-c2-edge-functions.md) | #42 |
| PR-06 | [tasks/PR-06-c3-seeds.md](./tasks/PR-06-c3-seeds.md) | #43 |
| PR-07 | [tasks/PR-07-c4-rollbacks-docs.md](./tasks/PR-07-c4-rollbacks-docs.md) | #44 |
| PR-08 | [tasks/PR-08-restore-postmvp-decision.md](./tasks/PR-08-restore-postmvp-decision.md) | SAN-445 gate |
| PR-09 | [tasks/PR-09-close-23-supersede.md](./tasks/PR-09-close-23-supersede.md) | #23 closed |
| PR-10 | [tasks/PR-10-merge-31-analytics.md](./tasks/PR-10-merge-31-analytics.md) | #31 |
| PR-11 | [tasks/PR-11-unstack-20-19.md](./tasks/PR-11-unstack-20-19.md) | #19/#20 closed |
| PR-12 | [tasks/PR-12-35-anon-key-warn.md](./tasks/PR-12-35-anon-key-warn.md) | #46 |
| PR-13 | [tasks/PR-13-split-hotfix-pile.md](./tasks/PR-13-split-hotfix-pile.md) | SAN-447 |
| PR-14 | [tasks/PR-14-relocate-worktrees.md](./tasks/PR-14-relocate-worktrees.md) | SAN-448 |
| PR-17 | [tasks/PR-17-migration-filename-lint.md](./tasks/PR-17-migration-filename-lint.md) | in #40 |

## Archived UX (9)

| ID | File | Notes |
|----|------|-------|
| UX-006 | [ux/UX-006-new-chat-reset-thread-and-map.md](./ux/UX-006-new-chat-reset-thread-and-map.md) | Superseded → UX-032 |
| UX-007 | [ux/UX-007-clear-stale-advanced-markers.md](./ux/UX-007-clear-stale-advanced-markers.md) | Superseded → UX-033 |
| UX-009 | [ux/UX-009-prod-synthetic-concierge-monitor.md](./ux/UX-009-prod-synthetic-concierge-monitor.md) | Superseded → UX-034 |
| UX-010 | [ux/UX-010-unified-result-card-architecture.md](./ux/UX-010-unified-result-card-architecture.md) | Done |
| UX-017 | [ux/UX-017-rebase-pr19-onto-main.md](./ux/UX-017-rebase-pr19-onto-main.md) | Canceled |
| UX-020 | [ux/UX-020-card-interaction-props-types.md](./ux/UX-020-card-interaction-props-types.md) | #45 |
| UX-028 | [ux/UX-028-place-result-card-fallback-upgrade.md](./ux/UX-028-place-result-card-fallback-upgrade.md) | Done |
| UX-032 | [ux/UX-032-new-chat-reset-thread-and-map.md](./ux/UX-032-new-chat-reset-thread-and-map.md) | Done |
| UX-034 | [ux/UX-034-prod-synthetic-concierge-monitor.md](./ux/UX-034-prod-synthetic-concierge-monitor.md) | Done |

## Archived PR tasks-data (2)

| ID | File | Ship vehicle |
|----|------|--------------|
| DATA-048 | [tasks-data/DATA-048-migration-version-prefix-realign.md](./tasks-data/DATA-048-migration-version-prefix-realign.md) | PR-04 #40 |
| DATA-050 | [tasks-data/DATA-050-out-of-band-base-table-migrations.md](./tasks-data/DATA-050-out-of-band-base-table-migrations.md) | PR-08 gate + #40 |

**Still open in [`../tasks-data/`](../tasks-data/):** SEARCH-002 (#38), SEARCH-001, AUTH-005/009/011, DATA-028, DATA-041, intelligence backlog — see [`../tasks-data/INDEX-data.md`](../tasks-data/INDEX-data.md).
