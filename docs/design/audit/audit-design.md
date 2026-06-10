# Design Track Audit — UX Linear × Local Specs

**Audited:** 2026-06-05  
**Scope:** `/home/sk/mdeai/tasks/design` · Linear project [UX](https://linear.app/sanjiovani/project/ux-0ad555e403b4/issues) · SAN-566…SAN-580 · overlap issues per dedup map  
**Passes:** 6/6 complete (local · Linear · deps · dupes · execution · production)

---

## Audit progress tracker

| Pass | Area | Status | Key finding |
|------|------|:------:|-------------|
| 1 | Local file audit | ✅ | 4/14 outputs on disk; 2 missing files + 1 broken ref |
| 2 | Linear issue audit | ✅ | All D-01…D-14 exist; all Backlog (status drift vs local) |
| 3 | Dependency & relation audit | ✅ | `blockedBy` wired on D-06…D-14; D-07 intentionally unblocked |
| 4 | Duplicate / stale audit | ✅ | WIRE-* canceled; card/route overlap documented; residual MOB risk |
| 5 | Execution-readiness | ⚠️ | Phase 0 doc tasks assignable today; Phase 3 needs blockers + scope guards |
| 6 | Production-readiness | ⚠️ | Track B correctly non-blocking MVP; D-09/D-08 unsafe without fixes |

---

## 1. Executive verdict

**Partially Correct**

The design track is **structurally sound** — 14 tasks exist in Linear under epic SAN-566, map 1:1 to local index, dedup intent is documented, and stale WIRE issues are Canceled. It is **not yet safe for blind agent execution** on build tasks (D-07–D-14) because Linear lacks dependency blockers, local/Linear status is out of sync, two spec outputs are missing, and card/route overlap still tempts duplicate work.

---

## 2. Overall score

**74 / 100**

---

## 3. Summary table

| Area                    | Score |     | Main issue                                                                                                      | Required fix                                          |
| ----------------------- | ----: | :-: | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Local spec completeness |    93 | 🟢  | D-04/D-06 artifacts on disk; index synced (2026-06-05)                                                          | None                                                  |
| Linear ↔ local mapping  |    88 | 🟢  | All SAN-567…580 present, titles match                                                                           | Update `index-design.md` project `screens` → **UX**   |
| Labels & project        |    85 | 🟢  | `track:ux` + `scr` on all D tasks; UX project is correct home                                                   | Optional: drop `scr` on pure-doc tasks (D-01–06)      |
| Status sync             |    90 | 🟢  | D-01–06 Done in Linear + on disk (2026-06-05)                                                                   | None for foundation phase                             |
| Blockers (deps)         |    88 | 🟢  | `blockedBy` wired D-06…D-14; D-07 unblocked (intentional)                                                       | D-08 gated on SAN-462 soak (1/3)                      |
| Relations (dedup)       |    82 | 🟢  | D-05/08/09/10/11/12/14 have overlap links                                                                       | Optional: D-06 → dashboard relatedTo                  |
| Duplicate risk          |    92 | 🟢  | Resolved 2026-06-05: SAN-437+360 → Duplicate of SAN-574; SAN-575 skin-only; SAN-265/268 Done; D-14 extends only | None — refresh per-task D-08/D-09/D-14 rows if needed |
| Acceptance criteria     |    90 | 🟢  | §6 Quality Gate + proof commands on SAN-573…580 (2026-06-05)                                    | None — D-01–06 doc tasks need no proof block           |
| MVP non-blocking        |    90 | 🟢  | D-10 post-revenue; Track B explicit in epic                                                                     | Keep D-09 behind Track A on `/rentals`                |
| Agent execution safety  |    88 | 🟢  | Blockers wired + index assignment table; D-07 marked safe; D-08+ gated                                          | Wait SAN-462 before D-08 card refactor                |

---

## 4. Per-task table (D-01…D-14)

| D | Linear | Local? | Linear? | Labels | Project | Blockers | Relations | Dup risk | % | |
|---|--------|:------:|:-------:|:------:|:-------:|:--------:|:---------:|:--------:|--:|:-:|
| D-01 | SAN-567 | ✅ `ia-journey.md` | ✅ Done | ✅ | ✅ UX | — (root) | ✅ | Low | 95 | 🟢 |
| D-02 | SAN-568 | ✅ `design-system.md` | ✅ Done | ✅ | ✅ UX | — | ✅ | Low | 95 | 🟢 |
| D-03 | SAN-569 | ✅ `images.md` | ✅ Done | ✅ | ✅ UX | — | ✅ | Low | 95 | 🟢 |
| D-04 | SAN-570 | ✅ `component-inventory.md` | ✅ Done | ✅ | ✅ UX | — | ✅ | Low | 92 | 🟢 |
| D-05 | SAN-571 | ✅ `explore-wireframe.html` | ✅ Done | ✅ | ✅ UX | — | ✅ WIRE-* | Low | 92 | 🟢 |
| D-06 | SAN-572 | ✅ `dashboard-wireframe.html` | ✅ Done | ✅ | ✅ UX | ←567 | ✅ | Low | 92 | 🟢 |
| D-07 | SAN-573 | ❌ (6 shadcn missing) | Backlog | ✅ | ✅ UX | — **SAFE** | ✅ | Low | 88 | 🟡 |
| D-08 | SAN-574 | ❌ no `browse/*` | Backlog | ✅ | ✅ UX | ←568,569,571,**462** | ✅ | Low | 82 | 🟡 |
| D-09 | SAN-575 | N/A (routes) | Backlog | ✅ | ✅ UX | ←573,574,567,571 | ✅ | Low | 85 | 🟡 |
| D-10 | SAN-576 | N/A | Backlog | ✅ | ✅ UX | ←572,573,574 | ✅ | Low | 85 | 🟡 |
| D-11 | SAN-577 | partial (map exists) | Backlog | ✅ | ✅ UX | ←574,575 | ✅ | Medium | 85 | 🟡 |
| D-12 | SAN-578 | partial (CK chat) | Backlog | ✅ | ✅ UX | ←575 | ✅ | Medium | 85 | 🟡 |
| D-13 | SAN-579 | ✅ `home-wireframe.html` | Backlog | ✅ | ✅ UX | ←574 | ✅ SAN-232 | Medium | 86 | 🟡 |
| D-14 | SAN-580 | N/A | Backlog | ✅ | ✅ UX | ←575–579 | ✅ SAN-265/268 | Low | 88 | 🟡 |

**Dot key:** 🟢 90–100 ready · 🟡 70–89 minor fixes · 🟠 50–69 risky · 🔴 &lt;50 blocked

---

## 5. Findings

### Red flags — resolved 2026-06-05

1. ~~**No Linear blockers**~~ → **Fixed:** `blockedBy` on SAN-572…580; D-07 intentionally unblocked.
2. ~~**Status drift**~~ → **Fixed:** D-01–06 Done in Linear + index.
3. ~~**D-04 blocked on missing input**~~ → **Fixed:** `component-inventory.md` on disk.
4. ~~**D-08 ∥ SAN-437**~~ → **Fixed:** SAN-437 + SAN-360 Duplicate of SAN-574.
5. ~~**index stale (screens project)**~~ → **Fixed:** index says UX + assignment table.

### Remaining yellow flags

1. **SAN-462 soak (1/3)** — D-08 (SAN-574) blocked until 3× scheduled prod synthetic PASS. D-07 can proceed in parallel.
2. **D-07 not started** — 6 shadcn primitives still missing; **assign SAN-573 now**.
3. ~~**D-09 scope ambiguity**~~ → SAN-575 SKIN-ONLY table wired.
4. ~~**D-14 vs SAN-265/268**~~ → MVP polish Done; D-14 extends only.
5. ~~**D-13 missing relation**~~ → SAN-232 relatedTo wired.
6. **MOB-522/523/524/525** — Still open in UX project; overlap D-08/D-11/D-12 but only `relatedTo`, not folded/canceled.
7. **Acceptance criteria thin on build tasks** — D-07–D-13 lack explicit `npm run floor` / Playwright proof lines (D-14 has them).

### Green checks

1. **All 14 D tasks exist** in Linear under SAN-566 with correct D-0N titles and parent.
2. **UX project is the right home** — Created 2026-06-05; epic + D tasks + key overlaps colocated; Linear docs mirror D-01/02/03 process files.
3. **WIRE supersession resolved** — SAN-244, SAN-247, SAN-261, SAN-267 → **Canceled** with relations back to D-05/D-09/D-11.
4. **D-08 dedup language is strong** — SAN-574 description explicitly says REUSE RestaurantCard/AttractionCard/RentalCard; relatedTo SAN-360/437/318/436/525.
5. **D-09 route separation** — relatedTo SAN-478/490/491/519; description says "input, not duplicate."
6. **MVP guardrail present** — Epic + D-10 state "must not block MVP"; Track A leads.
7. **Foundation docs quality** — `ia-journey.md`, `design-system.md`, `images.md`, `explore-wireframe.html` are substantive and cross-linked.
8. **Cards exist in prod code** — `restaurant-card.tsx`, `rental-card.tsx`, `cafe-result-card.tsx` shipped (no `VenueCard`/`browse/*` yet — expected).

---

## 6. Missing items

| Category | Gap |
|----------|-----|
| **Missing tasks** | None — D-01…D-14 all in Linear |
| **Missing local files** | `docs/component-inventory.md` (D-04) · `wireframe/dashboard-wireframe.html` (D-06) · `components/links-components.md` (referenced, never created) |
| **Missing blockers** | All dependency edges from index critical-path diagram (see §8) |
| **Missing relations** | D-13 → SAN-232 · D-06 → SAN-255/259/251/253 · D-07 → (optional) shadcn registry doc |
| **Missing acceptance criteria** | Explicit proof blocks on D-07–D-13 (floor, localhost, evidence path) |
| **Missing proof/tests** | D-04, D-06 have no deliverable to verify; build tasks untested until assigned |

---

## 7. Corrections needed (per task)

| Task | Correction |
|------|------------|
| **D-01** | Mark SAN-567 **Done** (doc shipped). Optional: link to Linear doc "IA-journey". |
| **D-02** | Mark SAN-568 **Done**. Sync `DESIGN.MD` de-drift called out in doc — separate small task or note in D-14. |
| **D-03** | Mark SAN-569 **Done**. |
| **D-04** | Create `component-inventory.md` from `concierge-os-direction.md` §7 + `home-wireframe.html` spec cards; fix or remove `links-components.md` references. |
| **D-05** | Mark SAN-571 **Done** or **In Review**. Keep WIRE relatedTo links. |
| **D-06** | Build annotated `dashboard-wireframe.html` from `mockups/dashboard.html`. Block SAN-572 on SAN-567 (blocks). |
| **D-07** | Run shadcn install; add AC: `npm run floor` green. No blockers needed (parallel with Phase 0). |
| **D-08** | **Block** SAN-574 on SAN-568, SAN-569, SAN-571. **Cancel or subordinate SAN-437** into SAN-574 (single owner). Add AC: extend existing cards, no new card from scratch; cite `restaurant-card.tsx` etc. |
| **D-09** | **Block** on SAN-571, SAN-573, SAN-574. Description amendment: `/restaurants` + `/nightlife` = **skin-only** on Done pages; `/rentals` = coordinate with SAN-478 (Track A owns functional fix). Do **not** create new route issues. |
| **D-10** | **Block** on SAN-572, SAN-573, SAN-574. Label `phase:post-mvp`. |
| **D-11** | **Block** on SAN-574, SAN-575. Clarify SAN-524 is mobile slice of D-11, not parallel map system. |
| **D-12** | **Block** on SAN-575. Fold SAN-522/523 scope into responsive section of D-12 or D-14. |
| **D-13** | **Block** on SAN-574. **relatedTo SAN-232**. Skin home bands; don't rebuild chat chrome. |
| **D-14** | **Block** on SAN-575…579. Merge SAN-265/268 into D-14 (mark Done when D-14 ships) — extend a11y/empty states to *new* surfaces only. |

**Global:** Update `index-design.md` line 35 — project **UX** not `screens`. Wire all blockers in Linear.

---

## 8. Correct implementation order

### Exact recommended order

```
Phase 0 (parallel, now):
  D-04 (after inventoring from existing docs) — only open doc gap
  [Already done locally: D-01, D-02, D-03 — sync Linear status]

Phase 1 (parallel):
  D-06 (dashboard wireframe) — only remaining wireframe gap
  [D-05 done]

Phase 2:
  D-07 (shadcn install) — can run anytime; before Phase 3

Phase 3 (serial core):
  D-08 → D-09 → D-11 → D-12
         └→ D-13 (parallel after D-08, before D-14)
  D-10 (after D-06 + D-07 + D-08; post-MVP, lowest priority)

Phase 4:
  D-14 (after all Phase 3)
```

### Parallel lanes

| Can run together | Must wait for |
|------------------|---------------|
| D-04 + D-06 + D-07 | — |
| D-13 + D-11/D-12 (after D-08, D-09 started) | D-08 |
| Track A SAN-478 (`/rentals` fix) | Never blocked by Track B |

### Linear blockers to wire (minimum)

```
SAN-572 blockedBy SAN-567
SAN-571 blockedBy SAN-567          (soft — D-05 already done)
SAN-574 blockedBy SAN-568,569,571
SAN-575 blockedBy SAN-567,571,573,574
SAN-577 blockedBy SAN-574,575
SAN-578 blockedBy SAN-575
SAN-579 blockedBy SAN-574
SAN-576 blockedBy SAN-572,573,574
SAN-580 blockedBy SAN-575,576,577,578,579
```

---

## 9. Production-readiness judgment

| Question | Answer |
|----------|--------|
| Is the design track production-ready? | **Partially** — specs and dedup *intent* are ready; *enforcement* (blockers, status, missing artifacts) is not. |
| Will tasks succeed if assigned today? | **Phase 0 doc gaps (D-04, D-06): yes with guidance.** **D-07: yes.** **D-08–D-14: high duplicate/rebuild risk without blockers and scope comments.** |
| What must be fixed before execution? | (1) Wire blockers (2) Sync Done statuses (3) Ship D-04 + D-06 artifacts (4) Merge SAN-437 → D-08 (5) Amend D-09 for skin-only on Done routes (6) Update index project name |

---

## 10. Final recommendation

**Safe only after fixes**

| Slice | Verdict |
|-------|---------|
| Assign **D-04, D-06, D-07** today | ✅ Safe with explicit "don't touch prod routes" |
| Assign **D-01–D-03, D-05** | ✅ Already done — sync Linear, don't re-execute |
| Assign **D-08–D-14** | ❌ Not safe until blockers + dedup merges applied |
| Track B blocks MVP? | ✅ No — if D-09 stays behind SAN-478 and D-10 stays post-MVP |

**First 30-minute fix list:** Update SAN-567/568/569/571 → Done · Create D-04 + D-06 files · Wire blockers on SAN-574+ · Add "skin-only, do not rebuild" comment on SAN-575 · Fix `index-design.md` UX project · Cancel SAN-437 as duplicate of SAN-574.

---

## Appendix — overlap issue snapshot

| Issue | Status | vs D-task | Action |
|-------|--------|-----------|--------|
| SAN-244/247/261/267 (WIRE) | Canceled | D-05/D-09/D-11 | ✅ Superseded |
| SAN-360/437 (card shell) | Backlog/Todo | D-08 | Merge into SAN-574 |
| SAN-478 `/rentals` | Todo | D-09 input | Track A owns build; D-09 skins after |
| SAN-490 `/restaurants` | **Done** | D-09 input | Skin only |
| SAN-491 `/nightlife` | **Done** | D-09 input | Skin only |
| SAN-519 `/cafes` | Backlog | D-09 input | Build via SCREEN-028; D-09 skins after |
| SAN-265/268 (polish) | In Review | D-14 | Merge — extend, don't redo |
| SAN-522/523/524/525 (MOB) | Backlog | D-08/11/12 | Fold into D-12/D-14 responsive |

---

*Next audit trigger: after blockers wired + D-04/D-06 land on disk.*
