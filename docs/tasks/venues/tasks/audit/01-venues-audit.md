---
title: Venues MVP — Forensic Task Audit
date: 2026-05-28
auditor: Cursor (senior specialist)
scope:
  - tasks/venues/tasks/mvp/
  - tasks/venues/tasks/post-mvp/
  - tasks/data/tasks-data/ (venue slice DATA-001–008, DATA-009)
  - crosswalk intelligence/INT-*, CTI-*, SCREEN-021
supersedes_notes: tasks/venues/docs/14-venues-mvp-forensic-audit.md (merge into this file)
---

# Venues MVP — Forensic Task Audit

## Executive verdict

| Metric | Score | Meaning |
|--------|------:|---------|
| **Planning structure** | 86% | Strong vertical split (data → UI → booking → WA → hardening) |
| **Implementation order** | 72% | Correct intent; **gaps in step table vs deps** (see §3) |
| **Task ID / naming hygiene** | 68% | Legacy `CAF-*` refs in VEN bodies; CTI mixed in `mvp/` |
| **Data layer alignment** | 78% | DATA-001–008 correct; **DATA-009 ↔ VEN-031 duplicate** |
| **Intelligence separation** | 82% | Crosswalk exists; post-MVP VEN-025/028 overlap INT |
| **Production readiness** | 62% | Specs improved; **zero runtime evidence** on hardening |
| **Overall task pack correctness** | **74%** | Executable after P0 doc fixes; not ship-safe until VEN-025–041 + INT CORE |

**One-line:** Architecture is right; **order and ownership** need correction before engineers start parallel work.

---

## Red flags (P0)

| # | Red flag | Impact | Fix |
|---|----------|--------|-----|
| R1 | **DATA-009 M1** and **VEN-031** both own `venue_booking_requests` migration | Double migration / merge conflict | **Single owner:** DATA-009 applies SQL; VEN-031 = app types + RLS tests only (remove `mutation` from VEN-031) |
| R2 | **VEN-031** `depends_on: none` but needs schema for field alignment | Sheet built before table exists | Add `depends_on: [data-009]` or `[VEN-015]` after R1 split |
| R3 | **Legacy `CAF-*` IDs** inside VEN-031–024 bodies (CAF-008, CAF-016, CAF-017) | Wrong task links in PRs | Global replace → VEN-031, VEN-031, VEN-031, VEN-031 |
| R4 | **mvp-index** puts hardening **35–41 before E2E 24** but **INDEX** permutes 019/021 inside chain | Teams follow wrong table | Adopt **canonical exec order** (§3) in both indexes |
| R5 | **INT CORE not gated** before VEN-011/012 | Café/restaurant clarify still regex-dumb on `/chat` | Insert **INT-001…005** (parallel rental) before VEN-012; **INT-008** after VEN-012 |
| R6 | **VEN-031** depends VEN-010/013 but listed after UI in INDEX — OK — yet **DATA-007/008** must complete first | Detail panels without cache = cost blow-up | Enforce: DATA-007 → DATA-008 before VEN-010/013/037 |
| R7 | Coffee tour files in `mvp/` | Resolved 2026-05-28 | **CTI → VEN-032…043**; single [`mvp-index.md`](../mvp/mvp-index.md) |
| R8 | **VEN-025 P0** post-MVP duplicates **INT-001** intent routing | Two sources of truth for clarify | Defer VEN-025 until INT-001 Done; or mark **superseded by INT-001** |

---

## Failure points (by phase)

### Data (`tasks/data/tasks-data/`)

| Task | Correct? | Issue |
|------|----------|-------|
| DATA-001 | ✅ | Canonical inventory; `legacy_id: CAF-001` OK as alias only |
| DATA-002 | ✅ | Three-kind contract — required before seeds |
| DATA-003–005 | ✅ | Parallel after DATA-002; align with MAP field masks |
| DATA-006 | ✅ | Golden queries — add café + INT hero strings |
| DATA-007–008 | ✅ | Must complete before VEN-010/013/037 |
| DATA-009 | ⚠️ | **Correct content** but **collides with VEN-031** — merge ownership (R1) |

**Venues `mvp/data/README.md`:** Pointer only — ✅ correct.  
**Wrong alias row:** Step 05 labeled `CAF-005` for nightclub seed — **misleading** (CAF-005 = shipped café UI). Use **DATA-005** only.

### MVP VEN (`tasks/venues/tasks/mvp/`)

