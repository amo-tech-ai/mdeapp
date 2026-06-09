# Forensic Audit — Trips Management System PRD

> **Verification pass:** 2026-05-26 · Supabase MCP `zkwcbyxiwklihegjhuql` + `mdeapp/src/trips` disk · Skills: mde-supabase, task-verifier, copilotkit, mastra.

## Verification summary (corrected)

| Audit claim | Verdict | Live evidence |
|-------------|---------|---------------|
| Overall **86/100** | **Adjust → 82/100** | Architecture direction holds; several “critical fixes” already partial on disk or overstated for MVP |
| Reuse existing schema | ✅ Verified | `trips` (2), `trip_items` (4), RLS on cluster — [`audit-supabase.md` §4](../data/audit-supabase.md) |
| **`item_type` CHECK missing** | ❌ **Stale** | Constraint **`trip_items_item_type_check`** exists: `event`, `restaurant`, `rental`, `poi`, `other` — extend for `showing`, `booking`, `custom_note` (data-027), not greenfield |
| **`metadata jsonb` missing** | ❌ **Stale** | Column exists on `trip_items` |
| Snapshot fields missing | 🟡 **Partial** | `title`, `address`, `location_name`, `latitude`, `longitude` already denormalized at insert — add `image_url` in `metadata` at write time; no `*_snapshot` columns needed MVP |
| Webhook → trip_items gap | ✅ Verified | `ticket-payment-webhook` has `idempotency_keys` ✅ but **no `trip_items` insert** (grep zero) — TRIP-010 / data-028 valid |
| Durable queue required MVP | 🟡 **Defer** | Existing `idempotency_keys` + upsert `unique_trip_item` sufficient for MVP; full queue = POST-MVP unless sync failure rate proves need |
| `mastra_threads.trip_id` column | ✅ Valid defer | Use `metadata->>'trip_id'` MVP; indexed column POST-MVP (data-029) |
| Client-only conflict detect | ✅ Verified | `itinerary-logic.ts` + UI banner; server RPC POST-MVP |
| `trip_activity_log` missing | ✅ Valid **POST-MVP** | Not launch blocker; use Supabase logs + `conflict_resolutions` MVP |
| Soft-delete on `trip_items` | ✅ Gap | No `deleted_at` on `trip_items` / `saved_places`; `collections.deleted_at` ✅ — data-027 optional |
| `version` optimistic lock | POST-MVP | `updated_at` exists on `trip_items` |
| App shell exists | ✅ Verified | `app/trips/page.tsx`, `[id]/page.tsx`, components, unit tests |
| `/saved` route | ❌ Missing | SCREEN-011 not on disk |
| Create trip modal | ❌ Missing | TRIP-003 |
| Playwright SCREEN-012/013 | ❌ Missing | Spec paths in scr frontmatter only |

**Revised priority fixes (MVP):**

1. **data-028 / TRIP-010** — idempotent `event_orders` / `showings` → `trip_items` mirror (webhook or edge hook)
2. **data-027** — extend `item_type` CHECK + insert RPC with ownership validation
3. **TRIP-003–007** — create trip, saved, add-to-trip (product path)
4. **TRIP-009** — persist conflicts + CopilotKit HITL card
5. POST-MVP: `trip_activity_log`, `mastra_threads.trip_id` FK, server conflict RPC, soft-delete columns

Canonical tasks: [`../tasks/`](../tasks/) · PRD: [`../trips-plan.md`](../trips-plan.md)

---

## Executive Verdict

**Overall score: 86/100**

The architecture direction is strong and significantly better than most AI-first travel systems because it correctly keeps:

* Supabase as truth
* Stripe as payment authority
* AI orchestration separated from deterministic writes
* RLS ownership boundaries
* Existing schema reuse over schema explosion

The PRD correctly avoids the biggest failure pattern:

```text
"Mindtrip clone overengineering before MVP validation"
```

The document repeatedly enforces:

```text
Do not add:
- trip_days
- timeline_events
- collection_items
- itinerary_suggestions
```

for MVP. 

That is the correct decision.

---

# What Is Correct

