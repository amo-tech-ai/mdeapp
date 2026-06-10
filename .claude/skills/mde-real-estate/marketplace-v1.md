---
name: real-estate-mdeai
description: "Use whenever work touches mdeai.co's rental marketplace domain — landlord onboarding (V1 wizard at /host/onboarding), listing creation (/host/listings/new), apartments table + RLS, leads + showings + applications + payments (P1 CRM tables), landlord_inbox, neighborhoods (12 Medellín seeded), the 28-table schema in supabase/migrations, the Spanish-first founder outreach playbook (§6 of tasks/plan/06-landlord-v1-30day.md), real-world tests in tasks/RWT, or anything specific to the Medellín rental marketplace. Triggers on terms: 'landlord', 'host', 'apartment', 'listing', 'rental', 'lease', 'showing', 'tour', 'rental application', 'tenant', 'CRM', 'P1 pipeline', 'lead', 'WhatsApp Business', 'wa.me', 'verification badge', 'Founding Beta', 'auto-moderation', 'Medellín', 'Laureles', 'Poblado', 'Provenza', 'Envigado', or any V1 day reference (D1-D30). Use this BEFORE the generic real-estate (Camino AI) skill — that one is for nearby-amenity address evaluation, not for our marketplace logic. Use this BEFORE real-estate-tech — that's V2 MLS/IDX/AVM territory. Do NOT use for: pure-React component work (use frontend-design / shadcn), pure-Supabase migration / RLS work without domain context (use supabase / supabase-postgres-best-practices), generic dev questions about lint/build/tests."
metadata:
  version: "0.1.0"
  scope: "V1 marketplace domain — primary entry point for any mdeai.co rental work"
  installed: 2026-04-29
  origin: "mdeai.co project-tailored umbrella + composes lead-qualifier-agent, property-description-generator, neighborhood-guide-creator, firecrawl-scraper, real-estate-tech (V2), real-estate (Camino AI)"
---

# Real-estate (mdeai.co — Medellín rental marketplace)

The umbrella skill for V1 work. Routes you to the right domain skill depending on what you're touching.

## Routing table — which skill to invoke

| You're working on… | Primary skill | Why |
|---|---|---|
| **Landlord signup / onboarding wizard** (D2-D3) | `real-estate-mdeai` (this) + `better-auth-best-practices` | account_type metadata, qa-landlord QA seed, GoTrue gotchas |
| **Listing creation wizard** (D4-D5) | `real-estate-mdeai` (this) + `shadcn` + `mde-vercel` | 4-step form, Step1Address Google Places, Step3Photos upload, Step4Description |
| **Listing description copywriting** | `property-description-generator` | NextAutomation MLS-ready / social / luxury copywriting framework. Use when generating apartment descriptions from specs |
| **Neighborhood content** (`/neighborhoods/:slug`, `/hosts/:id` blurbs) | `neighborhood-guide-creator` | Lifestyle storytelling + practical data, fits the 12 seeded Medellín neighborhoods |
| **Lead scoring / qualification** (post-D8 inbox triage) | `lead-qualifier-agent` | BANT-R framework — pairs with the `landlord_inbox.structured_profile` jsonb |
| **Renter "is this place near a school / grocery?"** queries | `real-estate` (Camino AI) | Address-level location intelligence; NOT for our marketplace state |
| **MLS / IDX / RETS / AVM / multi-source** (V2+) | `real-estate-tech` | Dormant for V1 — invoke when scaling beyond manual single-listing |
| **Listing photo extraction from external URL** | `firecrawl-scraper` | Zillow / Realtor.com / Airbnb / Booking.com → structured listing data |
| **Database / RLS / migrations** | `supabase` + `supabase-postgres-best-practices` | All schema work. This skill provides domain context only |
| **Edge functions** (p1-crm, listing-create, send-host-email, lead-classify, verification-submit) | `supabase-edge-functions` | Use the `_shared/http.ts` template + Zod |

## V1 domain map

### 28+ tables (live in Supabase, project zkwcbyxiwklihegjhuql)

