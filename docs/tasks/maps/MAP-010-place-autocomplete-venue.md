---
id: MAP-010
title: Place autocomplete — Roberto host venue
status: Not Started
priority: P1
phase: mvp
persona: roberto
project: roberto-host
milestone: P1
imp: "089"
linear: SAN-104
percent: 0
blocked_by: []
blocks: []
conditional: Only if free-text venue blocks Roberto publish
effort: 3-4h
owner: sanjiovani
depends_on: []
skill: [mde-maps, shadcn, testing]
prd_ref: ../../plan/maps/maps-prd.md §8 step 10 · ../../plan/prd/03-events.md
draft_sources:
  - ../../drafts/tasks/mastra/maps/tasks/places/029-place-autocomplete-host-venue.md
  - ../../drafts/tasks/mastra/maps/features/12-component-libary.md
verified_docs:
  - https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
  - .claude/skills/mde-maps/references/places-official/places-session-pricing.md
verified_against:
  - /home/sk/mdeai/github/maps/js-api-samples/
  - /home/sk/mdeai/github/maps/react-google-maps/website/src/examples/autocomplete.mdx
---

# MAP-010 — Host venue autocomplete

## At a glance

**Description:** **Roberto** picks a venue on `/host/event/new` with Google **Place Autocomplete** — stored `place_id` and Maps link, no typos.

**Purpose:** Free-text venue names break maps and tickets. Autocomplete + one Details call gives **Andrés** a correct “Open in Google Maps” link on the event page.

**Goals:**
- Server-proxied autocomplete (Colombia bias, session token for billing).
- `VenueAutocomplete` in the F34 wizard; no Places key in the browser bundle.
- On select: save `google_place_id`, `place_uri`, address to Supabase.
- Tests with mocked JSON responses.

**Features:**
| Who | What they get |
|-----|----------------|
| **Roberto** | Type “Comuna 13” → pick official place → preview map link works. |
| **Andrés** | Ticket/checkout shows the same venue link Roberto chose. |

> **Roberto** at `/host/event/new` picks a venue → `google_place_id` + `placeUri` persist on `events` row for map links and CRM.  
> **Draft port:** PLACES-018, PLACES-019.

## 1. Purpose

Server-proxied **Place Autocomplete (New)** for the host event wizard: debounced input, **session token** per wizard session, Colombia region bias, field mask on suggestions — **zero** Places API key in the browser bundle.

## 2. Goals

- API route or `places-proxy` sub-route `autocomplete` with session token header propagation
- `VenueAutocomplete.tsx` on `/host/event/new` (F34 wizard shell)
- On select: optional single **Place Details** call via proxy to fill address + `placeUri`
- Persist to Supabase `events` (or draft table): `google_place_id`, `place_uri`, `formatted_address`
- Session token: new token per wizard mount; complete session on selection (billing optimization per Google session pricing)
- `includedRegionCodes: ['CO']` + Medellín location bias
- Vitest/Playwright with mocked autocomplete JSON

## 3. Features (implementation detail)

| Persona | Effect |
|---------|--------|
| **Roberto** | No free-text venue typos; event preview map link uses real Place ID. |
| **Andrés** | Ticket page shows correct venue link from stored `placeUri`. |

## 4. Workflows

1. Extend MAP-005 proxy with autocomplete + session token passthrough.
2. Build shadcn combobox/command pattern with 300ms debounce.
3. Wire form field into `hostEventAgent` working memory / `EventDraftState` (F34).
4. Fallback: plain text venue if proxy down (feature flag).
5. Evidence: wizard screenshot with suggestion dropdown + saved row in Supabase (redacted).

## 5. Acceptance criteria

1. `rg GOOGLE_MAPS_API_KEY mdeapp/src/app` client components → no server key leaked to client.
2. Selected row has non-null `google_place_id` and `placeUri`.
3. Field mask documented next to autocomplete route.
4. Session token reused for typing burst; new session on remount.
5. `npm run floor` green.

## 6. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-010-evidence.md`](../notes/MAP-010-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### Unit / component

- [ ] `VenueAutocomplete.test.tsx` (or path at implement time) — mock proxy response → N suggestions
- [ ] Select suggestion → `EventDraftState` / working memory has `google_place_id` + `placeUri`
- [ ] Debounce ~300ms; session token reused within burst; new session on remount

### Integration

- [ ] `/host/event/new` — type venue → dropdown → select → preview shows Maps link from API (not hand-built URL)
- [ ] Autocomplete calls MAP-005 `places-proxy` only — `rg "AutocompleteService" mdeapp/src` → 0 unless explicit flag
- [ ] Field mask documented on autocomplete route in `places-mask-checklist.md`

### Security

- [ ] `rg "GOOGLE_MAPS_API_KEY" mdeapp/src/app/host` client components → 0

### Manual evidence

- [ ] Screenshot: dropdown + saved Supabase row (redacted)

## 7. Rollback

Revert to plain `<Input>` for venue name only.

## 8. Out of scope

- Places UI Kit / `gmpx-place-picker` double-loader (defer unless explicit flag)
- Guest-facing search autocomplete (Camila uses chat, not this form)

## 9. Definition of Done

§5 acceptance + **§6 verification checklist** + wizard screenshot. Commit: `feat(events): host venue Places autocomplete (MAP-010)`.
