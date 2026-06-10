# SAN-135 · Phase A — Pre-implementation verification

**Date:** 2026-06-08  
**Linear:** [SAN-135](https://linear.app/sanjiovani/issue/SAN-135/aie-024-mvp-luma-event-detail-layout-evp-032)  
**Branch (recommended):** `ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032`  
**Gate:** SAN-731 merged (`0baeda7` · PR #137) · SAN-492 **blocked**

---

## Skills loaded (≤5)

| # | Skill | Role in this verify |
|---|-------|---------------------|
| 1 | `task-verifier` | Forensic probes, readiness rubric, fail-closed |
| 2 | `shadcn` | `Avatar`, layout tokens, skeleton patterns |
| 3 | `testing` | Vitest + Playwright + evidence paths |
| 4 | `mde-task-lifecycle` | Pre-verify before In Progress; no fake Done |
| 5 | `mde-worktree-pr-flow` | One branch · one PR · ≤15 files |

**Not loaded:** copilotkit, mastra, mde-supabase (note RLS finding below — load `mde-supabase` at implement time).

---

## Phase 1 — Source reconciliation

| Source | Status | Notes |
|--------|--------|-------|
| Linear SAN-135 | In Review ⚠️ stale | Moved Todo→In Review 2026-05-27 in ~1 min; 0 comments until forensic |
| `AIE-024-mvp-luma-event-detail.md` | **Not Started · 10%** | Full AC lists vibe/AI/Ask Host — **Phase A is a strict subset** |
| `PAGE-003` | **Live** | Commerce layout shipped (SCREEN-014) |
| `PAGE-003b` | Spec-only | Defines full Luma upgrade; §PR slices say **PR-A = hero + host + skeleton** |
| Forensic audit | Class D | No git/PR; planning + PAGE-003 base only |
| Changelog | No SAN-135 row | Add after ship |

**Conflict resolution:** User Phase A scope **wins** over AIE-024 full AC for this PR. Defer vibe/AI/attendees/Ask Host to SAN-136–138.

---

## Phase 2 — Phase A scope (locked)

### Allowed (layout-only)

1. **Host block** — avatar, host name, “Hosted by” label (hide section if no resolvable host)
2. **Section order** — hero → event summary (title, schedule, location line) → host block → tickets → venue block
3. **Responsive** — mobile stack + desktop two-column (narrative left · sticky ticket card right)
4. **Empty states** — per PAGE-003b: hide block when data null (no lorem)

### Explicitly out of scope

SAN-136 vibe tags · AI summaries · Ask Host · social proof · recommendations · agents · venue booking · sponsors · map/nearby · follow button · Share implementation

### Already shipped (do not re-scope)

- Route skeleton (`loading.tsx`) — SAN-731
- Hero `alt={event.name}` — SAN-731
- Ticket tiers + checkout modal — PAGE-003
- Mobile sticky buy bar — PAGE-003

---

## Phase 3 — Browser gap (PAGE-003 vs PAGE-003b)

**Probe slug:** `reina-de-antioquia-2026-finals` · localhost:3001 + prod `mdeai.co` (2026-06-08)

| Feature | Current (PAGE-003) | Phase A target | Later (SAN-136+) |
|---------|-------------------|----------------|------------------|
| Hero 16:10 | 🟡 placeholder / optional img | 🟡 keep; optional scrim polish only | badge + gradient |
| Event summary (H1 + time + location) | ✅ split mobile/desktop | ✅ unify order above fold | category chip |
| Host block | ❌ | ✅ new | follow link |
| Vibe tags | ❌ | ❌ defer | SAN-136 |
| AI summary | ❌ | ❌ defer | SAN-136 |
| Attendee strip | ❌ | ❌ defer | SAN-138 |
| About / description | ✅ | ✅ keep in narrative stack | — |
| Ticket tiers | ✅ | ✅ unchanged behavior | — |
| Venue section | 🟡 inline `address · city` only | ✅ dedicated block (+ `event_venues` name when linked) | map panel |
| Ask Host | ❌ | ❌ defer | SAN-137 |
| Map + nearby | ❌ | ❌ defer | SAN-139 |
| Sticky mobile buy bar | ✅ | ✅ preserve | — |
| Loading skeleton | ✅ SAN-731 | 🟡 optional host/venue skeleton bars | — |
| Checkout modal | ✅ | ✅ must stay green | — |

**Screenshots (baseline):** `SAN-135-desktop.png`, `SAN-135-mobile.png`, `SAN-135-prod-*.png` in this folder.

---

## Phase 4 — Data audit (no new tables)

### Available today (DB + types)

| Field | DB (`events`) | `PublicEventDetail` / `getPublicEvent` | Phase A use |
|-------|---------------|----------------------------------------|-------------|
| Event title | ✅ `name` | ✅ | Event summary |
| Schedule | ✅ `event_start_time` / `event_end_time` | ✅ | Event summary |
| Inline venue text | ✅ `address`, `city` | ✅ | Event summary + venue fallback |
| Coordinates | ✅ `latitude`, `longitude` | ✅ | Later map; optional “Open in Maps” link in venue block |
| Hero image | ✅ `primary_image_url` | ✅ `imageUrl` | Hero |
| Description | ✅ `description` | ✅ | About |
| Tickets | ✅ `event_tickets` | ✅ | Unchanged |
| Organizer FK | ✅ `organizer_id` | ❌ **not selected** | Host block |
| Venue FK | ✅ `venue_id` → `event_venues` | ❌ **not joined** | Venue block |
| `event_venues.name/address` | ✅ table + public RLS | ❌ not fetched | Venue block |

### Available on `profiles` (not exposed to public page today)

| Field | DB | Public anon read? |
|-------|-----|-------------------|
| `full_name` | ✅ | ❌ RLS: own profile only |
| `avatar_url` | ✅ | ❌ same |

**RLS probe:** `profiles` policy = `authenticated_users_can_view_own_profile` (uid = id) — **anon event detail cannot join organizer profile without a policy or SECURITY DEFINER RPC**.

### Missing from app layer (not missing from DB)

| Need | Resolution (pick one before host block ships) |
|------|-----------------------------------------------|
| Organizer name + avatar | **A)** RLS policy: public SELECT limited fields for profiles who organize published events · **B)** SECURITY DEFINER RPC `get_event_host_public(event_id)` · **C)** Denormalize host display into `events.details` at publish (no new table) |
| Venue name | Extend `getPublicEvent` join `event_venues` (RLS already public when event published) |

