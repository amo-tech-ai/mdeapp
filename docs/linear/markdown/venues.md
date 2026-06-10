# 🍽️ Venues — VEN + DATA + VEB tracker
> Spec pack: [`docs/tasks/venues/tasks/INDEX-VENUE.md`](../../tasks/venues/tasks/INDEX-VENUE.md) · Updated: 2026-06-09 · Canonical: `mvp.md` § Venues + `ADV.md` § Events Discovery

**Legend:** 🟢 Done · 🟡 Partial · ⚪ Not started · 🟥 Blocked · — No Linear

---

## Phase 0 — Data foundation

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| 🟢 | DATA-001 | [SAN-325](https://linear.app/sanjiovani/issue/SAN-325) | Venue data inventory | ADV.md |
| 🟢 | DATA-002 | [SAN-330](https://linear.app/sanjiovani/issue/SAN-330) | Three-kind catalog contract | ADV.md |
| 🟢 | DATA-009 | [SAN-331](https://linear.app/sanjiovani/issue/SAN-331) | Schema M1–M3 | ADV.md |
| 🟢 | DATA-035 | [SAN-332](https://linear.app/sanjiovani/issue/SAN-332) | Café anchors seed | ADV.md |
| 🟢 | DATA-004 | [SAN-333](https://linear.app/sanjiovani/issue/SAN-333) | Restaurant catalog verify | ADV.md |
| 🟢 | DATA-003 | [SAN-334](https://linear.app/sanjiovani/issue/SAN-334) | Café seed sign-off | ADV.md |
| 🟢 | DATA-005 | [SAN-335](https://linear.app/sanjiovani/issue/SAN-335) | Nightclub seed | ADV.md |
| 🟢 | DATA-006 | [SAN-336](https://linear.app/sanjiovani/issue/SAN-336) | Golden eval queries | ADV.md |
| 🟢 | DATA-007 | [SAN-337](https://linear.app/sanjiovani/issue/SAN-337) | Places cache audit | ADV.md |
| 🟡 | DATA-008 | [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) | Places backfill cron | mvp.md |

## Browse surfaces (wireframes)

| Route | Linear | Status | Tracker |
|-------|--------|--------|---------|
| `/restaurants` | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | 🟢 | mvp.md |
| `/nightlife` | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | 🟢 | mvp.md |
| `/cafes` | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | ⚪ | mvp.md · dup SAN-558 canceled |
| SCREEN-021 café chat | [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | 🟢 | core.md |

## MVP booking spine (VEN-009…031)

| Status | Spec | Linear | Title | Tracker |
|--------|------|--------|-------|---------|
| ⚪ | VEN-009 | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | RestaurantResultCard | mvp.md |
| ⚪ | VEN-010 | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | RestaurantDetailPanel | mvp.md |
| 🟢 | VEN-011 | [SAN-294](https://linear.app/sanjiovani/issue/SAN-294) | Nightlife grounding intent | mvp.md |
| 🟢 | VEN-012 | [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) | Café vs nightlife kind split | mvp.md |
| 🟢 | VEN-013 | [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) | NightlifeDetailPanel | mvp.md |
| 🟢 | VEN-014 | [SAN-297](https://linear.app/sanjiovani/issue/SAN-297) | Places cache + field mask | mvp.md |
| 🟢 | VEN-014b | [SAN-520](https://linear.app/sanjiovani/issue/SAN-520) | Places detail retry guard | mvp.md |
| 🟢 | VEN-015 | [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) | Booking schema + RLS | mvp.md |
| ⚪ | VEN-016 | [SAN-299](https://linear.app/sanjiovani/issue/SAN-299) | requestVenueBooking tool | mvp.md |
| ⚪ | VEN-017 | [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | VenueBookingSheet | mvp.md |
| ⚪ | VEN-018 | [SAN-301](https://linear.app/sanjiovani/issue/SAN-301) | Mastra ↔ CK registry | mvp.md |
| ⚪ | VEN-019 | [SAN-302](https://linear.app/sanjiovani/issue/SAN-302) | Booking HITL copilot action | mvp.md |
| 🟢 | VEN-021 | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) | Sheet → DB persist | mvp.md |
| ⚪ | VEN-022…030 | SAN-305–313 | Hardening + WA + admin | mvp.md |
| 🟢 | VEN-020 | [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) | Booking status chips | mvp.md |
| 🟡 | VEN-031 | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) | Playwright SCREEN-021/022/023 | mvp.md |
| — | VEN-031b | — | SCREEN-021 ask-prompt e2e | Disk evidence only |

## VEB — Event venue booking (18/18 filed)

> **Import plan:** [`audit/veb-import-plan.md`](../audit/veb-import-plan.md) · **Spec pack:** [`event-booking/INDEX.md`](../../tasks/venues/tasks/event-booking/INDEX.md)  
> **Project:** Events Platform · **Import:** 2026-06-04 · Disk `VEB-*` → Linear `EVT-033…050`

| VEB | Title | Phase | Linear | Tracker |
|-----|-------|-------|--------|---------|
| VEB-001 | Event venue + offerings schema | core | [SAN-492](https://linear.app/sanjiovani/issue/SAN-492) | mvp.md |
| VEB-002 | Seed Mamacita + 5 event partners | core | [SAN-493](https://linear.app/sanjiovani/issue/SAN-493) | mvp.md |
| VEB-003 | Restaurant card Event Venue CTA | mvp | [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | mvp.md |
| VEB-004 | Event offerings detail panel | mvp | [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | mvp.md |
| VEB-005 | Request proposal modal (HITL) | mvp | [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | mvp.md |
| VEB-006 | eventVenueAgent + search/rank tools | mvp | [SAN-497](https://linear.app/sanjiovani/issue/SAN-497) | mvp.md |
| VEB-007 | AI venue match score panel | mvp | [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | mvp.md |
| VEB-008 | Compare venues side-by-side | mvp | [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | mvp.md |
| VEB-009 | Host wizard venue step (Roberto) | mvp | [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | mvp.md |
| VEB-010 | eventVenueBookingWorkflow | mvp | [SAN-501](https://linear.app/sanjiovani/issue/SAN-501) | mvp.md |
| VEB-011 | Patricia admin queue | mvp | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) | mvp.md |
| VEB-012 | Add confirmed booking to trip | mvp | [SAN-503](https://linear.app/sanjiovani/issue/SAN-503) | mvp.md |
| VEB-013 | Venue availability calendar | advanced | [SAN-504](https://linear.app/sanjiovani/issue/SAN-504) | ADV.md |
| VEB-014 | Auto follow-up WA drafts (24h) | advanced | [SAN-505](https://linear.app/sanjiovani/issue/SAN-505) | ADV.md |
| VEB-015 | Venue CRM for Patricia | advanced | [SAN-506](https://linear.app/sanjiovani/issue/SAN-506) | ADV.md |
| VEB-016 | Dynamic package pricing | advanced | [SAN-507](https://linear.app/sanjiovani/issue/SAN-507) | ADV.md |
| VEB-017 | Sponsor ↔ venue match | advanced | [SAN-508](https://linear.app/sanjiovani/issue/SAN-508) | ADV.md |
| VEB-018 | OpenClaw venue enrichment (plan) | advanced | [SAN-509](https://linear.app/sanjiovani/issue/SAN-509) | ADV.md · openclaw.md |

**Wireframes (EVT-051…055):** SAN-510–514 — see [`event-booking/wireframes/INDEX.md`](../../tasks/venues/tasks/event-booking/wireframes/INDEX.md)

## Release stop (venues MVP)

1. VEN-012 Done ✅ · 2. SAN-368 ADK prod 🟥 · 3. VEN-021 persist ✅ · 4. VEN-031 green 🟡

**Verdict:** **VEN MVP SAN-292–314 + data SAN-325–338 + VEB SAN-492–509** — **46/46 in mvp/ADV** · VEB **not** a launch gate (post north-star)
