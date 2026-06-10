# SEARCH namespace audit

**Date:** 2026-06-09  
**Task:** #19 — resolve spec ID collision before it spreads  
**Related:** [`duplicate-spec-audit.md`](./duplicate-spec-audit.md)

---

## Collision

| SAN | Current ID | Title (abbrev) | Phase | Project | Status |
|-----|------------|----------------|-------|---------|--------|
| **SAN-387** | SEARCH-002 | Wire hybrid_search_events + event_signals | phase:mvp | UX | In Review |
| **SAN-780** | SEARCH-002 | Hybrid rental + event + confidence | phase:post-mvp | Discovery | Backlog |

**Same spec ID · different scope** — will break disk specs, grep, and agent routing.

---

## Recommended resolution ✅

```text
SAN-387 → SEARCH-002  (event hybrid fast-path — Camila/Andrés cards)
SAN-780 → SEARCH-003  (rental+event confidence + grounding_sources)
```

| Item | SAN-387 (SEARCH-002) | SAN-780 (SEARCH-003) |
|------|----------------------|----------------------|
| Disk spec | `tasks/data/tasks-data/SEARCH-002-event-hybrid.md` | Rename or new `SEARCH-003-confidence-hybrid.md` |
| Tracker | `mvp.md`, `mastra.md`, `grounding.md` | `ADV.md` § Search |
| Launch gate? | **Yes** — G2 event cards | **No** — post-MVP |

---

## Linear hygiene steps

| # | Action |
|---|--------|
| 1 | Rename SAN-780 title: `SEARCH-003 — Hybrid rental + event search with confidence score` |
| 2 | Update SAN-780 description header · link SAN-387 as related |
| 3 | Update `grounding.md` row SAN-780 → SEARCH-003 |
| 4 | Grep repo for `SEARCH-002` + SAN-780 pairs · fix references |
| 5 | Leave SAN-387 as canonical SEARCH-002 |

---

## Other SEARCH IDs (canonical)

| Spec | Canonical SAN | Tracker |
|------|---------------|---------|
| SEARCH-001 | SAN-790 | ADV.md · grounding.md |
| SEARCH-002 | **SAN-387** | mvp.md |
| SEARCH-003 | **SAN-780** (after rename) | ADV.md |

---

## Do not merge

SAN-387 = PR #38 event card UI + soak gate SAN-462  
SAN-780 = Mastra tool return shape + faithfulness SAN-590  

Different owners · different Done gates · keep separate issues.
