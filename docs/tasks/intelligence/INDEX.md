# Intelligence layer — program index

**Forensic audit:** [`AUDIT-2026-05-31.md`](./AUDIT-2026-05-31.md) (72% → ~88% post v1.1 fixes)

**Canonical execution plan:** [`intelligence-plan.md`](./intelligence-plan.md) v1.1 — Medellín Intelligence System (MIS) roadmap, progress tracker, task registry.

**Agent task specs:** [`tasks/INDEX.md`](./tasks/INDEX.md) (INT-001…022)

**Data intelligence DDL:** [`../data/plan/data-intelligence-plan.md`](../data/plan/data-intelligence-plan.md) · **Venue strategy:** [`../venues/data/venue-dataplan.md`](../venues/data/venue-dataplan.md)

**Plans:** [`agent-plan.md`](./agent-plan.md) · [`00-shared-intelligence-architecture.md`](./00-shared-intelligence-architecture.md)

**Report:** [`tasks/00-program-report.md`](./tasks/00-program-report.md)

---

## Quick status (2026-06-01)

| Track | Progress | Next |
|-------|----------|------|
| **MIS overall** | ~40% (MIS-M1 shipped) | DATA-040 spec · VEC-001 |
| **INT program** | ~45% (4/22 archived Done) | [INT-010](tasks/INT-010-working-memory-schema-update.md) → INT-004/003 clarify |
| **DATA intelligence** | 0% (040+ unfiled) | Write DATA-040 spec |
| **VEC platform** | ~10% | VEC-001 HNSW cleanup |

**Linear:** [Intelligence view](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23) · map [`LINEAR.md`](./LINEAR.md) · prod @ `main` `c9e54b8`

Full tracker: [`intelligence-plan.md` § Progress tracker](./intelligence-plan.md#progress-tracker-read-this-first)

---

## Program map

```text
MIS (this folder)
├── intelligence-plan.md     ← execution roadmap + task registry (DATA-040+, SEARCH-*, AI-*)
├── tasks/INDEX.md           ← INT-001…022 agent specs
├── agent-plan.md            ← PRD + confidence bands
└── 00-shared-intelligence-architecture.md

Related (do not duplicate)
├── data/plan/data-intelligence-plan.md   ← DDL + signal schemas
├── data/tasks-data/INDEX-data.md         ← DATA-001…035 Done
├── vector/INDEX.md                       ← VEC-001…007
├── maps/INDEX.md                         ← MAP-005+ backlog
└── grounding-search/tasks/INDEX.md       ← GS-001…009
```

---

## Implementation order

### Intelligence foundation (parallel MVP — not blocking EVT-001)

```text
Phase 0:  VEC-001 → DATA-039 → MAP-005
Phase 1:  DATA-040 → DATA-041…045 → SEARCH-001 → DATA-046
Phase 1:  VEC-003 → VEC-004 → VEC-005
```

### Agent intelligence (after Phase 1 seeds or overlapping tail)

```text
CORE:     INT-001 → INT-002 → INT-003 → INT-004 → INT-005
MVP:      INT-006 → INT-007 → INT-008 → INT-009 → INT-010
          INT-021 (restaurant/venue wrapper)
POST-MVP: INT-011 → INT-015
ADVANCED: INT-016 → INT-020
```

## Related programs

| Program | Path |
|---------|------|
| Rental implementation | [`../real-estate/tasks/INDEX.md`](../real-estate/tasks/INDEX.md) |
| Vector platform | [`../vector/INDEX.md`](../vector/INDEX.md) |
| MVP execution | [`../MVP-EXECUTION.md`](../MVP-EXECUTION.md) |

## Superseded (2026-05-28)

Root-level `INT-00x-*.md` in this folder → see [`tasks/MIGRATION.md`](./tasks/MIGRATION.md).
