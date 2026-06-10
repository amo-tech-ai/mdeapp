# Venues AI Booking + Events Plan

## Goal

Turn restaurants, cafés, rooftops, bars, hotels, and event spaces into bookable venue partners inside mdeai.

Simple flow:

```text
Discover venue → View event offerings → Ask AI → Request proposal → WhatsApp coordination → Confirm booking → Add to trip/event
```

This fits your stack: Supabase owns data, Mastra orchestrates, CopilotKit renders UI, Google Maps/Places provides geo truth, Gemini explains only from tool data.

---

# 1. Core User Journeys

## Journey A — Restaurant wants event bookings

Example: Mamacita Medallo wants private birthday bookings.

Flow:

```text
Restaurant card
→ “Event Venue” button
→ Event offerings panel
→ Request event proposal
→ AI drafts message
→ Patricia approves
→ WhatsApp sent
→ Venue confirms
```

## Journey B — Organizer needs a venue

Example: Roberto wants an AI meetup for 80 people.

Flow:

```text
“I need a venue for 80 founders in Provenza”
→ AI compares venues
→ Shows capacity, price, vibe, map
→ User requests proposal
→ Booking request saved
```

## Journey C — Tourist plans a night

Example: dinner + salsa event + rooftop bar.

Flow:

```text
Restaurant booking
→ Nearby event suggestion
→ Add to trip
→ WhatsApp reminder
```

Trips already act as the planning layer for restaurants, events, rentals, and saved places. 

---

# 2. Screens to Build

## Core Screens

| Screen                  | Purpose                             |
| ----------------------- | ----------------------------------- |
| Restaurant Card         | Add “Event Venue” button            |
| Event Offerings Panel   | Shows capacity, packages, amenities |
| Venue Detail Page       | Full venue profile                  |
| Request Proposal Modal  | Collect event details               |
| AI Venue Match Panel    | Explains why venue fits             |
| Compare Venues Screen   | Side-by-side options                |
| Admin Booking Queue     | Patricia reviews requests           |
| WhatsApp Message Review | Approve/edit before sending         |
| Host Wizard Venue Step  | Roberto selects venue for event     |
| Trip/Event Itinerary    | Saves confirmed bookings            |

---

# 3. Restaurant Card Upgrade

Current:

```text
[ Details ]
```

Upgrade:

```text
[ Details ] [ Event Venue ]
```

Add badge:

```text
🎉 Hosts Events
```

Only show button when:

```text
accepts_event_bookings = true
```

---

# 4. Event Offerings Content

Each venue should show:

| Section       | Example                                                |
| ------------- | ------------------------------------------------------ |
| Event types   | Birthdays, AI meetups, fashion events, private dinners |
| Capacity      | Seated 60, standing 120                                |
| Spaces        | Rooftop, private room, terrace                         |
| Amenities     | DJ, projector, sound, WiFi, valet                      |
| Packages      | $25/person dinner, $500 minimum spend                  |
| Best for      | Networking, launches, dinners                          |
| Not ideal for | Large concerts, conferences                            |
| Contact rules | WhatsApp, email, manual approval                       |
| Map context   | Parking, hotels, nightlife nearby                      |

---

# 5. Data Model

## Main Tables

```text
venues
venue_event_offerings
venue_event_packages
venue_booking_requests
venue_messages
venue_availability
venue_media
venue_reviews
approval_requests
wa_outbox
```

## Minimum MVP fields

### venues

```text
id
name
venue_kind
google_place_id
neighborhood
address
lat
lng
phone
website
accepts_event_bookings
capacity_seated
capacity_standing
price_level
is_verified
```

### venue_event_offerings

```text
venue_id
event_types
amenities
spaces
minimum_spend
price_per_person_from
setup_notes
best_for
not_ideal_for
```

### venue_booking_requests

```text
user_id
venue_id
event_type
event_date
event_time
guest_count
budget
notes
status
whatsapp_draft
approval_status
```

Your venues PRD already recommends a unified `venue_booking_requests` table instead of separate café-only requests. 

---

# 6. AI Features

## Core AI

| Feature                 | Real Example                             |
| ----------------------- | ---------------------------------------- |
| Venue search            | “Rooftop for 80 people in Provenza”      |
| Venue match score       | “92% fit for AI networking”              |
| Event package generator | “Create birthday package for 20 guests”  |
| Proposal draft          | WhatsApp message to venue                |
| Venue comparison        | Compare 3 restaurants for private dinner |
| Map intelligence        | Nearby hotels, nightlife, parking        |
| Availability assistant  | Suggest better date/time                 |
| Upsell suggestions      | Add DJ, photographer, drinks package     |

## Advanced AI

| Feature                 | Use Case                           |
| ----------------------- | ---------------------------------- |
| Seating layout AI       | Fashion show or dinner layout      |
| Staffing estimate       | “Need 3 waiters + 1 host”          |
| Revenue estimate        | Ticket price × capacity            |
| Sponsor match           | Brand launch venue recommendations |
| Dynamic package pricing | Weekend vs weekday pricing         |
| Auto follow-up          | Venue has not replied in 24 hours  |

---

# 7. Agents and Workflows

## Agents

| Agent                | Job                               |
| -------------------- | --------------------------------- |
| `venueAgent`         | Finds and ranks venues            |
| `bookingAgent`       | Creates booking requests          |
| `eventVenueAgent`    | Matches venues to event needs     |
| `whatsappAgent`      | Drafts messages, never auto-sends |
| `adminApprovalAgent` | Routes requests to Patricia       |
| `mapsGroundingAgent` | Gets real place/map facts         |
| `tripAgent`          | Adds booking to itinerary         |

Keep agents lean. Use one router plus workflows, not an agent swarm. Your PRD already recommends one router with workflows instead of too many module agents. 

