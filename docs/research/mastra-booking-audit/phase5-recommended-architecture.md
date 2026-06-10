# Phase 5 — Recommended mdeai Booking Architecture

**Verdict:** Build on **existing mdeai core** — external repos supply patterns only. Do not fork any audited repo.

---

## MVP (Phase 1) — ship now

**Personas:** Tourist, Carlos (restaurant); Patricia (review)

```text
User → /chat (CopilotKit)
     → conciergeAgent (Gemini 3.5 Flash)
     → slot fill: venue, date, time, party_size, contact
     → renderAndWaitForResponse (HITL confirm card)
     → requestVenueBooking tool
     → insertVenueBookingRequest (venue-booking-core.ts)
     → venue_booking_requests (status=pending, source=agent)
     → Patricia admin queue (manual review)
     → WhatsApp draft (propose-only, Phase 1 manual send)
     → Restaurant confirms offline
     → status=confirmed (human-set only)
```

### MVP components

| Component | Source | Linear |
|-----------|--------|--------|
| DB + RLS | mdeapp (Done) | [SAN-298 · VEN-019](https://linear.app/sanjiovani/issue/SAN-298) |
| Web form insert | PR #156 path | In review |
| Mastra tool | **Build** — pattern from care-connect | [SAN-299 · VEN-020](https://linear.app/sanjiovani/issue/SAN-299) |
| CopilotKit HITL card | **Build** — Roberto publish pattern | [SAN-302 · VEN-023](https://linear.app/sanjiovani/issue/SAN-302) |
| Registry CI test | **Build** | [SAN-303 · VEN-024](https://linear.app/sanjiovani/issue/SAN-303) |

### MVP agent tool sketch

```typescript
// Pattern: care-connect bookAppointmentTool + mdeapp venue-booking-core
createTool({
  id: "requestVenueBooking",
  inputSchema: venueBookingRequestSchema,
  execute: async ({ context, runtimeContext }) => {
    const supabase = createClientFromRuntime(runtimeContext);
    const userId = requireAuth(runtimeContext);
    return insertVenueBookingRequest(supabase, userId, {
      ...context,
      source: "agent",
    });
  },
});
```

---

## Phase 2 — multi-agent + notifications

**Personas:** Patricia (CRM); restaurant partners (future portal)

```text
User → /chat
     → Booking Agent (conciergeAgent extended)
         ├→ Availability Agent (Places / partner API / manual rules)
         ├→ requestVenueBooking → Supabase
         ├→ draftVenueWhatsApp (propose-only tool)
         └→ Notification Agent → approval_requests → wa_outbox
     → Patricia HITL approve
     → WhatsApp sent
     → Status webhooks / inbound reply parsing
```

**Pattern source:** a2a-mastra-demo delegation + VEN-003 sequence diagram.

**Linear:** MSV-003, MSV-007 (disk specs); partner flow SAN-686 (Backlog).

---

## Phase 3 — OpenClaw automation

**Personas:** Tourist (availability alerts); Patricia (supervised automation)

```text
User → /chat
     → Mastra Agent
     → OpenClaw sub-agent (browser / OpenTable / Resy / WhatsApp monitor)
     → availability signal (not auto-book)
     → requestVenueBooking OR alert Patricia
     → HITL always before confirm
```

**Guardrails** (from `04-openclaw.md`):

- No auto-call restaurants
- No auto-payment
- No bypass OpenTable bot protection
- OpenClaw **behind** Patricia queue

---

## Architecture comparison

| Phase | User sees | Booking truth | Automation |
|-------|-----------|---------------|------------|
| **MVP** | "Request sent" | `venue_booking_requests.pending` | None |
| **Phase 2** | "WhatsApp sent to venue" | status lifecycle + approval | Draft + notify |
| **Phase 3** | "We found an opening" | OpenClaw signal + human confirm | Browser/API monitor |

---

## What NOT to build from repos

| Anti-pattern | Source repo | Why skip |
|--------------|-------------|----------|
| Instant LiteAPI hotel confirm | mastra-hotel | Wrong market; no Medellín restaurants |
| Podcast email as "booking" | guest-booking-assistant | Misnamed demo |
| Gutenberg search | a2a-book-agent | Wrong domain |
| Reading library | Booksy-Agent | Wrong domain |
| Static HTML enquiry | mastravel | No agent code |

---

## Implementation order

1. Merge PR #156 (web Request Table path)
2. **SAN-299** — Mastra `requestVenueBooking` tool wrapping `venue-booking-core.ts`
3. **SAN-302** — CopilotKit HITL generative card
4. **SAN-303** — tool/action registry test
5. Patricia admin booking queue (VEN admin specs)
6. **SAN-302** + MSV-003 WhatsApp draft tool
7. Phase 2 multi-agent split
8. Phase 3 OpenClaw (see `04-openclaw.md`)

See [`architecture-diagram.md`](./architecture-diagram.md) for mermaid diagrams.
