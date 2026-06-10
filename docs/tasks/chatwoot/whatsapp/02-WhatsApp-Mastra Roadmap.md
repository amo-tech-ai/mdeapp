# WhatsApp + Mastra Roadmap (Audit + Architecture + Linear Plan)

> **Status:** Draft v2 · **updated:** 2026-06-05 · **verified against:** `mdeapp/src/mastra/**`, `mdeapp/supabase/**`, Linear epic `SAN-588` (AGT-00, 24 children).
>
> **Role of this doc:** the **detailed WA-001…WA-010 task specs**. The braided overview (CW-* channel + WA-* brain + AGT-* primitives) lives in [`roadmap-chatwoot.md`](../roadmap-chatwoot.md); the architecture decision + responsibility split lives in [`prd-chatwoot.md`](../prd-chatwoot.md). Read those first — this doc assumes their **Option C (Hybrid)** decision.
>
> ⚠️ **Draft v1 of this file was wrong in several audit rows** (it claimed Chatwoot, HITL approvals, suspend/resume, and resource memory already exist). Those are **corrected below** against the codebase. See the [correction log](#correction-log).

## Executive Verdict

**Build WhatsApp as a thin Mastra channel, not a separate AI system** — and put it behind a pluggable transport so the *same* agents serve web (CopilotKit) and WhatsApp.

Brain pipeline (unchanged from the official Mastra guide):

```text
WhatsApp
   ↓
Webhook  (transport port: receive)
   ↓
Mastra Workflow
   ↓
routerAgent → Domain Tools
   ↓
Grounding guard (AGT-00A/B)   ← non-negotiable: 0 scorers today
   ↓
Message Formatter (WA-003, Gemini)
   ↓
Sender   (transport port: send → Chatwoot in prod)
```

**Transport (the Hybrid seam):** in **production** the Webhook + Sender are **Chatwoot-fronted** (`CW-2`/`CW-3`); in **dev / fallback** they are the **official Mastra direct webhook** — Mastra `Channels`, `AGT-10`/`SAN-604`. One brain, two pipes, swapped by config. A standalone second sender is the **double-send ban risk** — don't build one.

Avoid (aligns with SAN-588's hard "do NOT"):

* MCP in runtime
* RAG / `@mastra/rag` (use Supabase pgvector)
* ADK
* Multi-agent / supervisor orchestration
* A separate WhatsApp AI

Current platform strategy (corrected):

* One `routerAgent` ✅
* Workflows 🔶 (primitive in `@mastra/core@1.35.0`; business workflows net-new)
* Human approvals ⚠️ (web-only CopilotKit today; server-side gate net-new — AGT-01)
* Resource memory ❌ (thread-scoped only today; net-new — AGT-02)
* CopilotKit as primary web UI ✅

> **Gemini deviation:** the official guide uses Anthropic/OpenAI. mdeai is **Gemini-only** → every responder/formatter uses `google("gemini-3.5-flash")`.

---

## Correction log

| Draft-v1 claim | Verified reality (2026-06-05) |
|---|---|
| Chatwoot ✅ exists | ❌ **Not deployed** — must self-host (CW-1) |
| HITL approvals ✅ | ⚠️ **Web-only** (CopilotKit `renderAndWaitForResponse`, `host-event-copilot-bridge.tsx`) + `approval-commit` edge fn (server commit, web-triggered). WhatsApp approval = net-new |
| Suspend/Resume — Partial | ❌ **Type only — not implemented** (AGT-14/SAN-608) |
| AI memory — Partial / Resource memory | ❌ **Thread-scoped only** (`createThreadMemory`, `scope:"thread"`). Resource memory net-new (AGT-02/SAN-597) |
| Observability ✅ Required (have it) | ❌ **Empty** — 0 scorers, 0 trace spans, 0 output processors; `@mastra/observability` not installed (AGT-00C/SAN-589) |
| `wa_outbox` is a live cron / sender | ⚠️ **Dormant stub** — RLS service-role, **zero code**, no cron |
| `leads.source='whatsapp'` needs migration | ✅ **Free-text — no migration** |
| `venueAgent` available | ❌ **Does not exist** — only 7 agents registered; nightlife agent is net-new |

---

# 1. Current State Audit

> Prompt rule: *verify, do not assume.* **Exists** = in the codebase today; **Reusable** = usable as-is for WhatsApp; **Gap** = work to close.

## WhatsApp Capability Audit

| Capability | Exists | Reusable | Gap |
| ------------------ | ------------------------------------- | -------- | ----------------------------- |
| Chatwoot | ❌ not deployed | — | Self-host (CW-1) |
| WhatsApp DB tables (`wa_outbox`, `whatsapp_*`) | ⚠️ dormant stubs, zero code | ⚠️ schema only | Let Chatwoot own conversation truth, or wire deliberately |
| Lead capture (`chat-lead-capture`, G2) | ✅ | ✅ | Call from the WhatsApp path (CW-5) |
| `leads.source='whatsapp'` | ✅ free-text | ✅ | **No migration** |
| Viewing scheduling | ⚠️ rental flow exists | ✅ | Reminder needs scheduled tasks (AGT-09) |
| Event ticketing (G1 + `ticket-payment-webhook`) | ✅ | ✅ | WhatsApp resend workflow (WA-006) |
| Booking requests | ⚠️ partial | ✅ | Confirmation workflow |
| Approval queues | ⚠️ web-only (CopilotKit + `approval-commit`) | ⚠️ | WhatsApp approval actions net-new (AGT-01/14) |
| Message logging (`ai_runs`) | ✅ | ✅ | WhatsApp-channel tagging |
| Human handoff | ❌ | — | Chatwoot (CW-3/CW-8) |

## Mastra Capability Audit

| Capability | Exists | Reusable | Gap |
| ------------------ | ------- | -------- | ------------------------ |
| `routerAgent` | ✅ | ✅ | WhatsApp entrypoint (transport port) |
| `conciergeAgent` | ✅ `gemini-3.5-flash` | ✅ | Channel-aware formatter (WA-003) |
| `hostEventAgent` | ✅ (0 server tools) | ✅ | Publish workflow (AGT-12) |
| `rentalAgent` | ✅ | ✅ | WhatsApp lead nurturing (WA-004) |
| 7-agent registry | ✅ | ✅ | Runtime allowlist — all 7 exposed (AGT-00D) |
| Workflows | 🔶 primitive `@mastra/core@1.35.0` | ✅ | Business workflows (AGT-11/12 + AGT-15) |
| AI memory | ⚠️ **thread-scoped only** | ⚠️ thread reuse | Resource-scoped prefs net-new (AGT-02) |
| `ai_runs` audit logs | ✅ | ✅ | WhatsApp event logging |
| HITL approvals | ⚠️ **web-only** (CopilotKit) | ⚠️ | Server-side pause net-new (AGT-01); WhatsApp approve (WA-007) |
| Suspend/Resume | ❌ **type only** | — | Net-new (AGT-14) |
| Background / scheduled jobs | ❌ | — | Net-new (AGT-09) |
| Observability / scorers | ❌ **0 scorers · 0 spans · 0 processors** | — | Net-new (AGT-00A/B/C) |
| Streaming (`context.writer`) | ❌ | — | Net-new (AGT-16) |
| Mastra `Channels` (WhatsApp) | ❌ planned | — | Spike (AGT-10) |

> Existing agents/tools/edge-functions should be **reused**; the approval / suspend-resume / memory / scheduled / observability columns are **net-new SAN-588 work**, not a free inheritance.

---

# Architecture Recommendation

## Official Mastra Features To Use

| Feature | Use? | Status today | Why | Delivered by |
| ------------------- | ---------- | --- | -------------------------- | --- |
| Workflows | ✅ Required | 🔶 primitive | WhatsApp is event-driven | AGT-11/12 (SAN-601/602) |
| Scheduled Workflows | ✅ Required | ❌ net-new | Reminders, follow-ups | AGT-09 (SAN-600) |
| Human-in-the-loop | ✅ Required | ⚠️ web-only | Publishing, venue outreach | AGT-01 (SAN-595) |
| Suspend/Resume | ✅ Required | ❌ net-new | Approval workflows | AGT-14 (SAN-608) |
| Resource Memory | ✅ Required | ❌ net-new | User preferences | AGT-02 (SAN-597) |
| Background Tasks | ✅ Required | ❌ net-new | Async reminders/campaigns | AGT-09 (SAN-600) |
| Streaming | ⚠️ Limited | ❌ | WhatsApp is message-based | AGT-16 (SAN-609) |
| Observability | ✅ Required **first** | ❌ empty | Audit + grounding guard before scale | AGT-00A/B/C (SAN-590/605/589) |
| `Channels` (WhatsApp) | ✅ dev/fallback | ❌ planned | Option-B transport | AGT-10 (SAN-604) |

---

# MVP Scope

## Phase 1

Only build:

```text
Webhook (receive port)        ← WA-001
Sender (send port = Chatwoot) ← WA-002
Formatter                     ← WA-003
Grounding guard               ← AGT-00A/B  (non-negotiable)
Rental Follow-Up (capture)    ← WA-004
Viewing Reminder              ← WA-005 (scheduled half waits on AGT-09)
Event Ticket Support          ← WA-006
```

Do NOT build (Phase 4 / never):

```text
Marketing broadcasts (WA-010)      Multi-agent systems
AI campaigns                       WhatsApp CRM
Host approval on WhatsApp (WA-007) Autonomous outreach
RAG / @mastra/rag                  Standalone 2nd WhatsApp sender
```

---

# WhatsApp Roadmap

> Each task lists its **transport / AGT dependency** so the net-new vs reuse split is explicit. Project: **AI & Intelligence**.

---

# WA-001 — WhatsApp Webhook Foundation (receive port)

### Business Value
Enable inbound conversations.

### Example
User: *"Find apartments in Laureles under $80/night"*

### Technical
```text
WhatsApp → (Chatwoot CW-2/CW-3  |  Meta-direct AGT-10) → transport.receive() → workflow → routerAgent
```
The `receive()` half of the transport port. Official-guide `registerApiRoute('/whatsapp', GET verify + POST)` shape; Chatwoot-fronted in prod, Meta-direct in dev.

### Acceptance
* webhook verified (HMAC / Meta verify token)
* inbound messages persisted
* user identified (contact hydration via `mde_contact_id`)
* workflow triggered

### Dependencies
CW-2/CW-3 (prod transport) · AGT-10/SAN-604 (dev transport)

### Effort
2 days · ### Priority P0

---

# WA-002 — WhatsApp Sender (send port)

### Business Value
Outbound communication.

### Examples
viewing reminder · ticket confirmation · booking confirmation

### Technical
```text
transport.send(reply)   // prod → Chatwoot Application API ; dev → Meta Graph API
```
The `send()` half of the transport port — **not** a standalone sender. **Chatwoot is the single production sender** (NFR3); the Meta Graph-API sender is the dev/fallback adapter only.

### Acceptance
* retries (inline)
* delivery logs
* failure handling
* **single-sender invariant honored** (no parallel `wa_outbox` send)

### Dependencies
CW-2 (Chatwoot sender) · AGT-10 (Meta-direct sender) · WA-001

### Effort
2 days · ### Priority P0

---

# WA-003 — WhatsApp Message Formatter

### Business Value
Readable responses.

### Example
Instead of a 500-word AI answer, generate:
```text
1️⃣ Top apartments
2️⃣ Best match
3️⃣ Next step
```

### Technical
Mastra step (`breakIntoMessages`), `gemini-3.5-flash`, structured-output array of 3–5 WhatsApp messages, markdown stripped. **Net-new but cheap.**

### Acceptance
* split messages
* remove markdown
* WhatsApp-safe output

### Dependencies
WA-002 · AGT-03/SAN-592 (structured output)

### Effort
1 day · ### Priority P1

---

# WA-004 — Rental Lead Follow-Up Workflow

### Business Value
Increase lead conversion.

### Example
Camila requests rentals → 30 min later: *"Would you like to schedule a viewing?"*

### Technical
Capture (synchronous) reuses `chat-lead-capture` (G2, `source='whatsapp'`). The **delayed nudge** needs scheduled/background tasks.

### Acceptance
* lead created (`leads` row)
* follow-up sent (opt-in; template if outside 24h window)
* response tracked

### Dependencies
WA-001 · WA-002 · CW-5 (capture) · **AGT-09/SAN-600 (scheduled nudge)**

### Effort
3 days · ### Priority P1

> Capture half = Phase 2; scheduled half = Phase 3 (waits on AGT-09).

---

# WA-005 — Viewing Reminder Workflow

### Business Value
Reduce no-shows.

### Example
24h before viewing: *"Reminder: Viewing tomorrow at 10:00 AM"*

### Technical
Scheduled workflow (template send outside the 24h window).

### Acceptance
* scheduled workflow fires
* confirmation support
* delivery tracking

### Dependencies
WA-004 · **AGT-09/SAN-600**

### Effort
2 days · ### Priority P1

---

# WA-006 — Event Ticket Support Workflow

### Business Value
Reduce support burden.

### Example
User: *"Resend my ticket"*
```text
lookup ticket → send QR → log support action
```

### Technical
Reuses **G1** ticket checkout + `ticket-payment-webhook` (both exist). Mostly reuse.

### Acceptance
* ticket lookup
* QR resend
* audit trail (`ai_runs`)

### Dependencies
WA-001 · WA-002 · G1 (exists)

### Effort
3 days · ### Priority P1

---

# WA-007 — Host Approval Workflow (WhatsApp)

### Business Value
Safe AI-assisted publishing.

### Example
Roberto receives on WhatsApp: `APPROVE` / `EDIT` / `REJECT`

### Technical
```text
workflow.suspend()  →  (WhatsApp approve)  →  workflow.resume()
```
**Net-new.** Today HITL is **web-only** (CopilotKit). WhatsApp approval needs server-side native approval **and** durable suspend/resume; can route the human step through Chatwoot handoff (CW-8).

### Acceptance
* workflow suspended (durable across sessions)
* approval recorded (`approval_decisions`)
* workflow resumed

### Dependencies
**AGT-01/SAN-595 (native approval) · AGT-14/SAN-608 (suspend/resume)** · CW-8 (handoff) · `hostEventAgent`

### Effort
4 days · ### Priority P2 (Phase 4)

---

# WA-008 — Venue Contact Approval Workflow

### Business Value
Protect venue relationships.

### Example
AI drafts: *"We'd like to partner with your venue"* → human approves before send.

### Acceptance
* approval gate (no autonomous outreach)
* audit trail
* resume support

### Dependencies
WA-007 (same AGT-01 + AGT-14 primitives)

### Effort
3 days · ### Priority P2 (Phase 4)

---

# WA-009 — Resource Memory Integration

### Business Value
Personalization.

### Example
Remember: Laureles · Budget $80 · Salsa events · Specialty coffee — across sessions.

### Technical
**Net-new.** Today memory is **thread-scoped only**. Needs resource-scoped working memory → memory processors → semantic recall.

### Acceptance
* memory retrieval (resource scope)
* memory updates
* channel persistence

### Dependencies
**AGT-02/SAN-597** → AGT-13/SAN-610 → AGT-08/SAN-603 · WA-001

### Effort
3 days · ### Priority P2 (Phase 4)

---

# WA-010 — Background Follow-Up Campaigns

### Business Value
Recover abandoned opportunities.

### Examples
unfinished booking · abandoned rental lead · ticket reminder

### Technical
Chatwoot Campaigns + Mastra background tasks; **opt-in only**, honor STOP.

### Acceptance
* scheduled execution
* opt-out support (STOP / `whatsapp_subscriptions`)
* audit logs

### Dependencies
WA-004 · WA-005 · WA-006 · **AGT-09/SAN-600**

### Effort
4 days · ### Priority P2 (Phase 4)

---

# Linear Structure

## Epic — WhatsApp Messaging (brain)

Project: **AI & Intelligence** · Team: Sanjiovani. WA-* children depend on existing **SAN-588 (AGT-00)** primitives. Channel/ops work (CW-*) lives in **Growth & Operations**.

> **No Linear issues created** (not requested) — structure proposed only.

## MVP Milestone

### P0
* WA-001 · WA-002

### P1
* WA-003 · WA-004 · WA-005 · WA-006

### P2 (Phase 4)
* WA-007 · WA-008 · WA-009 · WA-010

---

# Dependency Map

```text
AGT-10 ─┐
CW-2 ───┼→ WA-001 ─→ WA-003
CW-1 ───┘     │
              ↓
          WA-002 (Chatwoot send)
AGT-00A/B ────┤ (grounding guard gates every reply)
              ↓
CW-5 ─→ WA-004 ─→ WA-005
AGT-09 ─┴───────────┘
G1 ─→ WA-006

AGT-01 ─┐
AGT-14 ─┼→ WA-007 ─→ WA-008
CW-8 ───┘
AGT-02 ─→ WA-009  (→ AGT-13 → AGT-08)
AGT-09 + WA-004/005/006 ─→ WA-010
```

---

# MVP vs Post-MVP

## MVP (Phase 1–3)
* WA-001 · WA-002 · WA-003 · WA-004 · WA-005 · WA-006 · (+ AGT-00A/B grounding guard)

## Post-MVP (Phase 4)
* WA-007 · WA-008 · WA-009 · WA-010

---

# Revenue Impact

| Workflow         | Revenue Impact |
| ---------------- | -------------- |
| Rental Follow-Up | High           |
| Viewing Reminder | High           |
| Ticket Support   | Medium         |
| Host Approval    | High           |
| Venue Approval   | Medium         |
| Memory           | Medium         |
| Campaigns        | High           |

### Highest ROI Order
```text
1. Rental Follow-Up (WA-004)
2. Viewing Reminder (WA-005)
3. Ticket Support (WA-006)
4. Host Approval (WA-007)
5. Memory (WA-009)
```

---

# Risks & Blockers

| Risk | Severity | Fix |
| ------------------- | -------- | --------------- |
| **Ungrounded reply (hallucinated listing/price)** | **High** | **AGT-00A/B grounding guard (0 scorers today)** |
| Multiple AI systems | High | One `routerAgent` |
| Autonomous outreach (WA-007/008) | High | Approval gates (AGT-01) |
| WhatsApp spam | High | Opt-in only + STOP |
| Two WhatsApp senders | High | Single sender — Chatwoot (NFR3); `wa_outbox` stays a stub |
| Thin/empty audit trail | High | `ai_runs` + tracing (AGT-00C) |
| Long AI messages | Medium | Formatter (WA-003) |
| Missing retries | Medium | Transport-port retry |
| Complex agent graph | High | Workflows only |

---

# Final Recommendation

Build WhatsApp as a **transport-agnostic channel for the existing Mastra brain**, not a new product — Chatwoot as the production front door + human layer, the official Mastra direct webhook as the dev/fallback transport.

Phase 1 stops at:
```text
Webhook · Sender · Formatter · Grounding guard · Rental Follow-Up · Viewing Reminder · Ticket Support
```

This follows the current mdeai architecture (one router agent + workflows + human approvals), reuses existing agents/edge-functions, and directly supports the three MVP revenue loops:

* Camila → rental leads
* Andrés → ticket sales
* Roberto → event publishing

The automation tier (WA-007…WA-010) is **Phase 4** because it blocks on **net-new SAN-588 primitives** (native approval, suspend/resume, resource memory, background tasks) — not because it's hard to imagine, but because those primitives **do not exist yet**. Ship the guarded rental loop first; clone the pattern.
