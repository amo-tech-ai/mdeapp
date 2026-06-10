STEP 1 — PROJECT + SUPABASE FOUNDATION AUDIT

Review the current mdeai Supabase architecture and determine:
- what already exists
- what is partially implemented
- what is missing
- what should be CORE vs MVP vs ADVANCED

Inspect:
- supabase/migrations/
- supabase/functions/
- src/lib/supabase*
- src/mastra/
- app/api/
- tasks/
- plan/
- docs/

Read product context first:
- MVP-SCOPE.md
- prd-event-contest.md
- real-estate-prd.md
- plan.md
- INDEX.md
- event-features-improvements-matrix.md

Core rules:
- Supabase owns deterministic truth
- Stripe owns money
- AI proposes only
- OpenClaw never directly mutates truth
- Webhooks are the source of payment truth
- All sensitive writes require approval or deterministic validation

Output:
1. Current architecture summary
2. Current readiness score /100
3. Existing tables inventory
4. Existing edge functions inventory
5. Existing RLS coverage
6. Existing realtime usage
7. Existing AI/agent infrastructure
8. Major risks
9. Missing core foundations
10. Recommended architecture direction

Do not modify files yet.
Audit only.


STEP 2 — EVENTS + BOOKINGS DATABASE REVIEW

Review all event-related database architecture.

Verify or suggest:
- events
- event_categories
- event_hosts
- event_venues
- event_tickets
- event_orders
- event_attendees
- event_checkins
- event_staff
- event_media
- event_qa
- event_chat
- event_notifications
- event_waitlists
- event_reviews
- event_analytics

Review:
- Stripe checkout flow
- webhook idempotency
- QR validation
- attendee status lifecycle
- refunds
- ticket transfer support
- sponsor relationships
- WhatsApp reminders
- audit logs

For each table:
- purpose
- columns
- indexes
- foreign keys
- RLS policies
- triggers
- realtime requirements
- edge functions needed

Output:
1. Existing event tables
2. Missing event tables
3. Missing columns
4. Missing indexes
5. Missing policies
6. Missing edge functions
7. MVP-required event architecture
8. ADVANCED event architecture
9. Recommended migration order


STEP 3 — VENUES + GOOGLE MAPS + ADK REVIEW

Review venue and geo architecture.

Verify or suggest:
- venues
- venue_photos
- venue_amenities
- venue_categories
- neighborhoods
- places_cache
- place_details_cache
- route_cache
- grounding_logs
- maps_search_cache
- nearby_recommendations

Check:
- Google place_id usage
- field masks
- caching strategy
- attribution storage
- map pin sync
- advanced markers support
- neighborhood intelligence
- nearby discovery
- safe walking routes
- travel time calculations

Review integration with:
- Google ADK
- Maps Grounding
- Places API New
- Routes API
- Mastra map workflows

Output:
1. Geo architecture score /100
2. Existing geo tables
3. Missing geo tables
4. Missing caches
5. Missing indexes
6. Missing RLS
7. Missing edge functions
8. Cost optimization recommendations
9. Realtime opportunities
10. MVP vs ADVANCED geo roadmap


STEP 4 — REAL ESTATE DATABASE REVIEW

Review real estate architecture.

Verify or suggest:
- apartments
- listings
- listing_embeddings
- landlords
- hosts
- leads
- conversations
- showings
- rental_applications
- bookings
- payments
- landlord_inbox
- market_snapshots
- neighborhood_scores

Check:
- lead routing
- showing workflows
- application lifecycle
- landlord ownership
- listing moderation
- semantic search
- Hermes scoring support
- OpenClaw support
- booking/payment readiness

Output:
1. Existing real estate tables
2. Missing tables
3. Missing columns
4. Missing RLS
5. Missing indexes
6. Missing triggers
7. Missing workflows
8. Required edge functions
9. CORE vs MVP vs ADVANCED breakdown
10. Recommended implementation order


STEP 5 — TRIPS + ITINERARY + SAVED SYSTEM REVIEW

Review trips and itinerary architecture.

