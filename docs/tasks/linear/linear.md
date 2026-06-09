---
title: Linear + local setup (MDEAPP)
updated: 2026-05-31
canonical: true
mvp_dashboard: ../MVP-EXECUTION.md
aliases: [docs/linear.md]
---

# Linear + local — setup hub (MDEAPP)

**Single source of truth** for Linear ↔ local task sync.  
(`docs/linear.md` redirects here — do not edit the duplicate.)

| Link | What |
|------|------|
| [MDEAPP project](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) | All issues (~275) |
| [Phase 1 initiative](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8) | Target **2026-06-17** (estimate) |
| **MVP dashboard** | [`MVP-EXECUTION.md`](MVP-EXECUTION.md) — next 10, blockers, deps |
| **Progress changelog** | [Initiative Updates](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8/overview) — weekly; playbook [`12-linear-official-practices.md`](12-linear-official-practices.md) |
| Operator checklist | [`todo.md`](../../todo.md) |
| MVP exit gates | [`MVP-REQUIRED.md`](MVP-REQUIRED.md) |
| Naming audit | [`NAMING-CLEANUP-REPORT.md`](NAMING-CLEANUP-REPORT.md) |

**Architecture frozen 2026-05-31** — ship MVP proofs; no more task-system refactors.

---

## One rule

```text
tasks/** on disk  =  truth (spec, status, evidence, depends_on)
Linear (SAN-###)  =  queue index + PR links
```

Linear titles use **SPEC-ID** (`PAY-001`, `EVT-013`, `UX-003`). Disk filenames may still say `EVP-*-core-*` until renamed separately.

---

## Three IDs (frozen)

| ID | Example | Use |
|----|---------|-----|
| **SPEC-ID** | `EVT-013`, `PAY-001`, `UX-003` | Linear **title** prefix |
| **SAN** | `SAN-117` | Immutable URL, branch `ai/san-117-…`, PR |
| **Disk path** | `tasks/events/EVP-013-core-*.md` | Spec + evidence |

**Title format:** `EVT-013 — Event cards in AI chat`

**Allowed prefixes:** MAP, EVT, RE, VEN, TRIP, AUTH, DATA, UX, PAY, OPS, TEST, AI  
**Deprecated in titles:** IMP-*, EVP-*, SCREEN-*, F32/F48, RNT/AIA/ATH/UIX catalog

**Canonical map:** [`mvp-canonical-titles.json`](mvp-canonical-titles.json) · **Queue:** [`mvp-queue.json`](mvp-queue.json)

---

## Setup verification

Run this after any bulk Linear change or when views look empty.

### Local (disk)

| Check | Expected | Command / path |
|-------|----------|----------------|
| MVP dashboard | Next 10 + blockers | [`../MVP-EXECUTION.md`](MVP-EXECUTION.md) |
| Machine queue | PAY→EVT chain | [`mvp-queue.json`](mvp-queue.json) |
| Title map | 22 P0/P1 rows | [`mvp-canonical-titles.json`](mvp-canonical-titles.json) |
| Last title sync | 22 updated, 0 errors | [`mvp-title-sync-log.json`](mvp-title-sync-log.json) |
| Operator todo | No IMP-* rows | [`../../todo.md`](../../todo.md) |
| Progress tracker | PAY/EVT spec IDs | [`../progres.md`](progres.md) |

```bash
cd /home/sk/mdeai
# Title sync dry-run (should show "skipped" if already applied)
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-sync-mvp-titles.mjs --dry-run
```

### Linear (workspace)

