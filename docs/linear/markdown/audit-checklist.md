# Linear — final execution queue

> **Audit complete · no new audits.** Archive: [`docs/linear/audit/`](../audit/)  
> **Constraint:** Proof-constrained, not documentation-constrained.  
**Forensic audit:** [`FORENSIC-SYNC-AUDIT-2026-06-09.md`](../audit/FORENSIC-SYNC-AUDIT-2026-06-09.md) — **79% sync · not 100%**

---

## Launch readiness

| Area | Score |
|------|------:|
| Planning | 95 |
| Tracker coverage | 95 |
| Linear hygiene | 100 |
| Documentation | 95 |
| **MVP proof** | **33** |
| **Launch readiness** | **72** |

**Single highest-ROI task:** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) — production Stripe purchase → webhook → ticket → wallet QR.

---

## Track A — Launch critical (only sequence that moves launch)

| Order | SAN | Goal | Status |
|------:|-----|------|--------|
| 1 | **SAN-178** | Real production ticket purchase proof | 🔴 Todo |
| 2 | **SAN-546** | Camila prod matrix (4 verticals) | 🟡 In Progress |
| 3 | **SAN-115** | MVP proof ledger close | 🟡 Todo |

```text
SAN-178 → SAN-546 → SAN-115
```

### Track A checklist

- [ ] **SAN-178** — real payment · real webhook · real ticket · QR in `/me/tickets`
- [ ] **SAN-546** — prod journey matrix evidence
- [ ] **SAN-115** — G1+G2+G3 attached · mark Done

---

## Track B — UI wins (parallel, low risk)

| Order | SAN | Goal | Status |
|------:|-----|------|--------|
| 1 | **SAN-730** | Enable host navigation | 🟡 In Review (code shipped) |
| 2 | **SAN-731** | Event detail skeleton + a11y | 🟡 In Review (code shipped) |
| 3 | **SAN-135** | Luma event detail Phase A | In Review (unchanged) |

- [x] SAN-730 · SAN-731 (disk + Linear In Review)
- [ ] SAN-135

---

## Track C — Tiny hygiene (<30 min total, optional)

