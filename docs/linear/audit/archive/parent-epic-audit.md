# Parent epic audit

**Date:** 2026-06-09  
**Goal:** Every active SAN has exactly one container: Epic · Milestone · Parent issue  
**Method:** Linear API sample + CSV project/milestone columns

---

## Summary

| Track | Parent status | Gap |
|-------|---------------|-----|
| CHAT sprint SAN-822–831 | ✅ SAN-822 epic | Children linked |
| AIE pack SAN-757–765 | 🟡 SAN-757 epic exists | Children lack `parentId` |
| VEB SAN-492–509 | ❌ **No parent** | Create VEB-000 |
| VEN SAN-292–314 | ❌ No single epic | Optional VEN-000 |
| Core launch SAN-115 | ✅ Parent SAN-757 | Ledger under AIE (acceptable) |
| OpenClaw SAN-187–226 | 🟡 Project only | No epic — OK for infra |

---

## Issues missing parent (priority)

| SAN range | Count | Recommended parent |
|-----------|------:|-------------------|
| SAN-492–509 | 18 | **VEB-000 — Event venue booking** |
| SAN-757–765 | 9 | SAN-757 (set parentId on children) |
| SAN-792–796 | 5 | Cancel/dup — or parent under VEN epic |
| SAN-835–854 | 20 | Per-pack epics (RET, OPS, AI insights) |

---

## Milestone coverage

| Project | Milestone examples | Issues without milestone |
|---------|-------------------|--------------------------|
| Events Platform | 🎟️ MVP Gates · 🔮 Discovery | VEB core/mvp have milestone ✅ |
| Discovery Platform | 🔮 Search — Grounding | SAN-780 ✅ |
| Core Foundation | Phase 1 — mdeai MVP launch | SAN-115, 178 ✅ |
| UX | — | CHAT sprint issues vary |

---

## Task 20 — VEB-000 epic creation spec

| Field | Value |
|-------|-------|
| **Title** | VEB-000 — Event Venue Booking Platform |
| **Project** | Events Platform |
| **Labels** | `prefix:VEB`, `phase:mvp`, `area:events`, `track:venues` |
| **Description** | Parent for VEB-001…018 (SAN-492–509) · disk `tasks/venues/tasks/event-booking/` |
| **Children** | Set `parentId` on SAN-492 through SAN-509 |
| **Milestone** | 🎟️ Events — MVP Gates (core/mvp) · 🔮 Discovery (013–018) |

```bash
# After Linear UI create — verify:
# get_issue SAN-492 → parentId = VEB-000 issue id
```

**Not launch-blocking** — do after SAN-178 proof or in parallel with orphan dup hygiene.

## Actions

| # | Action |
|---|--------|
| 1 | Create Linear epic **VEB-000** · parentId on SAN-492–509 |
| 2 | Wire AIE-001…011 under SAN-757 |
| 3 | Resolve SAN-792–796 — dup or parent |
| 4 | Re-audit parentId column after CSV export |

---

## VEB import guard

Do not start VEB **implementation** until:

- [ ] VEB-000 epic created
- [ ] Milestone 🎟️ Events — MVP Gates confirmed on SAN-492–503
- [ ] phase:post-mvp on SAN-504–509 confirmed

See [`veb-readiness-report.md`](./veb-readiness-report.md).
