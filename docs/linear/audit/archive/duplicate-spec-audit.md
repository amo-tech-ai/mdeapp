# Duplicate spec audit

**Date:** 2026-06-09  
**Method:** Title spec-ID extraction from `All issues.csv` + Phase 0 hygiene log  
**Caveat:** Re-run after CSV export · verify `duplicateOf` via Linear API

---

## Executive summary

| Category | Count | Action |
|----------|------:|--------|
| **Resolved dups** (Duplicate state) | 8+ | Documented in `notes.md` |
| **Spec ID collisions** (same prefix, different SAN) | **31** | Triage below |
| **Critical open collision** | **1** | SEARCH-002 — SAN-387 vs SAN-780 |

---

## Resolved duplicates (Phase 0 ✅)

| Canonical | Duplicate | Pattern | Resolution |
|-----------|-----------|---------|------------|
| SAN-368 MAP-002B | SAN-463 | Same P0 ADK prod | Duplicate |
| SAN-369 MAP-008B | SAN-464 | Same map pins | Duplicate |
| SAN-551 REV-C2 | SAN-563 | Same checkout widget | Duplicate |
| SAN-800 PTR-AI-001 | SAN-798 | Same partner AI | Duplicate |
| SAN-801 PTR-AI-002 | SAN-799 | Same partner AI | Duplicate |
| SAN-469 RE-003 | SAN-470 | Same rental indexes | Duplicate |
| SAN-574 UX-023 | SAN-437, SAN-360 | Same ResultCardShell | Duplicate |
| SAN-104 MAP-010 | SAN-789 (was) | Prefix collision | **Renamed** 789 → MAP-035 |

---

## Critical — SEARCH-002 collision 🔴

| SAN | Title | Phase | Project | Status | Scope |
|-----|-------|-------|---------|--------|-------|
| **SAN-387** | SEARCH-002 — Wire hybrid_search_events + event_signals | phase:mvp | UX | In Review | Event fast-path UI (PR #38) |
| **SAN-780** | SEARCH-002 — Hybrid rental + event search + confidence | phase:post-mvp | Discovery | Backlog | Mastra tool shape + grounding_sources |

**Not duplicate work** — **duplicate spec ID**. Different scopes, both filed as SEARCH-002.

| Resolution option | Recommendation |
|-------------------|----------------|
| A | Rename SAN-780 → **SEARCH-003** (confidence + rental blend) |
| B | Split disk specs: `SEARCH-002-event-hybrid` (387) vs `SEARCH-002-confidence` (780) |
| C | Merge into one epic with sub-issues | Overkill for launch |

**Canonical for launch:** **SAN-387** (Camila/Andrés event cards in chat). **SAN-780** is post-MVP polish.

---

## Other spec ID collisions (31 total)

| Spec ID | SANs | Severity | Notes |
|---------|------|----------|-------|
| SCREEN-008 | 262, 473, 716 | 🟡 | Schedule viewing — check 473 vs 262 |
| SCREEN-011 | 253, 278, 290 | 🟢 | Saved/trips — different surfaces |
| MAP-005 | 102, 105, 776 | 🟡 | Map feature variants |
| VEN-001 | 158, 362, 792 | 🔴 | **792 orphan** — likely dup of VEN spine |
| VEN-010 | 167, 793 | 🔴 | **793 orphan** vs SAN-293 |
| VEN-020 | 299, 795 | 🔴 | **795 orphan** vs SAN-307 |
| SEARCH-001 | 386, 790 | 🟡 | 790 canonical in ADV |
| PAY-001 | 178, 715 | 🟢 | 715 Done decline states; 178 live purchase |
| EVT-002 | 120, 366 | 🟢 | 366 Done prod proof |
| EVT-013 | 117, 131 | 🟡 | Event cards — verify canonical |
| CK-001 | 521, 734 | 🟡 | CopilotKit patterns |
| CHAT-001 | 522, 612 | 🟢 | 612 in ADV integrations |
| AI-004 | 396, 803 | 🟡 | Partner AI |

---

## Scan patterns used

| Pattern | Method |
|---------|--------|
| Same Spec ID in title | Regex `\b[A-Z]{2,6}-\d{2,3}[a-z]?\b` |
| Same feature | Manual + title similarity |
| Same acceptance criteria | Body hash — deferred (needs API export) |
| Same epic | `parentId` — see [`parent-epic-audit.md`](./parent-epic-audit.md) |

---

## Actions

| Priority | Action |
|----------|--------|
| P0 | Resolve SEARCH-002: rename SAN-780 or split spec on disk |
| P1 | Mark SAN-792–796 Duplicate of SAN-292–314 cluster OR cancel orphan VEN track |
| P2 | Audit VEN-001/010/020 triple collisions |
| P3 | Re-scan after CSV export with `duplicateOf` column |