| Range | Correct? | Notes |
|-------|----------|-------|
| VEN-009–013 | ✅ | Restaurant + nightlife UI order sound |
| VEN-031–020 | ⚠️ | Booking chain sound after R1/R2; fix CAF-* refs |
| VEN-031–023 | ✅ | WA + admin after booking |
| VEN-025–041 | ✅ | Hardening pack — **release blockers** |
| VEN-031 | ✅ | E2E last — correct |

**Missing from VEN track (by design):** Café cards — ✅ **SCREEN-021 shipped** (not a VEN-00N gap).

### Post-MVP VEN

| Task | Verdict | Action |
|------|---------|--------|
| VEN-025 | ⚠️ Overlaps INT-001 | **Defer** until INT-001; P0→P1 |
| VEN-026 | ✅ | Normalizer — keep |
| VEN-027–029 | ✅ | UX polish |
| VEN-028 | ⚠️ Overlaps INT-010 | Coordinate schemas; do not duplicate tables |
| VEN-030 | ✅ | Workflow after MVP booking |
| VEN-031–032 | ✅ | Vitest; 032 partly superseded by VEN-029 |
| VEN-033–034 | ✅ | Defer P2 — real-time reservations ≠ WA MVP |
| VEN-044+ | ✅ | Separate track — not venue MVP |
| VEN-019-ARCHIVED | ✅ Cancelled | **Archive** |
| OCL-013+ | ✅ | OpenClaw — separate |

### Intelligence overlap (do not consolidate into VEN)

| Intelligence | Venues | Rule |
|--------------|--------|------|
| INT-001…005 CORE | Before VEN-012 | Shared slots + no canned clarify |
| INT-008 | After VEN-012 | Café Gemini clarify |
| INT-010 | VEN-028 | Global WM schema first |
| INT-016 / VEC | VEN-044 | Catalog vs user memory |

Full matrix: [`../../CROSSWALK-INT.md`](../../CROSSWALK-INT.md)

---

## Blockers

| Blocker | Blocks | Owner |
|---------|--------|-------|
| DATA-001 not closed | All seeds | Data |
| DATA-009 vs VEN-031 unresolved | Booking MVP | Architect decision (R1) |
| INT-001…004 not shipped | Smart café/restaurant chat | Intelligence program |
| AUTH-009 JWT context | User-scoped booking tools | Auth track |
| MAP-005 Places proxy | DATA-007, VEN-031 | Maps |
| No `tasks/venues/archive/` yet | Clean superseded files | This audit |

---

## Canonical implementation order (plan)

**Use `exec_step` (01–48) for sequencing. Keep file IDs (VEN-009, VEN-036) unchanged.**

### Track A — Intelligence CORE (parallel; does not block venue DATA)

| exec | ID | Note |
|------|-----|------|
| A1–A5 | INT-001 → INT-005 | Rental + shared slots — see [`../../../intelligence/tasks/INDEX.md`](../../../intelligence/tasks/INDEX.md) |

### Track B — Venue data

| exec | ID | Depends |
|------|-----|---------|
| 01 | DATA-001 | — |
| 02 | DATA-002 | DATA-001 |
| 03 | **DATA-009** (M1 booking + M2 anchors) | DATA-002 |
| 04–06 | DATA-003, DATA-004, DATA-005 | DATA-002, DATA-009 M2 |
| 07 | DATA-006 | DATA-003–005 |
| 08 | DATA-007 | DATA-001, MAP-005 |
| 09 | DATA-008 | DATA-007 |

### Track C — Venue UI + Places hardening

| exec | ID | Depends |
|------|-----|---------|
| 10 | VEN-009 | DATA-004 |
| 11 | VEN-010 | VEN-009, DATA-008 |
| 12 | VEN-011 | DATA-005 |
| 13 | VEN-012 | VEN-011, **INT-001** (soft) |
| 14 | VEN-013 | VEN-012 |
| 15 | **INT-008** | INT-001, INT-005, VEN-012 |
| 16 | VEN-031 | DATA-007, DATA-008, VEN-010, VEN-013 |

### Track D — Booking (schema already in DATA-009)

