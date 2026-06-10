# Orphan issue audit

**Date:** 2026-06-09  
**Method:** `All issues.csv` (739 rows) vs 16 markdown trackers  
**Caveat:** CSV stale for SAN-835–854 · re-run after Task 11 export

---

## Summary

| Metric | Count |
|--------|------:|
| Issues in CSV | 739 |
| Unique SAN in trackers | 582 |
| **Orphans** (not in any tracker, excl. Duplicate/Canceled) | **176** |
| Open orphans (Todo / In Progress / Backlog / In Review) | **92** |
| Done orphans (shipped archive — lower risk) | 84 |

**Verdict:** Tracker coverage is **~76%** of active Linear issues. **92 open orphans** need triage before large imports.

---

## Open orphans by project (action required)

| Project | Open | Risk |
|---------|-----:|------|
| AI & Intelligence | 43 | 🔴 Scope creep — intel-1/1b in MVP cycle |
| Commerce Platform | 12 | 🟡 ECOM-C-* post-checkout polish |
| Platform Infrastructure | 11 | 🟡 DATA spine — some post-MVP |
| Events Platform | 9 | 🟡 AIE pack (SAN-757+) — not launch gate |
| UX | 6 | 🟡 In Review UIX + design track |
| Venues | 5 | 🔴 **SAN-792–796** parallel VEN track — collides with SAN-292–314 |
| — (no project) | 4 | 🟡 MAP-P5, currency fixes |
| Discovery Platform | 2 | 🟡 VEC-001/002 vector foundation |

---

## Sample — high-priority open orphans

| SAN | Project | Status | Title | Missing From |
|-----|---------|--------|-------|--------------|
| SAN-792 | Venues | Backlog | DATA-VEN-001 venue seed | rollups, domain |
| SAN-793 | Venues | Backlog | VEN-010 venueAgent tools | rollups, domain |
| SAN-794 | Venues | Backlog | VEN-015 requestVenueBooking HITL | rollups, domain |
| SAN-795 | Venues | Backlog | VEN-020 venue_bookings schema | rollups, domain |
| SAN-796 | Venues | Backlog | VEN-025 Playwright e2e | rollups, domain |
| SAN-757 | Events Platform | Backlog | AIE-000 implementation pack | rollups, domain |
| SAN-740 | AI & Intelligence | Todo | CK-007 HITL booking card | rollups, domain |
| SAN-743 | AI & Intelligence | Todo | AGT-venueAgent | rollups, domain |
| SAN-727 | Commerce Platform | Todo | ECOM-C-023 Stripe re-proof | rollups, domain |
| SAN-356 | Platform Infrastructure | Todo | DATA-028 trip_items idempotency | rollups, domain |
| SAN-728 | UX | Backlog | E2E Camila schedule-viewing | rollups, domain |

---

## Sample — done orphans (shipped archive — OK to bundle)

| SAN | Project | Title | Recommendation |
|-----|---------|-------|----------------|
| SAN-117 | Events Platform | EVT-013 event cards in chat | Add to `mvp.md` archive footnote or events shipped table |
| SAN-232–268 | UX | UIX SCREEN-* polish | Already bundled in `ux.md` shipped archive |
| SAN-315–324 | UX | UX-001…027 fixes | Reference in `ux.md` wave-1 shipped |

---

## Actions

| # | Action | Owner |
|---|--------|-------|
| 1 | Re-run orphan scan after CSV export (include SAN-835+) | Agent |
| 2 | **Dedupe SAN-792–796** vs canonical SAN-292–314 in `venues.md` | Linear hygiene |
| 3 | Add AIE pack (SAN-757–765) to `ADV.md` § Events Intelligence or new `aie.md` | Markdown |
| 4 | Add Commerce ECOM-C open rows to `revenue.md` or defer with `phase:post-mvp` | Scope freeze |
| 5 | Mark done UX orphans as "shipped bundle" in `ux.md` to clear false positives | Markdown |

---

## Method

```bash
cd /home/sk/mdeai/mdeapp
# Re-run after CSV refresh:
python3 docs/linear/audit/scripts/orphan-scan.py  # optional — same logic as 2026-06-09 manual scan
```

Trackers scanned: `core.md`, `mvp.md`, `ADV.md`, `CHAT.md`, `maps.md`, `grounding.md`, `partners.md`, `ux.md`, `real-estate.md`, `revenue.md`, `trips.md`, `vector.md`, `venues.md`, `wireframes.md`, `openclaw.md`, `mastra.md`.
