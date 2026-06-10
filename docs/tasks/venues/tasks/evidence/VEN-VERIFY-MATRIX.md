# Venues MVP — verification matrix (VEN-009 … VEN-043)

> **Standard:** [`../mvp/VEN-VERIFY-STANDARD.md`](../mvp/VEN-VERIFY-STANDARD.md)  
> **Updated:** 2026-06-02

Legend: ✅ verified · 🟡 partial · ⚪ pending · ❌ fail · — n/a (not started)

| VEN | Task | Status | Grade | Prod? | Local | MCP | Chrome | Playwright | Evidence |
|-----|------|--------|-------|-------|-------|-----|--------|------------|----------|
| 009 | Restaurant result card | 🟡 | **A- / 90** | Staging | ✅ | ⚪ | ✅ | ✅ 2/2 | [SCREEN-023](../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md) · spec **In Review** |
| 010 | Restaurant detail panel | 🟡 | **A- / 92** | Staging | ✅ | ⚪ | ✅ | ✅ 2/2 | [SCREEN-023](../../../testing/evidence/2026-06-02/SCREEN-023-RESULTS.md) · spec **In Review** |
| 011 | Nightlife grounding intent | ⚪ | — / — | No | — | — | — | — | — |
| 012 | Grounded kind split | ⚪ | — / — | No | — | — | — | — | — |
| 013 | Nightlife detail panel | ⚪ | — / — | No | — | — | — | — | — |
| 014 | Places cache field-mask | ⚪ | — / — | No | — | maps MCP | — | — | — |
| 015 | Booking schema + RLS | 🟡 | **B+ / 85** | Staging | — | ✅ | — | — | [VEN-015](VEN-015-verify-2026-06-02.md) |
| 016 | requestVenueBooking tool | 🟡 | **B+ / 88** | Staging | ✅ | ✅ | ⚪ | ⚪ | [VEN-016](VEN-016-verify-2026-06-02.md) |
| 017 | VenueBookingSheet | 🟡 | **B / 80** | Staging | ✅ | — | ⚪ | ⚪ | form shipped; nightlife+HITL pending |
| 018 | Tool action registry | 🟢 | **B / 78** | Yes | ✅ | copilotkit | — | vitest 3/3 | spec **Done** |
| 019 | Booking CopilotKit HITL | ⚪ | — / — | No | — | copilotkit | — | — | — |
| 020 | Booking status chips | ⚪ | — / — | No | — | — | — | — | — |
| 021 | Booking sheet persist | 🟡 | **B+ / 86** | In Review | ✅ | supabase | ⚪ | auth e2e | [VEN-021](VEN-021-verify-2026-06-02.md) |
| 022 | draftVenueWhatsApp tool | ⚪ | — / — | No | — | mastra | — | — | — |
| 023 | WA approval outbox | ⚪ | — / — | No | — | supabase | — | — | — |
| 024 | Admin booking queue | ⚪ | — / — | No | — | supabase RLS | admin chrome | — | — |
| 025 | RLS penetration tests | ⚪ | — / — | No | — | ✅ required | — | vitest/sql | — |
| 026 | Idempotency | ⚪ | — / — | No | — | supabase | — | e2e dup | — |
| 027 | WA consent | ⚪ | — / — | No | — | — | — | — | — |
| 028 | Retry / error recovery | ⚪ | — / — | No | — | — | chrome | playwright | — |
| 029 | Registry CI | ⚪ | — / — | No | CI | — | — | vitest | — |
| 030 | Admin audit log | ⚪ | — / — | No | — | supabase | admin | — | — |
| 031 | Playwright venue screens | 🟡 | **B+ / 82** | No | ✅ | — | — | ✅ 023 only | SCREEN-023 spec |
| 032 | Coffee tour schema | ⚪ | — / — | No | — | supabase | — | — | — |
| 033 | Coffee tour types | ⚪ | — / — | No | vitest | — | — | — | — |
| 034 | Seed coffee tours | ⚪ | — / — | No | — | supabase | — | — | — |
| 035 | rankCoffeeTours | ⚪ | — / — | No | vitest | — | — | — | — |
| 036 | searchCoffeeTours tool | ⚪ | — / — | No | — | mastra | — | — | — |
| 037 | Places enrich tours | ⚪ | — / — | No | — | maps MCP | — | — | — |
| 038 | CoffeeTourCard UI | ⚪ | — / — | No | dev | — | chrome | playwright | — |
| 039 | Map pins tours | ⚪ | — / — | No | dev | — | chrome | — | — |
| 040 | smoke:coffee-tours | ⚪ | — / — | No | script | — | — | — | — |
| 041 | Tour logs cache | ⚪ | — / — | No | — | supabase | — | — | — |
| 042 | Phase A evidence | ⚪ | — / — | No | floor | — | — | suite | — |
| 043 | Tour detail page | ⚪ | — / — | No | dev | — | chrome | playwright | — |

