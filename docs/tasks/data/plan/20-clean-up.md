---
title: mdeapp canonical schema — decided & applied
date: 2026-05-24
status: applied
migration: supabase/migrations/20260524022749_mdeapp_canonical_schema_cleanup.sql
project: zkwcbyxiwklihegjhuql
---

# 20 — Canonical schema (mdeapp only)

**Decision made and applied live.**  
114 public tables → **73** after cleanup → **99** after post-MVP restores (+ PostGIS views + `vote.*` schema unchanged).

```text
Browser → /api/copilotkit → Mastra → Gemini + ADK → Postgres
```

No legacy chat. No duplicate rental table. No old agent job queue.

---

## What we KEEP (73 tables)

### MVP — use these in mdeapp

| Domain | Tables |
|--------|--------|
| **Auth** | `profiles`, `user_roles`, `user_preferences` |
| **Rentals** | `apartments`, `neighborhoods`, `listing_embeddings` |
| **Leads** | `leads`, `rate_limit_hits` |
| **Events** | `events`, `event_venues`, `event_tickets`, `event_orders`, `event_order_refunds`, `event_attendees`, `event_check_ins`, `event_attendee_profiles`, `event_media_assets`, `event_promo_codes`, `event_stakeholders`, `event_taxes_and_fees`, `event_ticket_taxes_and_fees`, `event_wait_list`, `event_vendors`, `event_embeddings` |
| **HITL** | `approval_requests`, `approval_decisions` |
| **Food + tourism** | `restaurants`, `restaurant_embeddings`, `tourist_destinations` |
| **Maps** | `places_search_cache`, `place_details_cache`, `grounding_quota_log` |
| **AI audit** | `ai_runs` |
| **Mastra** | all `mastra_*` (28 tables incl. `mastra_workflow_snapshot`) |
| **Tickets infra** | `idempotency_keys` |
| **Payments (legacy rows, W9 uses event_orders)** | `payments` |

### Ops — keep, low priority

| Tables | Notes |
|--------|-------|
| `notifications`, `email_outbox`, `outbox`, `delivery_receipts`, `suppression_list` | Empty or tiny — email/ops pipeline |
| `spatial_ref_sys` | PostGIS system table |

### Not in `public` (unchanged)

| Schema | Tables | When |
|--------|--------|------|
| `vote.*` | 10 contest tables | Phase 3 only — drop separately if contests cancelled |

---

## What we REMOVED (41 tables) — 2026-05-24

| Group | Dropped tables | Why |
|-------|----------------|-----|
| **Duplicate rental** | `rentals` | Empty; mdeapp uses **`apartments`** |
| **Old agent queue** | `agent_jobs`, `agent_runs`, `agent_tool_calls`, `agent_errors`, `agent_budgets`, `agent_approvals`, `agent_audit_log` | Replaced by **`mastra_*` + `ai_runs`** |
| **Old edge chat** | `conversations`, `messages`, `ai_context`, `chat_events` | Replaced by **`mastra_messages`** |
| **Trip planner** | ~~dropped~~ → **restored 2026-05-24** | `trips`, `trip_items`, `collections`, `budget_tracking`, `conflict_resolutions`, `proactive_suggestions` + FKs on `saved_places`/`bookings` |
| **Other verticals** | `car_rentals` | Not Phase 1 |
| **Landlord marketplace** | ~~dropped~~ → **restored 2026-05-24** | See post-MVP restore below |
| **Sponsor stubs** | ~~dropped~~ → **restored 2026-05-24** | `event_sponsors`, `event_sponsor_placements` |
| **WhatsApp stubs** | ~~dropped~~ → **restored 2026-05-24** | Phase 4 schema kept |
| **Concierge / bookings** | ~~`saved_places`, `bookings`~~ → **restored 2026-05-24** | FKs to `trips`/`collections` re-wired |
| **Misc** | `posts_outbox`, `outbound_clicks` | Legacy ops — still dropped |

**Column drops on kept tables:** `ai_runs.conversation_id`, `leads.conversation_id`  
**Data cleared:** `apartments.landlord_id` set NULL (FK to dropped landlord table)

---

## One table name to remember

| ✅ Correct | ❌ Wrong |
|-----------|---------|
| `apartments` | ~~`rentals`~~ dropped |
| `mastra_messages` | ~~`messages`~~ dropped |
| `mastra_workflow_snapshot` | ~~`mastra_workflow_snapshots`~~ never existed |

---

## Edge functions — still to clean (not DB)

38 live → MVP needs **~5**. Delete legacy edges separately (`tasks/data/17-edge-audit.md` Phase B).  
**Do not** restore AI chat edges.

---

## Post-MVP rental tables — **restored** (2026-05-24)

You were right: if we need them for post-MVP, we should **keep the schema** even when MVP doesn't query it.

| Table | MVP reads? | Status |
|-------|------------|--------|
| `rental_applications` | No | ✅ Restored — RE apply wizard |
| `rental_freshness_log` | No | ✅ Restored — scrape/enrichment jobs |
| `rental_listing_images` | No | ✅ Restored — multi-image CDN |
| `rental_listing_sources` | No | ✅ Restored — import registry |
| `rental_search_sessions` | No | ✅ Restored — search analytics |
| `showings` | No | ✅ Restored — scheduler E2E |

Migration: `20260524130000_restore_rental_post_mvp_tables.sql`

