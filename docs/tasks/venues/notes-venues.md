## Short answer

## DATA-035 added — café seeding path

### New task (primary seed work)

**[DATA-035 — Café listings → venue_anchors](tasks/data/tasks-data/data-035-cafe-listings-venue-anchor-seed.md)**

| Item | Detail |
|------|--------|
| **Input** | `tasks/venues/tasks/listings/` (Laureles, Poblado, top-10 drafts) |
| **Output** | `venue_anchors` rows (`kind=cafe`) + `metadata` JSON |
| **Includes** | `why_special`, `ai_vibe_summary`, tags, website, Instagram, email, WhatsApp (if public), semantic descriptors, confidence |
| **Places-only** | `google_place_id`, lat/lng, hours/phone/photos via **DATA-008** cache |
| **Depends** | DATA-002 (contract), DATA-009 M2 (`venue_anchors` table) |
| **Unblocks** | DATA-003 sign-off, DATA-006 golden queries, DATA-007/008 cache |

### Updated chain

```text
DATA-002 contract  →  DATA-009 (M2 venue_anchors)  →  DATA-035 (seed cafés)
       →  DATA-003 (sign-off + golden-query map)  →  DATA-007/008 (Places photos/hours/phone)
```

### Supporting files

| Path | Purpose |
|------|---------|
| [`tasks/venues/tasks/listings/README.md`](tasks/venues/tasks/listings/README.md) | What each listing pack is for |
| [`tasks/venues/seeds/README.md`](tasks/venues/seeds/README.md) | Seed artifact index |
| [`tasks/venues/seeds/cafes-medellin.seed.json`](tasks/venues/seeds/cafes-medellin.seed.json) | Empty template — filled by DATA-035 ETL script |

### DATA-003 role (narrowed)

Still step **03**, but now **sign-off only** after DATA-035: verify log, golden-query → anchor IDs, confirm chat still uses grounding first.

### Indexes updated

- [`INDEX-data.md`](tasks/data/tasks-data/INDEX-data.md) — row 3b  
- [`mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md) — step 03b  
- [`venues/INDEX.md`](tasks/venues/INDEX.md), [`cafes/INDEX.md`](tasks/venues/cafes/INDEX.md)

---

**Next implementation step (when you execute):** run DATA-002 + DATA-009 M2, then build `scripts/seed-cafe-anchors.ts` (or SQL) that parses `03-cafe-laureles.md` / `04-pablado-cafes.md` into `cafes-medellin.seed.json` and upserts with Places verify. I can add that script in `mdeapp/` in a follow-up if you want it on disk now.
**DATA-003** only seeds **anchors** (`place_id`, name, neighborhood, tags). It does **not** yet cover images, long descriptions, Instagram, WhatsApp, email, or “what makes this café unique” in the DB.

You have the **content** in listings; you are **missing execution tasks** to turn it into seeded, verified data.

---

## What’s in `listings/` today

| File | Role | Executable task? |
|------|------|------------------|
| `prompt-cafes.md` | Spec for researchers/LLM (fields: IG, web, vibe, images, WiFi…) | No |
| `01-cafes.md`, `02-cafes.md` | Draft top-10 packs (vibe, tags, IG, web; some ChatGPT image URLs) | No |
| `03-cafe-laureles.md`, `04-pablado-cafes.md`, `03a`/`04a` | Neighborhood deep profiles | No |
| `05*` / `06*` / `prompt-tours.md` | Coffee **tour** copy (→ VEN-032…, not café Places) | No |

Referenced from [`cafes/INDEX.md`](tasks/venues/cafes/INDEX.md) as eval/enrichment input. Paths in **DATA-002/003/006** pointed at a non-existent `cafes/listings/` — fixed to `tasks/venues/tasks/listings/`.

---

## Are the DATA tasks “correct” for what you want?

**Partially.** They cover the **platform** path, not the **rich catalog** path:

| Need | Covered by | Gap |
|------|------------|-----|
| `google_place_id` + neighborhood | **DATA-003** + **DATA-009** `venue_anchors` | ✅ intent |
| Hours / phone / Google photos | **DATA-007/008** → `place_details_cache` (Places API + field mask) | ✅ official facts only |
| Contract: what goes on card vs detail | **DATA-002** | ⚠️ must list IG/web/vibe in `metadata` |
| Curated description / “why special” | Listings markdown only | ❌ no ETL task |
| Instagram / website / email | In listings text | ❌ not in seed schema yet |
| WhatsApp (venue contact) | Not in listings consistently | ❌ booking WA is **user** flow (VEN-022+), not venue phone book |
| Hero images (curated) | Listings (often non-storage URLs) | ❌ use Places `photos` or store URLs in `metadata` |
| AI vibe / coworking / specialty tags | Listings + **INT-008** (live chat) | ❌ catalog tags → `venue_anchors.tags` + `metadata` via seed |
| Semantic search on café copy | **VEC-005** (later) | Post-MVP |

Planned `venue_anchors` shape ([`supabase-plan.md`](tasks/data/supabase-plan.md)):

- Columns: `name`, `google_place_id`, `neighborhood`, `tags[]`, `metadata jsonb`
- **Right place for** website, instagram, whatsapp, email, `ai_vibe_summary`, `image_urls`, `confidence` — inside **`metadata`** (or extend contract in DATA-002)

DATA-003 explicitly says: **no invented WiFi/hours/prices in CSV** — those should come from **Places**, not listings prose.

---

## What you have vs what’s missing (tasks)

```text
listings/ (content)  ──?──►  venue_anchors + place_details_cache  ──►  CaféDetailPanel
         ↑                           ↑
    NO ETL task yet            DATA-003 (thin seed only)
                               DATA-008 (Places backfill)
```

### Already in the plan (use these)

| Step | Task | What it does for listings |
|------|------|---------------------------|
| 1 | **DATA-002** | Define per-field source: Places vs `metadata` vs LLM-only forbidden |
| 2 | **DATA-009** M2 | Create `venue_anchors` |
| 3 | **DATA-003** | Seed ≥15 cafés from listings → CSV/migration |
| 4 | **DATA-007/008** | Fill phone, hours, photos from Places |
| 5 | **VEN-014** | Field mask / cache on detail panel |
| 6 | **INT-008** | Live chat clarify (“quiet café for remote work”) — not DB seed |

### Gaps (you likely need new tasks)

| Gap | Suggested task | Notes |
|-----|----------------|-------|
| Listings → DB ETL | **DATA-010** (or `LIST-001`) `listings-to-venue-anchors` | Parse `03-cafe-laureles.md` etc. → `metadata` JSON; verify `place_id` via Places |
| Social/contact schema | Part of **DATA-002** | `metadata.website`, `.instagram`, `.email`, `.whatsapp` (E.164), `source_url`, `confidence` |
| Curated images | Subtask of DATA-010 or DATA-008 | Prefer **Places photo refs**; curated URLs only if licensed/stable |
| IG discovery at scale | **OCL-015** (post-MVP) | Staging rows `source=instagram` — broken ref to `tasks/listings/cafes/`; should point to `venues/tasks/listings/` |
| Intelligence in DB vs chat | **INT-008** vs **DATA-010** | INT = runtime reasoning; DB = stable card copy for Sarah |

---

## Recommended field split (so seeding stays honest)

| Field | Source |
|-------|--------|
| `google_place_id`, lat/lng, hours, phone, Google photos | **Places API** (DATA-008) |
| `ai_vibe_summary`, `best_for[]`, specialty tags, persona fit | **Listings** → `metadata` / `tags` (DATA-010) |
| Website, Instagram | Listings, **verified** in DATA-010 (no hallucinated handles) |
| Email | Listings / website scrape; optional |
| WhatsApp | Venue business number if public; else omit — **Patricia** uses **user** WA on booking (VEN-022) |
| “Unique about café” | `metadata.why_special` from listings, not Gemini at seed time |

---

## Verdict

| Question | Answer |
|----------|--------|
| Do we have **tasks** for listings? | **No** — only **content** in `tasks/listings/`. |
| Are DATA tasks **correct**? | **Correct for MVP anchors + Places cache**; **incomplete** for rich café catalog you described. |
| What to do? | Run **DATA-002 → DATA-009 → DATA-003**; add **DATA-010** (listings ETL + contact/social/vibe in `metadata`); keep listings as source docs. |

I can draft **DATA-010-listings-cafe-enrichment.md** with acceptance criteria (metadata schema, verify IG/web, Places photo policy) and add it to `mvp-index` after DATA-003 if you want that specced next.

| File | Needed? | Action |
|------|---------|--------|
| **`cti-index.md`** | **No** | Deleted — was only a redirect after CTI→VEN merge. Order lives in [`mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md) (Phase 7, VEN-032…043). |
| **`NUMBERING.md`** | **No** (as separate file) | Deleted — content folded into [`tasks/INDEX.md`](tasks/venues/tasks/INDEX.md) § Numbering. |

