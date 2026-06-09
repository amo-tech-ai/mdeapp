# Rollup validation report — pre-re-export baseline

**Date:** 2026-06-09  
**Scope:** `core.md` · `mvp.md` · `ADV.md` · `CHAT.md` vs canonical CSV sources  
**CSV freshness:** Stale through SAN-834 (see [`csv-audit-report.md`](./csv-audit-report.md))  
**Verdict:** 🟡 **Do not regenerate rollups** — markdown is intentionally ahead of CSV; reconcile after full export.

---

## Summary

| Rollup | MD SAN refs | CSV rows | MD-only | CSV-only | Duplicate rows in MD | Status |
|--------|------------:|---------:|--------:|---------:|---------------------:|--------|
| `core.md` | 26 | 21 | 5 | 0 | 1 (SAN-412) | 🟡 manual patches |
| `mvp.md` | 210 | 158 | 52 | 0 | 0 | 🔴 CSV gap + manual rows |
| `ADV.md` | 381 | 739† | 5 | 363† | 0 | 🟡 filter mismatch‡ |
| `CHAT.md` | 35 | 11 | 24 | 0 | 11 | 🟡 sprint superset |

† ADV source is `All issues.csv` filtered by `phase:post-mvp` — high CSV-only count is expected.  
‡ ADV.md is a curated post-MVP view, not a 1:1 CSV dump.

---

## Check matrix

| Check | core | mvp | ADV | CHAT |
|-------|------|-----|-----|------|
| Missing SAN rows (in CSV, absent MD) | — | 0 | N/A‡ | 0 |
| Duplicate SAN rows (same ID ≥2 table rows) | SAN-412 | — | — | 11 refs†† |
| Wrong phase (mvp issue in ADV only) | — | see §mvp | see §ADV | — |
| Wrong milestone | — | low risk | low risk | — |
| Wrong parent | — | — | — | SAN-822 children OK |
| Wrong status vs Linear | — | 835–849 manual | 850–854 manual | — |
| SAN-835+ present | 0 | **15 in MD / 0 CSV** | **5 in MD / 0 CSV** | 0 |

†† CHAT.md references sprint children + cross-links — duplicate link refs are navigation, not duplicate work items.

---

## core.md

**Source CSV:** `Core Foundation › Issues.csv` (21 rows)

### MD-only (manual — keep after `generate.py`)

| SAN | Reason |
|-----|--------|
| SAN-115 | Payments cluster — manual core Payments section |
| SAN-116 | Payments cluster — manual |
| SAN-412 | Cross-project concierge ref — intentional |
| SAN-547 | Launch gate — manual deploy section |
| SAN-823 | CHAT sprint cross-ref |

### Duplicate row

| SAN | Occurrences | Action after re-export |
|-----|-------------|----------------------|
| SAN-412 | 2 table rows | Merge to single row or footnote |

### Phase / status

No Phase 0 hygiene conflicts. Core CSV max SAN-548 — no 835+ gap.

---

## mvp.md

**Source CSV:** `MVP issues.csv` (158 rows) · **MD refs:** 210

### Critical gap — SAN-835–849

| Location | Count | Notes |
|----------|------:|-------|
| `mvp.md` Admin/UX/Events/Venues sections | 15 | Manually synced 2026-06-08 |
| `MVP issues.csv` | 0 | **BLOCKER for generate.py** |

Issues affected: SAN-835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849.

### MD-only sample (52 total — not all gaps)

| SAN | Likely reason |
|-----|----------------|
| SAN-113, 115, 120 | Cross-rollup manual rows |
| SAN-283–287 | Data cluster footnotes |
| SAN-835–849 | **New filings — CSV missing** |
| SAN-789 | In MD; was missing from MVP CSV |

### Hygiene rows — status alignment

| SAN | mvp.md | Linear | Match |
|-----|--------|--------|-------|
| SAN-470 | Dup SAN-469 ✅ | Duplicate | ✅ |
| SAN-469 | Todo Urgent | Todo | ✅ |
| SAN-463/464 | Dup | Duplicate | ✅ (in MD) |

### Wrong phase risks

None detected for Phase 0 hygiene SANs. Post-export: verify `phase:mvp` label on SAN-848 (AI-EXP) vs ADV filter.

---

## ADV.md

**Source:** `All issues.csv` post-MVP filter (191 expected) · **MD refs:** 381 (includes cross-links)

### MD-only post-MVP new filings

| SAN | In ADV.md | In CSV | Action |
|-----|-----------|--------|--------|
| SAN-850 | ✅ | ❌ | Re-export All |
| SAN-851 | ✅ | ❌ | Re-export All |
| SAN-852 | ✅ | ❌ | Re-export All |
| SAN-853 | ✅ | ❌ | Re-export All |
| SAN-854 | ✅ | ❌ | Re-export All |

### Phase 0 hygiene — ADV rows

| SAN | ADV section | Status in MD | Linear |
|-----|-------------|--------------|--------|
| SAN-789 | Maps/Search | MAP-035 | Backlog ✅ |
| SAN-227–231 | Search — Grounding | Backlog | Backlog ✅ |
| SAN-780 | Search — Grounding | SEARCH-002 | Backlog ✅ |
| SAN-563 | Revenue overlap | Dup 551 | Duplicate ✅ |
| SAN-800/801 | Partner AI | Backlog | Backlog ✅ |

### Manual patches to preserve after `generate.py`

Re-apply per [`audit-checklist.md`](../markdown/audit-checklist.md) §Re-export:

- CHAT-001–015 block (SAN-612–626)
- Partner AI Layer footnote (SAN-800–810)
- SAN-850–854 if filter excludes them

---

## CHAT.md

**Source CSV:** `CHAT issues.csv` (11 rows) · **MD refs:** 35

### MD-only (24) — expected

CHAT.md is a **sprint superset**: SAN-822 epic, SAN-823–831 children, cross-refs to mvp concierge cluster (SAN-403, 406, 407, 413, 425, 426, 484, 485). Not a strict CSV mirror.

### Parent / milestone

| Parent | Children in MD | Linear parentId | OK |
|--------|----------------|-----------------|-----|
| SAN-822 | SAN-823–831 | verified in CHAT.csv subset | ✅ |

### Sprint exit gate

SAN-831 remains open — CHAT.md accurate.

---

## Recommended reconciliation order (Task 2 — after fresh CSVs)

```
1. Export CSVs (All, MVP, Partners, Discovery)
2. Verify csv-audit-report.md → all checks green
3. python3 docs/linear/markdown/generate.py
4. Re-apply manual patches (core Payments, mvp 835–849 if generator drops, ADV CHAT block, SAN-850–854)
5. Diff rollups vs this report — expect md_only → 0 for 835–854
6. Run task-verifier on tracker crosswalks (maps, partners, grounding, ux, real-estate)
```

---

## Post-export success criteria

| Check | Target |
|-------|--------|
| `mvp.md` SAN-835–849 | Present from CSV, not manual-only |
| `ADV.md` SAN-850–854 | Present from CSV filter |
| Hygiene SANs | Status/title match Linear |
| `generate.py` run | No regression in Phase 0 canonical mappings |
| Duplicate execution paths | 0 open dup owners (463,464,563,798,799,470,437) |

---

## References

- CSV audit: [`csv-audit-report.md`](./csv-audit-report.md)
- Phase 0 complete: [`markdown/notes.md`](../markdown/notes.md)
- Generator: [`markdown/generate.py`](../markdown/generate.py)
