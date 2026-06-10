---
id: EVP-014-core
legacy_id: F35
title: /host/events list page — Roberto draft + published view (PRD §51 #15)
status: Done
priority: P1
phase: mvp
persona: roberto
project: roberto-host
milestone: P1
imp: "086"
linear: SAN-118
percent: 88
blocked_by: [EVP-013-core]
blocks: []
effort: 1.5h (route + auth gate + EventCard list + Vitest + smoke)
owner: sanjiovani
depends_on: [F07, F08, EVP-013-core, EVP-009-core]
skill: [shadcn, react-best-practices, mde-supabase]
wireframes:
  - ../../wireframes/EVP-014-wire-host-events-list.md
primary_wire: ../../wireframes/EVP-014-wire-host-events-list.md
playwright_spec: ../../../mdeapp/e2e/host/host-events-list.spec.ts
path: /host/events
prd_ref: §51 task 15 · §13 Roberto persona
verified_against:
  - EVP-013-core EventCard component
  - F08 auth middleware (auth-gated route)
  - Supabase public.events table (49 rows per audit 04 §10)
---

# EVP-014-core — `/host/events` list page

## 1. Purpose

After Roberto creates an event via EVP-010-core wizard + EVP-011-core HITL approval + EVP-012-core commit, he needs a place to see his drafts AND published events. EVP-014-core ships the read-only list page `/host/events` using EVP-013-core `EventCard` over real Supabase `public.events` data (filter on `organizer_id = current_user.id`). Empty-state shows "Create your first event" CTA → `/host/event/new` (EVP-010-core).

## 2. Goals

- `mdeapp/src/app/host/events/page.tsx` — **Server Component** that fetches Roberto's events from Supabase server-side (no client roundtrip)
- Auth-gated via F08 middleware
- Renders ≤ 50 events as `<HostEventCard>` grid via `HostEventsGrid` (not chat `EventCard`)
- Status filter bar **deferred** — wire spec filter chips post-MVP
- Empty state with "Create event" CTA → `/host/event/new`
- ≥ 2 Vitest tests (renders list · empty state with CTA)
- Localhost gate 9: `curl :3001/host/events` HTTP 200 (auth) or 302 (anon)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | One place to see all his events at a glance; can click into one to edit (W4+) or publish (EVP-011-core HITL) |
| **Patricia** | Eventually `/admin/events` reuses this query pattern (W8) |

## 4. Workflows

1. **Pre-flight:** EVP-013-core + F08 + F22 land first; Supabase MCP `SELECT column_name FROM information_schema.columns WHERE table_name='events'` to confirm `organizer_id`, `status`, `slug`, `event_start_time` columns.
2. Create `mdeapp/src/app/host/events/page.tsx`:
   - Server Component using `@supabase/ssr` server client (F08 pattern)
   - Query: `SELECT ... FROM events WHERE organizer_id = auth.uid() ORDER BY event_start_time DESC LIMIT 50`
   - Render `<EventCard>` grid
3. Add Vitest at `mdeapp/src/app/host/events/__tests__/page.test.tsx`:
   - T-A: renders 3 cards given 3 fixture events
   - T-B: empty state shows "Create event" CTA
4. `npm run floor` exit 0.
5. Gate 9 — curl + manual smoke.
6. Evidence at `tasks/evidence/EVP-014-core-evidence.md`.

## 5. User journeys

- **Roberto logged in** → `/host/events` → sees his 2 drafts + 1 published event → clicks "Create event" → lands on `/host/event/new` (EVP-010-core).
- **Roberto anon** → redirect to `/login` (F08 middleware).
- **First-time Roberto** → empty state with friendly **English** CTA + Medellín hero photo from F22.

## 6. Agents

None — pure list view.

## 7. Integrations

| Integration | Purpose |
|---|---|
| EVP-013-core `<EventCard>` + `<EventFilters>` | List rendering |
| F08 `@supabase/ssr` server client | Auth-aware query |
| F22 hero photo | Empty-state background |
| F07 shadcn | Layout primitives |
| Next 16 App Router Server Components | No client-side data fetch |

## 8. Summary

Auth-gated Server-Component list of Roberto's events using EVP-013-core cards. Empty-state CTA → EVP-010-core wizard. ~1.5h.

## 9. Definition of Done

- [x] `mdeapp/src/app/host/events/page.tsx` is Server Component (no `"use client"`)
- [x] Auth-gated (anonymous → redirect `/login?next=/host/events`)
- [x] Renders `<HostEventCard>` grid (`data-testid="host-events-list"`)
- [x] Empty + error states with CTA
- [x] Vitest `host-events-grid.test.tsx`
- [ ] Enable link in `host-nav-rail.tsx` (UI polish)
- [ ] Authed Playwright grid proof (SCREEN-016c)
- [ ] Evidence at `tasks/evidence/EVP-014-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Route file exists | `test -f` |
| T2 | No `"use client"` | grep returns empty |
| T3 | Uses EventCard | grep returns ≥ 1 |
| T4 | Vitest ≥ 2 new | `npm test` |
| T5 | Floor green | exit 0 |
| T6 | Localhost auth-aware | curl 200 or 302 |

## 11. Rollback

```bash
rm -rf mdeapp/src/app/host/events/
```

## Notes

- **CopilotKit compatibility:** Server Component — does NOT mount CopilotKit. Provider stays at app root. Page links to `/host/event/new` (EVP-010-core) which has its own nested provider.
- **Real Supabase query** uses F08 server-side client; RLS policy `events_organizer_select_own` enforces `organizer_id = auth.uid()`.
