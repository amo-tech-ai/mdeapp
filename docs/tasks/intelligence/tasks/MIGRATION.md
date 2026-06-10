# INT task ID migration (2026-05-28)

## New canonical location

All executable tasks: **`tasks/intelligence/tasks/INT-001` … `INT-020`**.

## Superseded paths

| Old file (root `tasks/intelligence/`) | New canonical |
|---------------------------------------|---------------|
| `INT-001-shared-intent-slot-extraction.md` | `tasks/INT-001-shared-intent-slot-schema.md` |
| `INT-002-rental-vertical-intelligence.md` | `tasks/INT-002` + `INT-003` + `INT-004` |
| `INT-003-event-intelligence.md` | `tasks/INT-007-event-intelligence-wrapper.md` |
| `INT-004-cafe-intelligence.md` | `tasks/INT-008-cafe-intelligence-wrapper.md` |
| `INT-005-restaurant-venue-intelligence.md` | `tasks/INT-021-restaurant-venue-intelligence-wrapper.md` (created 2026-05-28) |
| `INT-006-shared-preference-memory.md` | `tasks/INT-011` … `INT-020` + VEC-* |

## RE-* tasks (keep — implementation detail)

| RE ID | INT program task |
|-------|------------------|
| RE-017 | INT-002 |
| RE-018 | INT-003 + INT-004 |
| RE-019 | INT-006 |
| RE-020 | INT-016 + INT-017 (partial) |

Do **not** delete RE-* files; link from INT tasks as `implements`.
