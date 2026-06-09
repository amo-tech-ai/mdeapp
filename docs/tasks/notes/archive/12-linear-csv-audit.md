# Linear CSV audit — MDEAPP issues (2026-05-27)

**Source:** `tasks/linear/MDEAPP › Issues (2).csv` (~2249 lines)  
**Canonical order:** [`plan.md`](../../plan.md) IMP-079→092 · [`core-mvp-order.json`](core-mvp-order.json)

## Verdict: **NOT correct — score 42/100**

Linear titles/milestones reflect a **stale** `implementation-order.json` from **before** the 2026-05-27 plan reorder. IMP numbers, P0 membership, and missing issues all diverge from `plan.md`.

---

## Active queue — canonical vs Linear

| IMP | Task | Linear SAN | Linear title IMP | Milestone (Linear) | Status |
|----:|------|------------|------------------|--------------------|--------|
| 079 | OPS-ANDRES-G1 | SAN-178 | 079 ✅ | P0 — MVP gates ✅ | Todo 🟡 |
| 080 | EVP-003-core | SAN-116 | 080 ✅ | P0 — MVP gates ✅ | In Progress 🟡 |
| 081 | EVP-013-core | SAN-117 | **082** ❌ | **P1 — Events polish** ❌ | Todo — should be **P0** |
| 082 | G3-core-host-publish-proof | — | **MISSING** ❌ | — | — |
| 083 | EVP-001-core | SAN-115 | **081** ❌ | P0 ✅ | Todo |
| 084 | F32 | SAN-100 | **107** ❌ | **P1 — Maps & core** ❌ | Todo — should be **P0** |
| 085 | AUTH-011 | — | **MISSING** ❌ | — | — |
| 091 | MAP-002B | — | **MISSING** ❌ | — | — |
| 092 | MAP-008B | — | **MISSING** ❌ | — | — |
| 086 | EVP-014-core | SAN-118 | **083** ❌ | P1 ✅ | Todo |
| 087 | SCREEN-017 | SAN-112 | **085** ❌ | P1 ✅ | Todo |
| 088 | SCREEN-010 | SAN-111 | **084** ❌ | P1 ✅ | In Review |
| 089 | MAP-010 | SAN-104 | **097** ❌ | P1 ✅ | Todo |
| 090 | AUTH-005 | — | **MISSING** ❌ | — | — |

**P0 milestone in Linear:** only **4** issues tagged `P0 — MVP gates` (should be **9**).

---

## Root causes

1. **`implementation-order.json` stale** — IMP 081–089 still map to old sequence (EVP-001 before EVP-013; no G3; F32 at IMP-107).
2. **Import/build scripts skipped nested folders** — `tasks/events/tasks/` (G3, EVP specs), so new P0 tasks never entered the manifest or Linear.
3. **`linear-apply-imp-numbers.mjs` never re-run** after plan fix — titles stuck on old IMP prefix.
4. **MAP-002B / MAP-008B / AUTH-011 / AUTH-005 / G3 never imported** — not in `import-log.json`.

---

## Other Linear problems

| Issue | Risk |
|-------|------|
| WIRE-* issues in Backlog with no IMP | Noise — wireframes are REF, not execution queue |
| SCREEN-021 (SAN-114) marked P0 in description but milestone P1 | Misleading priority |
| ADV tasks (MAP-005 IMP-095, VEC, OCL, CTEST) numbered IMP-095+ | OK for backlog — but **must not** sort above P0 in Todo |
| `Blocked by` on EVP-001 omits G1/G3/EVP-003/EVP-013 | Wrong dependency graph |

---

## Fix procedure (run locally)

Scripts updated 2026-05-27: `linear-build-implementation-order.mjs` + `linear-import-tasks.mjs` now scan `tasks/events/tasks/`, `tasks/data/tasks-data/`, etc.

```bash
cd /home/sk/mdeai
export LINEAR_API_KEY="$(grep '^LINEAR_API_KEY=' .env.local | cut -d= -f2- | tr -d '"')"

# 1. Rebuild IMP manifest from disk (must show G3 @ 082, MAP-002B @ 091, …)
node scripts/linear-build-implementation-order.mjs

# 2. Import missing specs (G3, AUTH-011, MAP-002B, MAP-008B, AUTH-005, …)
node scripts/linear-import-tasks.mjs

# 3. Retitle all issues [IMP-NNN] from fresh manifest
node scripts/linear-apply-imp-numbers.mjs

# 4. Milestones + priorities + blocked-by
node scripts/linear-organize-project.mjs

# 5. Sort project Todo column by IMP (manual sort in Linear UI if needed)
node scripts/linear-sort-todo.mjs
```

**Verify after sync:**

```text
Todo top 9 (P0):
079 G1 → 080 EVP-003 → 081 EVP-013 → 082 G3 → 083 EVP-001
→ 084 F32 ‖ 085 AUTH-011 ‖ 091 MAP-002B ‖ 092 MAP-008B
```

---

## Correct implementation order (reference)

```text
P0 A: 079 → 080 → 081 → 082 → 083
P0 B: 084 ‖ 085 ‖ 091 ‖ 092
P1:   086 → 087 → 088 → 089  (+ 090 AUTH-005 parallel)
ADV:  MAP-005+ · data-* · TRIP-* · RE-* — not in MVP Todo
```

Do **not** pull MAP-005, trips, rentals, OpenClaw, or CTEST into P0 Todo.
