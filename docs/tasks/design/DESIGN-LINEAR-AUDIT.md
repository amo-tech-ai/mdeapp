---
title: DESIGN-LINEAR-AUDIT — Implementation roadmap + Linear correction plan
updated: 2026-06-08
owner: sanjiovani
status: APPLIED 2026-06-08 (Groups A + B + Trips-closure written to Linear; Group C content held — see "Applied log")
source_of_truth: ./DESIGN-INVENTORY.md
inputs:
  - DESIGN-INVENTORY.md · website-pages.md · DESIGN.MD · sitemap.md
  - tasks/design/** · tasks/partners/** · partner + dashboard wireframes
  - Linear bodies for 113 design-relevant issues across UX · Partners · Trips · Events Platform · Venues (fetched 2026-06-08)
---

# Design ↔ Linear Audit & Implementation Roadmap

> Cross-checks every design-relevant Linear issue against `DESIGN-INVENTORY.md`. **Nothing has been written to Linear yet** — the final section lists the exact updates to apply, pending your go-ahead.

## TL;DR — 8 systemic findings

| # | Finding | Severity | Fix |
|---|---|---|---|
| 1 | **No Linear *cycle* assigned to any issue** — Cycle 1 (Jun 8–22) is active but empty | 🔴 launch-planning blind | Assign the 10 MVP issues to Cycle 1 |
| 2 | **Acceptance Criteria missing in ~30 actionable issues** — Venues/EVT carry `"Not specified"` placeholders; EVT wires + mobile cluster have none | 🔴 not build-ready | Backfill AC from disk specs |
| 3 | **EVT wireframe issues 510–514 have ZERO Linear relations** (deps in prose only); SLAs on 510/511 already breached | 🔴 broken dep graph | Add `relatedTo` build-pairs |
| 4 | **Partners M1 dependency graph inconsistent** — 712/713/714 correctly `blockedBy 665`; 660/661/691/692/693/726 only `relatedTo` | 🟡 ordering risk | Add `blockedBy 665` |
| 5 | **Inverted mobile dep graph** — SAN-489 (Done) is `blockedBy` 10 backlog issues (522–530) that also claim to *block* it | 🟡 contradictory | Reverse: 489 is the shell, 522–530 are follow-ups |
| 6 | **Project mis-files** — SAN-118 (EVT) & SAN-311 (VEN) live in project **UX** | 🟡 view leakage | Move to Events Platform / Venues |
| 7 | **Epic + label drift** — 712/713/714 not children of epic SAN-667 and use off-taxonomy labels (`stack:/area:`) | 🟡 won't surface in PTR/MKT views | Re-parent + relabel |
| 8 | **Priority field ≠ body** — 165/175 (body P0/P3, field High), 173/174 (P2/Medium), all EVT/CTEST (body P0, field High) | 🟡 mis-prioritized | Reconcile field to body intent |

**Quality benchmark:** the hand-authored **Trips TRP-274…279** and **design D-08…D-13** issues are the gold standard (summary + journey + FE/BE/agent split + real AC + "do-not-do"). The imported **UIX/SCREEN-*** family and the **Venues/EVT stubs** are the weak spots.

---

# Recommended Implementation Order

> Ordered by dependency + north-star value (Camila cards/pins · Andrés paid ticket · Roberto host publish). Order # is global. "Dependencies" = the gating issue(s).

## MVP — Cycle 1 (Jun 8–22) · launch blockers

| Order | Task ID | Task Name | Reason | Dependencies |
|---:|---|---|---|---|
| 1 | **PAY-001** (`/api/tickets/webhook`) | Stripe webhook finalize | **THE P0** — Andrés can't get a confirmed paid ticket; edge fn deployed, needs Dashboard event subs + e2e proof | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) ✅, [SAN-248](https://linear.app/sanjiovani/issue/SAN-248) ✅ |
| 2 | [SAN-715](https://linear.app/sanjiovani/issue/SAN-715) | FE — Checkout states (decline/3DS/wallet/empty) | Done — verify on prod against live webhook | SAN-248 |
| 3 | [SAN-259](https://linear.app/sanjiovani/issue/SAN-259) | SCREEN-015 — My tickets + QR | Andrés' wallet; unblocks after paid-ticket G1 | PAY-001 (text dep only — add relation) |
| 4 | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | REAL-011 — Rental browse `/rentals` | Camila's catalog; redirects to /chat today | SCREEN-005 ✅, MAP-001 |
| 5 | [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | REAL-012 — Rental detail `/rentals/[id]` | Camila's cards link nowhere without it | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) |
| 6 | [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) | SCREEN-008 — Schedule-viewing modal | Camila lead capture (In Review → verify) | — |
| 7 | [SAN-716](https://linear.app/sanjiovani/issue/SAN-716) | FE — "Lead submitted" confirmation | Closes Camila's lead loop; blocks partner dashboard | RE-006 / [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) |
| 8 | [SAN-263](https://linear.app/sanjiovani/issue/SAN-263) | SCREEN-004 — Workflow progress strip | Concierge polish (In Review → verify) | — |
| 9 | [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | SCR-002b — Sidebar nav enable | Turn on browse nav now that routes are Done | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519), [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) |
| 10 | [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) | Login/signup polish | Auth visual polish (In Review) | — |
| 11 | **NEW LEGAL-001/002** | `/legal/privacy` + `/legal/terms` | Compliance gate for public launch — **no task exists** | — |

## Phase 1 — W6–W10 (consumer depth + active supply track)

| Order | Task ID | Task Name | Reason | Dependencies |
|---:|---|---|---|---|
| 12 | [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | D-12 — Concierge AI band | Finish design re-skin | [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) ✅ |
| 13 | [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) | D-14 — Polish + proof (a11y/responsive/tests) | Final design gate (WCAG 2.2 AA) | D-09…D-13 |
| 14 | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | VEN-013 — RestaurantResultCard | Venue card parity (Urgent, AC missing) | DATA-004 |
| 15 | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | VEN-014 — RestaurantDetailPanel | In-chat restaurant detail | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) |
| 16 | [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | VEN-021 — VenueBookingSheet | Booking UI (304 persist already Done) | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) ✅ |
| 17 | [SAN-273](https://linear.app/sanjiovani/issue/SAN-273)→[279](https://linear.app/sanjiovani/issue/SAN-279) | TRP-009…015 — Trips track | Camila planning layer (gold-spec chain) | 273→274→275→276→277→278→279 |
| 18 | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) | SCREEN-024 — Admin Events dashboard | Patricia ops (W8) — **wireframe first** | F08, EVP-014 |
| 19 | [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) | SCREEN-025 — Admin Leads CRM | Patricia ops — **wireframe first** | F08, leads table |
| 20 | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | VEN-032 — Admin booking queue | Merge venue+event queue (see dups) | [SAN-310](https://linear.app/sanjiovani/issue/SAN-310) |
| **Supply track (active now — current branch SAN-692)** ||||
| 21 | [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) | Partner UX pack (wireframes + SVGs) | **Unblocks all M1 landing wireframes** | — |
| 22 | [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) | Partner hub `/partners` | Supply funnel entry (gated on scope) | [SAN-674](https://linear.app/sanjiovani/issue/SAN-674), 660/661/691/664/663 (cards 404 until) |
| 23 | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | For Event Hosts `/host` | M1 acquire (wireframe A·92) | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) ✅ |
| 24 | [SAN-661](https://linear.app/sanjiovani/issue/SAN-661) | For Venues `/venues` | M1 acquire (wireframe A·88) | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) ✅ |
| 25 | [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | For Rentals/Brokers `/partners/rentals` | M1 acquire (shell exists) | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) ✅ |
| 26 | [SAN-713](https://linear.app/sanjiovani/issue/SAN-713)/[714](https://linear.app/sanjiovani/issue/SAN-714)/[712](https://linear.app/sanjiovani/issue/SAN-712) | For Restaurants/Cafés/Nightlife | M1 venue-type landings | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) ✅ |
| 27 | [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) | Contact / book a demo `/contact` | M1 conversion | [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) |
| 28 | [SAN-662](https://linear.app/sanjiovani/issue/SAN-662) | About `/about` | M1 trust page (wireframe exists) | — |
| 29 | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Partner dashboard `/dashboard` | M2 deliver — role-aware shell | [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) ✅, [SAN-716](https://linear.app/sanjiovani/issue/SAN-716), [SAN-683](https://linear.app/sanjiovani/issue/SAN-683) ✅ |

## Phase 2

| Order | Task ID | Task Name | Reason | Dependencies |
|---:|---|---|---|---|
| 30 | [SAN-663](https://linear.app/sanjiovani/issue/SAN-663)/[664](https://linear.app/sanjiovani/issue/SAN-664)/[726](https://linear.app/sanjiovani/issue/SAN-726) | Business/AI · Sponsors · Business hub | M5 expand | M1 done |
| 31 | [SAN-694](https://linear.app/sanjiovani/issue/SAN-694)/[695](https://linear.app/sanjiovani/issue/SAN-695)/[696](https://linear.app/sanjiovani/issue/SAN-696)/[697](https://linear.app/sanjiovani/issue/SAN-697)/[701](https://linear.app/sanjiovani/issue/SAN-701)/[702](https://linear.app/sanjiovani/issue/SAN-702)/[703](https://linear.app/sanjiovani/issue/SAN-703) | Contests/Pricing/Creator/Social/EventMkt/Vendor/VenueFeatures | M4/M5 augment+expand | [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) needs [SAN-668](https://linear.app/sanjiovani/issue/SAN-668) |
| 32 | [SAN-492](https://linear.app/sanjiovani/issue/SAN-492)→[514](https://linear.app/sanjiovani/issue/SAN-514) | EVT-033…055 — B2B event-venue booking | Roberto venue sourcing; build chain + wires | schema 492→497→panels |
| 33 | [SAN-521](https://linear.app/sanjiovani/issue/SAN-521)+[522](https://linear.app/sanjiovani/issue/SAN-522)→[530](https://linear.app/sanjiovani/issue/SAN-530) | Mobile hardening (chat/cards/map/checkout/PWA/perf/a11y) | Post-shell mobile depth | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) ✅ (fix dep direction) |
| 34 | [SAN-269](https://linear.app/sanjiovani/issue/SAN-269)/[271](https://linear.app/sanjiovani/issue/SAN-271)/[517](https://linear.app/sanjiovani/issue/SAN-517) | Onboarding · Notifications · Profile | Personalization layer | — |
| 35 | VEN-001…012 + TRP-001…008 | Coffee-tour vertical | Whole vertical unbuilt | schema first |
| 36 | ECOM-C-*/M-* | Ecommerce (Medusa) storefront + vendor | Commerce direction | medusa setup |

