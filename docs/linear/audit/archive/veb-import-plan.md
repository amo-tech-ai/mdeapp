# VEB import plan — Event venue booking track (VEB-001…018)

**Date:** 2026-06-09  
**Spec pack:** [`docs/tasks/venues/tasks/event-booking/INDEX.md`](../../tasks/venues/tasks/event-booking/INDEX.md)  
**PRD:** [`docs/tasks/venues/docs/venues-booking.md`](../../tasks/venues/docs/venues-booking.md)  
**Mapping:** [`docs/tasks/linear/veb-evt-mapping.json`](../../tasks/linear/veb-evt-mapping.json)  
**Import log:** [`docs/tasks/linear/veb-import-log.json`](../../tasks/linear/veb-import-log.json) (2026-06-04)

---

## Executive summary

| Item | Status |
|------|--------|
| **VEB-001…018 filed in Linear?** | **✅ 18/18** — SAN-492…SAN-509 |
| **Wireframes EVT-051…055?** | **✅ 5/5** — SAN-510…SAN-514 |
| **Disk specs on disk?** | **✅ 18/18** — `tasks/venues/tasks/event-booking/VEB-*.md` |
| **Tracker hygiene** | 🟡 `venues.md` + `audit-checklist.md` were stale ("unfiled") — fixed 2026-06-09 |
| **Remaining import work** | Optional title rename · parent epic · full spec bodies · CSV re-export |

**Key insight:** Linear uses **dual-track naming** — disk `VEB-*`, Linear title `EVT-033…050`, label `prefix:VEB` on issues. No net-new issue creation required unless you want a dedicated **VEB parent epic**.

---

## Import table (canonical)

