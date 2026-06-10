# Venues forensic audit complete

Full report: [`tasks/venues/tasks/audit/03-venues-tasks-audit.md`](tasks/venues/tasks/audit/03-venues-tasks-audit.md)

## Overall scores

| Pack | Score | Dot |
|------|------:|-----|
| **VEN MVP** (009–043) | **48%** | 🟡 |
| **VEB event booking** (001–012) | **8%** | 🔴 |
| **Data cache** (DATA-007/008) | **55%** | 🟡 |

## Tests run today

- Vitest: **13/13** (booking, cache, restaurant/café cards) + **3/3** tool registry
- Cache audit: **2/74** Places cached (2.7%)
- Supabase MCP: RLS ✅ · 17 café + 13 nightclub anchors ✅ · **no** `venue_event_offerings` table
- API: `POST /api/venue-booking/request` → 400 validation ✅

---

## Top blockers

1. **🔴 VEN-012 bug** — grounded nightlife queries forced through café UI (`kind: "cafe"` hardcoded)
2. **🔴 Google Places 403** — backfill blocked; detail panels lack phone/hours
3. **🔴 Spec drift** — VEN-009/010/017/018 shipped on disk but specs still `Not Started`
4. **🔴 Playwright drift** — SCREEN-021 still expects "Booking stub" (VEN-021 shipped)
5. **🔴 VEB-001** — zero event-booking schema; Roberto/Mamacita flow doesn't exist

---

## Per-task highlights (🟢 / 🟡 / 🔴)

| Task | % | Grade | Real-world |
|------|--:|-------|------------|
| **VEN-009** restaurant cards | 88% | A-/90 | 🟡 "Italian restaurants El Poblado" works in chat |
| **VEN-010** detail panel | 90% | A-/92 | 🟡 Details + booking CTA work |
| **VEN-011** nightlife intent | 35% | D+/58 | 🟡 Tool normalization only |
| **VEN-012** kind split | 15% | F/25 | 🔴 **Bug** — cocktails → café panel |
| **VEN-013** nightlife panel | 5% | F/10 | 🔴 Not built |
| **VEN-014** places cache | 62% | C+/72 | 🟡 Infra yes; panels not wired |
| **VEN-015** schema/RLS | 85% | B+/85 | 🟡 Live; no admin UPDATE |
| **VEN-016** booking tool | 88% | B+/88 | 🟢 Mastra insert works |
| **VEN-017/021** booking sheets | 75–86% | B/B+ | 🟡 Form + API; no nightlife sheet; no auth e2e |
| **VEN-018** registry | 82% | B/78 | 🟢 Vitest green; spec not flipped |
| **VEN-019** HITL | 25% | D/45 | 🔴 Chip only, no sheet HITL |
| **VEN-022–024** WA/admin | 0% | — | 🔴 Patricia path missing |
| **VEN-031** Playwright | 55% | C+/68 | 🟡 021/023 exist; 021 stale; no 022 |
| **VEN-032–043** coffee tours | 0% | — | 🔴 Optional — correctly empty |
| **VEB-001–012** event booking | 8% | — | 🔴 Only generic host venue text field |

---

## Critical corrections (by priority)

1. **Fix VEN-012** before any nightlife work — split grounded render + add `NightlifeDetailPanel`
2. **Sync task statuses** — 009, 010, 017 → In Review; 018 → Done
3. **Update SCREEN-021** — replace stub assertions with sign-in gate / form testids
4. **Refresh VEN-VERIFY-MATRIX** — VEN-021 still marked ⚪ pending
5. **Enable Places API billing** → rerun DATA-008 backfill (target ≥80% cache)
6. **VEB-001 migration** before any Event Venue UI

The audit file has per-task corrections, dependency violations, best-practices checklist, and a recommended 2-week fix order. Want me to start on VEN-012 (nightlife kind split) or the spec status sync first?


VEN-021 shipped. Booking sheets are no longer stubs. DATA-008 backfill is still blocked on Google Places API permissions.

VEN-021 — Booking sheet persist ✅
Café + restaurant sheets now submit real booking requests:

Layer	What shipped
API
POST /api/venue-booking/request — session-gated, idempotency key, source: web
Core
lib/venues/venue-booking-core.ts — shared insert logic (no Mastra in client bundle)
UI
VenueBookingForm — date, time, party size, contact, notes, honest WhatsApp pending copy
Sheets
cafe-booking-sheet.tsx + restaurant-booking-sheet.tsx wired to form
Confirm
VenueBookingConfirmationBanner in chat column after submit
Fix: Initial implementation imported Mastra via venueKindInputSchema → broke the client bundle (stream/web). Logic moved to lib/venues/venue-booking-core.ts.

Verified:

Vitest request-venue-booking — 5/5 pass
curl POST /api/venue-booking/request -d '{}' → 400 validation (route loads clean)
Evidence: tasks/venues/tasks/evidence/VEN-021-verify-2026-06-02.md
Task spec → In Review
Unsigned-in users see a sign-in gate; signed-in submit creates a venue_booking_requests row via RLS.

DATA-008 — Still blocked ⚠️
Places API returns 403 PERMISSION_DENIED on searchText and batch backfill. Until you enable Places API (New) + billing on the server key:

cd mdeapp
node --env-file=.env.local scripts/backfill-place-details-cache.mjs
node --env-file=.env.local scripts/audit-place-details-cache.mjs
Target ≥80% cache hit → flip SAN-338 to Done.

Playwright
SCREEN-023: 2 passed / 4 failed — failures are restaurant cards not rendering (AI fast-path timeout), not the booking form change. Re-run when dev agent is healthy:

cd mdeapp && SMOKE_BASE_URL=http://localhost:3001 npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts
Next priority
GCP — fix Places key → rerun DATA-008 backfill
VEN-021 Done gate — signed-in Playwright submit proof (needs auth fixture)
Nightlife track — VEN-011 → wire nightclub sheet (same VenueBookingForm with venueKind="nightlife")