| Area                                   | Verdict        |
| -------------------------------------- | -------------- |
| Existing schema reuse                  | ✅ Correct      |
| `trip_items` as single timeline source | ✅ Correct      |
| Supabase ownership model               | ✅ Correct      |
| Stripe/payment truth separation        | ✅ Correct      |
| RLS-first architecture                 | ✅ Correct      |
| AI approval gating                     | ✅ Correct      |
| Deferred advanced tabs                 | ✅ Correct      |
| CopilotKit as UI/action layer          | ✅ Correct      |
| Mastra as orchestration layer          | ✅ Correct      |
| ADK/Maps read-only grounding           | ✅ Correct      |
| No `timeline_events` table             | ✅ Very correct |
| No `trip_days` MVP dependency          | ✅ Correct      |
| Idempotent trip item insertion         | ✅ Correct      |

---

# Biggest Architectural Strength

This is the best part:

```text
Chat
 → Mastra orchestration
 → Supabase truth
 → Workspace UI
 → Maps rendering
```



This is production-correct.

Most AI trip systems incorrectly let:

* AI own scheduling
* AI own itinerary state
* AI mutate bookings directly

This PRD correctly avoids that.

---

# Critical Red Flags

## 🔴 RED FLAG 1 — `trip_items` becoming a God-table

Current design:

```text
trip_items:
- rentals
- events
- restaurants
- bookings
- showings
- attractions
- notes
```



This is good for MVP.

BUT:
without strict contracts it becomes:

```text
jsonb chaos
```

### Critical fix

**Already exists** — extend, do not recreate:

```sql
-- Live: trip_items_item_type_check (event, restaurant, rental, poi, other)
ALTER TABLE public.trip_items DROP CONSTRAINT trip_items_item_type_check;
ALTER TABLE public.trip_items ADD CONSTRAINT trip_items_item_type_check
  CHECK (item_type IN (
    'rental', 'event', 'restaurant', 'poi', 'showing', 'booking', 'custom_note', 'other'
  ));
```

AND validate `metadata` at app/tool layer (Zod in Mastra tool + server action). Column already exists.

---

# 🔴 RED FLAG 2 — Missing realtime/event sync architecture

The PRD mentions:

```text
ticket paid → trip item appears
```



But does NOT fully define:

* webhook orchestration
* sync retries
* replay safety
* duplicate prevention
* queue failures

### Failure point

If Stripe webhook succeeds but trip insert fails:

```text
paid ticket
NO itinerary item
```

### Critical fix

**MVP:** extend `ticket-payment-webhook` (or mdeapp finalize route) with **idempotent** `trip_items` upsert keyed on `unique_trip_item (trip_id, item_type, source_id)` after `event_orders` commit. Reuse existing `idempotency_keys` for Stripe replay — **no new queue table** until failure metrics justify it.

**POST-MVP:** durable outbox if webhook succeeds but trip sync fails repeatedly.

---

# 🔴 RED FLAG 3 — Trip-scoped chat ownership unclear

Current proposal:

```text
mastra_threads.metadata.trip_id
```



This is acceptable temporarily.

BUT:
metadata lookups become slow + unsafe at scale.

### Best practice

MVP:

```text
metadata.trip_id
```

Post-MVP:
add:

```sql
trip_id uuid references trips(id)
```

to:

```text
mastra_threads
```

with index.

---

# 🔴 RED FLAG 4 — No offline/partial state strategy

Current design assumes:

```text
all items fully hydrated
```

But:
Places API failures
Map failures
deleted events
removed rentals
expired listings

will break timeline rendering.

### Critical fix

**MVP:** on insert, copy `title`, `address`, `location_name`, `latitude`, `longitude` from source entity (already columns). Store `image_url` and display labels in `metadata` JSON.

**POST-MVP:** only add dedicated `*_snapshot` columns if metadata proves insufficient for archived itineraries.

---

# 🟠 HIGH RISK — Overcoupling itinerary to live entities

Current system depends heavily on:

```text
source_id
```

This is dangerous long-term.

If:

* event deleted
* restaurant removed
* apartment expired

timeline breaks.

### Best practice

Hybrid model:

```text
source_id = live entity
snapshot fields = historical truth
```

---

# 🟠 HIGH RISK — Conflict detection only client-side

Current PRD:

```text
Client-side overlap detection
```



This is okay for MVP.

BUT:
server-side validation is eventually required.

### Future issue

Multiple devices:

```text
mobile insert
desktop insert
AI insert
```

can bypass client conflict logic.

### Recommendation

MVP:

* client detect

Post-MVP:

* server conflict RPC

---

# 🟠 HIGH RISK — OpenClaw boundaries not strict enough

