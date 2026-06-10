You are a senior product architect and forensic software auditor.

Create a complete PRD + roadmap for the mdeai Trips Management System.

Goal:
Design the trips system for mdeai without overbuilding. Focus on CORE + MVP first, then clearly separate ADVANCED features.

Read and inspect:
- tasks/screens/012-scr-trips-dashboard.md
- tasks/wireframes/012-wire-trips-dashboard.md
- tasks/wireframes/012-wire-trip-workspace.md
- tasks/screens/013-scr-itinerary-panel.md
- tasks/wireframes/013-wire-itinerary-planner.md
- tasks/screens/014-scr-saved-collections-page.md
- tasks/wireframes/014-wire-saved-collections.md
- booking checkout and bookings inbox wireframes
- Supabase migrations and current schema
- Mastra/CopilotKit app structure
- Google Maps / ADK / Places integration docs in repo

Important rules:

- MVP uses existing `trips`, `trip_items`, `saved_places`, `collections`, `bookings`, `event_orders`, `showings`.

- Group itinerary by `trip_items.start_at` first.
- Supabase owns truth.
- Mastra orchestrates.
- CopilotKit renders assistant UI and approval cards.
- Google ADK + Maps provide geo intelligence.
- Gemini drafts/summarizes only.
- OpenClaw and WhatsApp are advanced and approval-gated.

Create:

1. Executive summary
   - What the trips system is
   - Why it matters
   - How it helps Camila, Andrés, Roberto, and Tourist users

2. Core user stories
   - Camila creates “Move to Laureles”
   - Camila saves apartments/events/restaurants
   - Camila adds ticket + viewing to itinerary
   - Camila sees conflicts
   - Camila opens map pins for trip items
   - User returns later and continues trip-scoped chat

3. Required screens
   - `/trips` Trips Dashboard
   - `/trips/[id]` Trip Workspace
   - Itinerary tab
   - Map tab
   - Ideas tab
   - Bookings tab
   - Saved collections page `/saved`
   - Create trip modal
   - Add to trip modal
   - Conflict resolution UI
   - Empty states
   - Mobile layouts

4. Feature matrix
   For each feature, classify:
   - CORE
   - MVP
   - POST-MVP
   - ADVANCED

5. Supabase data requirements
   Review existing tables and recommend only necessary changes:
   - trips
   - trip_items
   - saved_places
   - collections
   - bookings
   - event_orders
   - showings
   - budget_tracking
   - conflict_resolutions
   - mastra_threads.trip_id if needed

   For each:
   - purpose
   - required columns
   - indexes
   - RLS policies
   - foreign keys
   - triggers
   - realtime needs
   - missing gaps

6. Data model rules
   - trip_items must support polymorphic items:
     rental, event, restaurant, attraction, booking, showing, custom_note
   - trip_items should support:
     title, item_type, source_id, start_at, end_at, lat, lng, status, metadata
   - user ownership must be enforced through trips.user_id
   - no user can read another user's trips

7. Mastra agents/workflows
   Design:
   - conciergeAgent with trip tools for MVP
   - logical conflict module
   - logical saved/promote module
   - read-only recommendation module
   Do not create timelineAgent, memoryAgent, or recommendationAgent for MVP unless the audit proves conciergeAgent has outgrown the tool surface.

   For each:
   - responsibility
   - tools
   - allowed writes
   - forbidden actions
   - approval requirements

8. CopilotKit integration
   Define:
   - trip-scoped chat
   - generative trip cards
   - add-to-trip action
   - itinerary conflict card
   - booking confirmation card
   - saved collection card
   - human approval cards

9. Google ADK + Maps integration
   Define:
   - route suggestions
   - travel time estimates
   - nearby recommendations
   - map pins
   - place details
   - Places cache
   - source attribution
   - route cache if needed later

10. Gemini tools
   Define how Gemini helps:
   - summarize trip
   - suggest itinerary
   - detect conflicts
   - explain neighborhoods
   - draft WhatsApp reminders
   - generate “what’s next” suggestions

   Important:
   Gemini must not invent places, prices, tickets, or booking status.

11. OpenClaw + WhatsApp advanced plan
   Define only future-safe usage:
   - WhatsApp trip reminders
   - booking reminders
   - viewing reminders
   - follow-up messages
   - OpenClaw enrichment drafts
   - approval queue before outbound actions
   - opt-in / opt-out / suppression list

12. MVP implementation roadmap
   Create ordered tasks suggest improve
   - TRIP-001 Supabase audit
   - TRIP-002 `/trips` dashboard
   - TRIP-003 create trip modal
   - TRIP-004 `/trips/[id]` workspace shell
   - TRIP-005 itinerary tab using `trip_items`
   - TRIP-006 saved collections integration
   - TRIP-007 add-to-trip from rental/event cards
   - TRIP-008 map pins for trip items
   - TRIP-009 conflict detection
   - TRIP-010 booking confirmation → trip item
   - TRIP-013 booking reconciliation worker
   - TRIP-014 RLS penetration verification
   - TRIP-015 Places cache + hydration
   - TRIP-016 mobile workspace hardening
   - TRIP-017 observability + sync logs
   - TRIP-018 lifecycle states + archival
   - TRIP-019 retry + optimistic UI recovery
   - TRIP-011 Playwright tests
   - TRIP-012 production smoke
 
12. Acceptance criteria
   Include:
   - RLS isolation test
   - `/trips` route works
   - `/trips/[id]` route works
   - saved item can be added to trip
   - event ticket can appear in itinerary
   - rental viewing can appear in itinerary
   - map pins render
   - conflict state appears
   - no user can see another user's trips
   - `npm run floor` passes

14. Risk audit
   Identify:
   - overbuilding risk
   - schema duplication risk
   - Mindtrip clone risk
   - RLS exposure risk
   - AI hallucination risk
   - booking truth risk
   - WhatsApp compliance risk

15. Final output
   Produce:
   - PRD
   - roadmap
   - screen list
   - database gap matrix
   - agent/workflow plan
   - Linear task list in implementation order
   - MVP vs Advanced table
   - recommended files to create/update

Do not modify code yet.
Do not create migrations yet.
First produce the PRD, audit, and roadmap only.
