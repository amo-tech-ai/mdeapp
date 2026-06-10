# Phase 3 — mdeai Mapping

How each audited repo maps to mdeai's stack and personas.

## mdeai baseline (2026-06-09)

| Layer | mdeai choice |
|-------|--------------|
| UI | Next.js 16 `/chat`, restaurant cards, VenueBookingSheet |
| Agent bridge | CopilotKit 1.55.2 → `/api/copilotkit` → Mastra in-process |
| Agent | `conciergeAgent` on `gemini-3.5-flash` |
| Data | Supabase `venue_booking_requests` + RLS (SAN-298 Done) |
| Insert core | `src/lib/venues/venue-booking-core.ts` |
| Booking model | **Honest request** — not instant OpenTable confirm |
| Phase 2 ops | OpenClaw availability / WhatsApp (see `04-openclaw.md`) |

---

## Per-repo mapping

### care-connect → **Primary pattern source**

| Question | Answer |
|----------|--------|
| **Copy?** | Tool → service → repository; availability check before insert; Zod tool I/O; slot-filling prompts |
| **Avoid?** | Ollama; raw pg without Supabase RLS; broken transaction pattern; healthcare-specific tables |
| **Adapt?** | `doctorAvailabilityTool` → `checkVenueAvailability` (Phase 2, partner calendar); `bookAppointmentTool` → `requestVenueBooking` calling `insertVenueBookingRequest` |
| **Reuse immediately?** | Folder structure for `src/mastra/tools/venues/` + `src/mastra/services/venue-booking.ts` |
| **Phase 2?** | Semantic recall over venue guidelines (like RAG guidelines tool) |

**Example:** Tourist says "Book Carmen Thursday 8pm for 6" → agent calls availability (optional Phase 2) → collects missing `contact_phone` → HITL confirm → `insertVenueBookingRequest` with `venue_kind=restaurant`.

---

### mastra-hotel-booking-ai-agent → **External API tool patterns**

| Question | Answer |
|----------|--------|
| **Copy?** | `errorHandler.ts` taxonomy; Zod-validated tool inputs; stepwise search → detail → action |
| **Avoid?** | LiteAPI as dependency; OpenAI model; unwired createBooking anti-pattern |
| **Adapt?** | Hotel search tools → Places-backed restaurant detail fetch (already in mdeai) |
| **Reuse immediately?** | Error mapping structure for tool execute blocks |
| **Phase 2?** | Real availability API if partner exposes slots |

---

### a2a-mastra-demo → **Multi-agent orchestration (Phase 2+)**

| Question | Answer |
|----------|--------|
| **Copy?** | Receptionist delegates to specialist agents; A2A fetch adapter |
| **Avoid?** | Hardcoded remote Ollama; external Agno dependency for MVP |
| **Adapt?** | Booking Agent + Availability Agent + Notification Agent as Mastra sub-agents or tools |
| **Reuse immediately?** | Nothing for MVP |
| **Phase 2?** | OpenClaw as external A2A specialist for OpenTable checks |

---

### Sol_Basic_Hotel… → **Gemini agent skeleton**

| Question | Answer |
|----------|--------|
| **Copy?** | Prompt: "do not invent booking state"; off-topic refusal; Zod output schema on tools |
| **Avoid?** | Mock fetch; accountId-without-auth pattern |
| **Adapt?** | System prompt additions to `conciergeAgent` for booking slot schema |
| **Reuse immediately?** | Prompt guardrail wording for honest request copy |
| **Phase 2?** | LibSQL memory patterns (mdeai uses F13 Supabase memory) |

---

### guest-booking-assistant → **Voice only (optional Phase 3)**

| Question | Answer |
|----------|--------|
| **Copy?** | Layercode `verifySignature` + `streamResponse` webhook pattern |
| **Avoid?** | Email tools, podcast instructions, Brave search stubs |
| **Adapt?** | Voice channel for WhatsApp-first Medellín market — low priority |
| **Reuse immediately?** | None for restaurant MVP |
| **Phase 2?** | Voice booking after chat MVP proven |

---

### Booksy-Agent, a2a-book-agent, mastravel → **Do not use for booking**

| Question | Answer |
|----------|--------|
| **Copy?** | Booksy: Mastra `registerApiRoute` A2A shim (if building A2A). a2a-book-agent: Telex task types |
| **Avoid?** | Treating as reservation references — **they are reading-book demos** |
| **Adapt?** | N/A for booking |
| **Reuse immediately?** | Nothing |
| **Phase 2?** | A2A task lifecycle types only if building agent-to-agent |

---

## Vertical mapping

| Vertical | mdeai surface | Best repo pattern | mdeai task |
|----------|---------------|-------------------|------------|
| **Restaurant** | `/chat` + restaurant card | care-connect book tool + honest request | SAN-299, SAN-302 |
| **Event venue** | `/host/event/new`, venue explorer | SAN-496 HITL proposal modal | EVT-037 |
| **Nightlife** | `/chat` `venue_kind=nightlife` | Same as restaurant | SAN-299 |
| **Trips** | `/trips` (shell) | mastravel HTML only — build in-house | Post-MVP |
| **Travel/hotel** | Post-MVP | mastra-hotel LiteAPI patterns | SAN-686 backlog |

---

## Gap analysis — what no repo provides

| Need | mdeai owner |
|------|-------------|
| CopilotKit `renderAndWaitForResponse` HITL | SAN-302 |
| Supabase RLS + idempotency | Done in `venue-booking-core.ts` |
| Patricia admin queue | VEN admin specs |
| WhatsApp draft + approval | MSV-003 / VEN-003 |
| OpenClaw OpenTable automation | Phase 3 per `04-openclaw.md` |
| Stripe deposits for venues | Post-MVP (SAN-686) |
