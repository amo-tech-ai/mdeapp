# CSV audit report — Phase 0 post-hygiene

**Date:** 2026-06-09  
**Auditor:** Linear MCP + on-disk CSV scan  
**Phase 0 hygiene:** 🟢 Complete (0A–0F)  
**CSV sync:** 🟡 Partial — **full UI re-export still required**

---

## Executive summary

| Gate | Result |
|------|--------|
| Linear hygiene verify (11 SANs) | **11/11 PASS** via API |
| On-disk CSV hygiene status fields | **11/11 PASS** in `All issues.csv` |
| On-disk CSV title sync (SAN-789) | **PASS** after 2026-06-09 patch |
| SAN-835–854 in CSV | **0/20 FAIL** — Linear live, CSV missing |
| Ready for `generate.py` | **NO** — re-export first |

**Blocker:** Linear MCP cannot bulk-export saved views. Sofía must run **Linear UI → Export CSV** for each view listed below, then overwrite `docs/linear/CSV/`.

---

## Export views required (Task 1)

| View | Target file | Current max SAN | Gap |
|------|-------------|-----------------|-----|
| All Issues | `All issues.csv` | SAN-834 | Missing SAN-835–854 + body/label refresh |
| MVP | `MVP issues.csv` | SAN-834 | Missing 835–849 + SAN-789, 563, 798/799, GS rows |
| ADV (post-MVP filter) | derived from All | — | Run after All refresh |
| Partners | `Partners › Issues.csv` | SAN-832 | Status OK for 798/799; bodies stale |
| Discovery | `Discovery Platform › Issues.csv` | SAN-791 | SAN-789 title patched; missing 800/801 bodies |
| Launch (`phase:launch`) | filter export optional | — | SAN-837 OPS-003 |

### Re-export command (manual)

```text
Linear → Saved view → ⋯ → Export CSV → overwrite docs/linear/CSV/<file>
```

Do **not** run `markdown/generate.py` until All + MVP exports include SAN-854.

---

## Hygiene verification matrix

Source of truth: **Linear API** (2026-06-09). CSV column: `All issues.csv` unless noted.

| Check | Linear API | CSV | Pass |
|-------|------------|-----|------|
| SAN-789 → **MAP-035** title | `MAP-035 — Neighborhood intel layer…` | Patched MAP-035 | ✅ |
| SAN-463 Duplicate | Duplicate → SAN-368 | Duplicate | ✅ |
| SAN-464 Duplicate | Duplicate → SAN-369 | Duplicate | ✅ |
| SAN-563 Duplicate | Duplicate → SAN-551 | Duplicate | ✅ |
| SAN-798 Duplicate | Duplicate → SAN-800 | Duplicate (Partners CSV) | ✅ |
| SAN-799 Duplicate | Duplicate → SAN-801 | Duplicate (Partners CSV) | ✅ |
| SAN-470 Duplicate | Duplicate → SAN-469 | Duplicate | ✅ |
| SAN-437 Duplicate | Duplicate → SAN-574 | Duplicate | ✅ |
| SAN-227 Active (GS-005) | Backlog | Backlog | ✅ |
| SAN-228 Active (GS-006) | Backlog | Backlog | ✅ |
| SAN-231 Active (GS-009) | Backlog | Backlog | ✅ |

### Per-file hygiene notes

| File | Verify IDs present | Stale fields |
|------|-------------------|--------------|
| `All issues.csv` | 11/11 | Descriptions pre–Batch B/C enrichment |
| `MVP issues.csv` | 5/11 (463,464,470,437 + partial) | Missing 789,563,798,799,227–231 |
| `Partners › Issues.csv` | 2/11 (798,799) | Missing canonical 800/801 export |
| `Discovery Platform › Issues.csv` | 6/11 | Missing 563,798,799,470,437 |

---

## SAN-835+ presence (Linear live vs CSV)

Linear API confirms **20 issues** filed SAN-835 through SAN-854 (2026-06-08 bulk create). **None** appear in any on-disk CSV.

| SAN | Title (abbrev) | Project | phase label |
|-----|----------------|---------|-------------|
| SAN-835 | RET-001 Recently Viewed | UX | phase:mvp |
| SAN-836 | RET-002 Saved Searches | UX | phase:mvp |
| SAN-837 | OPS-003 Launch Command Center | Platform Infra | phase:mvp |
| SAN-838 | INFRA-001 Universal Activity Feed | Platform Infra | phase:mvp |
| SAN-839 | EVT-AIE-001 Event Health Score | Events | phase:mvp |
| SAN-840 | EVT-INS-001 Event Insights dashboard | Events | phase:mvp |
| SAN-841 | EVT-WAIT-001 Waitlist system | Events | phase:mvp |
| SAN-842 | VEN-READY-001 Venue Readiness Score | Venues | phase:mvp |
| SAN-843 | VEN-CRM-001 Booking Pipeline CRM | Venues | phase:mvp |
| SAN-844 | INFRA-DQ-001 Data Quality Dashboard | Platform Infra | phase:mvp |
| SAN-845 | OPS-AUDIT-001 Audit Log Viewer | Platform Infra | phase:mvp |
| SAN-846 | INFRA-JOBS-001 Background Jobs Dashboard | Platform Infra | phase:mvp |
| SAN-847 | INFRA-ERR-001 Error Tracking Dashboard | Platform Infra | phase:mvp |
| SAN-848 | AI-EXP-001 Explain Results | AI & Intelligence | phase:mvp |
| SAN-849 | INFRA-MDD-001 Missing Data Detection | Platform Infra | phase:mvp |
| SAN-850 | AI-REC-001 Recommendation Engine | AI & Intelligence | phase:post-mvp |
| SAN-851 | AI-FUP-001 Follow-up Suggestions | AI & Intelligence | phase:post-mvp |
| SAN-852 | AI-INS-001 AI Concierge Insights | AI & Intelligence | phase:post-mvp |
| SAN-853 | INFRA-FF-001 Feature Flags | Platform Infra | phase:post-mvp |
| SAN-854 | PART-RPT-001 AI Weekly Reports | Partners | phase:post-mvp |

**Markdown ahead of CSV:** `mvp.md` has SAN-835–849 manually; `ADV.md` has SAN-850–854 manually.

---

## Partial patches applied (2026-06-09)

Without replacing full export, these mechanical CSV updates were applied:

- Hygiene **Status** + **Title** for Batch A/B/C verify SANs
- SAN-789 title → MAP-035 in All + Discovery
- Partners 798/799 → Duplicate

---

## Next steps

1. **Sofía:** Full Linear UI CSV re-export (All, MVP, Partners, Discovery, Launch filter)
2. **Agent:** Re-run this audit → expect 20/20 SAN-835–854 present
3. **Then:** `cd docs/linear/markdown && python3 generate.py`
4. **Then:** Rollup reconciliation → `rollup-validation-report.md` v2
5. **Then:** VEB-001…018 import planning

---

## References

- Phase 0 log: [`markdown/notes.md`](../markdown/notes.md)
- Playbook: [`markdown/audit-checklist.md`](../markdown/audit-checklist.md)
- Generator: [`markdown/generate.py`](../markdown/generate.py)
