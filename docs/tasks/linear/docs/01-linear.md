# Linear import — MDEAPP project

**Project:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/overview) · Team **Sanjiovani**  
**Hub:** [`linear.md`](linear/docs/linear.md) · Also: [`07-mvp.md`](07-mvp.md) · [`08-linear-improve.md`](08-linear-improve.md) · [`12-linear-official-practices.md`](12-linear-official-practices.md) · [`09-views-setup.md`](09-views-setup.md)

## Status (2026-05-30)

| Metric | Value |
|--------|------:|
| Issues in MDEAPP | **275** |
| By state | **194** Todo · **35** Done · **14** In Review · **2** In Progress · **28** Backlog |
| Milestones | **12** product buckets (see [`02-views-sort.md`](02-views-sort.md)) |
| Launch Critical | **18** issues on milestone **🚨 Launch Critical** |
| Initiative | [**Phase 1 — mdeai MVP launch**](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8) (target **2026-06-17** estimate) |

### Scripts

| Script | Purpose |
|--------|---------|
| `scripts/linear-fetch-all-issues.mjs` | Snapshot → `linear-issues-snapshot.json` |
| `scripts/linear-restore-track-labels.mjs` | Re-apply `track:ux` / `track:data` after bulk label scripts |
| `scripts/linear-apply-stack-labels.mjs` | Add `stack:*` from `prefix:*` (merge labels) |
| `scripts/linear-apply-prefix-catalog.mjs` | PREFIX titles — **dry-run first**; overwrites titles |
| `scripts/linear-sort-todo.mjs` | Todo column manual sort (`sortOrder`) |

### Logs

- [`ux-import-log.json`](ux-import-log.json) · [`data-import-log.json`](data-import-log.json)
- [`stack-labels-apply-log.json`](stack-labels-apply-log.json) · [`track-labels-restore-log.json`](track-labels-restore-log.json)
- [`import-log.json`](import-log.json) — legacy task ID → SAN-*

---

## Milestones (current names)

| Milestone | Role |
|-----------|------|
| **🚨 Launch Critical** | MVP exit — Andrés, Roberto, Tourist prod proof |
| **🎟️ Events — Polish** | Post-launch host/checkout |
| **🍽️ Discovery — UI** | Screens, UX-010 cards |
| **🗺️ Maps — Growth** | MAP-005+ |
| **🏠 Trips — Phase 2** · **🍽️ Venues — Phase 2** | Post-MVP packs |
| **🔮 …** | Vector, OpenClaw, Grounding, Contest, Coffee tours |

---

## Launch Critical — execution order

Manual sort in [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207). Full table: [`07-mvp.md`](07-mvp.md).

| Code | SAN | State (snapshot) |
|------|-----|------------------|
| PAY-001 | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Todo |
| PAY-002 | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | In Progress |
| EVT-001 | [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | Todo |
| EVT-002 | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Todo |
| … | SAN-315…324 | See `07-mvp.md` |

**Done on launch milestone:** AIA-001 [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) · CAF-001 [SAN-114](https://linear.app/sanjiovani/issue/SAN-114)

---

## Views

Copy-paste filters and URLs: [`09-views-setup.md`](09-views-setup.md)

| View | Filter |
|------|--------|
| Launch | `project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress"` |
| UX | `project:MDEAPP label:track:ux` |
| Data | `project:MDEAPP label:track:data` |
| Blocked | `project:MDEAPP has:blocked-by state:Todo,"In Progress"` |
| Stale WIP | `project:MDEAPP state:"In Progress" updated:< -P7D` |

Linear API cannot create views — edit existing views in UI per `09-views-setup.md`.

---

## Issue templates (paste into Linear UI)

Markdown sources: [`templates/`](./templates/) — launch-blocker, ux-fix, data-supabase, prod-bug.

---

## Maintenance commands

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"
node scripts/linear-fetch-all-issues.mjs
node scripts/linear-restore-track-labels.mjs    # after any bulk label pass
node scripts/linear-apply-stack-labels.mjs    # stack:* from prefix:*
```

### Cursor rule

[`.cursor/rules/mdeai-linear.mdc`](../../.cursor/rules/mdeai-linear.mdc) when syncing board or reordering Todo.

### Manual (UI only)

- **GitHub integration:** Settings → Integrations → `amo-tech-ai/mdeapp` (PR → In Review / merge → Done)
- **Project Resources:** links in [`07-mvp.md`](07-mvp.md) § Resources
