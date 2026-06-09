# Orphan triage report — 92 open orphans

**Date:** 2026-06-09  
**Source:** [`orphan-issue-audit.md`](./orphan-issue-audit.md)  
**Goal:** 92 → **<20 unresolved** before large imports  
**Re-baseline:** After Task 11 CSV export

---

## Triage summary

| Bucket | Count | Action |
|--------|------:|--------|
| **Post-MVP → ADV** | 65 | Label `phase:post-mvp` · add to ADV sections or freeze |
| **Duplicate / close** | 5 | SAN-792–796 → dup SAN-292–314 |
| **Manual review** | 19 | Owner assignment this sprint |
| **Valid → tracker** | 3 | Add rows to domain trackers |
| **Shipped archive** | 0 open | Done orphans — bundle in `ux.md` |

**After triage (projected):** ~19 manual + 3 tracker adds = **~22 remaining** → second pass targets <20.

---

## Bucket 1 — Duplicate / close (5) 🔴 P1

| SAN | Title | Canonical | Action |
|-----|-------|-----------|--------|
| SAN-792 | DATA-VEN-001 venue seed | SAN-325 DATA-001 | **Duplicate** or Cancel |
| SAN-793 | VEN-010 venueAgent | SAN-293 | **Duplicate** |
| SAN-794 | VEN-015 requestVenueBooking | SAN-298 | **Duplicate** |
| SAN-795 | VEN-020 venue_bookings schema | SAN-307 | **Duplicate** |
| SAN-796 | VEN-025 Playwright e2e | SAN-314 | **Duplicate** |

**Effort:** 30 min Linear hygiene · clears 5 orphans immediately.

---

## Bucket 2 — Post-MVP → ADV (65) — freeze, do not Cycle 1

| Project cluster | Count | Examples | Action |
|-----------------|------:|----------|--------|
| AI & Intelligence | 43 | SAN-372, 373, 383, 740, 743 | Move to ADV § Intelligence · `phase:post-mvp` |
| Commerce ECOM-C | 12 | SAN-727, 636, 720 | Freeze until SAN-178 Done |
| Events AIE pack | 9 | SAN-757–765, 730 | Parent SAN-757 · ADV § AIE |
| Platform DATA backlog | 11 | SAN-341–343, 356, 359 | ADV § Data spine |
| Discovery VEC | 2 | SAN-787, 791 | `vector.md` already has VEC-001–007 |

**Rule:** No new Todo in Cycle 1 unless `phase:launch` or Track A/B sprint.

---

## Bucket 3 — Manual review (19)

| SAN | Project | Title | Recommended bucket |
|-----|---------|-------|-------------------|
| SAN-728 | UX | E2E Camila schedule-viewing | **Valid** → `CHAT.md` or `ux.md` |
| SAN-566 | UX | Design Track light-luxury re-skin | **Valid** → `ux.md` (D-08) |
| SAN-259 | UX | UIX-031 My Tickets + QR | **Track A** — ties SAN-178 |
| SAN-262 | UX | UIX-034 Schedule Viewing Modal | Shipped archive |
| SAN-263 | UX | UIX-035 Workflow Progress Strip | Shipped archive |
| SAN-722 | — | MAP-P5 Cache-Control photos | Post-MVP maps |
| SAN-581–583 | — | Currency formatting fixes | **Valid** → mvp.md footnote |
| SAN-356 | Platform | DATA-028 trip_items idempotency | Post-MVP trips |

*Full list in CSV — re-export refreshes labels.*

---

## Bucket 4 — Valid work → add to tracker (3)

| SAN | Add to | Why |
|-----|--------|-----|
| SAN-730 | `mvp.md` § Events UI sprint | Host nav — Track B |
| SAN-731 | `mvp.md` § Events UI sprint | Event detail skeleton — Track B |
| SAN-135 | `mvp.md` (exists?) | Luma detail — verify grep |

```bash
grep -E 'SAN-(730|731|135)' docs/linear/markdown/mvp.md
```

---

## Execution order

```text
1. Dup SAN-792–796        → -5 orphans
2. Freeze 65 post-MVP     → remove from Cycle 1 Todo
3. Add SAN-730/731 rows   → tracker coverage
4. Manual review 19       → assign or close
5. Re-run orphan scan     → target <20
```

---

## Success metric

| Metric | Now | Target |
|--------|----:|-------:|
| Open orphans | 92 | <20 |
| Unassigned open orphans | 92 | 0 |
| Orphans in Cycle 1 Todo | ~15 | 0 (except Track A/B) |