| Check | Expected | How |
|-------|----------|-----|
| P0 issues exist | ≥ 17 | Filter `project:MDEAPP label:phase:launch` |
| MVP view not empty | Same filter on [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) | Edit view if still on old `P0 — MVP gates` |
| Titles synced | e.g. SAN-117 = `EVT-013 — …` | Spot-check top 5 in queue |
| UX view | `label:track:ux` | [UX view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) |
| Data view | `label:track:data` | [Data view](https://linear.app/sanjiovani/view/data-54425dec37b9) |
| Track labels | UX + Data packs | `node scripts/linear-restore-track-labels.mjs` if views empty |

**Spot-check titles (2026-05-31 sync):**

| SAN | Title must start with |
|-----|------------------------|
| SAN-178 | `PAY-001 —` |
| SAN-116 | `PAY-003 —` |
| SAN-117 | `EVT-013 —` |
| SAN-115 | `EVT-001 —` |
| SAN-315 | `UX-001 —` |

---

## Linear structure

```text
Initiative: Phase 1 — mdeai MVP launch
  └── Project: MDEAPP
        ├── 🚨 Launch Critical     (P0 — MVP exit)
        ├── 🍽️ Discovery — UI
        ├── 🎟️ Events — Polish
        ├── 🗺️ Maps — Growth
        └── 🔮 Phase 2 / deferred
```

Milestone detail: [`02-views-sort.md`](02-views-sort.md) · Legacy catalog: [`07-mvp.md`](07-mvp.md)

---

## Saved views (labels only — never title text)

Create or fix in Linear UI. Full copy-paste: [`09-views-setup.md`](09-views-setup.md) · [`10-mvp-module-views.md`](10-mvp-module-views.md)

| View | Filter |
|------|--------|
| **MVP EXECUTION** | `project:MDEAPP label:phase:launch` |
| **BLOCKERS** | `project:MDEAPP has:blocked-by state:Todo,"In Progress","In Review"` |
| **MAPS** | `project:MDEAPP label:prefix:MAP` |
| **EVENTS** | `project:MDEAPP label:prefix:EVT` |
| **PAYMENTS** | `project:MDEAPP label:prefix:PAY` |
| **UX** | `project:MDEAPP label:track:ux` |
| **DATA** | `project:MDEAPP label:track:data` |
| **INTELLIGENCE** | `project:MDEAPP label:track:intelligence` |
| **INTEL Phase 1 (frozen)** | `project:MDEAPP label:phase:intel-1` |

Setup: [`11-intelligence-views.md`](11-intelligence-views.md) · Queue: [`intelligence-queue.json`](intelligence-queue.json)

| **AUTH** | `project:MDEAPP (label:prefix:ATH OR label:stack:supabase)` |
| **POST-MVP** | `project:MDEAPP label:phase:post-mvp` |
| Stale WIP | `project:MDEAPP state:"In Progress" updated:< -P7D` |

**Labels per issue:**

| Layer | Examples | Purpose |
|-------|----------|---------|
| Phase | `phase:launch`, `phase:post-mvp` | MVP vs later |
| Track | `track:ux`, `track:data` | Pack views |
| Prefix | `prefix:EVT`, `prefix:PAY`, `prefix:MAP` | Module views |
| Stack | `stack:mastra`, `stack:supabase`, `stack:stripe` | Cross-cut (1–3 max) |

---

## Board columns

```text
Todo  →  In Progress  →  In Review  →  Done
```

| Column | Who moves |
|--------|-----------|
| **Todo** | Top = [`mvp-queue.json`](mvp-queue.json) order |
| **In Progress** | Agent / you (≤3) |
| **In Review** | Agent after floor + evidence |
| **Done** | **User only** — [`04-completion-approval.md`](04-completion-approval.md) |

Import scripts map disk `Done` → **In Review**, not Done.

---

## Local ↔ Linear workflow

### Start work

1. Read spec under `tasks/**`
2. Find SAN in description, [`import-log.json`](import-log.json), or frontmatter
3. Linear → **In Progress**
4. Branch: `ai/san-###-slug` from `mdeapp/`

### Open PR

1. PR body mentions `SAN-###`
2. Linear → **In Review** ([`GITHUB-LINEAR-SETUP.md`](GITHUB-LINEAR-SETUP.md))
3. Small commits per [`tasks/commit/00-commit-playbook.md`](00-commit-playbook.md)

### Ship slice

1. `cd mdeapp && npm run floor`
2. Evidence → `tasks/testing/evidence/` or `tasks/notes/`
3. Linear comment with evidence path → stay **In Review**
4. User approves → **Done**

### Bulk scripts

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"

node scripts/linear-fetch-all-issues.mjs       # snapshot
node scripts/linear-sync-mvp-titles.mjs        # titles from mvp-canonical-titles.json
node scripts/linear-restore-track-labels.mjs   # track:ux / track:data
node scripts/linear-apply-stack-labels.mjs     # stack:* from prefix:*
node scripts/linear-sort-todo.mjs              # Todo manual order
```

**Do not run:** `linear-apply-prefix-catalog.mjs`, `linear-apply-imp-numbers.mjs` (deprecated).

---

## Pull order

1. [`MVP-EXECUTION.md`](MVP-EXECUTION.md) — primary dashboard
2. [`todo.md`](../../todo.md) — checklist
3. [`mvp-queue.json`](mvp-queue.json) — deps + order
4. [`10-mvp-module-views.md`](10-mvp-module-views.md) — view filters

Do not pull from 🔮 deferred milestones while 🚨 Launch Critical is open.

**Dependency chain (P0):** PAY-001 → PAY-003 → EVT-013 + EVT-002 → EVT-001 → AUTH-011, OPS-002

---

## Scripts

| Script | When |
|--------|------|
| `linear-sync-mvp-titles.mjs` | Align titles to [`mvp-canonical-titles.json`](mvp-canonical-titles.json) |
| `linear-fetch-all-issues.mjs` | Before/after bulk edits |
| `linear-restore-track-labels.mjs` | UX/Data views empty |
| `linear-apply-stack-labels.mjs` | Refresh `stack:*` |
| `linear-sort-todo.mjs` | Re-order Todo column |
| `linear-import-tasks.mjs` | New disk spec → issue |

Logs: `mvp-title-sync-log.json`, `track-labels-restore-log.json`, `data-import-log.json`.

---

## GitHub + Cursor

| Integration | Doc |
|-------------|-----|
| GitHub ↔ SAN | [`GITHUB-LINEAR-SETUP.md`](GITHUB-LINEAR-SETUP.md) |
| Cursor delegate | [`06-linear-claude-code.md`](06-linear-claude-code.md) |

Delegate: `@Cursor … [repo=amo-tech-ai/mdeapp]` on the issue.

---

## Don’t do this

| Don’t | Do instead |
|-------|------------|
| `title~"UX-"` in views | `label:track:ux` |
| `milestone:"P0 — MVP gates"` | `label:phase:launch` |
| Agent sets **Done** | **In Review** + evidence |
| Re-run prefix catalog | `linear-sync-mvp-titles.mjs` |
| Edit `docs/linear.md` | Edit **this file** only |
| >3 In Progress | Finish or park one |

---

## Doc map (`tasks/linear/`)

| File | Role |
|------|------|
| **linear.md** (this file) | Hub — setup, verify, sync |
| [09-views-setup.md](09-views-setup.md) | View URL + filter copy-paste |
| [10-mvp-module-views.md](10-mvp-module-views.md) | Module view detail |
| [mvp-canonical-titles.json](mvp-canonical-titles.json) | SAN → SPEC-ID map |
| [mvp-queue.json](mvp-queue.json) | P0 queue + dependencies |
| [NAMING-CLEANUP-REPORT.md](NAMING-CLEANUP-REPORT.md) | Migration audit |
| [04-completion-approval.md](04-completion-approval.md) | Done gate |
| [08-linear-improve.md](08-linear-improve.md) | Backlog (non-blocking) |
| [12-linear-official-practices.md](12-linear-official-practices.md) | Linear docs + Method → MDEAPP mapping |
| [templates/initiative-update.md](initiative-update.md) | Weekly Initiative changelog template |
| [templates/project-update.md](project-update.md) | MDEAPP project update (when workspace enables) |

---

## Quick start

1. Open [MVP EXECUTION](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) — filter `label:phase:launch`
2. Read [`MVP-EXECUTION.md`](MVP-EXECUTION.md) next 10
3. Open disk spec; note `SAN-###`
4. Implement → floor → evidence → PR → **In Review**
5. You approve → **Done**
6. **Weekly:** post Initiative update (`Shift+U`) — template [`templates/initiative-update.md`](initiative-update.md)
