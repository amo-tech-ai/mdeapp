**Yes — that row is done.** The audit table is stale; it still describes the pre-fix state.

| Item | Was (audit) | Now |
|------|-------------|-----|
| `component-inventory.md` | Missing | ✅ `tasks/design/docs/component-inventory.md` (~146 lines, 70/20/10 tagged) |
| `dashboard-wireframe.html` | Missing | ✅ `tasks/design/wireframe/dashboard-wireframe.html` (5-zone annotated spec) |
| `links-components.md` ref | Broken in index | ✅ Removed from `index-design.md`; D-04 pulls from `concierge-os-direction.md` §7 + home-wireframe instead |
| Index status | D-04/D-06 ☐ | ✅ Both marked done |
| Linear | Backlog | ✅ **SAN-570**, **SAN-572** → Done |

**Minor leftovers (not blockers):**
- `design-process.md` still mentions `links-components.md` — historical note only
- `audit-design.md` summary row still says 72/🟡 — should be **~92–95 🟢**
- SAN-570 description still says “Consolidate `links-components.md`” — file was never on disk; actual source was concierge-os + home-wireframe

**Quality note:** `dashboard-wireframe.html` is leaner than `explore-wireframe.html` (5 zones vs 12 sections). That’s fine for D-06 — it covers the 5-domain OS layout; D-10 owns the route re-skin.

**Updated audit row would read:**

| Local spec completeness | ~93 | 🟢 | Phase 0 docs + wireframes complete on disk | None — refresh `audit-design.md` scorecard |

**Yes — completed and correct** for what that row asked for.

| D task | Linear | Status | Matches disk? |
|--------|--------|--------|---------------|
| D-01 | SAN-567 | **Done** | ✅ `ia-journey.md` |
| D-02 | SAN-568 | **Done** | ✅ `design-system.md` |
| D-03 | SAN-569 | **Done** | ✅ `images.md` |
| D-05 | SAN-571 | **Done** | ✅ `explore-wireframe.html` |

Also synced beyond the original row (same session):

| D task | Linear | Status |
|--------|--------|--------|
| D-04 | SAN-570 | **Done** |
| D-06 | SAN-572 | **Done** |

**Correctly still Backlog** (not done yet — expected):

`SAN-573` (D-07) · `574` · `575` · `576` · `577` · `578` · `579` · `580`

**Verdict:** The 🔴 status-sync finding is **resolved** for foundation/wireframe tasks. Linear and `index-design.md` agree on D-01–06.

**Updated audit row:**

| Status sync | ~90 | 🟢 | Phase 0 + wireframes synced (6 Done) | None for D-01–06 · refresh `audit-design.md` |

**Only nit:** `audit-design.md` still shows the old 45/🔴 line — the doc is stale, not Linear.

---

**Duplicate risk — resolved 2026-06-05**

| Pair | Action | Linear state |
|------|--------|--------------|
| D-08 vs SAN-437 | Merged | SAN-437 → **Duplicate** of SAN-574 |
| D-08 vs SAN-360 | Merged | SAN-360 → **Duplicate** of SAN-574 |
| D-09 vs Done routes | Clarified | SAN-575 **SKIN-ONLY** table; SAN-490/491 **Done** + relatedTo (not duplicateOf) |
| D-14 vs SAN-265/268 | Split scope | SAN-265/268 → **Done** (MVP shipped); SAN-580 **EXTEND** to D-09…D-13 surfaces only |

**Updated audit row:** Duplicate risk ~92 🟢 — no parallel card-shell or polish tickets active.

**Duplicate risk is cleared** — all three pairs from the audit row are resolved in Linear.

| Risk | Resolution |
|------|------------|
| **D-08 vs SAN-437** | SAN-437 → **Duplicate** of **SAN-574** (already done) |
| **D-08 vs SAN-360** | SAN-360 → **Duplicate** of **SAN-574** (just applied) |
| **D-09 vs Done routes** | SAN-575 has **SKIN-ONLY** table; SAN-490/491 are **Done** with `relatedTo` only — functional build ≠ re-skin |
| **D-14 vs polish** | SAN-265/268 → **Done** (MVP evidence); SAN-580 scoped to **extend** SCREEN-019/020 to re-skinned surfaces only |

**Canonical owners now:**
- Card shell → **SAN-574** (D-08) only — absorbs 437 + 360
- Route re-skin → **SAN-575** (D-09) — style after SAN-478/519 ship function
- Post-re-skin polish → **SAN-580** (D-14) — net-new surfaces, not a second MVP pass