| VEB | Title | Phase | Project | Parent epic | Linear | EVT |
|-----|-------|-------|---------|-------------|--------|-----|
| **VEB-001** | Event venue + offerings schema | core | Events Platform | — *(recommend VEB epic)* | [SAN-492](https://linear.app/sanjiovani/issue/SAN-492) | EVT-033 |
| **VEB-002** | Seed Mamacita + 5 event partners | core | Events Platform | — | [SAN-493](https://linear.app/sanjiovani/issue/SAN-493) | EVT-034 |
| **VEB-003** | Restaurant card Event Venue CTA | mvp | Events Platform | — | [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | EVT-035 |
| **VEB-004** | Event offerings detail panel | mvp | Events Platform | — | [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | EVT-036 |
| **VEB-005** | Request proposal modal (HITL) | mvp | Events Platform | — | [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | EVT-037 |
| **VEB-006** | eventVenueAgent + search/rank tools | mvp | Events Platform | — | [SAN-497](https://linear.app/sanjiovani/issue/SAN-497) | EVT-038 |
| **VEB-007** | AI venue match score panel | mvp | Events Platform | — | [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | EVT-039 |
| **VEB-008** | Compare venues side-by-side | mvp | Events Platform | — | [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | EVT-040 |
| **VEB-009** | Host wizard venue step (Roberto) | mvp | Events Platform | — | [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | EVT-041 |
| **VEB-010** | eventVenueBookingWorkflow | mvp | Events Platform | — | [SAN-501](https://linear.app/sanjiovani/issue/SAN-501) | EVT-042 |
| **VEB-011** | Patricia admin queue (event requests) | mvp | Events Platform | — | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) | EVT-043 |
| **VEB-012** | Add confirmed booking to trip | mvp | Events Platform | — | [SAN-503](https://linear.app/sanjiovani/issue/SAN-503) | EVT-044 |
| **VEB-013** | Venue availability calendar | advanced | Events Platform | — | [SAN-504](https://linear.app/sanjiovani/issue/SAN-504) | EVT-045 |
| **VEB-014** | Auto follow-up WA drafts (24h) | advanced | Events Platform | — | [SAN-505](https://linear.app/sanjiovani/issue/SAN-505) | EVT-046 |
| **VEB-015** | Venue CRM for Patricia | advanced | Events Platform | — | [SAN-506](https://linear.app/sanjiovani/issue/SAN-506) | EVT-047 |
| **VEB-016** | Dynamic package pricing | advanced | Events Platform | — | [SAN-507](https://linear.app/sanjiovani/issue/SAN-507) | EVT-048 |
| **VEB-017** | Sponsor ↔ venue match | advanced | Events Platform | — | [SAN-508](https://linear.app/sanjiovani/issue/SAN-508) | EVT-049 |
| **VEB-018** | OpenClaw venue enrichment (plan) | advanced | Events Platform | — | [SAN-509](https://linear.app/sanjiovani/issue/SAN-509) | EVT-050 |

### Phase labels in Linear (today)

| Tier | VEB range | Typical Linear labels | Milestone |
|------|-----------|----------------------|-----------|
| **core** | 001–002 | `phase:mvp`, `prefix:VEB` | 🎟️ Events — MVP Gates |
| **mvp** | 003–012 | `phase:mvp`, `prefix:VEB` | 🎟️ Events — Polish / MVP Gates |
| **advanced** | 013–018 | `phase:post-mvp`, `prefix:VEB` | 🔮 Events — Discovery |

---

## Wireframe companion issues (not in VEB-001…018 count)

| Wire | Linear | Paired VEB |
|------|--------|------------|
| VEB-W01 | [SAN-510](https://linear.app/sanjiovani/issue/SAN-510) EVT-051 | VEB-003, VEB-004 |
| VEB-W02 | [SAN-511](https://linear.app/sanjiovani/issue/SAN-511) EVT-052 | VEB-005 |
| VEB-W03 | [SAN-512](https://linear.app/sanjiovani/issue/SAN-512) EVT-053 | VEB-007, VEB-008 |
| VEB-W04 | [SAN-513](https://linear.app/sanjiovani/issue/SAN-513) EVT-054 | VEB-009 |
| VEB-W05 | [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) EVT-055 | VEB-011 |

---

## Prerequisites before Roberto VEB execution (not launch blockers)

```text
VEN-012 + VEN-021 Done + VEN-031 green
  → VEB-001 → VEB-002 → VEB-003…005 → VEB-010
  parallel: VEB-006 → VEB-007 → VEB-008
  after EVP-010 green: VEB-009
```

| Gate | Linear / spec | Blocks |
|------|---------------|--------|
| Place booking spine | VEN-015…024 (SAN-292–314 cluster) | VEB-010 workflow |
| ADK on prod | **SAN-368** MAP-002B | Grounding quality for VEB-006/007 |
| Host wizard publish | **EVP-010** + SAN-366 Done | VEB-009 must not break publish path |
| DATA-009 schema | SAN-331 | VEB-001 offerings tables |

**VEB is post–north-star polish** — Roberto publish (SAN-366 ✅) and Andrés payment (SAN-178 ⏳) precede VEB MVP chain.

---

## Optional hygiene (post-import)

| # | Action | Owner | When |
|---|--------|-------|------|
| 1 | Create parent epic **VEB-000 — Event venue booking**; set `parentId` on SAN-492…509 | Linear | Before Cycle 2 venue booking sprint |
| 2 | Retitle Linear issues `EVT-0NN` → lead with `VEB-00N` (keep EVT in body) | Linear | Low priority — labels already have `prefix:VEB` |
| 3 | Enrich descriptions from disk specs (acceptance + proof commands) | Agent | Same pass as Batch B/C hygiene |
| 4 | Sync `venues.md` VEB section + `mvp.md` cross-ref | Markdown | ✅ 2026-06-09 |
| 5 | Re-export Events Platform CSV after edits | Sofía | After CSV Task 1 |

---

## Build order (from spec pack)

```text
VEB-001 → VEB-002 → VEB-003 → VEB-004 → VEB-005 → VEB-010 → VEB-011
  parallel: VEB-006 → VEB-007 → VEB-008
  after EVP-010 green: VEB-009
  after VEB-010: VEB-012
  Phase 2+: VEB-013…018
```

---

## MVP exit criteria (VEB pack gate — from INDEX)

- [ ] Mamacita shows **Event Venue** when `accepts_event_bookings=true`
- [ ] Offerings panel from Supabase (not LLM invent)
- [ ] Proposal modal saves row; Patricia approves WA draft
- [ ] Roberto host wizard venue step without breaking EVP-010 publish
- [ ] Copy: **"Request sent — we'll confirm by WhatsApp"** — never instant confirm
- [ ] RLS + FieldMask on all new surfaces
- [ ] Playwright smoke W01–W02

---

## References

- Tracker: [`markdown/venues.md`](../markdown/venues.md)
- Rollup rows: [`markdown/mvp.md`](../markdown/mvp.md) § Events (SAN-492–503)
- Advanced rows: [`markdown/ADV.md`](../markdown/ADV.md) § Events Discovery (SAN-504–509)
- OpenClaw cross-pack: VEB-018 = SAN-509 in [`markdown/openclaw.md`](../markdown/openclaw.md)
