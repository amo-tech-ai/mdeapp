You are a senior AI product architect, Mastra specialist, CopilotKit specialist, and forensic implementation auditor.

**Canonical plan (read first):** [`links-plan.md`](./links-plan.md) — repo scores, per-task playbooks, v2→v1 translation, build order.

Goal:
Create a practical implementation plan for MDE Events / Venue Booking using proven patterns from Mastra, CopilotKit, and booking/travel repos.

Focus tasks:

1. SAN-494 · EVT-035 — Restaurant Card Event Venue CTA
2. SAN-495 · EVT-036 — Event Offerings Detail Panel
3. SAN-496 · EVT-037 — Request Proposal Modal (HITL)
4. SAN-497 · EVT-038 — Search/rank tools + venueShortlistWorkflow
5. SAN-498 · EVT-039 — AI Venue Match Score Panel
6. SAN-501 · EVT-042 — eventVenueBookingWorkflow
7. SAN-502 · EVT-043 — Patricia Admin Queue

Reference repos and docs:

1. CopilotKit Showcases
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases

2. CopilotKit A2A Travel
https://github.com/CopilotKit/CopilotKit/tree/main/examples/showcases/a2a-travel

3. Mastra main repo
https://github.com/mastra-ai/mastra

4. Mastra Travel AI blog
https://mastra.ai/blog/travel-ai

5. Mastra HITL approval guide
https://mastra.ai/blog/human-in-the-loop-when-to-use-agent-approval

6. Mastra templates
https://mastra.ai/blog/templates

7. Mastravel — 🔴 SKIP (not Mastra code; README template only)
https://github.com/vishal777-git/mastravel

8. Mastra Hotel Booking Agent
https://github.com/Calinemesef/mastra-hotel-booking-ai-agent

9. Hotel Booking Assistant — Mastra + Gemini — 🔴 SKIP for EVT (lookup only, not offerings catalog)
https://github.com/KishorNaik/Sol_Basic_Hotel_Booking_Assistant_Mastra_AI_Google_Gemini

10. Southwest Flight Booking
https://github.com/leporejoseph/southwest-flight-booking

11. Guest Booking Assistant — Layercode + Mastra
https://github.com/jackbridger/guest-booking-assistant-layercode-mastra

12. Mastra Meeting Assistant
https://github.com/dgalarza/mastra-meeting-assistant

13. Mastra Location Agent — 🔴 SKIP (IP geo; wrong domain for restaurant cards)
https://github.com/ashenghm/mastra-location-agent

14. Mastra Travel App
https://github.com/PedrooJ/mastra-travel-app

15. TanStack Start + Mastra Example
https://github.com/ataschz/tanstack-start-mastra-example

16. Composio Bookingmood Mastra Toolkit
https://composio.dev/toolkits/bookingmood/framework/mastra-ai

Audit each source for:

- Agent architecture
- Tool design
- Workflow design
- Slot-filling pattern
- Human-in-the-loop approval
- Booking state machine
- UI panels/cards/modals
- CopilotKit actions
- Mastra tools/workflows
- Data model
- Error handling
- Idempotency
- Test strategy
- Production readiness

For each source, produce a table:

| Source | Best pattern | Reuse score | Complexity | What to copy | What to avoid | MDE task mapping |

Map patterns to MDE:

- SAN-494 · EVT-035 — Restaurant Card Event Venue CTA
  Model from: a2a-travel card footer + in-repo restaurant-card.tsx
  Need: CTA opens offerings panel, no instant booking.

- SAN-495 · EVT-036 — Event Offerings Detail Panel
  Model from: hotel booking package/card UI
  Need: packages, capacity, minimum spend, amenities, price bands.

- SAN-496 · EVT-037 — Request Proposal Modal (HITL)
  Model from: Mastra HITL approval + hotel booking slot filling
  Need: collect event type, date, time, guests, budget, requirements, contact, review before submit.

- SAN-497 · EVT-038 — Search/rank tools + venueShortlistWorkflow
  Model from: Mastra travel-ai blog + mastra-travel-app (NOT mastravel)
  Need: venue shortlist based on capacity, budget, neighborhood, amenities.

- SAN-498 · EVT-039 — AI Venue Match Score Panel
  Model from: travel recommendation explanations
  Need: match score with reasons: budget, capacity, vibe, location, amenities.

- SAN-501 · EVT-042 — eventVenueBookingWorkflow
  Model from: flight/hotel booking state machines
  Need: draft → reviewed → pending → approved → declined → confirmed.

- SAN-502 · EVT-043 — Patricia Admin Queue
  Model from: approval queue / operations dashboard patterns
  Need: pending requests, approve, decline, request info, assign, notes.

MDE schema source of truth:

Use:
- partner_locations
- venue_event_offerings
- venue_event_packages
- bookings

Do not use:
- partner_venues
- venues
- event_venue_bookings
- venue_booking_requests for event proposals

Important architecture rule:

Restaurant/table booking:
venue_booking_requests

Event venue proposal:
bookings with booking_type='event'

Required output:

1. Best 5 sources ranked
2. Patterns to copy
3. Patterns to avoid
4. MDE architecture recommendation
5. Implementation plan by task
6. File-level plan for mdeapp
7. Test plan
8. Evidence plan
9. Risks and blockers
10. Final recommended build order

Build order must be:

1. SAN-494 · EVT-035 — Restaurant Card Event Venue CTA
2. SAN-495 · EVT-036 — Event Offerings Detail Panel
3. SAN-496 · EVT-037 — Request Proposal Modal (HITL)
4. SAN-501 · EVT-042 — eventVenueBookingWorkflow
5. SAN-502 · EVT-043 — Patricia Admin Queue

Parallel branch:

1. SAN-497 · EVT-038 — Search/rank tools + venueShortlistWorkflow
2. SAN-498 · EVT-039 — AI Venue Match Score Panel
3. SAN-500 · EVT-041 — Host Wizard Venue Step

Rules:
- Always use full task names.
- Do not copy code blindly.
- Prefer proven patterns over new architecture.
- Keep each task one PR.
- No production schema changes without existing migration approval.
- SAN-494/495 can start now; gate SAN-496 merge on SAN-299 · VEN-020 + SAN-302 · VEN-023 Class U 4/4.
- Save detailed audits to links-plan.md or booking-patterns-mastra-copilotkit-plan.md