**Not duplicates** (intentional `relatedTo`): MOB-522/523/525 → fold into D-11/D-12/D-14 when those start; UX-024/026/029 → downstream of D-08, separate scope.

Audit scorecard updated: duplicate risk **68/🟠 → 92/🟢** in `audit-design.md`; progress logged in `audit-3-progress.md`.

---

**Acceptance criteria — resolved 2026-06-05**

Added **§6 Quality Gate** checklist + **Proof commands (Done gate)** to all build tasks:

| D | Linear | Proof highlights |
|---|--------|------------------|
| D-07 | SAN-573 | `shadcn add` · `npm run floor` · `npm run build` · 6 ui files |
| D-08 | SAN-574 | Vitest card tests · floor · before/after screenshot |
| D-09 | SAN-575 | Full §6 table per route · Playwright SCREEN-022/023 · chat-smoke |
| D-10 | SAN-576 | curl 200 on /saved, /trips, /me/tickets · dashboard screenshot |
| D-11 | SAN-577 | chat-smoke · map pins browser proof · mapId/FieldMask AC |
| D-12 | SAN-578 | chat-smoke · CK POST 400 · concierge band screenshot |
| D-13 | SAN-579 | chat-smoke · home event-card browser proof |
| D-14 | SAN-580 | Full §6 matrix · prod-synthetic Playwright · `d-14-RESULTS.md` |

**Updated audit row:** Acceptance criteria ~90 🟢 — agents have explicit Done gates on every build task.

---

**Agent execution safety — resolved 2026-06-05**

| Fix | Where |
|-----|-------|
| `blockedBy` chain D-06…D-14 | Linear (wired prior session + SAN-575 ←567,571 today) |
| Assignment table (safe vs blocked) | `index-design.md` §Agent assignment |
| D-07 **SAFE TO START** banner | SAN-573 description |
| Stale "Start now: D-05" | Index → **Start now: D-07** |

**Assign now:** **SAN-573** (D-07) only. **Do not assign SAN-574** until SAN-462 soak 3/3 (currently 1/3).

**Updated audit row:** Agent execution safety ~88 🟢 · Blockers ~88 🟢.

**Acceptance criteria row is done** — §6 Quality Gate + explicit proof commands are on all eight build tasks (D-07–D-14).

| Task | Linear | What was added |
|------|--------|----------------|
| D-07 | SAN-573 | shadcn install checklist · `floor` + `build` · verify 6 ui files |
| D-08 | SAN-574 | VenueCard parity AC · Vitest card tests · screenshot evidence |
| D-09 | SAN-575 | Full §6 table **per route** · Playwright + chat-smoke · per-route screenshots |
| D-10 | SAN-576 | 3-route curl 200 · dashboard mobile/desktop screenshot |
| D-11 | SAN-577 | map-panel pins AC · chat-smoke · browser proof prompt |
| D-12 | SAN-578 | CK v1 check · chat-smoke · POST 400 gate · band screenshot |
| D-13 | SAN-579 | home wireframe bands · chat-smoke · event-card browser proof |
| D-14 | SAN-580 | Full §6 matrix (8 checks) · prod-synthetic Playwright · `d-14-RESULTS.md` |

Source of truth for the checklist: `tasks/design/docs/design-process.md` §6.

Audit scorecard: **70/🟡 → 90/🟢**. Doc-only tasks (D-01–06) intentionally have no proof block — they're already Done on disk.

**Agent execution safety is fixed** — blockers are wired in Linear, the index has an assignment table, and D-07 is the only safe pick right now.

| Fix | Detail |
|-----|--------|
| **Linear `blockedBy`** | Full chain on SAN-572…580; added SAN-575 ←567,571 |
| **SAN-573** | "SAFE TO START" in description — no blockers |
| **`index-design.md`** | Agent assignment table + "Start now: **D-07**" (replaces stale D-05) |
| **D-08 gate** | SAN-574 still blocked on **SAN-462** (prod soak **1/3**) — intentional |

**Assign now:** **SAN-573** (D-07 shadcn install) only.

**Wait on:**
- **SAN-574** (D-08) — SAN-462 soak must hit 3/3
- **SAN-575+** — upstream D-tasks must clear first

Audit scorecard: agent execution safety **62/🟠 → 88/🟢**, blockers **20/🔴 → 88/🟢**.