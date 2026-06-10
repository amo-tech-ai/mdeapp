> **Tasks:** [EVP-018-mvp-event-web-discovery-task-pack.md](EVP-018-mvp-event-web-discovery-task-pack.md) (EVT-D01–D11) · Architecture: [F41](../EVP-017-mvp-event-grounding-architecture.md)

You are a senior product architect, Cursor AI engineer, CopilotKit expert, Mastra workflow architect, Google ADK specialist, Supabase engineer, Google Maps Platform specialist, OpenClaw automation architect, and production QA auditor.

Goal:
Create future implementation tasks for adding comprehensive web search and discovery for Medellín events, contests, venues, restaurants, tours, and local experiences.

This is FUTURE work, not MVP scope.

Project:
- App path: /home/sk/mdeai/mdeapp
- Legacy reference only: /home/sk/mde
- Current stack:
  - CopilotKit
  - Mastra
  - Next.js
  - Supabase
  - Google Maps / Places
  - Gemini
  - Google ADK
  - Google Search Grounding
  - Maps Grounding Lite
  - OpenClaw later
  - Stripe for deterministic payments
  - shadcn/ui
  - Playwright
  - Chrome DevTools MCP

Core rule:
Supabase owns truth.
Mastra owns orchestration.
CopilotKit owns UI.
Google Search Grounding discovers fresh web info.
Google Maps / Places owns geo facts.
ADK orchestrates Google tools.
OpenClaw automates only after approval.
Stripe owns money.
AI proposes. Humans approve. Supabase writes.

Hard rules:
1. Do not implement yet.
2. Create task specs only.
3. Do not modify production data.
4. Do not expose secrets.
5. Do not run npm audit fix --force.
6. Do not make web search the source of truth.
7. Do not let AI mutate money, tickets, orders, approvals, or inventory directly.
8. Do not use OpenClaw in MVP.
9. Do not add agent sprawl.
10. Use official docs and MCP tools before finalizing tasks.

Feature to plan:
Comprehensive web discovery for:
- events
- contests
- concerts
- football games
- nightlife
- festivals
- food events
- tours
- venues
- pageants
- cultural activities
- restaurants
- local experiences

Main user journey:
User asks:
“What is happening in Medellín tonight?”
or
“Find contests and events this weekend near Laureles.”

System should:
1. Search approved Supabase events first
2. Use Google Search Grounding for fresh web results
3. Use Google Maps / Places for venue facts
4. Normalize and dedupe results
5. Score results by freshness, confidence, source quality, distance, category, and user intent
6. Show CopilotKit event cards
7. Show map pins
8. Show source/citation/attribution
9. Let user save, share, or buy ticket if supported
10. Require human approval before saving discovered events into Supabase

Task requirements:

Create a future task pack with task IDs, ordered dependencies, acceptance criteria, tests, and evidence requirements.

Include these tasks:

A. Research + official docs task
- Read official docs:
  - CopilotKit
  - Mastra agents/workflows/tools
  - Google ADK
  - Google Search Grounding
  - Maps Grounding Lite
  - Google Places API New
  - vis.gl react-google-maps
  - OpenClaw docs
  - Supabase Edge Functions
- Use MCP official docs where available
- Produce verified implementation notes
- List exact APIs and constraints

B. Data model task
Design tables for:
- discovered_events
- discovered_event_sources
- event_source_snapshots
- event_dedupe_matches
- event_discovery_runs
- event_approval_queue
- venue_candidates
- search_queries
- source_confidence_scores

Define:
- columns
- indexes
- RLS policies
- unique constraints
- freshness TTL
- approval status lifecycle
- audit logging
- source URL storage
- citation storage

C. Mastra workflow task
Create workflow:
eventDiscoveryWorkflow

Steps:
1. classify intent
2. search Supabase events
3. decide if web grounding is needed
4. call ADK SearchAgent
5. call MapsAgent / Places enrichment
6. normalize results
7. dedupe events
8. score/rank
9. return cards + pins
10. optionally propose save-to-Supabase approval

