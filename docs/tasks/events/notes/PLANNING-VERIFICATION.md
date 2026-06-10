---
title: Events Platform — planning verification (Linear ↔ local)
updated: 2026-06-08-hygiene
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
canonical_tracker: ./index-events.md
evp_index: ./tasks/INDEX.md
aie_index: ./tasks/AI-native-system/index-aievents.md
implementation_order: ../notes/events/events-order.md
ui_coverage: ./specs/LINEAR-COVERAGE.md
linear_hygiene: ./tasks/AI-native-system/LINEAR-SYNC.md
---

# Events Platform — planning verification

**Question:** Are all [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) tasks correct, in order, and in sync with local `tasks/events/**`?

**Answer (2026-06-08 hygiene pass):** **Planning sync is ✅ complete.** **Implementation is not** — **4 Done**, P0 gate [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) (AIE-001) still Todo.

---

## Executive verdict

| Dimension | Status | Notes |
|-----------|--------|-------|
| **AIE pack ↔ Linear** | ✅ Complete | 33 issues (000–032); all `linear: SAN-*` on disk |
| **EVP ↔ Linear** | ✅ Complete | SAN-115–150 + G3 mapped; legacy EVT titles use EVP IDs where renamed |
| **UI spec pack ↔ Linear** | ✅ Complete | PAGE/OVL/VEN → SAN; cross-project UX refs documented |
| **Wireframes / design** | ✅ Complete | 37 wire screens; Luma design → `tasks/events/screenshots/luma/` |
| **CTEST scope** | ✅ Fixed | SAN-532–544 moved to **Growth & Operations** + `out-of-scope:events` |
| **EVT numbering** | ✅ Fixed | SAN-131/132/120 titles use **EVP-028/029/016** (see LINEAR-SYNC §EVT) |
| **Implementation complete** | ❌ **~4%** | 4 Done · 1 In Review · hostOps stack unbuilt |
| **Implementation order** | ✅ **AIE-first** | Core 001–012 → MVP 013–026 → Advanced 027–032; EVP discovery **LATER** |

---

## Linear Events Platform snapshot (2026-06-08)

| Metric | Count | Notes |
|--------|------:|-------|
| **Total on EP project** | **~95** | After CTEST-000–012 moved off EP |
| Done | **4** | SAN-116, 117, 118, 366 |
| In Review | **1** | SAN-135 (AIE-024 Luma) |
| In Progress | **0** | SAN-544 contest sync moved to Growth & Ops |
| Todo + Backlog | **~90** | |
| **AIE (`prefix:AIE`)** | **33** | Under epic SAN-757 |
| **CTEST on EP** | **0** | Was 13 — hygiene fix applied |
| **Exclude from events %** | CTEST, UX cross-project canonicals | Filter: `-label:out-of-scope:events` |

### Done on Linear (code shipped)

| Linear | Local | Title |
|--------|-------|-------|
| [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | EVP-013 / AIE cards | EVT-013 — Event cards (**canonical**) |
| [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | EVP-014 | EVT-014 — Host events list (**canonical**) |
| [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | G3 | Host publish production proof |
| [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | EVP-003 | Stripe webhook secret isolation |

---

## Correct implementation order (AIE-first — 2026-06-08)

**Canonical index:** [`tasks/AI-native-system/index-aievents.md`](./tasks/AI-native-system/index-aievents.md)

```text
NOW:    AIE-001 SAN-115 → AIE-002 SAN-730 → AIE-003–004 → AIE-005–009 hostOps
NEXT:   AIE-011–012 venues (SAN-765,764) → AIE-013–019 MVP intelligence
LATER:  EVP-015–028 discovery (SAN-119–131) · AIE-027+ Advanced (FROZEN)
```

### Phase A — Core launch (NOW)

| Order | AIE | Linear | Why |
|------:|-----|--------|-----|
| 1 | AIE-001 | **SAN-115** | Production proof ledger — **only P0 gate open** |
| 2 | AIE-002 | SAN-730 | Host nav Events + Analytics links |
| 3 | AIE-003 | SAN-758 | Observability schema |
| 4 | AIE-004 | SAN-704 | `ai_runs` prod writes |
| 5–9 | AIE-005–009 | SAN-760–761,729 | `hostOpsAgent` + `/host/analytics` + KPI cards |

**Already Done (do not re-build):** SAN-366, SAN-118, SAN-116, SAN-117

### Phase B — Venues + MVP (NEXT)

AIE-011–012 → AIE-013–026 (see [`LINEAR-SYNC.md`](./tasks/AI-native-system/LINEAR-SYNC.md))

### Phase C — Discovery pack (LATER — post SAN-115)

SAN-119 → SAN-131 (EVP-015–028). Renamed collisions: [SAN-131](https://linear.app/sanjiovani/issue/SAN-131) = **EVP-028** (not EVT-013); [SAN-132](https://linear.app/sanjiovani/issue/SAN-132) = **EVP-029** (not EVT-014).

### Phase D — Venue booking UI

SAN-492–514 · specs `specs/venue-booking/VEN-001–007`

---

## Local artifacts ↔ Linear

| Artifact | Count | Linear | Sync |
|----------|------:|--------|------|
| AIE task files | 32 + epic doc | SAN-757 + 001–032 | ✅ |
| EVP active tasks | 35 | SAN-115–150 | ✅ |
| UI specs (PAGE/OVL/VEN) | 31 | Mixed EP/UX/Partners | ✅ by design |
| Wireframes | 37 | Referenced in AIE descriptions | ✅ |
| Luma design screens | 12 | SAN-135 | ✅ |
| Screenshots | 44 PNG | — | `tasks/events/screenshots/luma/` (16) + `eventbrite/` (28) |

Full UI matrix: [`specs/LINEAR-COVERAGE.md`](./specs/LINEAR-COVERAGE.md)

---

## Hygiene fixes applied (2026-06-08)

| Fix | Action |
|-----|--------|
| Issue count | Updated 78 → **~95** on EP (108 pre-CTEST move) |
| CTEST pollution | SAN-532–544 → **Growth & Operations** + label `out-of-scope:events` |
| AIE frontmatter | All 32 tasks: `linear: SAN-###` from LINEAR-SYNC |
| Screenshot paths | Design docs → `tasks/events/screenshots/luma/` only |
| EVT dupes | SAN-131→EVP-028 · SAN-132→EVP-029 · SAN-120→EVP-016; SAN-117/118 marked canonical EVT-013/014 |

---

## Verification checklist

- [x] All 32 AIE tasks have `linear: SAN-*` frontmatter
- [x] LINEAR-SYNC mapping matches Linear titles (0 mismatches)
- [x] CTEST issues moved off Events Platform
- [x] EVT numbering collisions resolved in Linear titles
- [x] Screenshot path consolidated under `tasks/events/screenshots/`
- [x] AIE-first order documented in this file + `tasks/INDEX.md`
- [ ] SAN-115 ledger file created (`tasks/notes/EVP-001-proof-ledger.md`)
- [ ] hostOps stack on disk (AIE-005–009)

---

## Related

- Forensic audit: [`audit/02-events-audit.md`](./audit/02-events-audit.md)
- AIE index: [`tasks/AI-native-system/index-aievents.md`](./tasks/AI-native-system/index-aievents.md)
- Contest home (CTEST): [`../contest/tasks/`](../contest/tasks/)