| Task | Action |
|------|--------|
| SAN-780 | Rename to **SEARCH-003** | ✅ Done |
| SAN-792–796 | Resolve duplicate VEN track (dup SAN-292–314) | ✅ Duplicate |
| VEB-000 | Create parent epic · parent SAN-492–509 | ✅ [SAN-855](https://linear.app/sanjiovani/issue/SAN-855) · children parented |
| Orphan freeze batch | `phase:post-mvp` + Backlog (sample: SAN-372,373,383,740,743) | 🟡 started |

---

## Freeze — do not start until Track A complete

- Revenue R2–R5 · OpenClaw expansion · Intelligence imports · Sponsor automation  
- Admin CRM · Recommendation systems · New trackers · **New audits**

CSV export + `generate.py` — **when convenient**, not blocking SAN-178.

---

## Persona proof

| Persona | Proof | Status |
|---------|-------|--------|
| Andrés | Payment | 🔴 SAN-178 |
| Camila | Cards + pins | 🟡 SAN-546 |
| Roberto | Publish | ✅ SAN-366 |

Ledger: [`mvp-proof-ledger.md`](../audit/mvp-proof-ledger.md)

---

### Phase 0 queue (complete ✅ — archive)

| # | Item | Status |
|---|------|--------|
| 1 | SAN-789 → MAP-035 | ✅ 2026-06-09 |
| 2 | SAN-463/464 dup of 368/369 | ✅ verified Duplicate |
| 3 | SAN-780 → SEARCH-002 | ✅ 2026-06-09 |
| 4 | SAN-563 dup of SAN-551 | ✅ 2026-06-09 |
| 5 | SAN-798/799 dup of 800/801 | ✅ 2026-06-09 |
| 6 | SAN-470 dup of SAN-469 | ✅ 2026-06-09 |
| 7 | SAN-437/360 dup of SAN-574 | ✅ 2026-06-09 |
| 8 | SAN-227/228/231 GS reopen | ✅ 2026-06-09 |
| **9** | **CSV re-export** | 🟡 [`csv-audit-report.md`](../audit/csv-audit-report.md) — **bottleneck** |
| **10** | **Rollup reconciliation** | 🟡 [`rollup-validation-report.md`](../audit/rollup-validation-report.md) baseline |
| — | VEB import plan | ✅ [`veb-import-plan.md`](../audit/veb-import-plan.md) — 18/18 filed |
| — | Launch blocker verification | ✅ [`launch-blocker-verification.md`](../audit/launch-blocker-verification.md) |

# Linear tracker — reference (archive)

**CSV root:** [`CSV/`](../CSV/) · **Markdown:** [`markdown/`](../markdown/) · **Generator:** [`markdown/generate.py`](../markdown/generate.py)

Run after any Linear bulk create, status sweep, or before sprint Done gates.

---

## Master rollup — open actions (all packs)

Last crosswalk: **2026-06-09**. Dedicated trackers in [`markdown/`](../markdown/).

| Pack | Tracker | Specs / issues | In markdown | **Still to do** |
|------|---------|----------------|-------------|-----------------|
| Core | [`core.md`](../markdown/core.md) | 21 CSV | ✓ | Re-export CSV · keep SAN-115/116/412 manual |
| MVP | [`mvp.md`](../markdown/mvp.md) | 158 CSV | ✓ | Re-export SAN-835–849 when filed |
| ADV | [`ADV.md`](../markdown/ADV.md) | 191 post-MVP | ✓ | Re-export after bulk create |
| CHAT sprint | [`CHAT.md`](../markdown/CHAT.md) | 11 CSV | ✓ (subset) | Sprint exit SAN-831 gates |
| Maps | [`maps.md`](../markdown/maps.md) | 13 active MAP | 13/13 | — |
| Grounding | [`grounding.md`](../markdown/grounding.md) | GS-005–009 + SEARCH | 8/8 | — |
| Mastra | [`mastra.md`](../markdown/mastra.md) | 25 AGT + MIS | ✓ | AGT-PTR-00 disk gate · file after SAN-683 |
| Partners | [`partners.md`](../markdown/partners.md) | 69 CSV | ~52/69 | P1 MKT → ADV optional |
| **Partner CRM** | ADV § CRM | CRM-001–012 | **12/12** | Reconcile SAN-723 vs CRM-002/003 |
| Real estate | [`real-estate.md`](../markdown/real-estate.md) | RE-001–020 | **20/20** | coordinate 407/485 |
| Revenue | [`revenue.md`](../markdown/revenue.md) | R1+CW 8 filed | 8/8 + 7 overlap | Import R2 (7) · R3–R5 not filed |
| Trips | [`trips.md`](../markdown/trips.md) | TRIP-001–019 | **19/19** | — |
| UX | [`ux.md`](../markdown/ux.md) | 9 active + UX-037 sprint | **19/19** | — |
| Vector | [`vector.md`](../markdown/vector.md) | VEC-001–007 | **7/7** | — |
| Venues | [`venues.md`](../markdown/venues.md) | VEN MVP + DATA + VEB | **46/46** | VEB hygiene · optional parent epic · SAN-368 blocker |
| Wireframes | [`wireframes.md`](../markdown/wireframes.md) | WIRE-001–026 | **25/26** | WIRE-026 dup only |
| OpenClaw | [`openclaw.md`](../markdown/openclaw.md) | OCL-001…042 | **40/40** filed | OCL-028/029 deferred · cross-pack in ADV |

**Active work:** Track A only. Track B parallel. Track C optional. See top of file.

---

## Trips pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/trips/`](../../tasks/trips/tasks/INDEX.md) · **Tracker:** [`markdown/trips.md`](../markdown/trips.md)

| Question | Answer |
|----------|--------|
| TRIP-001…019 in Linear? | **19/19** — SAN-273–291 cluster |
| In mvp + ADV? | **19/19** |
| Data spine (data-026–034)? | SAN-328, 353–355, 357–358 in ADV |

**Checklist:** [x] Create `trips.md` (2026-06-09)

---

## UX pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/ux/tasks/INDEX.md`](../../tasks/ux/tasks/INDEX.md) · **Tracker:** [`markdown/ux.md`](../markdown/ux.md) · **Sprint:** [`CHAT.md`](../markdown/CHAT.md) § UX-037

| Question | Answer |
|----------|--------|
| Active UX-020…034 in markdown? | **9/9** — mvp + ADV (444 Phase 2) |
| UX-037 sprint (SAN-822–831)? | **10/10** in CHAT.md |
| Shipped archive (14 specs)? | Bundled — no per-SAN rows |

**Added 2026-06-09:** SAN-321, 322, 436, 440 → mvp · SAN-444 → ADV

**Checklist:** [x] Create `ux.md` · [x] Patch missing wave-1 UX SANs · [x] Dedupe SAN-437/574 → SAN-574 Done (2026-06-09)

---

## Vector pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/vector/`](../../tasks/vector/INDEX.md) · **Tracker:** [`markdown/vector.md`](../markdown/vector.md)

| Question | Answer |
|----------|--------|
| VEC-001…007 → SAN-151–157? | **7/7** in ADV § Platform — Vector |

**Checklist:** [x] Create `vector.md` (2026-06-09)

---

## Venues pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/venues/tasks/INDEX-VENUE.md`](../../tasks/venues/tasks/INDEX-VENUE.md) · **Tracker:** [`markdown/venues.md`](../markdown/venues.md)

| Question | Answer |
|----------|--------|
| VEN MVP SAN-292–314? | **23/23** in mvp |
| DATA-001…008 SAN-325–338? | **10/10** in mvp/ADV (337 added 2026-06-09) |
| VEB-001…018? | **18/18** — SAN-492–509 · Events Platform · import 2026-06-04 |
| VEB wireframes EVT-051…055? | **5/5** — SAN-510–514 |
| Release blocker? | **SAN-368** MAP-002B ADK on prod |

**Checklist:** [x] Create `venues.md` · [x] Add SAN-337 to ADV · [x] VEB filed — see [`veb-import-plan.md`](../audit/veb-import-plan.md)

---

## OpenClaw pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/openclaw/index-ocl.md`](../../tasks/openclaw/index-ocl.md) · **Tracker:** [`markdown/openclaw.md`](../markdown/openclaw.md) · **Import log:** [`import-log.json`](../../tasks/linear/import-log.json)

| Question | Answer |
|----------|--------|
| OCL-001…042 filed in Linear? | **40/40** — SAN-187–226 (AUT-001…040 + OCL-042) |
| OCL-028 / OCL-029 (Paperclip)? | **Deferred** — no Linear by design |
| In ADV § Automation — OpenClaw? | **40/40** |
| Cross-pack OpenClaw SANs? | **5/5** — SAN-133, 134, 509, 543, 688 in ADV |

**Cross-pack (track in `openclaw.md`, not duplicate rows):**

| Spec | Linear | Pack |
|------|--------|------|
| EVP-030 | SAN-133 | events |
| EVP-031 | SAN-134 | events |
| CTEST-011 | SAN-543 | contest |
| VEB-018 | SAN-509 | venues |
| — | SAN-688 | partners |

**Checklist:** [x] Create `openclaw.md` (2026-06-09) · [ ] OCL-013 coffee-tour gate — CTI-001A/003 before MVP crawl

---

## Wireframes pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/wireframes/screens/INDEX.md`](../../tasks/wireframes/screens/INDEX.md) · **Tracker:** [`markdown/wireframes.md`](../markdown/wireframes.md)

| Question | Answer |
|----------|--------|
| WIRE-001…025 in ADV? | **24/25** active |
| WIRE-026 (SAN-272)? | Canceled dup — track in wireframes.md only |
| Browse scr pairs? | SAN-490/491/519/478/118 — see venues + real-estate trackers |

**Added 2026-06-09:** SAN-238, 241, 260, 267 → ADV

**Checklist:** [x] Create `wireframes.md` · [x] Patch WIRE gaps in ADV

---

## Mastra pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/mastra/`](../../tasks/mastra/INDEX.md) · **AGT roadmap:** [`plan/index-mastra.md`](../../tasks/mastra/plan/index-mastra.md) · **AGT-PTR:** [`partners/AGT-PTR-INDEX.md`](../../tasks/mastra/partners/AGT-PTR-INDEX.md) · **Tracker:** [`markdown/mastra.md`](../markdown/mastra.md) · **Canonical CSV:** [`AI & Intelligence › Issues.csv`](./CSV/AI%20%26%20Intelligence%20%E2%80%BA%20Issues.csv)

### Verdict

| Question | Answer |
|----------|--------|
| AGT-00…17 (25 issues under SAN-588) in markdown? | **25/25** — mvp.md (Phase 0–1) + ADV.md (Phase 2–3) + CHAT.md refs |
| MIS crossover (SEARCH/AI/DATA + MASTRA-MIS-001)? | **7/7** — mvp + ADV + CHAT |
| AGT-PTR-01…07 (SAN-705–711)? | **7/7** — ADV § Partner AI Layer |
| AGT-PTR-00 (CK architecture)? | Disk-only design gate — no Linear |
| Shipped MASTRA-001–005 archive | No SAN — OK |

### Missing from markdown

| Spec | Linear | Action |
|------|--------|--------|
| AGT-PTR-00 | — | Disk design gate — file Linear after SAN-683 |

### Checklist — mastra pack hygiene

- [x] Create **`mastra.md`** full AGT spine tracker (2026-06-09)
- [x] Add **SAN-705–711** to ADV § Partner AI Layer (2026-06-09)
- [x] Add **SAN-384, 388, 395, 396** to ADV (MIS crossover) (2026-06-09)
- [ ] AGT-PTR-00 — file Linear only after SAN-683 schema lands (design gate stays disk)

---

## Partners pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/partners/`](../../tasks/partners/00-INDEX.md) · **Index:** [`index-partners.md`](../../tasks/partners/index-partners.md) · **Tracker:** [`markdown/partners.md`](../markdown/partners.md) · **Canonical CSV:** [`Partners › Issues.csv`](./CSV/Partners%20%E2%80%BA%20Issues.csv)

### Verdict

| Question | Answer |
|----------|--------|
| Issues in Partners CSV | **69** |
| In `mvp.md` + `ADV.md` + trackers | **~52/69** |
| P0 MKT landings in markdown | **9/9** — mvp § Partners (2026-06-09) |
| CRM spine CRM-001–012 | **12/12** — ADV § Partner CRM + SAN-832 mvp |
| PTR-AI dupes (798/799 vs 800/801) | ✅ Canonical SAN-800/801 · dups marked 2026-06-09 |
| SAN-666 | Canceled — use **SAN-690** only |

### Still missing from mvp/ADV (tracked in `partners.md`)

| Priority | Linear | Title |
|----------|--------|-------|
| P1 | SAN-662, 712–714, 726 | MKT landings (About, nightlife, restaurants, cafés, /business) |
| P1 | SAN-684 | PTR — Lead-generation engine |
| Hygiene | SAN-798, 799 | PTR-AI dupes of SAN-800/801 |

### Checklist — partners pack hygiene

- [x] Create **`partners.md`** full PTR+MKT+CRM tracker (2026-06-09)
- [x] Add **P0 MKT + foundation** to `mvp.md` § Partners (2026-06-09)
- [x] Add **CRM-001–011** to ADV § Partner CRM (2026-06-09)
- [x] **Dedupe** SAN-798/799 vs SAN-800/801 in Linear (2026-06-09)
- [ ] Reconcile **SAN-723** (Done) vs CRM-002/003 before CRM sprint execution
- [ ] Add P1 MKT (662, 712–714, 726) to ADV § Partners when landing sprint starts

---

## Real-estate pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/real-estate/`](../../tasks/real-estate/tasks/INDEX.md) · **Tracker:** [`markdown/real-estate.md`](../markdown/real-estate.md) · **Canonical:** `mvp.md` § Rental Cards MVP + `ADV.md` § RE Browse

### Verdict

| Question | Answer |
|----------|--------|
| RE-001…020 on disk | **20** specs |
| RE specs with Linear SAN | **20/20** — mapped to SAN-467–487 cluster |
| In `mvp.md` + `ADV.md` | **20/20** |
| Shipped archive (F17, F46, F47) | No per-task SAN — OK |

### Hygiene

| Issue | Action |
|-------|--------|
| SAN-469 / SAN-470 | ✅ SAN-469 canonical · SAN-470 dup · full RE-003 body |
| SAN-407 / SAN-485 | RE-017/018 clarify bypass — coordinate single owner |
| RE-007 / SAN-557 | G2 lead proof — RE-007 + CW-5 same acceptance |

### Checklist — real-estate pack hygiene

- [x] Create **`real-estate.md`** RE-001–020 spine (2026-06-09)
- [x] Dedupe **SAN-469/470** — SAN-470 dup of SAN-469 (2026-06-09)
- [ ] RE-004/006 Done evidence refresh before landlord loop (RE-008)

---

## Revenue pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/revenue/`](../../tasks/revenue/INDEX-revenue.md) · **Import log:** [`LINEAR-REVENUE.md`](../../tasks/revenue/LINEAR-REVENUE.md) · **Tracker:** [`markdown/revenue.md`](../markdown/revenue.md)

### Verdict

| Question | Answer |
|----------|--------|
| R1 pilot (C13, C1, C2) in Linear | **3/3** — SAN-550, 551, 552 in ADV |
| CW track in Linear | **5/5** — SAN-553–557 in ADV § Integrations |
| Overlap/defer issues | **7** — SAN-559–565 in ADV (triage only) |
| R2–R5 not imported | **32 tasks** — no Linear issues yet (by design) |
| MVP-exit gate | SAN-178, 115, 368 — blocks all revenue until closed |

### Missing from markdown

| Task tier | Count | Action |
|-----------|------:|--------|
| R2 (C11, C3, C12, C6, C15, C9, C10) | 7 | Import after C2 proof — not in CSV |
| R3-A (C4, C5, C8) | 3 | Import after C3 |
| R3-B (C7, C14) | 2 | Blocked CW-3 |
| R4 (M1–M12) | 12 | Months 3–6 |
| R5 (A1–A10) | 10 | Strategy only |

### Checklist — revenue pack hygiene

- [x] Create **`revenue.md`** R1+CW + defer table (2026-06-09)
- [x] Close **SAN-563** as dup of SAN-551 (2026-06-09)
- [ ] Import **R2 batch** when MVP-exit gate closes
- [ ] C5 self-serve `/advertise` — file separately from C1 Agency section

---

## Maps pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/maps/`](../../tasks/maps/INDEX.md) · **Done archive:** [`archive/maps-A/`](../../tasks/archive/maps-A/) · **Tracker:** [`markdown/maps.md`](../markdown/maps.md) · **Canonical CSV:** [`Discovery Platform › Issues.csv`](./CSV/Discovery%20Platform%20%E2%80%BA%20Issues.csv)

### Verdict

| Question | Answer |
|----------|--------|
| Active MAP specs on disk | **13** (+ 23 archived Done) |
| Active specs with Linear SAN | **12/12** (MAP-DOC-001 doc-only) |
| Active specs in `mvp.md` / `ADV.md` | **13/13** — SAN-789 → MAP-035 in ADV (2026-06-09) |
| Shipped archive (MAP-001–031, 002D/E) | **No SAN** — bundled W1 (`inLinear: false`) · OK |
| Dedicated `maps.md` | **Yes** — created 2026-06-09 |

### Missing from `mvp.md` + `ADV.md` + `core.md` + `CHAT.md` (add or track)

| Spec | Linear | Status | Action |
|------|--------|--------|--------|
| MAP-005 audit slice | [SAN-776](https://linear.app/sanjiovani/issue/SAN-776) | Backlog | FieldMask + cache audit — add to mvp Maps § or keep `maps.md` |
| MAP-008B CI slice | [SAN-788](https://linear.app/sanjiovani/issue/SAN-788) | Backlog | CI env guard — child of SAN-369 |
| MAP-035 | [SAN-789](https://linear.app/sanjiovani/issue/SAN-789) | Backlog | ✅ Renamed from MAP-010 (2026-06-09) · not SAN-104 |
| MAP-DOC-001 | — | Done | Doc-only — no Linear needed |

### Active spec → Linear (canonical)

| Spec | SAN | Status | In mvp | In ADV |
|------|-----|--------|:------:|:------:|
| MAP-002B | SAN-368 | In Progress | ✓ | — |
| MAP-008B | SAN-369 | Done | ✓ | — |
| MAP-005 | SAN-105 | Backlog | — | ✓ |
| MAP-006 | SAN-106 | Backlog | — | ✓ |
| MAP-012A | SAN-107 | Backlog | — | ✓ |
| MAP-012 | SAN-230 | Todo | — | ✓ |
| MAP-010 | SAN-104 | Backlog | ✓ | — |
| MAP-011A | SAN-465 | Backlog | — | ✓ |
| MAP-011 | SAN-229 | Todo | — | ✓ |
| MAP-023 | SAN-108 | Backlog | — | ✓ |
| MAP-002A | SAN-101 | Backlog | — | ✓ |
| MAP-034 | SAN-466 | Backlog | — | ✓ |

### Checklist — maps pack hygiene

- [x] Add **SAN-776** + **SAN-788** to `mvp.md` § Maps (2026-06-09)
- [x] Rename **SAN-789** → **MAP-035** (2026-06-09) · added ADV.md + maps.md
- [x] Close/mark dup **SAN-463/464** — already Duplicate of SAN-368/369 (verified 2026-06-09)
- [ ] Keep superseded **SAN-102/103** as canceled only — canonical **SAN-105/106**
- [ ] Shipped archive row in `maps.md` § Shipped — no Linear issues to file

---

## Grounding-search pack ↔ Linear ↔ markdown (2026-06-09)

**Spec root:** [`docs/tasks/grounding-search/`](../../tasks/grounding-search/) · **Index:** [`tasks/INDEX.md`](../../tasks/grounding-search/tasks/INDEX.md) · **Done archive:** [`archive/grounding-search-A/`](../../tasks/archive/grounding-search-A/) · **Parent ship:** [`MAP-002D`](../../tasks/archive/maps-A/MAP-002D-search-grounding-enable.md) (Done, no SAN) · **Canonical CSV:** [`Discovery Platform › Issues.csv`](./CSV/Discovery%20Platform%20%E2%80%BA%20Issues.csv)

### Verdict

| Question | Answer |
|----------|--------|
| All GS specs accounted in Linear? | **8/9 mapped** — GS-001–004 shipped with MAP-002D (no per-task SAN); GS-005–009 have SAN-* |
| GS-005–009 in `mvp.md` / `ADV.md` / `CHAT.md`? | **5/5 in ADV + grounding.md** (SAN-227–231 reopened) · SEARCH-001/002 in ADV |
| Dedicated `grounding.md` tracker? | **Yes** — GS + SEARCH spine (2026-06-09) |
| Blocking hygiene issue? | **None** — SAN-780 renamed SEARCH-002; GS-005 = SAN-227 |

### Spec → Linear → markdown (canonical)

| Spec | Disk | Linear | Status | In markdown | Notes |
|------|------|--------|--------|-------------|-------|
| **MAP-002D** | archive Done | — | Shipped W1 | ❌ | Parent: ADK SearchAgent; `implementation-order.json` `inLinear: false` |
| **GS-001** | archive Done | — | Shipped | ❌ | Types + parser — bundled MAP-002D |
| **GS-002** | archive Done | — | Shipped | ❌ | Web citation UI — bundled MAP-002D |
| **GS-003** | archive Done | — | Shipped | ❌ | Quota + logging — bundled MAP-002D |
| **GS-004** | archive Done | — | Shipped | ❌ | Freshness router — bundled MAP-002D |
| **GS-005** | active | [SAN-227](https://linear.app/sanjiovani/issue/SAN-227) | Backlog | ADV § Grounding | ✅ Reopened 2026-06-09 |
| **GS-006** | active | [SAN-228](https://linear.app/sanjiovani/issue/SAN-228) | Backlog | ADV § Grounding | ✅ Reopened 2026-06-09 |
| **GS-007** | active | [SAN-229](https://linear.app/sanjiovani/issue/SAN-229) | Todo | ADV § Search — Grounding | Restaurant closure verify |
| **GS-008** | active | [SAN-230](https://linear.app/sanjiovani/issue/SAN-230) | Todo | ADV § Search — Grounding | Neighborhood news search |
| **GS-009** | active | [SAN-231](https://linear.app/sanjiovani/issue/SAN-231) | Backlog | ADV § Grounding | ✅ Reopened 2026-06-09 |

### Related Discovery / MVP (not GS-* but grounding-adjacent)

| Linear | Title | In markdown | Tie to pack |
|--------|-------|-------------|-------------|
| [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK grounding on production | mvp.md | Grounding Lite prod path |
| [SAN-294](https://linear.app/sanjiovani/issue/SAN-294) | Nightlife intent search-grounded-places | mvp.md | Live concierge grounding |
| [SAN-549](https://linear.app/sanjiovani/issue/SAN-549) | Wire intent:nightlife | mvp.md | Follow-on SAN-294 |
| [SAN-790](https://linear.app/sanjiovani/issue/SAN-790) | SEARCH-001 search_grounded_places hardening | ❌ | Discovery CSV only |
| [SAN-780](https://linear.app/sanjiovani/issue/SAN-780) | SEARCH-002 hybrid rental/event | ADV.md | ✅ Renamed 2026-06-09 |
| [SAN-790](https://linear.app/sanjiovani/issue/SAN-790) | SEARCH-001 search_grounded_places | ADV.md | ✅ Added 2026-06-09 |
| [SAN-124](https://linear.app/sanjiovani/issue/SAN-124) | Google Search Grounding query templates | ADV.md | Phase 2 ADK Search |
| [SAN-126](https://linear.app/sanjiovani/issue/SAN-126) | ADK SearchAgent + MapsAgent sidecar | ADV.md | Phase 2 · blocked SAN-122 |

### Checklist — grounding pack hygiene

- [x] **GS-005 collision:** SAN-780 → SEARCH-002 (2026-06-09)
- [x] **Canceled carry-forward:** SAN-227/228/231 reopened as GS-005/006/009 (2026-06-09)
- [x] Create **`grounding.md`** tracker (2026-06-09)
- [x] **Discovery orphans:** SAN-790, SAN-780 → ADV § Search — Grounding (2026-06-09)
- [ ] **Spec paths in Linear bodies** still say `tasks/grounding-search/...` — OK; no path update needed after `docs/` move

---

## CSV ↔ markdown sync matrix (2026-06-08)

| Tracker | Canonical CSV | Rows in CSV | Unique IDs in `.md` | CSV → MD gaps | MD ahead of CSV |
|---------|---------------|------------:|--------------------:|--------------:|----------------:|
| [`core.md`](../markdown/core.md) | `Core Foundation › Issues.csv` | 21 | 26 | **0** | 5 (SAN-115, 116, 412, 547, 823 — Linear sync) |
| [`mvp.md`](../markdown/mvp.md) | `MVP issues.csv` | 158 | 173 tables† | **0** | **15** (SAN-835–849 — not exported yet) |
| [`ADV.md`](../markdown/ADV.md) | `All issues.csv` (phase:post-mvp filter) | 191 post-MVP | 320 | **0**‡ | SAN-850–854 + SAN-612–626 patched manually |
| [`CHAT.md`](../markdown/CHAT.md) | `CHAT issues.csv` | 11 | 10 sprint§ | **0** | By design — sprint subset only |
| [`maps.md`](../markdown/maps.md) | `Discovery Platform › Issues.csv` | 25 | 15 active MAP rows | **0** | Re-export CSV after Phase 0 |
| [`mastra.md`](../markdown/mastra.md) | `AI & Intelligence › Issues.csv` | ~80 | 32 AGT+MIS+PTR | **0** | AGT-PTR-00 disk only |
| [`partners.md`](../markdown/partners.md) | `Partners › Issues.csv` | 69 | ~52 cross-refs | **17** | P1 MKT + SAN-684 + PTR-AI dupes |
| [`real-estate.md`](../markdown/real-estate.md) | `mvp.md` rental cluster | 20 RE specs | 20/20 | **0** | SAN-469/470 dup hygiene |
| [`revenue.md`](../markdown/revenue.md) | Growth + Commerce CSV | 8 pilot + 7 overlap | 15/15 filed | **32** | R2–R5 not imported |
| [`trips.md`](../markdown/trips.md) | mvp + ADV trips cluster | 19 TRIP | 19/19 | **0** | — |
| [`ux.md`](../markdown/ux.md) | UX view + CHAT sprint | 19 active | 19/19 | **0** | SAN-437/574 dup |
| [`vector.md`](../markdown/vector.md) | ADV § Vector | 7 VEC | 7/7 | **0** | — |
| [`venues.md`](../markdown/venues.md) | mvp venues + ADV data + VEB | ~46 VEN/DATA/VEB | 46/46 | **0** | CSV re-export for SAN-492–509 |
| [`wireframes.md`](../markdown/wireframes.md) | ADV Discovery UI | 26 WIRE | 25/26 | **1** | WIRE-026 dup |
| [`openclaw.md`](../markdown/openclaw.md) | `Platform Infrastructure › Issues.csv` | 42 OCL (40 filed) | 40/40 | **2** | OCL-028/029 deferred |
| [`grounding.md`](../markdown/grounding.md) | Discovery Platform CSV | GS+SEARCH | 8/8 | **0** | MAP-002D + GS-001–004 shipped archive |

† Section tables total 173; blocker lists repeat IDs (do not double-count).  
‡ After adding SAN-612–626 to ADV § Integrations.  
§ CHAT view = UX-037 chain; CHATW epic tracked in ADV, not CHAT.md.

### Verdict

| Question | Answer |
|----------|--------|
| Missed from `MVP issues.csv` in mvp.md? | **No** — all 158 present |
| Missed phase:mvp from `All issues.csv`? | **No** |
| Missed phase:post-mvp in ADV.md? | **No** (after SAN-612–626 patch) |
| SAN-835–854 in CSV? | **No** — markdown only until re-export |
| CHAT-labeled but not in CHAT.md? | **16** — SAN-612–626 + SAN-689 → **ADV § Integrations** (not concierge sprint) |

### Re-export command (Sofía)

```bash
# Linear UI → each saved view → Export CSV → overwrite files in linear/CSV/
# Then optionally:
cd /home/sk/mdeai/mdeapp/docs/linear/markdown && python3 generate.py
# Re-apply manual patches: core Payments, mvp Admin & Ops, ADV CHAT-001–015, SAN-835–854
```

---

## CHAT sprint — per-issue gate

**View:** [CHAT Linear view](https://linear.app/sanjiovani/view/chat-5e4071d8144e) · **Tracker:** [`markdown/CHAT.md`](../markdown/CHAT.md) · **AI project:** [AI & Intelligence](https://linear.app/sanjiovani/project/ai-and-intelligence-fe206edb90b2/issues)

Use before marking any **UX-037 sprint** issue **Done** (SAN-822 children + SAN-733).

| Step | Check |
|------|-------|
| 1 | Success criteria in `CHAT.md` § Per-task — all boxes checked |
| 2 | Evidence folder exists under `tasks/testing/evidence/YYYY-MM-DD/chat-sprint/san-NNN-*/` |
| 3 | `npm test -- --run` subset for touched area green |
| 4 | Playwright slice green if UI/agent touched |
| 5 | `task-verifier` anti-fake-done gates passed |
| 6 | Prod proof if persona-visible (Tier 1 smoke minimum) |

### Sprint exit ([SAN-831](https://linear.app/sanjiovani/issue/SAN-831))

- [ ] `npm run floor` green
- [ ] `e2e/home-to-chat.spec.ts` 7/7 PASS
- [ ] `chat-smoke.mjs` prod documented
- [ ] Launch readiness ≥ **9.0** in `docs/audits/launch-readiness.md`
- [ ] PR merged · `Closes SAN-822`
- [ ] `CHAT.md` + `mvp.md` CSV footnote still accurate after Linear export

---

## MVP / ADV — tracker hygiene

| Check | Pass when |
|-------|-----------|
| New Linear issues have `phase:mvp` or `phase:post-mvp` | Label set at create time |
| phase:mvp issues appear in `mvp.md` (or CHAT sprint if `label:CHAT` + child of SAN-822) | Grep `SAN-NNN` in markdown |
| phase:post-mvp issues appear in `ADV.md` | Grep `SAN-NNN` in ADV |
| Chatwoot stack (CHAT-001–015) | ADV § Integrations only — not CHAT.md |
| Duplicate SAN IDs in blocker footers | OK for navigation; don't inflate section counts |
| `generate.py` run after CSV refresh | Diff mvp/ADV against manual sections before commit |

---

## VEB import plan (Task 3 — 2026-06-09)

**Deliverable:** [`audit/veb-import-plan.md`](../audit/veb-import-plan.md)

| Question | Answer |
|----------|--------|
| VEB-001…018 in Linear? | **18/18** — SAN-492…509 · project **Events Platform** |
| Disk specs? | **18/18** — `tasks/venues/tasks/event-booking/VEB-*.md` |
| Dual-track naming? | Disk `VEB-*` · Linear title `EVT-033…050` · label `prefix:VEB` |
| Parent epic? | **None yet** — optional VEB-000 epic before Cycle 2 |
| Launch gate? | **No** — VEB is post north-star (Roberto event-venue booking) |

**Checklist:** [x] Import plan doc · [x] `venues.md` VEB table · [ ] Optional parent epic · [ ] Full spec bodies in Linear

---

## Launch blocker verification (Task 4 — 2026-06-09)

**Deliverable:** [`audit/launch-blocker-verification.md`](../audit/launch-blocker-verification.md)

| Persona | Exit proof | Key SAN | Status |
|---------|------------|---------|--------|
| **Andrés** | G1 paid ticket on prod | SAN-178 PAY-001 | 🔴 Todo — **hard blocker** |
| **Roberto** | G3 host publish on prod | SAN-366 EVT-002 | 🟢 Done |
| **Camila** | G2 discovery chat → cards + pins | SAN-733 + SAN-546 | 🟡 733 Done · matrix open |

**MVP ledger:** SAN-115 AIE-001 stays Todo until G1 + G2 + G3 evidence filed.

**Cycle 1 next 5:** SAN-178 → SAN-546 → SAN-548 → SAN-823 → SAN-545

**Checklist:** [x] Launch verification doc · [ ] SAN-178 prod Stripe proof · [ ] SAN-546 prod matrix · [ ] SAN-115 ledger close

---

## Pre-import audit pack (Tasks A1–A6, 14–17)

| Doc | Scope |
|-----|-------|
| [`audit/AUDIT-QUEUE.md`](../audit/AUDIT-QUEUE.md) | Master queue + execution order |
| [`audit/orphan-issue-audit.md`](../audit/orphan-issue-audit.md) | 176 orphans · 92 open |
| [`audit/duplicate-spec-audit.md`](../audit/duplicate-spec-audit.md) | 31 spec collisions · SEARCH-002 |
| [`audit/mvp-scope-audit.md`](../audit/mvp-scope-audit.md) | Bucket assignment · creep risks |
| [`audit/dependency-audit.md`](../audit/dependency-audit.md) | Launch + VEB chains |
| [`audit/route-coverage-audit.md`](../audit/route-coverage-audit.md) | Sitemap ↔ Linear |
| [`audit/mvp-proof-audit.md`](../audit/mvp-proof-audit.md) | 1/3 north-star proofs |
| [`audit/mvp-proof-ledger.md`](../audit/mvp-proof-ledger.md) | SAN-115 G1/G2/G3 evidence |
| [`audit/parent-epic-audit.md`](../audit/parent-epic-audit.md) | VEB-000 · AIE parent |
| [`audit/launch-scope-freeze.md`](../audit/launch-scope-freeze.md) | Keep vs move post-MVP |
| [`audit/veb-readiness-report.md`](../audit/veb-readiness-report.md) | Pre-VEB implementation |
| [`audit/veb-import-plan.md`](../audit/veb-import-plan.md) | VEB-001…018 (filed) |
| [`audit/launch-blocker-verification.md`](../audit/launch-blocker-verification.md) | MVP exit path |
| [`audit/csv-audit-report.md`](../audit/csv-audit-report.md) | CSV ↔ Linear hygiene |
| [`audit/rollup-validation-report.md`](../audit/rollup-validation-report.md) | Rollup baseline |
| [`audit/08-core-audit.md`](./audit/08-core-audit.md) | Core Foundation forensic |
| [`audit/08a-mvp-audit.md`](./audit/08a-mvp-audit.md) | MVP tracker forensic (WIP) |
| [`audit/june-8-audit-tasks.md`](./audit/june-8-audit-tasks.md) | Full CORE+MVP skill audit |
| [`docs/tasks/grounding-search/tasks/INDEX.md`](../../tasks/grounding-search/tasks/INDEX.md) | GS-005–009 active specs |
| [`docs/tasks/archive/grounding-search-A/`](../../tasks/archive/grounding-search-A/) | GS-001–004 Done archive |
| [`markdown/maps.md`](../markdown/maps.md) | MAP-002B–034 spine tracker |
| [`markdown/mastra.md`](../markdown/mastra.md) | AGT-00…17 + MIS + AGT-PTR spine |
| [`markdown/partners.md`](../markdown/partners.md) | PTR + MKT + CRM partner tracker |
| [`docs/tasks/maps/INDEX.md`](../../tasks/maps/INDEX.md) | Active + archived maps specs |
| [`docs/tasks/mastra/plan/index-mastra.md`](../../tasks/mastra/plan/index-mastra.md) | AGT implementation order |
| [`docs/tasks/partners/index-partners.md`](../../tasks/partners/index-partners.md) | Partner lifecycle + MKT registry |
| [`markdown/real-estate.md`](../markdown/real-estate.md) | RE-001–020 Camila rental loop |
| [`markdown/revenue.md`](../markdown/revenue.md) | C/M/CW revenue import + defer |
| [`docs/tasks/revenue/LINEAR-REVENUE.md`](../../tasks/revenue/LINEAR-REVENUE.md) | Revenue pilot import log |
| [`markdown/trips.md`](../markdown/trips.md) | TRIP-001–019 Camila trip loop |
| [`markdown/ux.md`](../markdown/ux.md) | UX active backlog + wave-1 |
| [`markdown/vector.md`](../markdown/vector.md) | VEC-001–007 pgvector spine |
| [`markdown/venues.md`](../markdown/venues.md) | VEN + DATA + VEB tracker |
| [`markdown/wireframes.md`](../markdown/wireframes.md) | WIRE/SCREEN pairing index |
| [`docs/tasks/venues/tasks/INDEX-VENUE.md`](../../tasks/venues/tasks/INDEX-VENUE.md) | Venues execution order |
| [`docs/tasks/wireframes/screens/INDEX.md`](../../tasks/wireframes/screens/INDEX.md) | Platform shell wireframes |
| [`markdown/grounding.md`](../markdown/grounding.md) | GS-005–009 + SEARCH-001/002 spine |
| [`markdown/openclaw.md`](../markdown/openclaw.md) | OCL-001…042 Patricia approval worker |
| [`docs/tasks/openclaw/index-ocl.md`](../../tasks/openclaw/index-ocl.md) | OpenClaw implementation order |
| [`docs/tasks/openclaw/docs/100-openclaw-plan.md`](../../tasks/openclaw/docs/100-openclaw-plan.md) | OpenClaw roadmap + critical path |
