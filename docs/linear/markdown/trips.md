# 🧳 Trips — TRIP task tracker
> Spec pack: [`docs/tasks/trips/`](../../tasks/trips/tasks/INDEX.md) · Plan: [`trips-plan.md`](../../tasks/trips/trips-plan.md) · Updated: 2026-06-09 · Canonical: `mvp.md` § Trips + `ADV.md` § Trips Hardening

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started

**Persona:** Camila — save places → trip workspace → itinerary → booking sync

---

## TRIP-001…012 (core + MVP + ship)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | TRIP-001 | [SAN-273](https://linear.app/sanjiovani/issue/SAN-273) | Trips Supabase audit + evidence | mvp.md |
| ⚪ | TRIP-002 | [SAN-274](https://linear.app/sanjiovani/issue/SAN-274) | `/trips` dashboard polish (SCREEN-012) | mvp.md |
| ⚪ | TRIP-003 | [SAN-275](https://linear.app/sanjiovani/issue/SAN-275) | Create trip modal + server action | mvp.md |
| ⚪ | TRIP-004 | [SAN-276](https://linear.app/sanjiovani/issue/SAN-276) | Trip workspace shell (SCREEN-013) | mvp.md |
| ⚪ | TRIP-005 | [SAN-277](https://linear.app/sanjiovani/issue/SAN-277) | Itinerary tab hardening | mvp.md |
| ⚪ | TRIP-006 | [SAN-278](https://linear.app/sanjiovani/issue/SAN-278) | `/saved` collections (SCREEN-011) | mvp.md |
| ⚪ | TRIP-007 | [SAN-279](https://linear.app/sanjiovani/issue/SAN-279) | Add-to-trip from rental/event cards | mvp.md |
| ⚪ | TRIP-008 | [SAN-280](https://linear.app/sanjiovani/issue/SAN-280) | Trip map Google pins tab | mvp.md |
| ⚪ | TRIP-009 | [SAN-281](https://linear.app/sanjiovani/issue/SAN-281) | Conflict persist + CopilotKit HITL | mvp.md |
| ⚪ | TRIP-010 | [SAN-282](https://linear.app/sanjiovani/issue/SAN-282) | Booking confirm → trip_items sync | mvp.md |
| ⚪ | TRIP-011 | [SAN-290](https://linear.app/sanjiovani/issue/SAN-290) | Playwright suite SCREEN-011/012/013 | mvp.md |
| ⚪ | TRIP-012 | [SAN-291](https://linear.app/sanjiovani/issue/SAN-291) | Production smoke + floor gate | mvp.md |

## TRIP-013…019 (hardening)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | TRIP-013 | [SAN-283](https://linear.app/sanjiovani/issue/SAN-283) | Booking reconciliation repair worker | ADV.md |
| ⚪ | TRIP-014 | [SAN-284](https://linear.app/sanjiovani/issue/SAN-284) | Trips RLS penetration verification | ADV.md |
| ⚪ | TRIP-015 | [SAN-285](https://linear.app/sanjiovani/issue/SAN-285) | Places cache + itinerary hydration | ADV.md |
| ⚪ | TRIP-016 | [SAN-286](https://linear.app/sanjiovani/issue/SAN-286) | Mobile workspace UX hardening | ADV.md |
| ⚪ | TRIP-017 | [SAN-287](https://linear.app/sanjiovani/issue/SAN-287) | Trips observability + sync logs | ADV.md |
| ⚪ | TRIP-018 | [SAN-288](https://linear.app/sanjiovani/issue/SAN-288) | Trip lifecycle states + archival | ADV.md |
| ⚪ | TRIP-019 | [SAN-289](https://linear.app/sanjiovani/issue/SAN-289) | Retry + optimistic UI recovery | ADV.md |

## Data spine (ADV § Trips Phase 2)

| Linear | Title | Status |
|--------|-------|--------|
| SAN-328 | Trips data inventory | 🟢 ADV |
| SAN-353 | trip_items CHECK + insert RPC | 🟢 ADV |
| SAN-354 | Commerce trip_id linkage | 🟢 ADV |
| SAN-355 | Trips golden queries | 🟢 ADV |
| SAN-357 | trip_items itinerary index | ⚪ ADV |
| SAN-358 | mastra_threads trip_id index | ⚪ ADV |

**Verdict:** **19/19** TRIP specs have Linear · **19/19** in mvp+ADV.
