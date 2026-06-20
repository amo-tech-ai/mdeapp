# mdeai Linear overrides — quick reference

Canonical sources: [`linear.md`](../../../../linear.md) · [`linear-reference.md`](../../../../linear-reference.md)

## Workspace

| Field | Value |
|-------|-------|
| Team key | `SAN` |
| Initiative | [Phase 1 — mdeai MVP launch](https://linear.app/sanjiovani/initiative/phase-1-mdeai-mvp-launch-c968b744a1a8) |
| Cycle 1 | Jun 8–22, 2026 |
| MVP view | [MVP EXECUTION](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) (`label:phase:mvp`) |

## Projects (assign every issue)

| Project | Prefixes |
|---------|----------|
| Platform Infrastructure | PAY, OPS, AUTH, DATA, UX core |
| Events Platform | EVT |
| AI & Intelligence | INT, SEARCH, VEC |
| Trips | TRIP, TRP |
| Venues | VEN, DATA |
| Discovery Platform | MAP |
| Real Estate | REAL, RE |

## Required labels

**Phase (pick one):** `phase:launch` · `phase:mvp` · `phase:post-mvp` · `phase:advanced` · `phase:intel-conv` · `phase:intel-1`

**Track (pick one+):** `track:ux` · `track:data` · `track:intelligence` · `track:trips` · `track:venues` · `track:real` · `track:maps` · `track:pr`

**Or prefix:** `prefix:PAY` · `prefix:EVT` · `prefix:MAP` · `prefix:AUTH` · `prefix:OPS` · `prefix:VEN` · `prefix:TRP` · `prefix:REAL` · `prefix:RE` · `prefix:ATH` · `prefix:INT`

**Stack (max 3):** `stack:stripe` · `stack:mastra` · `stack:nextjs` · `stack:copilotkit` · `stack:supabase` · `stack:gemini` · `stack:maps` · `stack:pgvector` · `stack:search` · `stack:playwright` · `stack:whatsapp`

## Deprecated — never on new issues

`surface:venues` · `surface:trips` · `prefix:TRIP` · `track:re` · `prefix:RE` · `IMP-*` · `EVP-*` · `SCREEN-*`

## Title + IDs

| Type | Example | Use |
|------|---------|-----|
| SPEC-ID | `PAY-001` | Title prefix, disk filename |
| SAN | `SAN-178` | URL, branch, PR |
| Disk | `docs/tasks/...` | Source of truth |

**Title:** `PAY-001 — Live ticket purchase on production`

**Chat/docs:** `SAN-178 · PAY-001 — Live ticket purchase on production`

## Git

```bash
git checkout -b ai/san-178-pay-001-live-ticket-purchase
```

PR body: `Closes SAN-178`

## Milestones (active)

| Milestone | Project |
|-----------|---------|
| 🚨 Launch Critical | Platform Infra · Events Platform |
| 🍽️ Venues — Phase 2 | Venues |
| 🎟️ Events — Polish | Events Platform |
| 🗺️ Maps — Growth | Discovery Platform |
| 🏠 Rental Cards MVP | Real Estate |

## Bulk scripts (repo root `/home/sk/mdeai`)

```bash
node scripts/linear-sync-mvp-titles.mjs
node scripts/linear-fetch-all-issues.mjs
node scripts/linear-restore-track-labels.mjs
node scripts/linear-apply-stack-labels.mjs
node scripts/linear-sort-todo.mjs
```

Do **not** run: `linear-apply-prefix-catalog.mjs`, `linear-apply-imp-numbers.mjs`.
