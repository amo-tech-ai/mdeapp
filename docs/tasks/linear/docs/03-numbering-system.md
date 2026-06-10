# Numbering system — IMP vs Task ID vs SAN

Linear carries **three IDs**. Only one is a global build order.

## The three layers

| Layer | Example | What it means | Renumber? |
|-------|---------|---------------|-----------|
| **IMP-###** | `[IMP-079]` | **Global implementation sequence** — IMP-001 was first work ever shipped; IMP-079 is the next open item | Yes — when queue changes, re-run build script |
| **Task ID** | `SCREEN-021`, `EVP-001-core`, `MAP-011` | **Domain prefix** from `tasks/**` frontmatter / filename — track-specific, not global order | No — stable spec identifier |
| **SAN-###** | `SAN-178` | **Linear team auto-ID** — assigned at issue creation, immutable | Never |

### Title format (Linear)

```
[IMP-079] OPS-ANDRES-G1 — Andrés G1 — manual Stripe test payment
 ^^^^^^^   ^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 sequence  task ID          human title from spec
```

---

## Why SAN-### looked random

- Linear assigns `SAN-###` in **creation order**, not build order.
- Import ran in folder order (contest → OpenClaw → … → core), so **SAN-179** might be a deferred contest task while **SAN-95** is core F20.
- The CSV export sorts by whatever the board view uses — not implementation sequence.

**SAN-### is fine as a permanent URL/ID.** Do not try to renumber Linear issues.

---

## Why domain Task IDs are not global order

| Prefix | Track | Example |
|--------|-------|---------|
| `F##` | Platform foundation | F01 bootstrap |
| `SCREEN-###` | UI screens | SCREEN-021 café |
| `MAP-###` | Maps pipeline | MAP-011 routes |
| `EVP-###` | Events vertical | EVP-001 proof gates |
| `GS-###` | Grounding search (deferred) | GS-009 |
| `OCL-###` | OpenClaw (deferred) | OCL-001 |

Within a track, numbers are mostly sequential — **across tracks they are not**. F50 can ship before SCREEN-010; MAP-001 before EVP-001.

---

## IMP-### — the correct implementation order

**Rule:** One ascending ledger for the whole repo.

1. **IMP-001 … IMP-078** — Shipped on disk (`status: Done` or Phase A.5 Done). Most are **not** Linear issues (import only brought open work).
2. **IMP-079+** — Open queue, sorted by milestone + explicit within-milestone list + dependencies.

### Source of truth files

| File | Purpose |
|------|---------|
| [`implementation-order.json`](implementation-order.json) | Machine manifest — all 233 tasks |
| [`implementation-order.csv`](implementation-order.csv) | Human-readable IMP ledger |
| [`import-log.json`](import-log.json) | Task ID → SAN-* map |
| [`todo-sort-log.json`](todo-sort-log.json) | Last Todo column `sortOrder` run |

### Regenerate + sync Linear

```bash
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"

# 1. Rebuild IMP ledger from tasks/** specs
node scripts/linear-build-implementation-order.mjs

# 2. Prefix Linear titles with [IMP-NNN]
node scripts/linear-apply-imp-numbers.mjs --dry-run
node scripts/linear-apply-imp-numbers.mjs

# 3. Re-sort Todo column (board → Todo → sort = Manual)
node scripts/linear-sort-todo.mjs
```

---

## Current snapshot (2026-05-27)

| Metric | Value |
|--------|------:|
| Total tasks in ledger | 233 |
| Shipped (IMP-001–078) | 78 |
| Open | 155 |
| In Linear (open only) | 137 |
| Done in Linear | 0 *(shipped work lives on disk, not closed in Linear)* |

### Next open work (IMP queue)

| IMP | Task ID | SAN | Milestone |
|-----|---------|-----|-----------|
| 079 | OPS-ANDRES-G1 | SAN-178 | P0 — MVP gates |
| 080 | EVP-003-core | SAN-116 | P0 — MVP gates *(In Progress)* |
| 081 | EVP-001-core | SAN-115 | P0 — MVP gates |
| 082 | EVP-013-core | SAN-117 | P1 — Events polish |
| … | … | … | … |

**Note:** SCREEN-021 is **IMP-063** (shipped Phase A.5 on disk) but SAN-114 may still show In Progress in Linear until status is synced.

---

## Board workflow

1. **Todo column** — sort **Manual** (not Priority). Top = lowest IMP among open issues.
2. **Pull work** — always take the top Todo `[IMP-NNN]` unless blocked.
3. **Done** — move issue to Done **and** set spec `status: Done` in `tasks/**`.
4. **New task** — add spec with `id:` frontmatter → re-run build script → apply IMP → sort Todo.

---

## FAQ

**Q: Why isn’t IMP-001 in Linear?**  
A: Import skipped completed specs. IMP-001–078 are the shipped ledger; Linear only tracks remaining work.

**Q: Can we rename SAN-178 to SAN-001?**  
A: No. Use `[IMP-079]` in the title and manual Todo sort.

**Q: SCREEN-021 vs 026-scr filename?**  
A: Task ID stays `SCREEN-021` (spec frontmatter). File was renumbered to `026-scr-*` for screen index — different namespace.