---

## Per-task detail

### VEN-009 — Restaurant result card

| Verify | Command / probe |
|--------|-----------------|
| Local | `npm run dev` → `/` → "Italian restaurants El Poblado" → cards render |
| Vitest | `npm test -- --run restaurant-card domain-results` |
| Playwright | `SMOKE_BASE_URL=:3001 PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts` |
| Chrome | snapshot `[data-testid="results-column"]`, restaurant card testids |
| MCP | CopilotKit: `search-docs` `useCopilotAction available disabled` |

**Production ready:** Staging — chat path only; not prod until booking persist + Maps billing fixed.

**Improvements needed:**
- Flip task spec `status: Done` + acceptance checkboxes
- Phase B: grounded `intent: restaurant` merge
- `/restaurants` catalog still uses separate grid (no chat cards)

---

### VEN-010 — Restaurant detail panel

| Verify | Command / probe |
|--------|-----------------|
| Local | Card click → `data-testid="restaurant-detail-panel"` (not café panel) |
| Vitest | `domain-results.test.tsx` — `openRestaurantDetail` routing |
| Playwright | SCREEN-023 spec — detail + booking stub sheet |
| Chrome | mobile sheet `restaurant-detail-mobile-sheet`; map pin `data-selected` |
| MCP | — |

**Production ready:** Staging — booking CTA opens `VenueBookingForm` (VEN-021); Places hydrate pending DATA-008.

**Improvements needed:**
- Flip spec **Done** with VEN-009 after auth e2e
- Wire Places hydrate via `/api/places/detail`
- Maps billing env blocker in evidence if embed 403

---

### VEN-011 — Nightlife grounding intent

| Verify | Command / probe |
|--------|-----------------|
| Local | `/` → "rooftop cocktails Provenza" → `search-grounded-places` with nightlife bias |
| MCP | mastra docs + gemini model registry |
| Chrome | grounded cards, no restaurant mis-route |
| Playwright | `SCREEN-022` spec (create in VEN-031) |
| Vitest | intent slot / grounded quality tests |

**Improvements needed:** Implement intent enum + concierge prompt gate; add SCREEN-022 spec.

---

### VEN-012 — Grounded kind split

| Field | Value |
|-------|-------|
| Grade | **B+ / 88** |
| Status | In Review |
| Evidence | [VEN-012-verify-2026-06-02.md](./VEN-012-verify-2026-06-02.md) |

| Verify | Command / probe |
|--------|-----------------|
| Local | ✅ `GroundedPlaceResults` branches on `metadata.venueKind` |
| Vitest | ✅ 455/455 (`grounded-venue-kind`, quality filter) |
| Playwright | 🟡 SCREEN-022 added; agent flake |

**Remaining:** E2E proof with live grounding; optional `nightlife` map category enum.

---

### VEN-013 — Nightlife detail panel

| Field | Value |
|-------|-------|
| Grade | **B+ / 87** |
| Status | In Review |
| Evidence | [VEN-013-verify-2026-06-02.md](./VEN-013-verify-2026-06-02.md) |