**Constraint:** User rule = no new schema tables. **RLS policy or RPC = allowed** (not a new table); document in PR as data-access slice, not SAN-492.

---

## Phase 5 — Testing plan

### Vitest (new)

| Test | File | Assert |
|------|------|--------|
| Host block renders name + label | `src/components/events/__tests__/event-host-block.test.tsx` | `Hosted by` + name |
| Host block hidden when organizer null | same | section absent / `data-testid` count 0 |
| Avatar fallback initials | same | no img → fallback |

### Playwright (extend SCREEN-014)

| Test | Viewport | Assert |
|------|----------|--------|
| Host block visible when seed has organizer | desktop | `[data-testid="event-host-block"]` visible |
| Section order smoke | mobile | host appears before tier rows in DOM order |
| Checkout unchanged | desktop + mobile | buy CTA → `booking-checkout-modal` |
| Existing tier count | desktop | 4 tiers Reina seed |

**Keep:** curl 200, UUID route, mobile buy bar tests.

### Browser MCP (post-implement)

- localhost desktop + mobile screenshots → `SAN-135-phase-a-localhost.png`
- prod spot-check after deploy

### Evidence (post-implement)

- `tasks/testing/evidence/YYYY-MM-DD/SAN-135-RESULTS.md`
- `cr review` + `cubic review` before PR

---

## Phase 6 — Files to touch (estimate ≤10)

| File | Change |
|------|--------|
| `src/lib/events/types.ts` | Add optional `organizer`, `venue` sub-objects |
| `src/lib/events/get-public-event.ts` | Select `organizer_id`, join venue; host resolution per chosen path |
| `src/components/events/event-host-block.tsx` | **NEW** — Avatar + “Hosted by” |
| `src/components/events/event-venue-section.tsx` | **NEW** — venue name/address (optional) |
| `src/components/events/event-detail-view.tsx` | Section reorder + compose blocks |
| `src/app/events/[slug]/loading.tsx` | Optional skeleton rows for host/venue |
| `e2e/screens/SCREEN-014-event-detail.spec.ts` | Host block + order asserts |
| `src/components/events/__tests__/event-host-block.test.tsx` | **NEW** |
| `supabase/migrations/YYYYMMDD_event_host_public_read.sql` | **Only if path A** — narrow profiles SELECT policy |

**Do not touch:** checkout modal, ticket tier logic, agent tools, venue booking schema.

---

## Readiness score

| Area | Score | Notes |
|------|------:|-------|
| Spec clarity | **88** | PAGE-003b + user Phase A slice align; trim AIE-024 AC in Linear |
| Existing data | **58** | Venue join easy; **host blocked by profiles RLS** |
| Layout complexity | **78** | Reorder + 2 components; no agents |
| Testing readiness | **82** | SCREEN-014 patterns; host tests not written yet |
| Browser validation | **85** | Baseline captured; gap table complete |

| Metric | Value |
|--------|------:|
| **Readiness /100** | **78** |
| **Success rate (est.)** | **82%** with host data path decided upfront · **65%** if RLS deferred mid-PR |

### Risks

1. 🔴 **Host data path** — profiles RLS blocks anon read (must decide A/B/C before coding)
2. 🟡 **Linear status drift** — In Review with zero implementation; reset to Todo/In Progress at kickoff
3. 🟡 **Reina seed** — no hero img; host block needs seed profile with `full_name` / `avatar_url`
4. 🟡 **Scope creep** — `events.ai_summary` column exists; do **not** surface in Phase A (SAN-136)
5. 🟢 **Checkout regression** — low risk if tiers/modal untouched

### Missing data (summary)

| Data | Status |
|------|--------|
| `organizer_id` on event row | DB ✅ · fetch ❌ |
| Organizer name/avatar | DB ✅ · public access ❌ |
| Venue record | DB ✅ · fetch ❌ |
| Event image | DB ✅ · often null on Reina |

---

## Verdict

| Question | Answer |
|----------|--------|
| **Go / Hold** | **GO** — after **host data access decision** (≤1 migration or RPC, no new tables) |
| **Safe to start SAN-492?** | **No** |
| **Next task** | SAN-135 Phase A implementation |
| **Branch** | `ai/san-135-aie-024-mvp-luma-event-detail-layout-evp-032` from `main` @ `0baeda7+` |

### Recommended kickoff sequence

```text
1. Linear: SAN-135 → Todo or In Progress (fix stale In Review)
2. Decide host data path (RLS vs RPC vs details JSON) — document in PR
3. Branch from main
4. Extend getPublicEvent + types
5. EventHostBlock + section reorder + venue section
6. Vitest + SCREEN-014 + browser evidence
7. PR → merge → changelog → gate audit → SAN-492
```

---

## Post-merge context

| Task | Status |
|------|--------|
| SAN-731 | ✅ Merged `0baeda7` |
| SAN-135 | 🔴 Phase A verified — ready to implement |
| SAN-492 | ❌ Hold until Phase A gate closes |