D. ADK sidecar task
Plan:
- SearchAgent for Google Search Grounding
- MapsAgent for Maps Grounding Lite
- strict JSON response contract
- timeout handling
- error handling
- source citations
- no direct DB writes
- no direct user writes
- no payments
- Zod validation in Mastra after response

E. Google Search Grounding task
Plan how to search:
- “Medellín events tonight”
- “Medellín concerts this weekend”
- “Medellín contests pageants”
- “Laureles events tonight”
- “El Poblado nightlife events”
- “football Medellín schedule”
- “food festival Medellín”
- “tours Medellín this weekend”

Define:
- query templates
- freshness windows
- source allowlist
- source blocklist
- citation requirements
- confidence scoring
- fallback behavior
- language handling EN/ES

F. Google Maps / Places enrichment task
For each discovered event:
- resolve venue
- get place_id
- get googleMapsLinks.placeUri if available
- get lat/lng
- get address
- get rating
- get photos if allowed
- get opening hours if relevant
- calculate distance from user area
- create map pin

Use field masks.
Never expose server-side Google keys to client.

G. CopilotKit frontend task
Render:
- EventDiscoveryCard
- ContestDiscoveryCard
- VenueCard
- GroundingAttribution
- SourceConfidenceBadge
- SaveEventApprovalPanel
- Map pins
- Follow-up chips

Frontend behavior:
- cards in center chat
- map on right column
- mobile map bottom sheet
- source links visible
- confidence warning if low
- “Save to mdeai” requires approval

H. OpenClaw future automation task
Plan only, do not implement.

Use OpenClaw later for:
- daily event source checks
- organizer contact discovery
- screenshot evidence
- outreach drafts
- WhatsApp follow-up drafts
- stale event detection

Rules:
- OpenClaw cannot publish events automatically
- OpenClaw cannot buy tickets
- OpenClaw cannot change Stripe/payment data
- OpenClaw cannot write approved events without human approval
- every automation needs audit row

I. Human approval task
Design approval flow:
- AI proposes discovered event
- user/admin reviews
- edit fields
- approve/reject
- approved event writes to Supabase
- rejected event stores reason
- audit log created

J. Testing task
Create test plan:
- unit tests
- workflow tests
- mock ADK responses
- grounding failure tests
- dedupe tests
- RLS tests
- source confidence tests
- Playwright UI tests
- Chrome DevTools MCP visual tests
- localhost smoke tests
- mobile tests

K. Production readiness task
Checklist:
- no secret exposure
- timeout handling
- rate limits
- quotas
- observability
- ai_runs logging
- event_discovery_runs logging
- source citations
- attribution compliance
- graceful fallback
- cache TTL
- rollback plan
- feature flag
- cost monitoring

Mermaid diagrams required:

1. Overall architecture
2. Event discovery workflow
3. ADK grounding flow
4. Data model ERD
5. Approval save flow
6. Frontend render flow
7. Mobile UX flow
8. OpenClaw future automation flow

For each task include:

- task ID
- title
- purpose
- problem it solves
- user story
- dependencies
- files likely touched
- frontend work
- backend work
- data work
- agents/workflows
- automations
- MCP/docs required
- implementation steps
- acceptance criteria
- tests
- localhost verification
- Chrome DevTools MCP verification
- Playwright verification
- evidence required
- risks
- rollback plan
- score impact /100

Success criteria:
The task pack is complete only if:
- tasks are ordered correctly
- no MVP contamination
- no source-of-truth violation
- no OpenClaw premature execution
- Supabase remains truth
- Google grounding is enrichment only
- all writes require approval
- frontend/backend wiring is clear
- tests are specific
- diagrams are included
- production checklist exists
- tasks can be implemented by Cursor without guessing

Final output:
1. Executive summary
2. Recommended phase placement
3. Full task list table
4. Mermaid diagrams
5. Data model proposal
6. Agent/workflow plan
7. Frontend plan
8. Backend plan
9. OpenClaw future plan
10. Test plan
11. Localhost visual QA plan
12. Production readiness checklist
13. Risks and blockers
14. Final scorecard
15. Exact next 10 implementation tasks after MVP

Be direct.
Use tables.
Be specific.
Do not give generic architecture advice.
Do not implement code yet.