## Post-MVP / Later

| Order | Task ID | Task Name | Reason | Dependencies |
|---:|---|---|---|---|
| 37 | [SAN-536](https://linear.app/sanjiovani/issue/SAN-536)/[538](https://linear.app/sanjiovani/issue/SAN-538)/[541](https://linear.app/sanjiovani/issue/SAN-541)/[542](https://linear.app/sanjiovani/issue/SAN-542) | CTEST contest platform | Labeled phase2 (body says P0 — reconcile) | contest schema 533/534 |
| 38 | NEW (no task) | Broker `/broker/*`, Restaurant/Nightlife `/[slug]` detail routes, `/whatsapp` | Orphan routes — create tasks when in scope | — |

---

# Design Audit

> "Complete Details" = has description + AC + deps + route all present in Linear. ✅ all present · 🟡 partial · ❌ stub.

| Task ID | Task Name | Route | Wireframe | Spec | Complete Details | Status |
|---|---|---|:--:|:--:|:--:|---|
| [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | D-08 Shared browse system | `src/components/browse` | ✅ | ✅ | ✅ | Done |
| [SAN-575](https://linear.app/sanjiovani/issue/SAN-575) | D-09 Re-skin discovery | `/restaurants`… | ✅ | ✅ | ✅ | Done |
| [SAN-577](https://linear.app/sanjiovani/issue/SAN-577) | D-11 Map workspace | `/`+browse | ✅ | ✅ | ✅ | Done |
| [SAN-579](https://linear.app/sanjiovani/issue/SAN-579) | D-13 Re-skin Home | `/` | ✅ | ✅ | ✅ | Done |
| [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) | D-12 Concierge AI band | browse | ✅ | ✅ | ✅ | Backlog |
| [SAN-274](https://linear.app/sanjiovani/issue/SAN-274)–[279](https://linear.app/sanjiovani/issue/SAN-279) | TRP-010…015 Trips | `/trips`… | ✅ | ✅ | ✅ | Todo |
| [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Partner dashboard | `/dashboard` | 🟡 (06-dashboards.md) | ✅ | ✅ | Todo |
| [SAN-660](https://linear.app/sanjiovani/issue/SAN-660)/[661](https://linear.app/sanjiovani/issue/SAN-661) | Host/Venues landing | `/host`,`/venues` | ✅ | ✅ | ✅ | Todo |
| [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | Rentals landing | `/partners/rentals` | ✅ | ✅ | 🟡 (deps relatedTo only) | Todo |
| [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) | Partner hub | `/partners` | ❌ | 🟡 | 🟡 (no wireframe) | Todo |
| [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | Rental browse | `/rentals` | ✅ | ✅ | ✅ | In Progress |
| [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) | Rental detail | `/rentals/[id]` | ✅ | ✅ | ✅ | Backlog |
| [SAN-292](https://linear.app/sanjiovani/issue/SAN-292)/[293](https://linear.app/sanjiovani/issue/SAN-293) | Restaurant card/panel | `/chat` | ✅ | ✅ | ❌ (AC "not specified") | Todo |
| [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | VenueBookingSheet | overlay | 🟡 | ✅ | ❌ (AC stub) | Todo |
| [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | Admin booking queue | `/admin/bookings` | ❌ | 🟡 | ❌ (AC stub, mis-filed UX) | Backlog |
| [SAN-515](https://linear.app/sanjiovani/issue/SAN-515)/[516](https://linear.app/sanjiovani/issue/SAN-516)/[517](https://linear.app/sanjiovani/issue/SAN-517) | Admin events/leads/profile | `/admin/*`,`/me/profile` | ❌ | ✅ | 🟡 (wireframe "to be created") | Backlog |
| [SAN-495](https://linear.app/sanjiovani/issue/SAN-495)–[502](https://linear.app/sanjiovani/issue/SAN-502) | EVT B2B venue booking | overlays | 🟡 | 🟡 | ❌ (thin, AC on disk only) | Todo |
| [SAN-510](https://linear.app/sanjiovani/issue/SAN-510)–[514](https://linear.app/sanjiovani/issue/SAN-514) | EVT wireframe tasks | overlays | 🟡 | 🟡 | ❌ (zero relations, SLA breached) | Todo |
| [SAN-522](https://linear.app/sanjiovani/issue/SAN-522)–[530](https://linear.app/sanjiovani/issue/SAN-530) | Mobile cluster | mobile | ❌ | 🟡 (disk) | ❌ (thin, no AC, inverted deps) | Backlog |
| [SAN-518](https://linear.app/sanjiovani/issue/SAN-518)/[584](https://linear.app/sanjiovani/issue/SAN-584) | Events browse / nav enable | `/events`,`/` | ✅ | 🟡 | 🟡 (AC erased by ship summary) | Done/In Progress |
| UIX/SCREEN-* (Done) | 232/234/236/237/240/242/245/248/253… | various | ✅ | ✅ | 🟡 (no forward AC, has evidence) | Done |

---

# Missing Wireframes

| Task ID | Task Name | Route | Priority |
|---|---|---|:--:|
| [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) | Partner hub | `/partners` | P1 |
| [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Partner dashboard (HTML wire; only module spec exists) | `/dashboard` | P1 |
| [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) | Contact / demo | `/contact` | P1 |
| [SAN-713](https://linear.app/sanjiovani/issue/SAN-713)/[714](https://linear.app/sanjiovani/issue/SAN-714)/[712](https://linear.app/sanjiovani/issue/SAN-712) | Restaurants/Cafés/Nightlife landing (have `pages/*.md`, no HTML wire) | `/partners/*` | P1 |
| [SAN-515](https://linear.app/sanjiovani/issue/SAN-515)/[516](https://linear.app/sanjiovani/issue/SAN-516) | Admin events / leads ("wire to be created") | `/admin/*` | POST |
| [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | Admin booking queue | `/admin/bookings` | POST |
| [SAN-517](https://linear.app/sanjiovani/issue/SAN-517) | Profile / AI memory | `/me/profile` | POST |
| [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | Compare venues | overlay | POST |
| [SAN-165](https://linear.app/sanjiovani/issue/SAN-165)/[173](https://linear.app/sanjiovani/issue/SAN-173) | Coffee-tour card + compare drawer | `/`, overlay | POST |
| [SAN-522](https://linear.app/sanjiovani/issue/SAN-522)–[526](https://linear.app/sanjiovani/issue/SAN-526) | Mobile chat/cards/map/checkout/concierge | mobile | POST |
| [SAN-696](https://linear.app/sanjiovani/issue/SAN-696)/[702](https://linear.app/sanjiovani/issue/SAN-702)/[726](https://linear.app/sanjiovani/issue/SAN-726)/[695](https://linear.app/sanjiovani/issue/SAN-695)/[694](https://linear.app/sanjiovani/issue/SAN-694) | Creator/Vendor/Business hub/Pricing/Contests | various | POST |
| NEW | Legal, Restaurant/Nightlife detail, Ecommerce | `/legal/*`,`/[slug]`,`/checkout` | P1/POST |

---

# Missing Specs (no detailed screen spec on disk)

| Task ID | Task Name | Route | Priority |
|---|---|---|:--:|
| [SAN-697](https://linear.app/sanjiovani/issue/SAN-697) | Postiz social services | `/business/social` | POST |
| [SAN-703](https://linear.app/sanjiovani/issue/SAN-703) | Venue features deep-dive | `/venues/features` | POST |
| [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) | Partner pricing | `/pricing` | POST |
| [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) | Contact / demo | `/contact` | P1 |
| NEW | Admin home/listings/users/cost | `/admin/*` | POST |
| NEW | Broker dashboard/listings/payouts | `/broker/*` | POST |
| NEW | Restaurant/Nightlife detail routes | `/restaurants/[slug]`,`/nightlife/[slug]` | POST |
| NEW | Legal privacy/terms | `/legal/*` | P1 |
| NEW | WhatsApp landing | `/whatsapp` | P2 |

---

# Missing Acceptance Criteria (actionable — non-Done issues)

> Backfill from the disk spec. Done issues with completion-evidence but no forward AC are low priority (listed separately at end).

| Task ID | Task Name |
|---|---|
| [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | VEN-013 RestaurantResultCard (AC = "Not specified") |
| [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | VEN-014 RestaurantDetailPanel (AC stub) |
| [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | VEN-021 VenueBookingSheet (AC stub) |
| [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | VEN-032 Admin booking queue (AC stub) |
| [SAN-165](https://linear.app/sanjiovani/issue/SAN-165) | VEN-008 CoffeeTourCard (AC truncated) |
| [SAN-175](https://linear.app/sanjiovani/issue/SAN-175) | VEN-012 /tours/[slug] (AC "Not specified") |
| [SAN-173](https://linear.app/sanjiovani/issue/SAN-173)/[174](https://linear.app/sanjiovani/issue/SAN-174) | TRP-005/006 compare drawer / intent chips (thin) |
| [SAN-495](https://linear.app/sanjiovani/issue/SAN-495)/[496](https://linear.app/sanjiovani/issue/SAN-496)/[498](https://linear.app/sanjiovani/issue/SAN-498)/[499](https://linear.app/sanjiovani/issue/SAN-499)/[500](https://linear.app/sanjiovani/issue/SAN-500)/[502](https://linear.app/sanjiovani/issue/SAN-502) | EVT-036…043 B2B build (AC on disk only) |
| [SAN-510](https://linear.app/sanjiovani/issue/SAN-510)/[511](https://linear.app/sanjiovani/issue/SAN-511)/[512](https://linear.app/sanjiovani/issue/SAN-512)/[513](https://linear.app/sanjiovani/issue/SAN-513)/[514](https://linear.app/sanjiovani/issue/SAN-514) | EVT-051…055 wireframe tasks (no AC) |
| [SAN-522](https://linear.app/sanjiovani/issue/SAN-522)–[530](https://linear.app/sanjiovani/issue/SAN-530) | Mobile cluster (AC on disk only) |
| [SAN-269](https://linear.app/sanjiovani/issue/SAN-269)/[271](https://linear.app/sanjiovani/issue/SAN-271) | Onboarding / Notifications (deferred) |
| [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | Sidebar nav enable (AC erased by ship summary) |

**Low-priority backfill (Done, has evidence not AC):** 114, 117, 232, 234, 236, 237, 240, 242, 245, 248, 518.

---

# Missing Dependencies

| Task ID | Task Name | Missing dependency to add |
|---|---|---|
| [SAN-510](https://linear.app/sanjiovani/issue/SAN-510)/[511](https://linear.app/sanjiovani/issue/SAN-511)/[512](https://linear.app/sanjiovani/issue/SAN-512)/[513](https://linear.app/sanjiovani/issue/SAN-513)/[514](https://linear.app/sanjiovani/issue/SAN-514) | EVT wireframes | **Zero relations** — add `relatedTo` build-pairs (510↔495, 511↔496, 512↔498/499, 513↔500, 514↔502) |
| [SAN-660](https://linear.app/sanjiovani/issue/SAN-660)/[661](https://linear.app/sanjiovani/issue/SAN-661)/[692](https://linear.app/sanjiovani/issue/SAN-692)/[693](https://linear.app/sanjiovani/issue/SAN-693)/[726](https://linear.app/sanjiovani/issue/SAN-726) | Partner M1 landings | Add `blockedBy [SAN-665](https://linear.app/sanjiovani/issue/SAN-665)` (signup) — match 712/713/714 |
| [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | Rentals landing | Promote text deps (665, 690, 668, 684, 677) from `relatedTo` → `blockedBy 665` minimum |
| [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) | Partner pricing | `blockedBy [SAN-668](https://linear.app/sanjiovani/issue/SAN-668)` (revenue config) — currently relatedTo |
| [SAN-715](https://linear.app/sanjiovani/issue/SAN-715)/[716](https://linear.app/sanjiovani/issue/SAN-716) | Checkout states / lead confirm | Promote to `blockedBy` PAY-001 / RE-006 (currently relatedTo) |
| [SAN-259](https://linear.app/sanjiovani/issue/SAN-259) | My tickets + QR | `blockedBy` PAY-001 (Stripe G1) — text-only today |
| [SAN-662](https://linear.app/sanjiovani/issue/SAN-662) | About page | No relations; link to [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) UX pack |
| [SAN-251](https://linear.app/sanjiovani/issue/SAN-251)/[253](https://linear.app/sanjiovani/issue/SAN-253)/[255](https://linear.app/sanjiovani/issue/SAN-255) | UIX SCREEN-011/012/013 | Link to overlapping TRP track (276/278/274) — see Duplicates |
| [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) | Map panel | Body names MAP-001/008/F49; only SAN-113 linked — add real relations |
| [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) + [522](https://linear.app/sanjiovani/issue/SAN-522)–[530](https://linear.app/sanjiovani/issue/SAN-530) | Mobile cluster | **Reverse inverted graph** — 489 (shell) is the prerequisite; 522–530 are follow-ups that depend on it, not block it |

---

# Duplicate Tasks

| Task A | Task B | Recommendation |
|---|---|---|
| [SAN-360](https://linear.app/sanjiovani/issue/SAN-360) (Duplicate) | [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) (D-08) | Already marked dup ✅ — keep 574 as canonical card owner |
| [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) (Duplicate) | [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) | Already marked dup ✅ |
| [SAN-558](https://linear.app/sanjiovani/issue/SAN-558) (Duplicate) | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) (Cafés) | Already marked dup ✅ |
| [SAN-666](https://linear.app/sanjiovani/issue/SAN-666) (Canceled) | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Canceled but `duplicateOf` is **null** — set the relation so it shows in the graph |
| [SAN-247](https://linear.app/sanjiovani/issue/SAN-247) (Canceled) | [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) | Map panel wire/screen pair — 247 canceled, built as SCREEN-010=111 ✅ |
| [SAN-255](https://linear.app/sanjiovani/issue/SAN-255) (SCREEN-012) | [SAN-274](https://linear.app/sanjiovani/issue/SAN-274) (TRP-010) | **Overlap** — both = Trips dashboard. Keep TRP-274 (gold spec); close 255 as superseded |
| [SAN-251](https://linear.app/sanjiovani/issue/SAN-251) (SCREEN-013) | [SAN-276](https://linear.app/sanjiovani/issue/SAN-276) (TRP-012) | **Overlap** — Trip workspace. Keep TRP-276; supersede 251 |
| [SAN-253](https://linear.app/sanjiovani/issue/SAN-253) (SCREEN-011, Done) | [SAN-278](https://linear.app/sanjiovani/issue/SAN-278) (TRP-014) | **Overlap** — Saved collections. 253 Done but 278 is a rebuild; confirm 278 supersedes or close it |
| [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) (venue queue) | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) + [514](https://linear.app/sanjiovani/issue/SAN-514) (event queue) | **Merge** — one `/admin/bookings` with venue+event tabs, not 3 surfaces |
| [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) (build) | [SAN-513](https://linear.app/sanjiovani/issue/SAN-513) (wire) | **Not a dup** — design→build pair; just add the relation |
| [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) (`/partners`) | [SAN-726](https://linear.app/sanjiovani/issue/SAN-726) (`/business`) | **Not a dup** — confirmed distinct (self-serve hub vs B2B brand front door) |
| [SAN-114](https://linear.app/sanjiovani/issue/SAN-114) | [SAN-272](https://linear.app/sanjiovani/issue/SAN-272) (WIRE-026 café) | Likely wireframe dup — verify and mark |

---

# UI Architecture Review — reusable components & patterns

> Per `DESIGN.MD` (base-nova, `@base-ui/react`, Tailwind v4 oklch) and D-07 installed primitives (`tabs, command, avatar, carousel, sonner, sidebar`). Goal: **build templates, not pages.**

| Shared asset | Build once | shadcn/ui | 21st.dev pattern | Consumers |
|---|---|---|---|---|
| **ResultCardShell** ✅ (SAN-574) | image + AI-reason + meta + CTA | `card` `badge` `aspect-ratio` `hover-card` `skeleton` | image/listing card | restaurants, cafés, nightlife, rentals, events, attractions → extend to **product + coffee-tour** |
| **BrowseLayout** ✅ (SAN-574) | filters + grid + map split | `tabs` `command` `scroll-area` | cards│map split | all 4 browse routes + future verticals |
| **DashboardShell** (NEW) | role-aware sidebar + tab modules | `sidebar` `tabs` `chart` | dashboard/KPI layout | partner `/dashboard` (690), `/host/events`, `/admin/*`, vendor |
| **DataTable** (NEW) | sortable/filterable table | `table` + TanStack Table | data-table | admin leads/events/bookings (515/516/311), host events, vendor orders |
| **FormKit** (NEW) | RHF + zod + field set | `form` `input` `select` `label` `checkbox` `radio-group` | form layouts | signup wizard, host wizard, request-proposal (496), schedule-viewing (262), contact (693) |
| **WizardShell** (partial) | stepper + progress + HITL | `progress` + stepper | multi-step wizard | partner signup (723), host event (240), onboarding (269), host venue-step (500) |
| **MarketingPageShell** (NEW) | hero + feature grid + CTA + FAQ + footer | `accordion` `card` `button` `separator` `badge` | hero / feature grid / pricing table / testimonial | **all M1–M5 partner landings** (660/661/691/692/693/662/664/663/726…) — one template, props per vertical |
| **DetailSheet** ✅ (SAN-245) | slide-over detail | `sheet` `drawer` (mobile) `carousel` | detail panel | venue/rental/event (245), restaurant (293), nightlife (296), offerings (495) |
| **Empty/Loading/Error states** ✅ (SCREEN-019) | skeleton + empty + error | `skeleton` `alert` `sonner` | — | every async surface (enforced by D-14) |

**Accessibility (WCAG 2.2 AA — D-14 / SAN-580):** target size **24×24 min (2.5.8)**, visible focus (`:focus-visible` ring per DESIGN.MD `--ring`), `prefers-reduced-motion`, skeletons over spinners, dragging alternatives (2.5.7). **Mobile (522–530):** 44px touch targets, bottom-sheet for detail, carousel for cards, keyboard-safe composer.

**Biggest leverage:** the **MarketingPageShell** collapses ~15 partner landing pages into one template — and **DashboardShell + DataTable** collapse partner dashboard + 3 admin queues + host/vendor into shared infra. Prioritize these two before building any individual partner/admin page.

---

# Linear Updates Required

> **Verify-before-change:** none of the below has been applied. Grouped by risk. Recommend applying Group A (safe structural) first, then B/C after sign-off.

### Group A — safe structural fixes (low risk, high value)
1. **Cycle assignment** — add to **Cycle 1 (Jun 8–22)**: SAN-478, 479, 259, 262, 263, 584, 112, 715, 716 (+ PAY-001 webhook issue). *(Currently 0 issues on Cycle 1.)*
2. **Project mis-files** — move **SAN-118** → Events Platform; **SAN-311** → Venues.
3. **Epic parenting** — set `parent: SAN-667` on **SAN-712, 713, 714**.
4. **Label taxonomy** — relabel **SAN-712/713/714** to `MKT`/`PTR`/`UX` set (drop `stack:/area:`); they're invisible in PTR/MKT views today.
5. **Duplicate relations** — set `duplicateOf`: **SAN-666 → SAN-690**; verify **SAN-114 ↔ SAN-272**.

### Group B — dependency graph corrections
6. Add `blockedBy SAN-665` to **SAN-660, 661, 691, 692, 693, 726**.
7. Add `blockedBy SAN-668` to **SAN-695**.
8. Add `relatedTo` build-pairs for EVT wires: **510↔495, 511↔496, 512↔498/499, 513↔500, 514↔502**.
9. Promote `relatedTo`→`blockedBy`: **SAN-715/716** → PAY-001/RE-006; **SAN-259** → PAY-001.
10. **Reverse mobile dep direction** — SAN-522–530 `blockedBy SAN-489` (not the reverse).
11. Link overlap pairs: **SAN-255/251/253** `relatedTo` their TRP equivalents (274/276/278).

### Group C — content fixes (need disk-spec sync)
12. **Backfill AC** from disk specs into: SAN-292, 293, 300, 311, 165, 175, 495, 496, 498, 499, 500, 502, 510–514, 522–530 (see *Missing AC*).
13. **Restore AC** erased by ship-summaries: SAN-518, 584.
14. **Reconcile priority field to body**: SAN-165 (→High/Urgent?), 175, 173, 174, and all EVT/CTEST P0-body issues — decide field truth.
15. **Status hygiene**: SAN-491 marked Done with 2 unchecked AC; SAN-478 churned Done↔In-Progress with 2 competing PRs (#108/#122) — pick one.

### Decisions needed from you (block C/dup-closure)
- **Trips overlap**: close UIX **SAN-255/251** as superseded by TRP **274/276**? And does TRP **278** supersede Done **SAN-253**?
- **Admin queue**: merge **SAN-311 + 502 + 514** into one `/admin/bookings`?
- **CTEST phase**: bodies say P0 but labeled `phase:phase2` — Phase 1 or 2?
- **New tasks to create** (no dup exists): LEGAL-001/002 (`/legal/*`), broker/`[slug]` detail routes, ecommerce checkout/cart/vendor-dashboard/product-card, `/whatsapp`.

---

---

# Applied log — 2026-06-08

User approved **All (A+B+C)** + **Close Trips dupes**. Executed via Linear MCP `save_issue`.

## ✅ Applied (43 mutations across 38 issues)

**Group A — structural**
- **Cycle 1 (Jun 8–22) assigned** → SAN-478, 479, 259, 262, 263, 584, 112, 715, 716 (9). *(Cycle 1 was empty before.)*
- **Project moves** → SAN-118 → Events Platform · SAN-311 → Venues.
- **Epic re-parent + relabel** → SAN-712, 713, 714 → `parentId SAN-667`, labels → `[PTR, MKT, UX]` (dropped off-taxonomy `stack:/area:`).
- **Duplicate relation** → SAN-666 `duplicateOf` SAN-690.

**Group B — dependency graph**
- **`blockedBy SAN-665`** → SAN-660, 661, 691, 692, 693, 726 (partner M1 landings).
- **`blockedBy SAN-668`** → SAN-695 (pricing).
- **EVT wire→build `relatedTo`** → 510→495 · 511→496 · 512→498/499 · 513→500 · 514→502.
- **`blockedBy`** → SAN-259→248 · 715→248 · 716→262.
- **Mobile graph reversed** → SAN-522–530 now `blockedBy SAN-489` (9 issues).

**Reconciliation — Trips dupes closed**
- SAN-255 (SCREEN-012) → Canceled, `duplicateOf` SAN-274.
- SAN-251 (SCREEN-013) → Canceled, `duplicateOf` SAN-276.
- SAN-278 (TRP-014) → `relatedTo` SAN-253 (left Done; 278 supersedes on rebuild).

## ⚠️ Partial / residual
- **Mobile `removeBlocks SAN-489` failed** on 522/526/527/530 (API: "Failed to remove 1 relation(s)"). The correct `blockedBy 489` is set on all 9, but a few may still carry the old contradictory `blocks 489`. **Manual cleanup:** open each, remove the stray "blocks SAN-489" relation in the UI.

## ⛔ Group C — HELD (not applied) with reason
- **AC backfill** — held. The missing AC is **absent in the source disk specs too** (e.g. SAN-311/292/293/300 bodies literally read *"Acceptance criteria: Not specified in source task"*). Adding AC would mean **authoring new product criteria**, which is a PM decision — not a mechanical Linear correction. I won't fabricate AC. **Needs you/PM to author** for: 292, 293, 300, 311, 165, 175, 173, 174, 495, 496, 498, 499, 500, 502, 510–514, 522–530, 269, 271, 584.
- **Priority reconcile** — held. The P0–P3 (body) ↔ Urgent/High/Medium/Low (field) mapping is ambiguous; bulk-changing it risks misordering the whole backlog. **Confirm the mapping** and I'll apply to: 165 (body P0), 175 (P3), 173/174 (P2), and the EVT/CTEST P0-body set.
- **AC restore (518/584)** — held. Original AC was overwritten by ship-summaries; I don't have the pre-edit text. Recover from Linear issue history if needed.

## Not actioned (you declined these reconciliations)
- Merge admin booking queues (311/502/514) — **not done** (left separate; overlap still flagged).
- Create orphan tasks (legal, broker, ecommerce, whatsapp) — **not created**.
- CTEST phase/priority change — **not changed**.

## Flags surfaced during apply
- **SAN-479** carries a `phase:phase2` label but was placed in Cycle 1 per the MVP roadmap (cards link nowhere). Reconcile the label vs cycle.
- **SAN-715** is already `Done`; cycle-assigned for sprint accounting only.
- **712/713/714** now have core `[PTR,MKT,UX]`; optionally add `ptr:nightclub/restaurant/cafe` to match SAN-661's per-type tags.

---

# Design Readiness Audit — 2026-06-08 (Phase 2)

Wireframes authored → [`wireframe/readiness-wireframes.md`](wireframe/readiness-wireframes.md) (6 screens). Shells → [`COMPONENT-SHELLS.md`](COMPONENT-SHELLS.md) (5 shells). AC authored below from the on-disk venue specs (the criteria exist on disk — they were just never imported into the Linear bodies, so this is grounding, not invention).

## Proposed Acceptance Criteria (review → push to Linear)

### [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) — VEN-013 RestaurantResultCard *(source: `tasks/venues/tasks/mvp/009-…md`)*
- [ ] Card renders Places photo (16:10 via `/api/places/photo`), name, ★rating, cuisine tag, neighborhood, price tier; `data-testid="restaurant-card"`.
- [ ] Both Mastra action names registered (`MASTRA_COPILOT_TOOL_ACTIONS.restaurants` + `MASTRA_TOOL_IDS.restaurants`), `available:"disabled"` render.
- [ ] Replaces `GenericResults` in the restaurant branch of `search-tool-renders.tsx`.
- [ ] Click → `openRestaurantDetail`; map pin sync `category="restaurant"` + hover→pin highlight.
- [ ] 2-line `line-clamp` (no mid-sentence truncation); skeleton on load; gradient+glyph fallback (no broken icon).
- [ ] Vitest snapshot + Playwright SCREEN-023 green; `floor` exit 0.

### [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) — VEN-014 RestaurantDetailPanel *(source: `010-…md`)*
- [ ] Card click opens `data-testid="restaurant-detail-panel"` (right column / mobile sheet) — **not** the café panel.
- [ ] Renders photos, hours/open-now, cuisine, price, description, Directions (secondary action).
- [ ] `RestaurantVenueDetail` type + `openRestaurantDetail`/`close…` + siblings list in `rental-ui-context`.
- [ ] Places hydrate via `/api/places/detail` (FieldMask); degrade gracefully on cache miss.
- [ ] Book CTA → `openVenueBooking({venue_kind:'restaurant'})` opens the real `VenueBookingForm` (not stub).
- [ ] Map pin `data-selected` on hover/select; Playwright SCREEN-023 detail+booking path; `floor` exit 0.

### [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) — VEN-021 VenueBookingSheet *(source: `017-…md`)*
- [ ] `VenueBookingForm` uses `react-hook-form` + `zodResolver(venueBookingFormSchema)` (**not** `useState`).
- [ ] All inputs inside shadcn `FieldGroup`/`Field`; `data-invalid`/`aria-invalid` on validation fail.
- [ ] Fields: name, email, phone/WhatsApp, date, time, party size, occasion, special requests, **WhatsApp consent (required)**.
- [ ] `venue_kind` prop drives café/restaurant/nightlife wrappers — all three open the shared form (no stub).
- [ ] Sign-in gate when logged out; submit → `POST /api/venue-booking/request` → pending row + honest "confirm on WhatsApp" copy.
- [ ] HITL `renderAndWaitForResponse` reuses the same form (VEN-019); Vitest schema/resolver + Playwright required-field/consent; `floor` exit 0.

### [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) — VEN-032 Admin booking queue *(source: `024-…md`)*
- [ ] `/admin/bookings` gated to admin role; non-admin → **403**.
- [ ] Lists `venue_booking_requests` filterable by `venue_kind` + status (pending/sent/needs_user) via `DataTable`.
- [ ] Row → preview `whatsapp_draft`; edit before send; link to place detail.
- [ ] Approve updates status + enqueues outbox (CAF-016); RLS UPDATE policy present (User A ≠ admin proof).
- [ ] Admin-fixture Playwright; `floor` exit 0.

## Remaining blockers (MVP)

| # | Blocker | Owner action |
|---|---|---|
| 1 | **PAY-001 Stripe webhook finalize** (`/api/tickets/webhook`) — backend, the one true launch blocker | Dashboard event subs + live checkout→finalize e2e proof |
| 2 | **AC not yet in Linear** for 292/293/300/311 | Approve the AC above → I push to issue bodies |
| 3 | **Mobile stray `blocks 489`** on 522/526/527/530 (removeBlocks API failed) | Manual relation-delete in Linear UI |
| 4 | **Priority field ↔ body mapping** unresolved (165/175/173/174 + EVT/CTEST P0-body) | Confirm P0–P3 → Urgent/High/Med/Low mapping |
| 5 | **Admin wireframes missing** (515/516/311) | Author after `DashboardShell` lands |
| 6 | **Legal `/legal/privacy` + `/legal/terms`** — no task, launch-compliance | Create LEGAL-001/002 (you declined earlier — re-confirm) |

## Missing Wireframes (updated)

| Status | Screens |
|---|---|
| ✅ **Now authored** (readiness-wireframes.md) | 692, 690, 693, 712, 713, 714 |
| ❌ Still missing | 515/516 admin · 311 admin queue · 517 profile · 499 compare venues · 165/173 coffee-tour · 522–526 mobile · 696/702/726/695/694 partner M4/M5 · legal/`[slug]` detail routes |

## Missing Acceptance Criteria (updated)

| Status | Issues |
|---|---|
| ✅ **Now authored** (above) | 292, 293, 300, 311 |
| ❌ Still missing (defer to PM) | 495/496/498/499/500/502 (EVT B2B) · 510–514 (EVT wires) · 522–530 (mobile) · 165/175/173/174 (coffee-tour) · 269/271 (onboarding/notif) · 584 |

## Build-Ready Score — every MVP / Phase-1 task

> Rubric: **Wireframe · Spec · AC · Deps-wired · Route · Component-plan** — each 1 / 0.5 / 0. Score = Σ ÷ 6. ≥83% = build-ready.

| Task | WF | Spec | AC | Deps | Route | Comp | Score | Verdict |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|
| [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) Rental browse | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ in progress |
| [SAN-479](https://linear.app/sanjiovani/issue/SAN-479) Rental detail | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ ready |
| [SAN-715](https://linear.app/sanjiovani/issue/SAN-715) Checkout states | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ done |
| [SAN-259](https://linear.app/sanjiovani/issue/SAN-259) My tickets+QR | 1 | 1 | ½ | 1 | 1 | 1 | **92%** | ✅ blocked on PAY-001 |
| [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) Schedule modal | 1 | 1 | ½ | 1 | 1 | 1 | **92%** | ✅ verify |
| [SAN-263](https://linear.app/sanjiovani/issue/SAN-263) Workflow strip | 1 | 1 | ½ | 1 | 1 | 1 | **92%** | ✅ verify |
| [SAN-716](https://linear.app/sanjiovani/issue/SAN-716) Lead confirm | ½ | 1 | 1 | 1 | 1 | 1 | **92%** | ✅ ready |
| [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) Login polish | 1 | 1 | ½ | 1 | 1 | 1 | **92%** | ✅ verify |
| [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) Nav enable | ½ | 1 | 0 | 1 | 1 | 1 | **75%** | 🟡 AC |
| **PAY-001** Webhook finalize | — | 1 | 1 | 1 | 1 | — | n/a (backend) | 🔴 P0 blocker |
| [SAN-578](https://linear.app/sanjiovani/issue/SAN-578) D-12 AI band | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ ready |
| [SAN-580](https://linear.app/sanjiovani/issue/SAN-580) D-14 polish | ½ | 1 | 1 | 1 | 1 | 1 | **92%** | ✅ final gate |
| [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) Restaurant card | 1 | 1 | 1* | 1 | 1 | 1 | **100%** | ✅ *AC pending push |
| [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) Restaurant panel | 1 | 1 | 1* | 1 | 1 | 1 | **100%** | ✅ *AC pending push |
| [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) Booking sheet | ½ | 1 | 1* | 1 | ½ | 1 | **83%** | ✅ RHF refactor |
| [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) Admin queue | 0 | 1 | 1* | 1 | 1 | 1 | **83%** | 🟡 needs WF |
| [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) Partner hub | 1† | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ †WF now authored |
| [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) Partner dashboard | 1† | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ build shells here |
| [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) Contact | 1† | ½ | 1 | 1 | 1 | 1 | **92%** | ✅ ready |
| [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) /host landing | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ ready |
| [SAN-661](https://linear.app/sanjiovani/issue/SAN-661) /venues landing | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ ready |
| [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) Rentals landing | 1 | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ ready |
| [SAN-712](https://linear.app/sanjiovani/issue/SAN-712) Nightlife landing | 1† | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ †WF now authored |
| [SAN-713](https://linear.app/sanjiovani/issue/SAN-713) Restaurants landing | 1† | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ †WF now authored |
| [SAN-714](https://linear.app/sanjiovani/issue/SAN-714) Cafés landing | 1† | 1 | 1 | 1 | 1 | 1 | **100%** | ✅ †WF now authored |
| [SAN-662](https://linear.app/sanjiovani/issue/SAN-662) /about | ½ | ½ | 1 | ½ | 1 | 1 | **75%** | 🟡 WF+deps |

\* AC authored above, not yet pushed to Linear. † wireframe authored in `readiness-wireframes.md`.

**Readiness summary:** 18 of 22 design tasks ≥ 92% build-ready. The only true launch blocker is **PAY-001 (backend webhook)**. Remaining design gaps: admin wireframes (311/515/516), `/about` deps, and pushing the 4 authored AC sets into Linear.

---

# Applied log — 2026-06-08 (Phase 2: AC push + mobile cleanup)

## ✅ Applied to Linear
**1. Acceptance Criteria pushed** (placeholder `*Not specified in source task.*` → real checklist; all other body content preserved):
- [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) — VEN-013 RestaurantResultCard ✅
- [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) — VEN-014 RestaurantDetailPanel ✅
- [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) — VEN-021 VenueBookingSheet ✅
- [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) — VEN-032 Admin booking queue ✅

(AC sourced verbatim from the disk specs `009/010/017/024-ven-*.md` via the "Proposed Acceptance Criteria" section above — no new criteria invented.)

**2. Mobile dependency cleanup** — **already correct, no mutation needed.** Verified relations:
- [SAN-522 — MOB-CHAT-001 Mobile chat composer](https://linear.app/sanjiovani/issue/SAN-522), [SAN-526 — PAY-005 Mobile checkout UX](https://linear.app/sanjiovani/issue/SAN-526), [SAN-527 — AUTH-006 Mobile auth stability](https://linear.app/sanjiovani/issue/SAN-527), [SAN-530 — A11Y-001 Mobile accessibility audit](https://linear.app/sanjiovani/issue/SAN-530): none `blocks` SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell anymore — adding `blockedBy 489` last turn auto-resolved the contradictory `blocks 489` relation.
- [SAN-489 — SCREEN-018 Mobile Responsive 3-Panel Shell](https://linear.app/sanjiovani/issue/SAN-489): `blocks` SAN-522…530 (the mobile cluster — it is the prerequisite) · `blockedBy` only [SAN-521 — MOB-CK-001 CopilotKit v1 mobile best practices](https://linear.app/sanjiovani/issue/SAN-521) (legit). **No mobile follow-up blocks SAN-489.** ✅ Graph is correct.

## ⚠️ Failures / residual
- **None this round.** (The prior `removeBlocks` API errors are moot — the stale relations were auto-cleared when `blockedBy 489` was added.)
- Note: the mobile cluster still has an internal cross-block tangle (e.g. 530 blocks 525/524/522; 522 blockedBy 528/529/530) — **out of scope** for this task and harmless to ordering since all correctly sit behind 489. Flag for a future mobile-track grooming pass.

## Not done (per your instructions)
- **Priority fields** — unchanged (mapping not approved).
- **Admin wireframes** — [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311), [SAN-515 — SCREEN-024 Admin Events dashboard](https://linear.app/sanjiovani/issue/SAN-515), [SAN-516 — SCREEN-025 Admin Leads / CRM](https://linear.app/sanjiovani/issue/SAN-516) — not created (waiting on `DashboardShell` spec/impl).

## Final next recommendation
1. **Build the shells first** — `MarketingPageShell` in [SAN-692 — MKT Partner hub (/partners)](https://linear.app/sanjiovani/issue/SAN-692) (current branch) and `DashboardShell`+`DataTable` in [SAN-690 — MKT Partner dashboard (/dashboard)](https://linear.app/sanjiovani/issue/SAN-690). These unblock ~11 landings + the partner dashboard + the 3 admin queues (incl. the now-AC'd [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311)) — and let the admin wireframes ([SAN-515 — SCREEN-024 Admin Events dashboard](https://linear.app/sanjiovani/issue/SAN-515), [SAN-516 — SCREEN-025 Admin Leads / CRM](https://linear.app/sanjiovani/issue/SAN-516), [SAN-311 — VEN-032 Admin booking queue](https://linear.app/sanjiovani/issue/SAN-311)) be authored against a real shell.
2. **Unblock launch** — drive **PAY-001 — Stripe webhook finalize** (`/api/tickets/webhook`) to done; it's the only true MVP blocker. Then verify the In-Review consumer set — [SAN-262 — SCREEN-008 Schedule Viewing Modal](https://linear.app/sanjiovani/issue/SAN-262), [SAN-263 — SCREEN-004 Workflow Progress Strip](https://linear.app/sanjiovani/issue/SAN-263), [SAN-112 — UX-012 Login and signup polish](https://linear.app/sanjiovani/issue/SAN-112) — and [SAN-478 — REAL-011 Rental browse page](https://linear.app/sanjiovani/issue/SAN-478).
3. **When ready**, send the approved P0–P3 → Urgent/High/Med/Low mapping and I'll reconcile the priority-field mismatches — [SAN-165 — VEN-008 CoffeeTourCard](https://linear.app/sanjiovani/issue/SAN-165), [SAN-175 — VEN-012 /tours/[slug] detail page](https://linear.app/sanjiovani/issue/SAN-175), [SAN-173 — TRP-005 CoffeeTourCompareDrawer](https://linear.app/sanjiovani/issue/SAN-173), [SAN-174 — TRP-006 Coffee tour intent chips](https://linear.app/sanjiovani/issue/SAN-174) + the EVT/CTEST P0-body set — in one batch.

---

# SAN-692 — MKT Partner Hub — shipped + validated (2026-06-08)

The reusable `MarketingPageShell` and the partner funnel are now live & clean on prod.

| PR | What | Status |
|---|---|---|
| #126 | [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) hub page (8 cards) | ✅ merged |
| #131 | `MarketingPageShell` + footer live-routes-only | ✅ merged (`61e3f11`) |
| #133 | Hub cards → live typed signup + venue `category` parse/prefill | ✅ merged (`dfb77ac`) |

**Prod validation (https://www.mdeai.co, real Chrome):** all 8 partner routes **HTTP 200 (10×)**; `?type=venue&category={restaurant,cafe,nightclub}` prefill the Category field as **Restaurant / Café / Nightclub**; `/partners` = 8 cards, **0 dead card destinations**, **0 dead footer links**, **0 console errors**. Forensic audit: `tasks/partners/audit/133pr.md` (97%, A). Funnel report: `tasks/partners/tests/02-tests-report.md`.

**Remaining (tracked, not blocking):** card destinations are a temporary redirect to signup — repoint to the marketing landings when [SAN-660](https://linear.app/sanjiovani/issue/SAN-660)/[661](https://linear.app/sanjiovani/issue/SAN-661)/[663](https://linear.app/sanjiovani/issue/SAN-663)/[664](https://linear.app/sanjiovani/issue/SAN-664)/[691](https://linear.app/sanjiovani/issue/SAN-691)/[712](https://linear.app/sanjiovani/issue/SAN-712)/[713](https://linear.app/sanjiovani/issue/SAN-713)/[714](https://linear.app/sanjiovani/issue/SAN-714) ship. **SAN-690 — MKT Partner dashboard** is the next lean build (DashboardShell + DataTable, 2 tabs) — not started.