| Verify | Command / probe |
|--------|-----------------|
| Local | ✅ Panel + mobile sheet + booking sheet wired |
| Vitest | ✅ Full suite green |
| Playwright | 🟡 SCREEN-022 on disk |

**Remaining:** Signed-in booking insert e2e; thread-scoped safety copy.

---

### VEN-014 — Places cache field-mask

| Verify | Command / probe |
|--------|-----------------|
| MCP | google-maps-code-assist — every `/api/places/*` has FieldMask |
| Grep | `rg 'places.googleapis.com' mdeapp/src --glob '*.ts'` + mask header |
| Vitest | cache hit/miss unit tests |
| Chrome | network tab — no unmasked Places billable fields |

**Improvements needed:** Audit script in CI; document allowed field sets per route.

---

### VEN-015 — Booking schema + RLS

| Verify | Command / probe |
|--------|-----------------|
| MCP | `execute_sql` — table, RLS, policies (see evidence) |
| Migration | `20260529234934_data009_venue_booking_requests.sql` |
| Negative | Two-user insert/select (VEN-025) |

**Production ready:** Staging for INSERT-only app path.

**Improvements needed:**
- Authenticated UPDATE policy (user cancel)
- Patricia admin SELECT/UPDATE (VEN-024)
- Cross-user penetration tests (VEN-025)

---

### VEN-016 — requestVenueBooking tool

| Verify | Command / probe |
|--------|-----------------|
| Vitest | `npm test -- --run request-venue-booking` |
| MCP | Supabase column list matches tool mapping |
| Local | Signed-in chat → agent calls tool → row in DB |
| Chrome | `data-testid="venue-booking-confirmation"` chip |
| Playwright | Auth fixture insert e2e (missing) |

**Production ready:** Staging — tool + web API paths; signed-in Playwright insert pending.

**Improvements needed:**
- Live JWT insert proof (signed-in Playwright)
- UI uses API (VEN-021) — not required to invoke tool from sheet
- Anonymous user: sign-in gate on form ✅

---

### VEN-017 — VenueBookingSheet

| Verify | Command / probe |
|--------|-----------------|
| Chrome | Opens from café/restaurant/nightlife detail CTAs |
| Vitest | form validation unit tests |
| Playwright | fill → submit disabled until valid |
| MCP | — |

**Improvements needed:** Replace stub sheets; shared component for 3 kinds.

---

### VEN-018 — mastra-tool-action-names

| Verify | Command / probe |
|--------|-----------------|
| Vitest | `mastra-tool-action-names.test.ts` — concierge grep |
| Grep | `requestVenueBooking` in concierge + search-tool-renders |
| MCP | CopilotKit action name = Mastra tools key |

**Partial:** VEN-016 added keys; formal task still open.

**Improvements needed:** Mark done; extend VEN-029 CI guard.

---

### VEN-019 — Booking CopilotKit HITL

| Verify | Command / probe |
|--------|-----------------|
| Local | `renderAndWaitForResponse` on booking sheet |
| MCP | copilotkit HITL docs |
| Chrome | sheet blocks agent until respond() |
| Playwright | full submit flow |

**Improvements needed:** Mirror host wizard HITL pattern.

---

### VEN-020 — Booking status chips

| Verify | Command / probe |
|--------|-----------------|
| Chrome | pending/confirmed chips on detail panels |
| Supabase | seed row → chip reflects status |
| Playwright | status transition mock |

---

### VEN-021 — Booking sheet persist

| Verify | Command / probe |
|--------|-----------------|
| Local | Submit sheet → `venue_booking_requests` row |
| MCP | supabase select own row |
| Playwright | signed-in e2e + confirmation chip |
| Chrome | no stub copy |

**Improvements needed:** Highest priority after VEN-016.

---

### VEN-022 — draftVenueWhatsApp tool

| Verify | Command / probe |
|--------|-----------------|
| Vitest | mocked draft output |
| MCP | mastra createTool |
| Local | tool returns draft text in metadata |