---

# 8. Workflow

## Booking Request Workflow

```text
User clicks Event Venue
→ User enters event details
→ Mastra validates request
→ Supabase saves request
→ Gemini drafts WhatsApp message
→ Admin reviews
→ WhatsApp sent
→ Venue replies
→ User confirms
→ Booking added to trip/event
```

## Venue Discovery Workflow

```text
User asks for venue
→ Router detects venue intent
→ Supabase searches curated venues
→ Google Places enriches details
→ Maps pins render
→ AI ranks options
→ User compares or requests proposal
```

## Host Event Workflow

```text
Roberto creates event
→ AI asks capacity/date/budget
→ Suggests venues
→ Roberto selects one
→ Booking request created
→ Event draft continues
```

---

# 9. Communication System

## Channels

| Channel            | Use                       |
| ------------------ | ------------------------- |
| In-app chat        | User asks and refines     |
| WhatsApp           | Venue coordination        |
| Email              | Formal proposal / receipt |
| Admin queue        | Approvals and exceptions  |
| Trip notifications | Reminders and updates     |

## WhatsApp Rules

Important: AI drafts only.

```text
AI drafts → human approves → WhatsApp sends
```

Do not auto-confirm bookings unless venue confirms.

Correct copy:

```text
Request sent — we’ll confirm by WhatsApp.
```

Not:

```text
Booking confirmed.
```

---

# 10. Tech Stack

## 10.1 Venue booking forms (locked)

All **table booking** UI (café · restaurant · nightclub) uses one stack — do not mix TanStack Form, Formisch, or `useActionState` until shadcn documents them as stable.

| Layer | Choice |
| ----- | ------ |
| Form state | [React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) |
| Validation | Zod (`venueBookingFormSchema` + `@hookform/resolvers/zod`) |
| Layout / a11y | shadcn `FieldGroup` + `Field` + `FieldLabel` + `FieldDescription` |
| Controls | `Input`, `Textarea`, `Select`, `Checkbox`, Calendar / Date Picker |

| Flow | Pattern |
| ---- | ------- |
| VEN-017 booking sheet | RHF + Zod in `VenueBookingForm` |
| VEN-021 persist | Same form → `submitVenueBooking` / API |
| VEN-019 HITL | Same form inside `renderAndWaitForResponse` |
| VEB proposal modal | RHF + Zod (separate schema, same Field primitives) |
| VEN-024 admin queue filters | Simple controlled inputs — not a full form framework |

**Recommended fields (VEN-017):** name, email, phone, date, time, party size, occasion (optional), special requests, WhatsApp consent.

**Build order:** VEN-017 form UI → VEN-021 submit/persist → VEN-019 HITL → VEN-020 status chips.

| Layer               | Tool                                    |
| ------------------- | --------------------------------------- |
| UI                  | Next.js, React, Tailwind, shadcn        |
| AI UI               | CopilotKit                              |
| Orchestration       | Mastra                                  |
| Reasoning           | Gemini                                  |
| Google intelligence | Google ADK                              |
| Maps                | Google Maps, Places API, Grounding Lite |
| Database            | Supabase Postgres                       |
| Semantic search     | pgvector                                |
| Messaging           | WhatsApp API / Infobip later            |
| Payments            | Stripe for deposits or ticketed events  |
| Automation          | OpenClaw later, approval-only           |

---

# 11. Development Order

## Phase 1 — MVP

1. Add `Event Venue` button to restaurant cards
2. Build Event Offerings Panel
3. Create `venue_booking_requests`
4. Build Request Proposal Modal
5. Save request to Supabase
6. AI drafts WhatsApp message
7. Admin approves message
8. Add basic WhatsApp send queue

## Phase 2 — Better Discovery

1. Venue search by event type
2. Venue match score
3. Venue comparison screen
4. Google Places enrichment
5. Map pin filtering
6. Add to trip/event

## Phase 3 — Host Events Integration

1. Add venue step to host event wizard
2. Suggest best venues for event
3. Create proposal from event draft
4. Attach venue booking to event
5. Add deposit/payment option

## Phase 4 — Advanced Automation

1. Availability calendar
2. Auto follow-up drafts
3. Venue CRM
4. Event package builder
5. OpenClaw enrichment
6. Sponsor matching

---

# 12. Best MVP Use Cases

| Use Case              | Why Valuable                     |
| --------------------- | -------------------------------- |
| Birthday dinner       | High demand, simple booking      |
| AI meetup             | Fits mdeai brand                 |
| Fashion networking    | Strong Medellín/event fit        |
| Private dinner        | Restaurants monetize slow nights |
| Rooftop party         | High-ticket venue lead           |
| Corporate event       | B2B revenue                      |
| Café coworking meetup | Low friction, frequent           |

---

# 13. Suggested MVP Task Names

```text
VEN-001 Venue event offerings schema
VEN-002 Restaurant card Event Venue CTA
VEN-003 Event offerings detail panel
VEN-004 Request proposal modal
VEN-005 Venue booking request API
VEN-006 AI WhatsApp draft generator
VEN-007 Admin approval queue
VEN-008 WhatsApp outbox integration
VEN-009 Venue match scoring
VEN-010 Host event wizard venue step
```

---

# Final Recommendation

Build this first:

```text
Restaurant Card → Event Venue CTA → Offerings Panel → Request Proposal → AI WhatsApp Draft → Admin Approval
```

That gives you the fastest real-world value without overbuilding.

---

# Executable tasks

**Task pack:** [`../tasks/event-booking/INDEX.md`](../tasks/event-booking/INDEX.md) (VEB-001…018 · core · mvp · advanced)

**Wireframes:** [`../tasks/event-booking/wireframes/INDEX.md`](../tasks/event-booking/wireframes/INDEX.md)