| exec | ID | Depends |
|------|-----|---------|
| 17 | VEN-031 | DATA-009 M1, DATA-004 — **verify only** |
| 18 | VEN-031 | VEN-031 |
| 19 | VEN-031 | VEN-031 (UI shell) |
| 20 | VEN-031 | VEN-031 |
| 21 | VEN-031 | VEN-031, VEN-031, VEN-031 |
| 22 | VEN-031 | VEN-031, VEN-031, VEN-031 |
| 23 | VEN-026 | VEN-031, VEN-031, VEN-031 |
| 24 | VEN-028 | VEN-031, VEN-031, VEN-031, VEN-026 |

### Track E — WA + admin + chips

| exec | ID | Depends |
|------|-----|---------|
| 25 | VEN-031 | VEN-031, VEN-031 |
| 26 | VEN-031 | VEN-031 |
| 27 | VEN-027 | VEN-031 |
| 28 | VEN-031 | VEN-031, VEN-027 |
| 29 | VEN-031 | VEN-031 |
| 30 | VEN-030 | VEN-031, VEN-031, VEN-027 |

### Track F — Security CI + E2E (release gate)

| exec | ID | Depends |
|------|-----|---------|
| 31 | VEN-025 | VEN-031, VEN-031, VEN-031 |
| 32 | VEN-029 | VEN-031, VEN-031 |
| 33 | VEN-031 | VEN-010, VEN-013, VEN-031, VEN-025, VEN-031, VEN-028, VEN-029, VEN-030 |

### Track G — Post-MVP (after F green)