## Post-MVP landlord / concierge / sponsor / WhatsApp — **restored** (2026-05-24)

| Object | Post-MVP use | Status |
|--------|--------------|--------|
| `landlord_profiles` | Landlord identity | ✅ Restored (schema only — 3 rows lost) |
| `landlord_inbox` | Host lead replies | ✅ Restored (schema only — 47 rows lost) |
| `landlord_inbox_events` | Inbox audit | ✅ Restored |
| `landlord_profiles_public` (view) | Public landlord card | ✅ Restored |
| `landlord_response_metrics` (view) | SLA metrics | ✅ Restored |
| `verification_requests` | Landlord KYC | ✅ Restored |
| `property_verifications` | Listing badges | ✅ Restored (schema only — 31 rows lost) |
| `analytics_events_daily` | Landlord cohort SQL | ✅ Restored |
| `saved_places` | Concierge favorites | ✅ Restored |
| `bookings` | Phase 5 rental checkout | ✅ Restored (schema only — 4 rows lost) |
| `event_sponsors` / `event_sponsor_placements` | Events ↔ sponsor bridge | ✅ Restored |
| `whatsapp_*` + `wa_outbox` | Phase 4 WhatsApp | ✅ Restored |

Live migrations: `restore_post_mvp_landlord_stack`, `restore_post_mvp_verification_analytics`, `restore_post_mvp_saved_places_bookings`, `restore_post_mvp_sponsor_whatsapp`

Local file: `supabase/migrations/20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql`

**Intentionally not restored:** `leads.conversation_id` (conversations dropped); `trips`/`collections` FKs; pre-drop row data (needs backup restore if required).

**Re-wired:** `apartments.landlord_id` FK → `landlord_profiles` (values still NULL from cleanup).

## Trip planner — **restored** (2026-05-24)

| Table | Post-MVP use | Status |
|-------|--------------|--------|
| `trips` | Trip containers | ✅ Restored |
| `trip_items` | Itinerary items (polymorphic) | ✅ Restored |
| `collections` | Saved-place folders | ✅ Restored |
| `budget_tracking` | Per-trip budget | ✅ Restored |
| `conflict_resolutions` | Schedule conflict engine | ✅ Restored |
| `proactive_suggestions` | AI nudges | ✅ Restored |

Migration: `restore_post_mvp_trip_planner` · local: `20260524150000_restore_post_mvp_trip_planner.sql`

FKs re-added: `saved_places.trip_id`, `saved_places.collection_id`, `bookings.trip_id` → `trips`/`collections`. `update_collection_count` trigger on `saved_places`.

**Correct cleanup rule going forward:**

| Action | When |
|--------|------|
| **DROP** | True duplicate (`rentals` vs `apartments`), dead product (old edge chat), empty stub with no roadmap owner |
| **KEEP empty** | Post-MVP table with a named task in PRD (RE-013+, OpenClaw ingest, etc.) |
| **MVP reads** | Only `apartments` + `leads` + `mastra_*` today |

---

## Optional next drops (not done yet)

| Target | When |
|--------|------|
| `vote.*` schema (10 tables) | If contests stay cancelled |
| `payments` (3 legacy P1 rows) | After confirming W9 uses only `event_orders` |
| `event_vendors` | If Roberto wizard never uses vendor booths |
| Orphan Postgres functions (`realtime_broadcast_messages`, `cleanup_expired_agent_jobs`, …) | Hygiene migration — no runtime impact |

---

## Verify

```bash
cd /home/sk/mdeai
supabase migration list   # 20260524022749 applied local + remote
```

```sql
-- expect 99 (after post-MVP + trip planner restores)
SELECT count(*) FROM pg_tables WHERE schemaname = 'public';
```

```bash
rg "from\(['\"]rentals['\"]|conversations|agent_runs" mdeapp/src   # expect 0
```

---

**Related:** [`19-product-schema-roadmap-audit.md`](./19-product-schema-roadmap-audit.md) · [`data-plan.md`](./data-plan.md)


You’re right to narrow the rule to: **drop only duplicates + zero-purpose tables.** Here’s what the cleanup migration removed, split by whether that was justified.

## Already put back ✅

| Table | Post-MVP use |
|-------|----------------|
| `rental_applications` | Apply wizard |
| `rental_freshness_log` | Scrape/stale checks |
| `rental_listing_images` | Multi-image CDN |
| `rental_listing_sources` | Import registry |
| `rental_search_sessions` | Search analytics |
| `showings` | Viewing scheduler |

---

## Still removed — **OK to stay dropped** (duplicate or dead)

| Table | Why it’s fine gone |
|-------|-------------------|
| **`rentals`** | Empty duplicate of **`apartments`** |
| **`agent_*`** (7) | Empty; replaced by **`mastra_*` + `ai_runs`** |
| **`conversations` / `messages` / `ai_context` / `chat_events`** | Legacy edge chat → **`mastra_messages`** |
| **`car_rentals`** | Different vertical, not in mdeapp plan |
| **`posts_outbox`** | Postiz legacy |
| **`outbound_clicks`** | Old affiliate click log (0 rows) |

---

## Summary

Post-MVP restores complete (2026-05-24). **99 `public` tables** — MVP still reads only `apartments`, `leads`, `mastra_*`; trip planner schema ready for concierge W6+.