## What to use instead

| Purpose | Use |
|---------|-----|
| **Execution order** | [`tasks/venues/tasks/mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md) |
| **ID ranges + tracks** | [`tasks/venues/tasks/INDEX.md`](tasks/venues/tasks/INDEX.md) |
| **CTI → VEN map** | [`tasks/venues/tasks/VEN-MIGRATION-2026-05-28.md`](tasks/venues/tasks/VEN-MIGRATION-2026-05-28.md) |
| **INT vs VEN overlap** | [`tasks/venues/CROSSWALK-INT.md`](tasks/venues/CROSSWALK-INT.md) (keep) |

**Maps** still has its own [`tasks/maps/NUMBERING.md`](tasks/maps/NUMBERING.md) — that pattern stays for MAP-* only.

Inbound links in `venues/INDEX.md`, cafes INDEX, INT-008, audits, and `tasks/notes/09-NUMBERING.md` are updated.

## What changed

### MVP folder (`009` → `043`, in order)

| Steps | What |
|-------|------|
| **09–13** | Restaurant + nightlife UI (unchanged) |
| **14** | Places cache (was **VEN-037**) |
| **15–24** | Booking + WA + admin (was 014–023) |
| **25–30** | Hardening (was 035–041) |
| **31** | Playwright E2E (was **VEN-024**) |
| **32–43** | Coffee tours (was **CTI-001A…017**) |

### Post-MVP tours

| Was CTI | Now VEN |
|---------|---------|
| CTI-011…020 | **VEN-044…051** in `post-mvp/` |
| CTI-019 (cancelled) | moved to `tasks/venues/archive/` |

### Master index

[`tasks/venues/tasks/mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md) — single ordered table  
[`tasks/venues/tasks/VEN-MIGRATION-2026-05-28.md`](tasks/venues/tasks/VEN-MIGRATION-2026-05-28.md) — old → new map  
Coffee tours: [`tasks/venues/tasks/mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md#phase-7--coffee-tours-32-43-optional) (VEN-032…051; CTI retired)

## How to read an ID

```text
DATA 01–09  →  VEN 09–13 UI  →  VEN 14 cache  →  VEN 15–24 booking
→  VEN 25–30 harden  →  VEN 31 E2E  →  VEN 32–43 tours (optional)
→  VEN 44–51 tour post-MVP
```

## Important caveat

**VEN-025** exists in **two folders**:

| Path | Meaning |
|------|---------|
| `mvp/025-*` | RLS penetration (release gate) |
| `post-mvp/025-*` | Concierge instructions (after MVP) |

Always use **path + VEN** in PRs (e.g. `mvp/025-ven-rls-…`).

## Quick examples

- Quiet café for remote work → **INT-008** + SCREEN-021  
- Coffee farm tour → **VEN-036** (`search-coffee-tours` tool)  
- Booking table SQL → **DATA-009**; app wiring → **VEN-015**

Linear/SAN issues may still say **CTI-*** — use the migration doc to map them when you sync.

**Venue MVP order is mostly correct** (DATA → VEN-009…013 → hardening → booking). **Café intelligence was split across three tracks** without a clear index — that’s fixed. **Do not merge** CTI, SCREEN-021, and INT-008. **Fix links** (all CTI paths pointed at a missing `tasks-intelligent/` folder).

---

## Café intelligence — set up correctly?

| Layer | Status | Tasks |
|--------|--------|--------|
| **UI (Places cafés)** | ✅ Shipped | SCREEN-021, CAF-A5 / **CAF-005** alias |
| **Routing (café vs nightclub)** | ⚪ Needed | **VEN-012** (before smart clarify) |
| **Chat reasoning** | ⚪ Needed | **INT-001** → **INT-008** (not CTI) |
| **Coffee tours product** | ⚪ Separate | **VEN-032…020** — farm tours, not “quiet café” |

**Example:** `quiet café in Laureles for remote work tomorrow` → **INT-008** + `search-grounded-places` + SCREEN-021 — **not** CTI.

**Example:** `best coffee farm tour near Medellín` → **VEN-036** — **not** INT-008.

---

## Consolidate tasks?

| Merge? | Answer |
|--------|--------|
| CTI + café INDEX | **No** — different products |
| INT-008 + VEN-012 | **No** — VEN-012 first, then INT-008 |
| VEN-025 + INT-001 | **Coordinate** — VEN-025 after INT-001 |
| CAFE-001 + VEN-031 | **Already** — VEN-031 canonical |
| Create `tasks-intelligent/` | **No** — use `mvp/` + `post-mvp/` |

---

## Overlap with INT program

| Venues | Intelligence |
|--------|----------------|
| VEN-012 | **INT-008** (after VEN-012) |
| VEN-025, VEN-028 | INT-001, INT-010 |
| VEN-044 | INT-016 / VEC (catalog vs user memory) |
| DATA-006 | INT-005 (shared eval strings) |

Full matrix: [`tasks/venues/CROSSWALK-INT.md`](tasks/venues/CROSSWALK-INT.md)

---

## Order (updated)

**Venue booking MVP (unchanged):**  
`DATA-001…008` → `VEN-009…013` → `VEN-031` → `VEN-031…041` → `VEN-031`

**Café intelligence (added to [`cafes/INDEX.md`](tasks/venues/cafes/INDEX.md)):**  
1. INT CORE (001…005) — rentals first, unblocks all verticals  
2. **VEN-012**  
3. **INT-008**  
4. DATA-003, booking chain  
5. CTI optional in parallel  

**INT program:** unchanged — [`tasks/intelligence/tasks/INDEX.md`](tasks/intelligence/tasks/INT-001-shared-intent-slot-schema.md) (INT-001…020 already filed).

---

## Renaming / consistency

| Old | Canonical |
|-----|-----------|
| `data-003-cafe-seed` | **DATA-003** |
| `CAF-A5` | **CAF-005** alias (file name unchanged) |
| `VEN-015` | **VEN-031** |
| CTI links → `tasks-intelligent/` | **`tasks/mvp/`** + **`tasks/post-mvp/`** |

**ID collision (OK):** VEN-043 (tour detail page) ≠ VEN-031 (tool registry) — different tracks.

---

## Files created / updated

**Created:**  
- [`tasks/venues/tasks/INDEX.md`](tasks/venues/tasks/INDEX.md)  
- [`tasks/venues/tasks/mvp/mvp-index.md`](tasks/venues/tasks/mvp/mvp-index.md) (includes VEN-032…043 tours)  
- [`tasks/venues/CROSSWALK-INT.md`](tasks/venues/CROSSWALK-INT.md)

**Updated:**  
- [`tasks/venues/INDEX.md`](tasks/venues/INDEX.md) — café 3-track section, fixed CTI links, INT crosswalk  
- [`tasks/venues/cafes/INDEX.md`](tasks/venues/cafes/INDEX.md) — DATA/VEN/INT/CTI naming  
- [`tasks/venues/tasks/INDEX.md`](tasks/venues/tasks/INDEX.md) (numbering + tracks)  
- [`tasks/INDEX.md`](tasks/INDEX.md) — venues row  
- [`INT-008`](tasks/intelligence/tasks/INT-008-cafe-intelligence-wrapper.md) — VEN-012 + CTI separation  

**Not duplicated:** INT-001…020 (intelligence program) and RE-017…020 (rental impl).

---

## Do we need additional tasks?

| New task? | Need |
|-----------|------|
| VEN-042 for café AI | **No** — use **INT-008** |
| `tasks-intelligent/` folder | **No** — fix links only |
| Merge post-mvp CTI into MVP index | **Done** — `mvp-index.md`; `cti-index.md` removed |
| INT-021 restaurant wrapper | **Later** — INT-018 |
| Renumber VEN-043 file | **No** — avoids VEN-031 collision |

**Optional later:** `INT-021-venue-restaurant-wrapper` when VEN-009/010 + INT-001 are Done.

---

## Next PR (unchanged)

1. **INT-002…004 + RE-017/018** (CORE rental)  
2. **VEN-012** + **INT-008** (café reasoning on `/chat`)  
3. Venue DATA + booking hardening in parallel  

**CTI** only if you’re shipping coffee **tours** in the same release.




# Venues — working notes

> Audit + roadmap scratchpad. Canonical specs: [`INDEX.md`](INDEX.md) · [`docs/prd-venues.md`](docs/prd-venues.md)


**Cafés are the template.** Phase A.5 is real on disk (`CafeResultCard`, `CafeDetailPanel`, Places detail, booking stub). **Restaurants** have Mastra + DB but **no polished UI**. **Nightlife** is spec-only — tool still lacks `intent: "nightlife"`. **Booking** is UI stub only; schema task exists but **`public.bookings` already exists** — you need **VEN-001** to unify before Phase C.

Created:
- [`docs/prd-venues.md`](docs/prd-venues.md) — full PRD
- [`INDEX.md`](INDEX.md) — progress tracker + task order
- Renamed `CAFE-001-booking-requests-schema.md` (fixed leading-space filename)

---

## 1. What's completed?

| Layer | Shipped |
|-------|---------|
| **UI** | Café cards + detail panel + map column toggle + mobile sheet |
| **Places** | `/api/places/detail`, field mask, caches |
| **Mastra** | `search-grounded-places` (cafe), `search-restaurants`, concierge routing |
| **CopilotKit** | Grounded café render; restaurant = generic list |
| **Maps** | F50 pin sync, grounded pin ids |
| **Supabase** | `restaurants` (44), `restaurant_embeddings` (43), WhatsApp/outbox tables (empty) |
| **006** | `VenueDetailSheet` for rental/event only |

---

## 2. What's missing?

- `RestaurantResultCard` / `RestaurantDetailPanel` (008)
- Nightlife intent filter + `NightlifeResultCard` / `NightlifeDetailPanel` (007)
- Booking persistence + status chips (Phase C)
- WhatsApp draft → Patricia approval → send
- Vector rerank (VEC-001→005)
- OpenClaw production pipeline (research only in `openclaw/`)
- Event **space** B2B booking (`event_venue_bookings` — Phase 3)
- Playwright SCREEN-022/023

---

## 3–5. Tasks correct? Dependencies? Conflicts?

**Scr/wire specs (005–008) are executable** and pair correctly.

**Conflicts to resolve:**

| Conflict | Resolution |
|----------|------------|
| CAFE-001 → `cafe_booking_requests` vs existing `public.bookings` | **VEN-001**: unified `venue_booking_requests` |
| Nightlife vs `search-events` category | Clubs = grounded places; tickets = `search-events` handoff only |
| Café scr path was `cafes/` in README | Fixed — specs live at `venues/` root |
| `007-wire-nightlife-explorer` stub | Ignore; use `007-wire-nightlife-listings-map` |

**Dependency order:** VEN-002/003 (UI) → VEN-001 (schema) → VEN-004 (form) → VEN-005 (WhatsApp). VEC-* parallel for Phase B rerank.

---

## 6. Supabase tables needed

**Use now:** `restaurants`, `restaurant_embeddings`, `places_*_cache`, `whatsapp_*`, `wa_outbox`, `approval_requests`, `event_venues`

**Add (VEN-001):** `venue_booking_requests` with `venue_kind` + status enum (`pending` → `sent` → `confirmed` / `needs_user`)

**Phase 3 (events):** `event_venue_bookings` — corporate/event space, not dinner tables

**Extend enum option:** add `cafe`/`nightlife` to `booking_type` only if you want one ledger — PRD recommends **separate request table** for honest UX.

---

## 7. Seed files

| Seed | Status |
|------|--------|
| Restaurants (6) | ✅ `20260404044721_restaurants_seed.sql` — expand via **VEN-006** |
| Cafés | Phase A = grounding only; optional curated JSON in `venues/seeds/` |
| Nightlife | Grounding-only Phase A; eval anchors optional |
| Prompt packs | ✅ `cafes/listings/*.md` for VEC-005 golden queries |

**Rule:** backfill `google_place_id`, hours, phone from Places — never invent.

---

## 8. Embeddings

- **Today:** `restaurant_embeddings` 768-dim, 43 rows (legacy)
- **Target:** VEC-002 `semantic_embeddings` + VEC-004 text builders
- **Venue use:** Phase B rerank after ADK results (café + restaurant)
- **Golden queries:** Sarah (quiet WiFi café), Carlos (date night), Tourist (reggaeton Provenza)

---

## 9–11. Mastra / CopilotKit / Maps

**Mastra tools needed:**

| Tool | Status |
|------|--------|
| `search-grounded-places` | ✅ cafe — **add** `nightlife`, `restaurant` intents |
| `search-restaurants` | ✅ |
| `requestVenueBooking` | ❌ VEN-004 |
| `draftVenueWhatsApp` | ❌ VEN-005 |

**CopilotKit:** mirror tools with `available: "disabled"` + render; fork café pattern for restaurant/nightlife detail actions.

**Maps/ADK:** Keep ADK Grounding Lite for café/nightlife; Supabase catalog for restaurants Phase A; Places New for detail; MAP-010 autocomplete later.

---

## 12. Edge vs Mastra?

| Op | Where |
|----|-------|
| Places detail | ✅ Next.js route (shipped) |
| Booking insert | Mastra tool (F13 carve-out) **or** edge `venue-booking-request` |
| WhatsApp send | **Edge** + `wa_outbox` (service role) |
| Patricia approval | Edge or admin API |
| Embeddings batch | Edge/cron |
| OpenClaw webhooks | Edge (draft writes only) |

Mastra orchestrates; edges own side effects.

---

## 13–14. Booking + WhatsApp (Carlos / Patricia)

```
Request click → form (date, time, party, notes, WhatsApp)
  → INSERT venue_booking_requests (pending)
  → Mastra drafts WhatsApp text (propose-only)
  → approval_requests → Patricia approves
  → wa_outbox → send
  → status: sent → confirmed | needs_user | cancelled
```

**Never show "Confirmed"** unless status says so. Colombia = WhatsApp/phone, not OpenTable ([openclaw research](openclaw/openclaw-restaurant-1.md)).

Mastra WhatsApp guide pattern: channel adapter for inbound; mdeai adds **approval gate** before outbound to venues.

---

## 15. OpenClaw (safe)

- Apify scrape menus/hours → **draft** metadata
- Verify IG/website vs Places
- Flag stale booking links
- Draft WA messages (Patricia approves)
- Monitor new venues → seed suggestions
- **Never:** auto-confirm bookings, auto-write hours/prices to prod

---

## Event venue booking (company / Roberto)

**Different product** from dinner reservation:

| Channel | When |
|---------|------|
| **Chat + wizard** | MVP — Roberto `/host/event/new`, `set_venue`, HITL publish |
| **Form** | Phase 2 — `/host/venue/inquiry` for B2B |
| **OpenClaw** | Phase 2+ — WA/call venue manager (propose-only) |
| **WhatsApp** | Phase 2+ — hold/confirm notifications |

Data: `event_venues` today → `event_venue_bookings` with conflict EXCLUDE (archive 041). AI proposes slots; **edge INSERT only**.

---

## Blockers

1. **VEN-001** schema decision before Phase C  
2. **VEN-002** before calling restaurants "done"  
3. Nightlife routing must not dump club queries into ticket search  
4. Vector Phase B blocked on VEC-001→005  
5. WhatsApp without Patricia gate = trust/legal risk  

---

## Exact next order

1. **VEN-002** — Restaurant cards + panel (copy café)  
2. **VEN-003** — Nightlife intent + UI  
3. **VEN-001** — `venue_booking_requests` migration  
4. **VEN-004** — Booking form → DB  
5. **VEN-005** — WA draft + approval + outbox  
6. **VEC-001** — (parallel) pgvector inventory  

Full detail: [`docs/prd-venues.md`](docs/prd-venues.md) · tracker: [`INDEX.md`](INDEX.md).

---

## Maps ↔ Venues — how `tasks/maps/` relates

**Rule:** Maps owns **platform geo infrastructure** (pins, Places clients, ADK grounding, map chrome). Venues owns **place-vertical UX** (café/restaurant/nightlife cards, detail panels, booking). Both share the same `/` Mindtrip shell — do not duplicate map pipelines inside `tasks/venues/`.

**Canonical maps index:** [`../maps/INDEX.md`](../maps/INDEX.md) · **PRD:** [`../maps/maps-prd.md`](../maps/maps-prd.md) · **Wireframe:** [`../maps/wireframes/011-scr-map-exploration-panel.md`](../maps/wireframes/011-scr-map-exploration-panel.md) (SCREEN-010)

### Architecture (shared stack)

```text
User on / (chat)
  CopilotKit center column     → VenueResultCard* (venues: 005–008)
  CopilotKit right column      → Map OR *DetailPanel (venues) — not VenueDetailSheet
  Mastra conciergeAgent        → search-grounded-places | search-restaurants
  ADK Grounding Lite (MAP-002) → discover cafés / (future) nightlife
  Places API New (MAP-004/018) → getPlaceDetails enrichment
  MapContext + ChatMap (MAP-001, F48–F50) → pins, focusPin, fitBounds
```

**Split:**

| Folder | Owns |
|--------|------|
| `tasks/maps/` | MapPin contracts, ADK sidecar, Places clients/caches, marker chrome, map panel polish |
| `tasks/core/` F48–F50 | 3-panel layout, generative cards→pins, `focusPin` / viewport bias |
| `tasks/venues/` | Vertical cards, detail panels, booking requests, restaurant Supabase catalog UX |

### MAP tasks venues already depend on (Done ✅)

Every venue scr (005–008) lists **`MAP-001`** in `depends_on`. On disk, these are **shipped** and power café Phase A.5:

| ID | What it gives venues | Venue use today |
|----|----------------------|-----------------|
| **MAP-001** | `MapPin` schema, `MapContext`, vis.gl + `mapId` | All pins on `/` |
| **MAP-002** | ADK Grounding Lite + attribution | Café discovery via `search-grounded-places` |
| **MAP-004** | Places API (New) client + field masks | `/api/places/detail` in `CafeDetailPanel` |
| **MAP-018** (+ B–F) | Mindtrip grounded cards pipeline | Parent of café enrichment path |
| **MAP-018E** | `place_details_cache` | Cost control on detail opens |
| **MAP-018D** | Photo proxy | Café card/panel images |
| **MAP-015** | Card ↔ pin sync | Sarah hovers café card → pin highlights |
| **MAP-016** | `fitBounds` on search | Tourist sees all club/café pins in view |
| **MAP-019** | Directions / Reviews / Maps CTAs | Café detail CTAs |
| **MAP-030** | Category markers (☕🍽️🎟️) | Grounded cafés = ☕; restaurants = 🍽️ when pinned |
| **F48 / F49 / F50** | Layout + tool renders + map state | Center/right column swap for detail |
| **F50b** | Viewport `locationBias` | Better Laureles/Provenza grounding |

**Café vertical = maps MVP consumed.** Restaurant/nightlife reuse the same stack; they add **venue-specific UI** (VEN-002/003), not new map infrastructure.

### MAP tasks still open that affect venues

| ID | Status | Venue impact | When |
|----|--------|--------------|------|
| **SCREEN-010 / 011-scr** | Not started | Right panel layer toggles, empty state, legend — polish for Tourist map during venue search | Optional; cafés work without it |
| **MAP-005** | Not started | Server Places proxy + search cache | Before heavy Places volume (restaurant backfill VEN-009) |
| **MAP-006** | Not started | Nearby search RPC | “Cafés near this rental” cross-sell |
| **MAP-010** | Not started | Place Autocomplete | **Roberto** host wizard + future “add venue” — **event space**, not dinner booking |
| **MAP-011** | Not started | Route previews (`compute_routes`) | “How far is this restaurant from my apartment?” |
| **MAP-012** | Not started | Neighborhood intelligence | Laureles vs Poblado context on cards |
| **MAP-002D** | Phase 2 | Google Search grounding sidecar | Time-sensitive “what’s open tonight” — not MVP venues |
| **MAP-002E** | Not started | ADK fallback runbook | Ops when grounding quota fails |

**Do not execute MAP-007** (superseded by MAP-007B).

### Per vertical — maps vs venues responsibility

| Vertical | Discovery (maps/Mastra) | Detail enrichment | Pin category today | Gap |
|----------|-------------------------|-------------------|--------------------|-----|
| **Café 005** | ADK `intent:cafe` (MAP-002) | Places detail (MAP-004/018) | `grounded` → ☕ (MAP-030) | Phase B vector rerank (VEC, not MAP) |
| **Restaurant 008** | Supabase `search-restaurants` (no Places search yet) | Partial — `placeId` nullable | `restaurant` → 🍽️ when lat/lng pinned | VEN-002 UI; Phase B grounded `intent:restaurant` |
| **Nightlife 007** | **Not wired** — needs `intent:nightlife` on same ADK path | Same Places detail pattern | Uses `grounded` ☕ today — **wrong glyph** | VEN-003 + likely **MAP-030 extension** (🎵/🍸 marker or `meta.kind`) |
| **Rental/event 006** | Supabase + events | VenueDetailSheet | `rental` / `event` | Not a venues vertical — shared sheet only |

**Nightlife routing trap:** `search-events` category `nightlife` = **ticketed events**, not clubs on the map. MAP/venues rule: reggaeton **venues** → `search-grounded-places`; ticketed **parties** → `search-events` handoff only.

### Discovery vs enrichment (invariant from maps PRD)

| Step | Owner | Venues rule |
|------|-------|-------------|
| **Discover** | ADK Grounding Lite (café/nightlife) or Supabase (restaurants) | Never invent lat/lng in Gemini prose |
| **Enrich** | Places API New + cache (MAP-018E) | Field mask on every call; show `factsCheckedAt` |
| **Render** | CopilotKit + venue detail panels | One listing surface; rich-card dedup |
| **Display** | Maps JS + AdvancedMarker + `mapId` | Required for every marker |

### SCREEN-010 (map exploration panel) vs venue detail panel

Both use the **right column** on `/` — they compete for the same space:

| Surface | Spec | Behavior |
|---------|------|----------|
| **Venue detail** | 005–008 wires | Card click → `CafeDetailPanel` / future Restaurant / Nightlife — **replaces map** in right column |
| **Map exploration** | 011-scr (SCREEN-010) | Layer toggles, legend, empty copy — **map stays** in right column |

**Resolution:** Detail panel wins on card select (shipped for café). SCREEN-010 is **map chrome polish** when no detail is open — not a second listing UI. Depends on MAP-001 + F49 + F50; optional for venue MVP.

### Event venue booking vs place venue (maps angle)

| Product | Maps touchpoint | Task |
|---------|-----------------|------|
| Dinner/club **request** | Places `place_id` on booking row | VEN-001 + MAP-004 detail |
| Corporate **event space** | Autocomplete + `event_venues` geo | MAP-010 + Roberto wizard (events/) |
| Event page map pin | Static preview OG | MAP-023 (marketing) |

MAP-010 is **not** for Carlos's restaurant reservation — it's for Roberto picking a **physical event venue** with correct `google_place_id`.

### Naming confusion (café listing docs)

Files under `cafes/listings/*.md` reference **MAP-024–029** as “AI café scoring / embeddings.” Those ids are **not** in [`../maps/INDEX.md`](../maps/INDEX.md). Real **MAP-030** = category Advanced Markers (Done). Vector work = **VEC-004/005**, not MAP-024.

### When implementing venue tasks — maps checklist

1. **Do not** add a second Places client — use `google-places-client.ts` + `/api/places/detail`.
2. **Do not** bypass `MapContext` for pins — F49 `ToolPinsSync` pattern.
3. **Do not** mix v1/v2 CopilotKit map state — F50 only.
4. **Do** add field masks for any new Places call (MAP-004 rule).
5. **Do** extend MAP-030 / `MapPinCategory` if nightlife needs distinct marker (VEN-003 acceptance).
6. **Do** run `npm run smoke:map-pins` + venue Playwright after UI changes.

### Suggested order (maps + venues combined)

```text
1. VEN-002 restaurant UI     — uses existing restaurant pins + MAP-030 🍽️
2. VEN-003 nightlife UI      — extend grounded tool + marker glyph
3. MAP-005 (optional)        — before VEN-009 restaurant Places backfill at scale
4. SCREEN-010 (optional)     — map panel polish, not blocking bookings
5. MAP-010                   — when Roberto venue autocomplete ships (events track)
6. MAP-006 / MAP-012         — cross-sell + neighborhood copy on venue cards
```

**Maps MVP for venues is already met for cafés.** Remaining venue work is **vertical UI + booking schema**, not MAP-001–018.

---

## Events ↔ Venues — two meanings of "venue"

mdeai uses **venue** in two places. They share **Maps + Places** infrastructure but **not** the same product surface or task folder.

| Concept | Folder / table | Persona | What it is |
|---------|----------------|---------|------------|
| **Place discovery** | `tasks/venues/` · no single table (Places + `restaurants`) | Tourist, Sarah, Carlos | Cafés, restaurants, clubs on **`/` chat** — cards + detail panel |
| **Event space** | `tasks/events/` · `event_venues` | Roberto, Andrés, Sofía | **Where a ticketed event happens** — host wizard, event detail, QR at door |

**Do not merge these backlogs.** Roberto’s `event_venues` row is not Carlos’s dinner reservation row.

### Shared touchpoints (where events + venues meet)

```text
/ chat
  EventCard (003) ──Details──► VenueDetailSheet (006)     ← event/rental overlay ONLY
  CafeCard (005)  ──Details──► CafeDetailPanel            ← NOT 006

/events/[slug]
  Event detail (003) ──venue block──► event_venues + map pin (EVP-016)
  Future EVP-036 ──nearby──► venues discovery (cafés/bars after the show)

/host/event/new
  set_venue tool (004) ──► event_venues + Places (MAP-010 future)
```

| Shared asset | Owner | Used by |
|--------------|-------|---------|
| **`006-scr` / `VenueDetailSheet`** | venues spec, events wire | In-chat **Details** on EventCard → rental or event metadata — **not** café/restaurant/nightlife |
| **`event_venues`** (7 rows) | events / Supabase | Event pins, detail page address, host wizard |
| **`restaurants`** (44 rows) | venues | `search-restaurants` — independent of events unless EVP-036 cross-sell |
| **MAP-004 / Places detail** | maps | Café panel today; EVP-024 for event candidates tomorrow |
| **MAP-010 autocomplete** | maps | **Roberto** host venue pick — events track, not VEN booking |
| **Checkout / tickets** | `tasks/events/wireframes/015-*`, `tasks/trips/010-*` | Andrés commerce — not venue reservation |

### Events tasks that touch venues (EVP)

**Canonical events index:** [`../events/INDEX.md`](../events/INDEX.md) · **Wireframes:** [`../events/wireframes/`](../events/wireframes/)

| EVP | Relationship to venues vertical |
|-----|----------------------------------|
| **EVP-013** | EventCard in chat — **Details** opens **006** sheet, not place detail panels |
| **EVP-016** | Event map pins + `event_venues` binding + Places — **event geo**, not café discovery |
| **EVP-024** | Places enrichment for **event/venue candidates** (discovery pipeline) |
| **EVP-036** | **Strongest link:** nearby cafés/bars/coworking on event detail → **calls into venues tools** (`search-grounded-places`, `search-restaurants`) after EVP-016/024 |
| **EVP-037** | Concierge “should I go?” — events only; may reference neighborhood context from MAP-012 later |
| **004-scr host wizard** | `set_venue` creates/links **event space** — corporate booking path, not Carlos WhatsApp dinner |

**Nightlife naming collision:**

| User says | Route to | Folder |
|-----------|----------|--------|
| “Reggaeton **clubs** near Provenza” | `search-grounded-places` `intent:nightlife` | **venues 007** |
| “**Nightlife events** this weekend” | `search-events` category `nightlife` | **events 003** |
| “Party at **[club name]** with tickets” | EventCard + checkout | **events** |

### Events commerce vs venue request booking

| Flow | Table / task | Confirms instantly? |
|------|--------------|---------------------|
| Andrés buys **ticket** | `event_orders` / EVP-002 | Yes (Stripe) |
| Carlos **requests dinner** | `venue_booking_requests` / VEN-001 | No — Patricia + WhatsApp |
| Roberto **books event space** | `event_venue_bookings` (Phase 3, archive 041) | Hold → contract — not MVP |

---

## Draft docs — `tasks/venues/drafts/`

Found under [`drafts/venues/`](drafts/venues/) and [`drafts/071-*`](drafts/071-restaurant-reservations-schema.md), [`drafts/072-*`](drafts/072-restaurant-booking-edge-fn.md).

### `drafts/venues/` — event **space** strategy (not place discovery)

**Status:** Near-duplicate of [`../../plan/events/venues/`](../../plan/events/venues/) (same filenames; plan copy has extra `docs/` subfolder). **Strategy layer from 2026-05-17** — references **retired** paths (`EVT-039–044`, `V2-tasks/advanced/`, `archive/035–044`).

| Draft doc | Topic | Active execution today? |
|-----------|--------|-------------------------|
| `venue-management-prd-v1.md` | Event OS venue layer (B2B space, not restaurants) | Plan reference only |
| `venue-workflows.md` | Onboarding, booking EXCLUDE, staff | Phase 3 — not filed as EVP yet |
| `venue-maps-integration.md` | `event_venues.google_place_id`, Nearby dining | Overlaps **EVP-016**, **MAP-010**, **MAP-006** |
| `venue-agents-architecture.md` | Propose-only Mastra; forbidden direct booking inserts | Aligns with CLAUDE.md rules |
| `venue-automation-strategy.md` | OpenClaw + WA for **event ops** | Overlaps **VEN-008** / EVP-030 — different scope |
| `venue-roadmap.md`, `venue-feature-matrix.md` | Enterprise venue CRM | Defer — not Phase 1 |

**Recommendation:**

- Treat **`plan/events/venues/`** as canonical for event-space strategy.
- Keep `tasks/venues/drafts/venues/` as **relocated stash** or delete after confirming no unique edits (diff clean vs plan).
- Do **not** add draft EVT ids to [`INDEX.md`](INDEX.md) — venues INDEX tracks **005–008 + VEN-*** only.

### `drafts/071–072` — native restaurant reservations (Phase 3 archive)

**Files:** [`071-restaurant-reservations-schema.md`](drafts/071-restaurant-reservations-schema.md) · [`072-restaurant-booking-edge-fn.md`](drafts/072-restaurant-booking-edge-fn.md)

**Origin:** Old **PHASE-3-RESTAURANT** pack (P2, ~1 day each). Assumes mdeai becomes a **restaurant SaaS** with on-platform table inventory — OpenTable-style instant confirmation. **Not aligned with Phase 1 Mindtrip chat on `/`.**

#### What 071 proposes

| Piece | Detail |
|-------|--------|
| **Schema** | New Postgres schema `restaurant.*` — 5 tables |
| `restaurant.venues` | Links `public.restaurants` → owner Carlos configures tables, slots, `booking_enabled` |
| `restaurant.tables` | Physical tables (capacity, section, terrace) |
| `restaurant.availability_slots` | Open/blocked windows per day or DOW |
| `restaurant.reservations` | Confirmed bookings — `pending` → `confirmed` → `seated` → `completed` |
| `restaurant.dietary_requirements` | Per-reservation dietary flags |
| **Concurrency** | `UNIQUE (table_id, reserved_date, reserved_time)` — real double-book prevention |
| **RLS** | Owner manages venue; public reads `booking_enabled`; user sees own reservations |

**Persona in draft:** Carlos = **restaurant owner** (El Cielo). Camila = diner who gets **instant confirmation code + email** — not WhatsApp request flow.

#### What 072 proposes

| Piece | Detail |
|-------|--------|
| **Edge fn** | `POST /functions/v1/restaurant-booking` create · `DELETE …/:id` cancel |
| **Availability API** | `GET …/availability?venue_id&date` → time slot grid |
| **Race safety** | `pg_advisory_xact_lock` + UNIQUE constraint → 409 on conflict |
| **Table assign** | Smallest table that fits party size |
| **UI surface** | **`/restaurants/:id`** detail page with date picker, slot grid, guest form |
| **Owner UX** | `/host/venue/:id` dashboard + Supabase Realtime |
| **Email** | SendGrid confirmation within 60s |

**Parallel cited:** ticket checkout edge fn (atomic capacity) — same pattern as Andrés Stripe flow, not Patricia approval.

#### vs current Phase 1 plan (VEN / 008)

| Dimension | **071/072 (drafts)** | **VEN-001 + 008 + VEN-004/005 (active)** |
|-----------|----------------------|------------------------------------------|
| **Product model** | Platform owns table calendar | Honest **request**; venue confirms offline |
| **Confirmation** | Instant + email code | `pending` → Patricia WA → `sent` → `confirmed` |
| **UI location** | `/restaurants/:id` catalog page | `/` chat → `RestaurantDetailPanel` (008) |
| **Schema** | `restaurant.*` (5 tables) | `venue_booking_requests` (1 table, all kinds) |
| **Existing DB** | Extends `public.restaurants` via FK | Uses `google_place_id` + optional `restaurants.id` in metadata |
| **Edge vs Mastra** | Edge owns INSERT + email | Mastra tool or edge; WA via `wa_outbox` |
| **Colombia fit** | Assumes restaurants opt into SaaS | Matches WhatsApp/phone reality (no OpenTable) |
| **Owner onboarding** | Carlos configures 20 tables in app | No owner portal MVP — OpenClaw enrich only |
| **Phase** | PHASE-3-RESTAURANT P2 | Phase C after VEN-002 UI |

**Verdict:** **Do not execute 071/072 for Phase 1.** They solve a different business (B2B restaurant partner SaaS). Keep as **Phase 3 option** if mdeai adds restaurant partners with owned inventory.

#### Overlap with existing Supabase

| Object | 071/072 | Today on disk |
|--------|---------|---------------|
| `public.restaurants` | FK target for `restaurant.venues` | ✅ 44 rows — discovery catalog |
| `public.bookings` | Not used | ✅ `booking_type` includes `'restaurant'` — generic ledger, 0 rows |
| `cafe_booking_requests` / VEN-001 | Not used | ❌ not migrated |
| Confirmation email | SendGrid in 072 | `email_outbox` exists (empty) |

If you ever ship 071, decide explicitly: **replace** `public.bookings` restaurant rows vs **keep** separate `restaurant.reservations` — don't add a third booking table alongside VEN-001.

#### Stale / broken references in drafts

| Reference in 071/072 | Status |
|----------------------|--------|
| `depends_on: 001-event-schema-migration` | Legacy archive id — use `event_phase1` migration path |
| `../15-user-stories.md` §8.3 | **Missing** from `tasks/venues/drafts/` — was old events pack |
| `./004-ticket-checkout-edge-fn.md` | **Missing** locally — lives in `drafts/tasks/archive/` |
| UI `/restaurants/:id` | **No route** in `mdeapp` — only chat `/` + tool URLs like `mdeai.co/restaurants/{id}` |
| `/host/venue/:id` owner dashboard | **Not built** — Roberto has `/host/event/new`, not restaurant ops |
| `RestaurantDetail` widget | Draft name ≠ **`RestaurantDetailPanel`** (008 spec) |

#### If you revive 071/072 later (checklist)

1. Rename/reconcile with **008** — booking widget lives in **right-column panel on `/`**, not only catalog route (unless F41-style `/rentals` pattern for `/restaurants`).
2. Restaurant **partner** story needs: owner auth, table admin, Stripe deposit (072 mentions `stripe_payment_intent`).
3. Run **RLS audit** — draft uses `current_setting('app.current_email')` for guest lookup; verify Supabase pattern.
4. **i18n:** draft copy is English; Phase 2 Spanish deferred globally.
5. Merge or supersede **VEN-001** for `venue_kind=restaurant` — don't run two booking systems.

#### Recommended task ids if filed formally

| Old draft | New id (if ever) | Tier |
|-----------|------------------|------|
| 071 | **VEN-010** restaurant partner schema | Phase 3 |
| 072 | **VEN-011** restaurant-booking edge + slot UI | Phase 3 |

Until then: **archive status = Open, execution = frozen.** Phase 1 Carlos (diner) story = **VEN-004** request form + **VEN-005** WhatsApp, not slot grid.


### How drafts relate to live specs

```text
tasks/venues/005–008 (scr/wire)     ← SHIP NOW — place discovery UX
tasks/venues/VEN-001..008 (planned) ← booking + restaurant/nightlife UI
tasks/events/EVP-*                  ← tickets, host wizard, event_venues
plan/events/venues/ (drafts copy)   ← Phase 2+ event SPACE OS
tasks/venues/drafts/071–072         ← defer — native reservations
```

### Cross-team order when both pillars move

1. **EVP-013** green (EventCard) before relying on 006 sheet from events chat.
2. **VEN-002/003** restaurant/nightlife UI — independent of EVP unless **EVP-036** (nearby on event page).
3. **MAP-010** — host event venue autocomplete (**events**), not Carlos dinner form.
4. **VEN-001** — place request bookings — **do not** conflate with `event_venue_bookings` (041).

**Events notes (dedupe UX):** [`../events/notes-events.md`](../events/notes-events.md) — event cards vs map results duplication; same pattern as venues `rich-card-results` for cafés.

