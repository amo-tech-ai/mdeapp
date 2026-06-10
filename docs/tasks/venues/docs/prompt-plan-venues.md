# Prompt — venues PRD + planning (executed 2026-05-27)

**Outputs:** see [`README.md`](./README.md) for the full doc index.

| # | Deliverable | Path | Status |
|---|-------------|------|--------|
| 1 | PRD | [`prd-venues.md`](./prd-venues.md) | ✅ |
| 2 | Progress tracker | [`../INDEX.md`](../INDEX.md) | ✅ |
| 3 | Architecture mermaid | [`01-architecture.md`](./01-architecture.md) | ✅ |
| 4 | Booking flow mermaid | [`02-booking-whatsapp.md`](./02-booking-whatsapp.md) | ✅ |
| 5 | Agent/tool flow mermaid | [`03-agents-tools-copilotkit.md`](./03-agents-tools-copilotkit.md) | ✅ |
| 6 | Core MVP roadmap | [`07-roadmap-mvp.md`](./07-roadmap-mvp.md) | ✅ |
| 7 | Advanced roadmap | [`08-roadmap-advanced.md`](./08-roadmap-advanced.md) | ✅ |
| 8 | Completed vs missing | [`10-status-audit.md`](./10-status-audit.md) | ✅ |
| 9 | Risks/blockers | [`09-risks-blockers.md`](./09-risks-blockers.md) | ✅ |
| 10 | Next 10 tasks | [`07-roadmap-mvp.md`](./07-roadmap-mvp.md) § Next 10 | ✅ |

Also: [`04-supabase-seeds-vectors.md`](./04-supabase-seeds-vectors.md), [`05-maps-places-adk.md`](./05-maps-places-adk.md), [`06-openclaw-automation.md`](./06-openclaw-automation.md).

---

## Original prompt (archive)

You are a senior product architect, repo auditor, and AI city-intelligence engineer for mdeai.co.

Goal:
Review tasks/venues and create a complete PRD + roadmap for the Venues system.

Venues includes:
- Cafés
- Restaurants
- Nightlife / clubs / bars
- Coffee tours if relevant
- Event nearby venues
- Venue booking requests
- WhatsApp booking workflow
- OpenClaw enrichment
- Maps / Places / ADK grounding
- Supabase / pgvector
- Mastra / CopilotKit

Read:
- tasks/venues/INDEX.md
- tasks/venues/005-008-places-README.md
- tasks/venues/notes-venues.md
- tasks/venues/cafes/*
- tasks/venues/007-*
- tasks/venues/008-*
- tasks/maps/INDEX.md
- tasks/events/INDEX.md
- current mdeapp Mastra tools, CopilotKit renders, map context, Supabase migrations

Also review:
https://mastra.ai/guides/guide/whatsapp-chat-bot

Main questions:
1. What is completed already?
2. What is missing?
3. Are the current venue specs correct?
4. What tasks are duplicated, stale, or conflicting?
5. What Supabase tables exist already?
6. Do we need new tables?
7. Do we need Edge Functions, or can Mastra handle it?
8. What seed files are needed?
9. What vector embeddings are needed?
10. What agents/tools/workflows are needed?
11. What OpenClaw features are safe to include?
12. What is the correct implementation order?

Important current truth:
- Cafés are the template and are Phase A.5 done.
- Restaurants are In Progress.
- Nightlife is Not Started.
- VenueDetailSheet is only for rentals/events.
- Cafés/restaurants/nightlife should use Mindtrip-style cards + map + right detail panel.
- suggest Booking features  AI ? 
- public.bookings already exists, so audit before adding a new booking table.
 
-  restaurant reservation plan 
Create:
1. docs/prd-venues.md
2. tasks/venues/INDEX.md progress tracker
3. Mermaid architecture diagrams
4. Mermaid booking flow
5. Mermaid agent/tool flow
6. core MVP roadmap
7. advanced roadmap
8. completed vs missing table
9. blocker/risk table
10. next 10 tasks in exact order

suggest User stories to include: improve
- Sarah wants a quiet café with Wi-Fi for 3 hours.
- Carlos wants to book dinner for 4 by WhatsApp.
- A tourist wants reggaeton clubs near Provenza tonight.
- Roberto wants nearby cafés/bars after his event.
- Patricia reviews booking requests before messages are sent.

Booking design suggest improve
User clicks Request
→ form asks date, time, party size, notes, WhatsApp/contact
→ insert venue_booking_requests pending
→ Mastra drafts WhatsApp message
→ Patricia approves/edits
→ WhatsApp outbox sends
→ status becomes sent / confirmed / needs_user / cancelled

Rules:
- Never show confirmed until venue confirms.

- Places API owns address, phone, hours, place_id, photos.
- pgvector owns vibe/similarity only.
- Supabase owns user data, bookings, approvals, logs.
- Mastra orchestrates workflows.
- Edge Functions should own side effects like WhatsApp send/outbox if safer.
- CopilotKit renders cards, panels, ask prompts, booking UI.
- No duplicate listing surfaces.
- No standalone catalog routes yet.
- No invented hours, Wi-Fi, prices, menus, dress codes, or reviews.

OpenClaw ideas:
- verify restaurant websites/Instagram

- find WhatsApp numbers
- flag stale Places/website data
- draft booking WhatsApp text
- monitor new cafés/restaurants/nightlife
- produce source evidence for   approval

Output format:
- Executive summary
- Current status
- What is completed
- What is missing
- Architecture
- Mermaid diagrams
- Supabase schema plan
- Seed plan
- pgvector embedding plan
- Mastra tools/workflows
- CopilotKit UI plan
- Google Maps/Places/ADK plan
- Booking + WhatsApp plan
- OpenClaw automation plan
- Core MVP tasks
- Advanced tasks
- Risks/blockers
- Exact task order