Verify or suggest:
- trips
- trip_items
- trip_days
- timeline_events
- conflict_resolutions
- budget_tracking
- saved_places
- collections
- collection_items
- itinerary_suggestions
- trip_bookings

Check:
- trip ownership
- saved collection linking
- itinerary timeline
- conflict detection
- AI suggestions
- booking linkage
- rental linkage
- event linkage
- restaurant linkage
- Mastra thread linkage

Review wireframes and flows:
- trips dashboard
- itinerary planner
- saved collections

Output:
1. Existing trips architecture
2. Missing tables
3. Missing relationships
4. Missing RLS
5. Missing indexes
6. Missing triggers
7. Missing realtime support
8. AI workflow recommendations
9. MVP-ready trip architecture
10. Future Mindtrip-style enhancements


STEP 6 — AI + MASSTRA + COPILOTKIT REVIEW

Review AI orchestration architecture.

Verify or suggest:
- mastra_threads
- mastra_messages
- ai_runs
- ai_tool_calls
- workflow_runs
- approval_requests
- approval_events
- generated_drafts
- memory_records
- recommendation_logs
- moderation_logs

Check:
- human-in-the-loop
- approval gates
- observability
- thread ownership
- audit logging
- replayability
- deterministic writes
- agent boundaries
- memory compression
- tool execution safety

Review:
- Mastra
- CopilotKit
- Google ADK
- OpenClaw orchestration

Output:
1. Current AI architecture
2. Missing AI tables
3. Missing audit systems
4. Missing approval systems
5. Missing observability
6. Missing RLS
7. Missing workflow persistence
8. Security risks
9. Recommended AI database structure
10. Production readiness score


STEP 7 — WHATSAPP + OPENCLAW + AUTOMATION REVIEW

Review automation and messaging architecture.

Verify or suggest:
- automation_jobs
- outreach_drafts
- outreach_campaigns
- approval_queue
- message_batches
- message_events
- suppression_list
- whatsapp_templates
- whatsapp_optins
- delivery_logs
- retry_queue

Check:
- opt-in compliance
- suppression handling
- retry safety
- auditability
- approval gates
- OpenClaw execution boundaries
- WhatsApp templates
- campaign analytics
- delivery tracking
- queue architecture

Output:
1. Existing automation architecture
2. Missing messaging tables
3. Missing queue systems
4. Missing audit systems
5. Missing policies
6. Missing edge functions
7. Compliance risks
8. MVP-safe automation strategy
9. ADVANCED automation roadmap
10. Recommended execution boundaries


STEP 8 — SECURITY + RLS + PRODUCTION HARDENING

Perform full security review.

Check:
- RLS enabled everywhere
- service role leakage
- client-side secrets
- webhook validation
- idempotency
- audit coverage
- ownership enforcement
- realtime exposure
- storage permissions
- signed URLs
- cron security
- edge function auth
- AI approval gates

Output:
1. Security score /100
2. Critical vulnerabilities
3. Missing RLS
4. Dangerous tables
5. Missing indexes affecting security/performance
6. Missing audit trails
7. Missing constraints
8. Production hardening checklist
9. Required fixes before launch
10. Recommended migration priority


STEP 9 — FINAL MASTER PLAN

Create the final master Supabase roadmap.

Generate:
1. Executive summary
2. Final readiness score /100
3. CORE database roadmap
4. MVP database roadmap
5. ADVANCED roadmap
6. Recommended migration batches
7. Recommended edge function batches
8. Recommended realtime channels
9. Recommended pgvector usage
10. Recommended caching strategy
11. Recommended audit strategy
12. Recommended approval architecture
13. Recommended AI workflow architecture
14. Recommended OpenClaw boundaries
15. Recommended Maps architecture
16. Recommended trips architecture
17. Recommended bookings architecture
18. Recommended WhatsApp architecture
19. Recommended Linear tasks
20. IMP-### implementation order

Important:
- Do not overengineer MVP
- Prioritize deterministic truth
- Prioritize approval-gated AI
- Prioritize production safety
- Separate CORE, MVP, ADVANCED clearly
- Identify what can ship now vs later