| exec | ID | Depends |
|------|-----|---------|
| G1+ | VEN-026 → VEN-032 | VEN MVP Done |
| G* | VEN-025 | **INT-001** Done (else skip) |
| G* | VEN-028 | **INT-010** Done |
| G* | VEN-032…043 | [`../mvp/mvp-index.md`](../mvp/mvp-index.md#phase-7--coffee-tours-32-43-optional) — optional |

```text
DATA → UI → INT-008 → VEN-031 → booking → hardening → RLS/CI → Playwright
```

---

## Consolidation & archive plan

### Consolidate (ownership, not delete)

| Items | Action |
|-------|--------|
| DATA-009 + VEN-031 | **One migration owner** (DATA-009); slim VEN-031 |
| VEN-025 + INT-001 | **INT wins** for routing; VEN-025 = venue-specific prompt appendix only |
| VEN-028 + INT-010 | **INT-010** owns schema; VEN-028 = venue field list only |
| VEN-032 + VEN-029 | Keep both; VEN-029 MVP gate, VEN-032 extended coverage |

### Move to `tasks/venues/archive/` (create folder)

| File | Reason |
|------|--------|
| [`../../CAFE-001-booking-requests-schema.md`](../../CAFE-001-booking-requests-schema.md) | Superseded by DATA-009 + VEN-031 |
| [`../../docs/CAFE-001-booking-requests-schema.md`](../../docs/CAFE-001-booking-requests-schema.md) | Duplicate doc |
| [`post-mvp/VEN-019-ARCHIVED-openclaw-tour-crawler.md`](../post-mvp/VEN-019-ARCHIVED-openclaw-tour-crawler.md) | Cancelled → OCL-013 |
| [`../../005-scr-cafe-listings-map-booking.md`](../../005-scr-cafe-listings-map-booking.md) | If duplicate of `mvp/wireframes/005-scr-*` (verify before move) |

**Do not archive:** CTI MVP files, OCL-013 (active), VEN-033/034 (deferred but valid).

### Remove from venue MVP scope (handle in Intelligence)

| Task | Program |
|------|---------|
| Generic clarify / intent extraction | INT-001, INT-003, INT-004 |
| Café remote-work clarify | INT-008 |
| Cross-session prefs | INT-011+ (not VEN) |

---

## Renumbering recommendation

| Approach | Recommendation |
|----------|----------------|
| Rename all VEN files 001–041 sequentially | **Reject** — high churn, breaks git history |
| Renumber CTI out of VEN sequence | **Optional** — move to `tasks/venues/tasks/cti/` later |
| Add `exec_step` to frontmatter | **Accept** — apply in next task hygiene pass |
| Fix `mvp_step` on DATA-009 (currently `09` collides with VEN-009) | **Accept** — use `data_step: 03b` or fold into step 03 |

**ID collision (acceptable if documented):** VEN-043 (tour page) vs VEN-031 (tool registry).

---

## DATA tasks — are they correct for venues?

**Yes for DATA-001–008** with these rules:

1. Canonical path: **`tasks/data/tasks-data/`** only.  
2. Venues index steps **01–08** map 1:1 (not CAF-001–009 aliases in new docs).  
3. Insert **DATA-009 at step 03** (after DATA-002, before seeds) per [`INDEX-data.md`](../../../data/tasks-data/INDEX-data.md).  
4. Update venues INDEX rows **01–08** → renumber display to **01–09** when DATA-009 inserted in chain.

**Not venue-specific (ignore in venue MVP):** data-012+ events, data-019+ rentals, data-026+ trips — correct separation in INDEX-data.

---

## Post-MVP — tasks to remove?

| Remove? | Task | Verdict |
|---------|------|---------|
| No | VEN-025–034 | Keep; adjust priority/deps |
| Archive | VEN-019-ARCHIVED | Cancelled |
| No | OCL-* | Keep — enrichment track |
| Defer | VEN-033–034 | Stripe/table reservations — post-MVP P2 ✅ |

---

## Critical fixes checklist (do before implementation)

- [ ] **C1** Resolve DATA-009 vs VEN-031 ownership (R1)  
- [ ] **C2** Publish canonical exec order (§3) in `mvp-index.md` + `venues/INDEX.md`  
- [ ] **C3** Replace CAF-* references in VEN-031–023 with VEN-*  
- [ ] **C4** Fix `mvp/data/README.md` CAF-005 nightclub mislabel  
- [ ] **C5** Gate VEN-012 on INT-001; add INT-008 after VEN-012 in indexes  
- [ ] **C6** Lower VEN-025 to P1; `depends_on: [INT-001, ven-011]`  
- [ ] **C7** Create `tasks/venues/archive/` + move CAFE-001 + VEN-019-ARCHIVED  
- [ ] **C8** Add DATA-009 to venues INDEX between 02 and 03  

---

## Best practices (apply going forward)

1. **One migration owner per table** — data layer applies SQL; app tasks consume.  
2. **File ID ≠ exec order** — document `exec_step` in frontmatter.  
3. **Never use legacy CAF-* in new PR descriptions** — use DATA-* / VEN-*.  
4. **Intelligence before venue agent copy** — INT CORE before VEN-025.  
5. **CTI ≠ café Places** — separate indexes, separate release trains.  
6. **Hardening before E2E** — VEN-025, 037, 039, 040, 041 before VEN-031.  
7. **Anti-fake-done** — evidence file per release gate task.

---

## Suggested improvements (next docs pass)

| Improvement | Effort |
|-------------|--------|
| Add `exec_step` column to [`../INDEX.md`](../INDEX.md) master table | 1h |
| Sync [`../mvp/mvp-index.md`](../mvp/mvp-index.md) to §3 order | 30m |
| Add INT column to venues INDEX (A1–A5, INT-008) | 30m |
| [`02-implementation-order-plan.md`](./02-implementation-order-plan.md) — mermaid only | 30m |
| Patch VEN-031 frontmatter (`mutation: false`) | 5m |

---

## Percent correct (summary)

| Layer | % |
|-------|---:|
| Data tasks DATA-001–008 | 88 |
| Data DATA-009 vs VEN-031 | 45 (until merged) |
| MVP VEN specs content | 82 |
| MVP execution order docs | 72 |
| Post-MVP specs | 85 |
| Intelligence crosswalk | 82 |
| Café three-track clarity | 80 |
| **Weighted overall** | **74** |

**After C1–C8 doc fixes (no code):** expect **~88%** execution readiness.

---

## Release stop condition (unchanged)

Venues booking MVP is not ship-safe until:

1. DATA-001 closed + DATA-009 applied once  
2. VEN-025, 037, 039, 040, 041 evidenced  
3. VEN-031 Playwright green on prod/preview  
4. INT-008 Done if marketing café intelligence on `/chat`

---

## Related documents

| Doc | Path |
|-----|------|
| Venues hub | [`../../INDEX.md`](../../INDEX.md) |
| MVP index | [`../mvp/mvp-index.md`](../mvp/mvp-index.md) |
| Task index | [`../INDEX.md`](../INDEX.md) · [`../mvp/mvp-index.md`](../mvp/mvp-index.md) |
| INT crosswalk | [`../../CROSSWALK-INT.md`](../../CROSSWALK-INT.md) |
| Data layer | [`../../../data/tasks-data/INDEX-data.md`](../../../data/tasks-data/INDEX-data.md) |
| Prior audit | [`../../docs/14-venues-mvp-forensic-audit.md`](../../docs/14-venues-mvp-forensic-audit.md) |

*Audit complete: 2026-05-28*
