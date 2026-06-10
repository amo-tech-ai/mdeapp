# SAN-135 · Option C — Host data verification

**Date:** 2026-06-08  
**Decision:** **Option C** — denormalize host display into `events.details` at publish + backfill  
**Linear:** SAN-135 · AIE-024 · EVP-032  
**Gate:** SAN-731 merged (`0baeda7`) · SAN-492 **HOLD**

---

## Task 1 — Host data verification (Supabase MCP)

**Project:** `zkwcbyxiwklihegjhuql` · probe via `execute_sql`

### `events` table — what exists today

| Field | Column / path | Present | Public fetch (`getPublicEvent`) |
|-------|---------------|:-------:|:-------------------------------:|
| Organizer FK | `organizer_id` | ✅ | ❌ not selected |
| Host display name | `organizer_name` column | ❌ | ❌ |
| Host avatar | `organizer_avatar_url` column | ❌ | ❌ |
| Host in JSON | `details.host_display` | ❌ | ❌ |
| Venue FK | `venue_id` | ✅ | ❌ not joined |
| Inline address | `address`, `city` | ✅ | ✅ |

### Live row — `reina-de-antioquia-2026-finals`

| Field | Value |
|-------|-------|
| `organizer_id` | `550e8400-e29b-41d4-a716-446655440005` |
| `details` | `{}` (empty — **no host display**) |
| `venue_id` | `11111111-1111-1111-1111-000000000001` |
| Profile (service join only) | `full_name`: Ana Martinez · `avatar_url`: ui-avatars URL |

**Anon page cannot join `profiles`** — RLS = own profile only. Confirmed: host data is **not** on the event row today.

### Slug events sample (10 published with slug)

All have `organizer_id` set; all have `details: {}`. **Zero** events carry `host_display` today.

### Venue join (ready without host path)

`event_venues` row for Reina:

| name | address | city |
|------|---------|------|
| Hotel Intercontinental — Salón Real | Calle 16 #28-51, El Poblado | Medellín |

Public RLS on `event_venues` — join via `events.venue_id` is safe for Phase A venue block.

---

## Option C — minimal schema enhancement

**No new tables. No public profile RLS. No SECURITY DEFINER RPC.**

### Storage shape (existing `events.details` JSONB)

```json
{
  "host_display": {
    "name": "Ana Martinez",
    "avatar_url": "https://ui-avatars.com/api/?name=Ana+Martinez&..."
  },
  "neighborhood": "...",
  "capacity": 80,
  "ticket_tiers": []
}
```

### Required slices (not SAN-492)

| Slice | Action |
|-------|--------|
| **Migration backfill** | `UPDATE events … FROM profiles` for published/live rows with `organizer_id` and missing `details.host_display` |
| **Publish path** | `buildEventInsert` + `approval-commit` — snapshot `host_display` from authenticated user's profile at publish |
| **Read path** | `getPublicEvent` — select `details`, `venue_id`; parse `host_display`; join `event_venues` |
| **Types** | `PublicEventDetail.host?: { name: string; avatarUrl: string \| null }` |

**Why not new columns:** `details` already used by host wizard; zero DDL; anon read stays on `events` public SELECT policy only.

---

## Files to change

| File | Change |
|------|--------|
| `supabase/migrations/YYYYMMDD_backfill_event_host_display.sql` | Backfill `details.host_display` from profiles |
| `supabase/functions/approval-commit/build-event-insert.ts` | Accept + nest `hostDisplay` in `details` |
| `supabase/functions/approval-commit/index.ts` | Pass profile name/avatar into builder at publish |
| `src/lib/events/types.ts` | `host`, `venue` optional sub-objects |
| `src/lib/events/get-public-event.ts` | Select `details`, `venue_id`; join venue; map host |
| `src/components/events/event-host-block.tsx` | **NEW** — Avatar + "Hosted by" |
| `src/components/events/event-venue-section.tsx` | **NEW** — venue name/address |
| `src/components/events/event-detail-view.tsx` | Section reorder (hero → summary → host → about → tickets → venue) |
| `src/app/events/[slug]/loading.tsx` | Optional host/venue skeleton bars |
| `src/components/events/__tests__/event-host-block.test.tsx` | **NEW** |
| `src/lib/events/__tests__/get-public-event.test.ts` | **NEW** or extend — host_display parse |
| `e2e/screens/SCREEN-014-event-detail.spec.ts` | Host block + DOM order |
| `src/__tests__/build-event-insert.test.ts` | Assert `details.host_display` when provided |

**Do not touch:** checkout modal · ticket tiers · agents · SAN-492 schema · profiles RLS

---

## UI order (Phase A)

```text
Hero
↓ Event Summary (title · schedule · location line)
↓ Host Block
↓ About (description)
↓ Tickets (desktop sticky column unchanged)
↓ Venue section
↓ Sticky Buy Bar (mobile)
```

---

## Readiness score (Option C locked)

| Area | Before | After Option C |
|------|-------:|---------------:|
| Spec clarity | 88 | 88 |
| Existing data | 58 | **85** (FK + venue join; backfill fills gap) |
| Security | 75 | **92** (no profile exposure) |
| Layout complexity | 78 | 78 |
| Testing readiness | 82 | 82 |
| Implementation readiness | 78 | **91** |

| Metric | Value |
|--------|------:|
| **Readiness /100** | **91** |
| **Success rate (est.)** | **92%** |

### Residual risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Backfill misses events without profile | 🟡 | Migration WHERE organizer_id IS NOT NULL; hide host block if no name |
| Future publishes without snapshot | 🟡 | Wire `approval-commit` in same PR |
| Reina seed no hero image | 🟢 | SAN-731 placeholder OK |
| Scope creep (ai_summary column exists) | 🟡 | Do not select/render |

---

## Verdict

| Question | Answer |
|----------|--------|
| **Host data on event today?** | **Partial** — `organizer_id` ✅ · display fields ❌ |
| **Minimal addition?** | `details.host_display` + backfill + publish snapshot |
| **GO / HOLD** | 🟢 **GO** |
| **SAN-492** | ❌ **HOLD** until SAN-135 merged + gate audit |

---

## Proof required (implementation)

- [ ] Vitest — host block, fallback avatar, venue empty state
- [ ] Playwright SCREEN-014 — desktop + mobile, host visible, checkout green
- [ ] Browser MCP — localhost + mobile screenshots
- [ ] Evidence `SAN-135-RESULTS.md`
- [ ] Changelog row
- [ ] `task-verifier` post-ship 100% Phase A AC