---

### VEN-023 — WA approval outbox

| Verify | Command / probe |
|--------|-----------------|
| MCP | supabase `wa_outbox` table/policies |
| Local | Patricia approve → stub Twilio |
| Admin chrome | approval UI |

---

### VEN-024 — Admin booking queue

| Verify | Command / probe |
|--------|-----------------|
| MCP | admin RLS policies on `venue_booking_requests` |
| Chrome | `/admin/bookings` list + status update |
| Playwright | Patricia role fixture |

---

### VEN-025 — RLS penetration tests

| Verify | Command / probe |
|--------|-----------------|
| Vitest/SQL | anon insert blocked; user A ≠ user B |
| MCP | get_advisors security |
| Script | extend `verify-supabase-data.mjs` |

---

### VEN-026 — Idempotency

| Verify | Command / probe |
|--------|-----------------|
| Vitest | duplicate idempotency_key → single row |
| Playwright | double-submit sheet |

---

### VEN-027 — WA consent

| Verify | Command / probe |
|--------|-----------------|
| Local | consent gate before WA send |
| Vitest | suppression list logic |

---

### VEN-028 — Retry / error recovery

| Verify | Command / probe |
|--------|-----------------|
| Chrome | `ToolErrorChip` + retry on booking fail |
| Playwright | simulate 500 insert |

---

### VEN-029 — Registry CI

| Verify | Command / probe |
|--------|-----------------|
| CI | vitest fails on concierge/registry drift |
| Local | `npm test -- mastra-tool-action-names` |

---

### VEN-030 — Admin audit log

| Verify | Command / probe |
|--------|-----------------|
| MCP | audit table + RLS |
| Admin chrome | approve/send rows logged |

---

### VEN-031 — Playwright venue screens

| Verify | Command / probe |
|--------|-----------------|
| Playwright | 021 + 022 + 023 specs all green |
| Local | `npm run dev` + full suite |
| Chrome | console sweep per screen |

**Partial:** SCREEN-023 2/2 pass; 021/022 specs missing or incomplete.

**Improvements needed:** Add SCREEN-022; café booking auth in 021.

---

### VEN-032 … VEN-043 — Coffee tours (optional track)

Use standard §8 with tour-specific routes (`/tours`, `searchCoffeeTours` tool). All ⚪ pending — verify after implementation:

| VEN | Key probe |
|-----|-----------|
| 032 | MCP schema + RLS on `coffee_tours` |
| 033 | vitest Zod round-trip |
| 034 | MCP row count ≥ 5 |
| 035 | vitest rank ordering |
| 036 | mastra tool + concierge registry |
| 037 | maps MCP field mask on enrich |
| 038 | chrome CoffeeTourCard |
| 039 | map pins + results column |
| 040 | `npm run smoke:coffee-tours` |
| 041 | search_logs insert (service path) |
| 042 | task-verifier closeout doc |
| 043 | `/tours/[slug]` playwright |

---

## Release gate (venues MVP)

Production-ready when **all P0 rows** (009–010, 015–021, 025, 029, 031) are ≥ **B+** and:

1. Booking persist works signed-in (VEN-021)
2. RLS penetration green (VEN-025)
3. Playwright 021/022/023 green (VEN-031)
4. No CopilotKit registry drift (VEN-029)
5. Maps billing + embed 403 resolved or documented env blockers

**Current MVP readiness:** **~48/100** — restaurant + booking form staged; nightlife + Patricia path incomplete. See [`../audit/03-venues-tasks-audit.md`](../audit/03-venues-tasks-audit.md).

---

## Next verify sessions (priority)

1. **VEN-009/010** — flip spec status + dedicated `VEN-009-verify` / `VEN-010-verify` evidence (copy SCREEN-023)
2. **VEN-021** — signed-in Playwright booking insert
3. **VEN-011–013** — nightlife track verify pack
4. **VEN-031** — complete 021/022 specs