```
Core marketplace ─── apartments (43 seeded), neighborhoods (12 seeded), profiles (5 seeded)
                     car_rentals, restaurants, events, tourist_destinations

P1 CRM pipeline ─── leads, showings, rental_applications, payments,
                    property_verifications, idempotency_keys

Landlord V1     ─── landlord_profiles, landlord_inbox, landlord_inbox_events,
(D1 schema)         verification_requests, analytics_events_daily

Bookings + saved ── bookings, saved_places, collections, trips, trip_items

AI / agents     ─── conversations, messages, ai_runs, ai_context, agent_jobs,
                    agent_audit_log, proactive_suggestions

WhatsApp        ─── whatsapp_messages, whatsapp_conversations (D8+)

System          ─── notifications, user_roles, rate_limit_hits, outbound_clicks,
                    rental_search_sessions, rental_listing_*
```

### Storage buckets

```
listing-photos     PUBLIC, 5 MB / image, jpeg/png/webp, path <auth.uid()>/<draftId>/...
identity-docs      PRIVATE, 10 MB / file, +pdf, path <auth.uid()>/...
```

### Edge functions deployed

```
p1-crm                  CRM CRUD (lead/tour/application/payment, atomic + idempotent)
ai-chat                 Multi-agent chat (concierge / trips / explore / bookings)
ai-router               Intent classification (gemini-3.1-flash-lite-preview)
ai-search               Semantic search (deployed, NOT YET called from frontend)
ai-trip-planner         Trip generation (deployed, NOT YET called from frontend)
ai-optimize-route       Route optimization
ai-suggest-collections  Collection suggestions
google-directions       Directions API proxy
rentals                 Rental intake conversation (gemini-3.1-pro-preview)
rules-engine            Business rules (deployed, NOT YET called from frontend)
listing-create          (D5 — written, not yet deployed at time of writing)
```

## V1 cohort goals (plan §1 + §8)

- 10–20 landlords signed up (acceptable–stretch band)
- 25–50 listings live
- 100–200 leads captured
- ≥25 % reply rate on `landlord_inbox` (whatsapp_reply_clicked event)
- median time-to-first-reply < 12 h (acceptable) / < 6 h (stretch)
- ≥3 active landlords logged 3+ days in D22-D30

V1 explicitly does NOT include billing, subscriptions, paid badges, MLS, multi-source scraping, AI auto-reply, or pricing recommendations. See plan §1.2 for the cut list.

## V1 plan reference

Always anchor work to `tasks/plan/06-landlord-v1-30day.md`. Key sections:

- §1 Scope (in / not in V1)
- §2 Database (6 tables, RLS pattern, triggers)
- §3 Edge functions (6 only)
- §4 Frontend pages (9)
- §5 Day-by-day (D1-D30) — current day governs scope
- §5.0 Skills atlas — which skill to invoke per task type
- §6 Founder growth playbook (Spanish-first WhatsApp scripts)
- §7 Metrics + PostHog event taxonomy (12 events)
- §8 Success criteria (acceptable / stretch bands + kill criteria)
- §13 Per-day testing block

## Key files (V1 frontend)

```
src/pages/Signup.tsx                                        D2 — AccountTypeStep gate
src/components/auth/AccountTypeStep.tsx                     D2
src/pages/host/Onboarding.tsx                               D3 — 3-step wizard
src/components/host/onboarding/Step{1Basics,2Verification,3Welcome}.tsx
src/pages/host/ListingNew.tsx                               D4 — 4-step wizard
src/components/host/listing/ListingForm/Step{1Address,2Specs,3Photos,4Description}.tsx
src/hooks/host/{useLandlordOnboarding,useListingDraft}.ts
src/lib/storage/upload-listing-photo.ts
```

## Founder outreach (D22-D30 sales playbook)

See plan §6 for the 5 channels, ICP, anti-ICP, scripts (A/B/C/D in Spanish), and tracking spreadsheet schema. Goal: 70 outreach attempts → 8 replies → 3 signups → 20 landlords over 9 days.

When the user mentions "outreach", "broker DM", "Facebook group post", "building walk", "referral", or "founder cohort" — invoke the `content-creation` skill alongside this one for Spanish copy refinement.

## Companion / nested skills

| Skill | When |
|---|---|
| `lead-qualifier-agent` | When triaging `landlord_inbox` rows (post-D8) |
| `property-description-generator` | When writing apartment descriptions or fields with copy needs |
| `neighborhood-guide-creator` | When seeding `/neighborhoods/:slug` content (V2 SEO) |
| `firecrawl-scraper` | When importing a listing from Airbnb/Booking.com/Zillow URL |
| `real-estate-tech` | V2 only — MLS / IDX / PostGIS clustering / AVM |
| `real-estate` (Camino AI) | Address-level nearby-amenity queries (separate concern) |