PRD says:

```text
OpenClaw enrichment drafts only
```

Correct. 

BUT:
must explicitly prohibit:

* automatic itinerary inserts
* automatic bookings
* automatic WhatsApp sends
* automatic edits

### Add hard rule

```text
OpenClaw may draft only.
User approval required before all writes.
```

---

# Missing Systems

## Missing 1 — Audit/Event Log

**POST-MVP.** For MVP use:

* `conflict_resolutions` for conflict lifecycle
* `trip_items.created_at` / `updated_at`
* Edge fn logs + `idempotency_keys` for webhook replay

Add `trip_activity_log` only when Patricia needs ops dashboard for trip edits.

---

## Missing 2 — Soft-delete strategy

| Table | `deleted_at` live? | Action |
|-------|-------------------|--------|
| `collections` | ✅ | Use as-is |
| `trips` | ✅ | Use as-is |
| `trip_items` | ❌ | POST-MVP migration or hard-delete MVP |
| `saved_places` | ❌ | POST-MVP if undo-save required |

---

## Missing 3 — Versioning

Need optimistic concurrency:

```sql
version integer default 1
updated_at timestamptz
```

Otherwise concurrent edits will overwrite.

---

# Supabase Best Practices Verification

Verified against Supabase production guidance:

| Practice                             | Correct? |
| ------------------------------------ | -------- |
| RLS-first architecture               | ✅        |
| User-scoped writes                   | ✅        |
| Edge/webhook payment ownership       | ✅        |
| No service role in browser           | ✅        |
| Realtime optional                    | ✅        |
| Cache Google data                    | ✅        |
| Thin client, DB truth                | ✅        |
| Idempotent inserts                   | ✅        |
| Deferred premature schema complexity | ✅        |

Supabase strongly recommends:

* RLS everywhere
* server/edge payment logic
* avoiding uncontrolled service_role exposure
* idempotent event processing

This PRD aligns well with those principles.

---

# Best Parts of the PRD

## 1. Avoiding schema explosion

Excellent:

```text
Do not create:
- trip_days
- timeline_events
- collection_items
```



Huge win.

---

## 2. AI boundaries

Excellent:

```text
Gemini must not invent places, prices, ticket status, or booking state.
```



Correct architecture.

---

## 3. MVP-first sequencing

Excellent roadmap ordering:

```text
dashboard
→ workspace
→ itinerary
→ saved
→ add-to-trip
→ map
→ conflicts
→ booking sync
```



Correct dependency order.

---

# Biggest Improvement Recommended

## Add this architecture layer

```text
External truth
  ↓
Webhook/event queue
  ↓
Sync processor
  ↓
trip_items mirror
  ↓
CopilotKit UI
```

NOT:

```text
Webhook
 → direct insert
```

---

# Production Readiness Score

| Category                | Score |
| ----------------------- | ----: |
| Schema architecture     |    89 |
| MVP scoping             |    95 |
| AI boundaries           |    92 |
| Supabase correctness    |    88 |
| CopilotKit integration  |    84 |
| Mastra orchestration    |    83 |
| Maps/ADK usage          |    80 |
| Realtime/event handling |    66 |
| Auditability            |    62 |
| Long-term scalability   |    78 |

# Final Score

# **82/100** (revised after MCP verification — was 86)

Architecture direction unchanged; deductions for overstated schema gaps and MVP-blocking queue/activity-log recommendations.

---

# Final Recommendation

This is the correct direction.

DO:

* ship lightweight MVP
* reuse existing schema
* keep one timeline table
* keep AI approval-gated
* keep Stripe authoritative

DO NOT:

* build full Mindtrip clone
* create 15 new tables
* let AI mutate bookings directly
* overbuild agents
* overbuild routes/calendar/media systems

# Highest Priority Fixes

```text
1. TRIP-010 / data-028 — idempotent booking → trip_items sync (webhook gap verified)
2. data-027 — extend item_type CHECK + insert RPC
3. TRIP-003–007 — create trip, /saved, add-to-trip product path
4. TRIP-009 — conflict persist + CopilotKit HITL
5. POST-MVP: trip_activity_log, mastra_threads.trip_id FK, soft-delete, server conflict RPC
6. EVP-003 — webhook secret audit (parallel, not trips-specific)
```

Ship MVP after items 1–4; do not block on queue table or activity log.
