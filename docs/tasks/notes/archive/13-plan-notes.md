Consolidation is done. Here is the doc hierarchy and a correctness pass on the task index.

## Doc hierarchy (one role each)

| Doc | Role |
|-----|------|
| **[`plan.md`](plan.md)** | **Single execution order** — Tiers 0–10 (shipped → P0 exit → INT CORE → DATA → VEN → ADV → Phase 2+) |
| **[`tasks/MVP-REQUIRED.md`](tasks/MVP-REQUIRED.md)** | **MVP exit only** — G1/G2/G3 + floor; ADV table updated, not duplicated |
| **[`tasks/INDEX.md`](tasks/INDEX.md)** | Slim router + P0/P1 tables + post-MVP catalog |
| **[`mvp.md`](mvp.md)** | Pointer to plan + MVP-REQUIRED |
| **[`prd.md`](prd.md)** | Strategy PRD index; repo truth → `plan.md` |
| **[`roadmap.md`](contest/docs/roadmap.md)** | Now/Next/Later narrative; current state **2026-05-28** |
| **[`advanced.md`](advanced.md)** | Post-MVP / forbidden scope; points at `plan.md` Tiers 3–10 |

## Are the tasks correct?

**Yes for structure and order**, after the 2026-05-28 venues renumber. The index now matches disk:

| Was wrong | Now |
|-----------|-----|
| `ven 01–24`, `CTI-*` in INDEX/plan | **VEN-009…051** + migration doc |
| Duplicate venues rows + `tasks-intelligent/` link | One **VEN** row; link removed |
| Tier 3 = only “Maps ADV” | **INT-001…005 CORE** before full venues booking |
| Café seed only in DATA-003 | **DATA-035** → listings ETL → DATA-003 sign-off |
| Post-MVP block ignored INT/DATA order | Tiers 3–10 in `plan.md` |

**Still open (spec vs execution):**

- **MVP exit 🔴** — Tier 1 (G1, EVP-003/013, G3, EVP-001, then F32 ‖ AUTH-011 ‖ MAP-002B/008B).
- **DATA-035** — spec + empty seed JSON; no `mdeapp` ETL yet.
- **INT-001…005** — should run **in parallel with MVP exit** if rental clarify is P0 for `/chat`.
- **VEN-015 vs DATA-009** — migration owner still “verify in spec” (DATA-009 owns SQL).

Retired IDs are documented in [`plan.md` § Task correctness audit](plan.md) and [`tasks/INDEX.md`](tasks/INDEX.md).

## Execution order (short)

```text
P0:  G1 → EVP-003 → EVP-013 → G3 → EVP-001 → F32 ‖ AUTH-011 ‖ MAP-002B ‖ MAP-008B
P1:  EVP-014 · SCREEN-017 · SCREEN-010 · MAP-010? · AUTH-005
CORE: INT-001…005  (‖ P0 when staffed)
DATA: 001→002→009→035→003…008 · rentals/trips packs
VEN:  009…031 (+ 032…051 tours) after DATA café path
ADV:  INT-006…020 · MAP-005+ · RE/TRIP · EVP-015+ · VEC · GS · OCL
```

Per-track detail stays in each track index (`venues/tasks/mvp/mvp-index.md`, `data/tasks-data/INDEX-data.md`, `intelligence/tasks/INDEX.md`).

I did not commit (per your git rules). Say if you want a commit message for these doc-only changes or a follow-up pass on stale `CTI`/`CAF-*` strings inside individual task bodies.