# Phase 6 — Linear Tasks (Verification)

**Verdict:** **Do not create duplicate Linear issues.** The booking backlog already exists in Linear + disk specs. This audit **updates priorities** based on forensic repo research — it does not add new SAN-XXX placeholders.

---

## Linear verification (2026-06-09)

| Proposed in audit prompt | Already in Linear? | Action |
|--------------------------|-------------------|--------|
| Booking Agent Foundation | Partial — conciergeAgent exists | **Extend**, don't new issue |
| requestVenueBooking Tool | ✅ [SAN-299 · VEN-020](https://linear.app/sanjiovani/issue/SAN-299) — Todo, Urgent | **Implement next** |
| Restaurant Booking Workflow | ✅ PR #156 + VEN specs | Merge PR, then SAN-299 |
| Booking Status Management | ✅ [SAN-686 · PTR — Booking system](https://linear.app/sanjiovani/issue/SAN-686) — Backlog | Post-MVP |
| WhatsApp Booking Notifications | Disk: MSV-003 / VEN-003 | Link to existing spec; no new SAN |
| OpenClaw Availability Agent | `04-openclaw.md` Phase 3 | **No Linear yet** — create only when Phase 2 ships |
| Multi-Agent Booking System | [SAN-686](https://linear.app/sanjiovani/issue/SAN-686) parent + a2a patterns | Post-MVP |

### Duplicate cancelled (do not reopen)

| Issue | Status |
|-------|--------|
| [SAN-794 · VEN-015 — requestVenueBooking HITL](https://linear.app/sanjiovani/issue/SAN-794) | Duplicate → use SAN-299 + SAN-302 |
| [SAN-796 · VEN-025 — Playwright e2e booking HITL](https://linear.app/sanjiovani/issue/SAN-796) | Duplicate → use SAN-314 (Done) + future spec |

---

## Active MVP chain (implement in order)

### 1. [SAN-299 · VEN-020 — requestVenueBooking Mastra tool](https://linear.app/sanjiovani/issue/SAN-299)

| Field | Value |
|-------|-------|
| **Description** | Mastra tool on `conciergeAgent` that inserts `venue_booking_requests` via `insertVenueBookingRequest` when user confirms in chat |
| **Acceptance criteria** | RLS insert own row; invalid `venue_kind` rejected; Vitest mocked Supabase; tool ID matches registry |
| **Dependencies** | SAN-298 Done ✅ |
| **Risks** | Agent invents confirmed state — mitigate with honest copy + HITL |
| **Estimate** | 1–2 days |
| **MVP / Post** | **MVP P0** |
| **Audit pattern** | care-connect `bookAppointmentTool` → service → repo |

---

### 2. [SAN-302 · VEN-023 — requestVenueBooking CopilotKit action](https://linear.app/sanjiovani/issue/SAN-302)

| Field | Value |
|-------|-------|
| **Description** | Generative UI mirror — `useCopilotAction` + `renderAndWaitForResponse` like Roberto event publish |
| **Acceptance criteria** | Disabled action name matches tool; card shows summary; `respond()` unblocks agent; no auto-submit |
| **Dependencies** | SAN-299 |
| **Risks** | Tool/action name mismatch (SAN-303 guards) |
| **Estimate** | 1–2 days |
| **MVP / Post** | **MVP P0** |

---

### 3. [SAN-303 · VEN-024 — Tool and CopilotKit action registry CI test](https://linear.app/sanjiovani/issue/SAN-303)

| Field | Value |
|-------|-------|
| **Description** | CI test: Mastra tool IDs ↔ CopilotKit action names ↔ render keys |
| **Acceptance criteria** | Fails on drift; covers `requestVenueBooking` |
| **Dependencies** | SAN-299, SAN-302 |
| **Estimate** | 0.5 day |
| **MVP / Post** | **MVP P0** |

---

## Post-MVP (existing — do not duplicate)

### [SAN-686 · PTR — Booking system (availability → approve → pay → notify)](https://linear.app/sanjiovani/issue/SAN-686)

| Field | Value |
|-------|-------|
| **Description** | Full partner booking lifecycle with HITL, optional Stripe, notifications |
| **MVP / Post** | **Post-MVP** (Backlog) |
| **Audit note** | Maps to Phase 2 multi-agent architecture |

### [SAN-496 · EVT-037 — Request proposal modal (HITL)](https://linear.app/sanjiovani/issue/SAN-496)

| Field | Value |
|-------|-------|
| **Description** | Roberto event venue proposal — reuses same HITL patterns |
| **MVP / Post** | MVP for Events vertical |
| **Dependencies** | SAN-299 patterns |

---

## Optional future Linear (create when Phase 2 starts)

| Title | When to create | Trigger |
|-------|----------------|---------|
| OpenClaw Availability Agent | After SAN-302 + Patricia queue live | Phase 3 kickoff |
| Multi-Agent Booking Orchestrator | After SAN-686 prioritized | Partner program launch |
| Trip Itinerary Booking Coordinator | `/trips` goes LIVE in sitemap | Product decision |

**Rule:** One SAN = one PR. Don't bulk-create Phase 2/3 issues until MVP proof exists.

---

## Disk spec cross-reference

| Disk ID | Linear | File |
|---------|--------|------|
| MSV-002 | SAN-299 | `docs/tasks/venues/tasks/mvp/016-ven-request-venue-booking-tool.md` |
| MSV-003 | (WhatsApp draft) | venues docs 02-booking-whatsapp |
| CKV-006 | SAN-302 | `docs/tasks/venues/tasks/mvp/019-ven-booking-copilot-action.md` |
| VEN-024 | SAN-303 | registry CI spec |

---

## Answer: do we need to create Linear tasks?

**No — for MVP.** SAN-299, SAN-302, SAN-303 already exist and are correctly prioritized (Urgent/Todo).

**Action items:**

1. **Start SAN-299** — next engineering slice after PR #156 merge
2. **Update** `06-mastra-booking.md` scores (this audit supersedes wrong repo rankings)
3. **Defer** new Linear issues for OpenClaw / multi-agent until Phase 2 gate
4. **Link** this audit from SAN-299 description when implementing (optional comment)
