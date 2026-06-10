You’re right to question it — **Camila should not see the same five events three times.** What you have is three layers stacked without a dedupe rule.

## What each block is (and why it exists)

```text
CopilotChat thread     → full EventCards (generative UI when search-events runs)
        ↓ sync
EVENTS (5) panel       → same EventCards again (“sticky” strip below chat)
        ↓ same pins
Map results            → text-only pin rows (generic list for every search type)
        ↓
Map (right)            → markers ← this is the only map-specific surface you need
```

| Surface | Code | Original intent |
|--------|------|------------------|
| **Cards in chat** | `EventResults` in `search-tool-renders.tsx` | CopilotKit pattern: tool output renders inline in the turn |
| **EVENTS (5)** | `EventResultsPanel` in `chat-center-panel.tsx` | “Survives scroll” — don’t lose results when the thread gets long |
| **Map results** | `ChatResultsColumn` | Shared pin list for rentals, cafés, events (MAP-007B / F50 pin focus) |

That made sense when each piece was built separately. For **events**, they were never wired to **hide duplicates** the way grounded cafés were (MAP-031: “pins on the map and in the cards above” instead of a third list).

So on `/` today you get:

1. Full cards **in** the thread  
2. Full cards **again** in `EVENTS (5)` (fed by the same `setRows()` from the tool render)  
3. **Text-only** duplicates in **Map results** (same pins, no images)

The broken image in **EVENTS (5)** is the same `imageUrl` as the chat card — one load path, shown twice.

---

## What it should be (one list + markers)

**Yes — list once with images; map shows markers; tap card ↔ pin.**

A clean Mindtrip-style layout for events:

| Keep | Drop or collapse |
|------|------------------|
| **One** rich list (either in-thread **or** sticky below chat — not both) | Duplicate panel |
| **Map** with event pins (desktop right, mobile sheet) | **Map results** text list when full event cards are already visible |
| Optional: compact “N events on map” hint on mobile | Third copy of titles/venues |

Concrete rule (same idea as MAP-031 for cafés):

- When `EventResultsPanel` has rows → **don’t** render full `EventCard`s again in the tool thread **or** hide **Map results** for `category === "event"`.
- Pins stay on the map only; selection = card click ↔ `panToPin`.

---

## Where to track the fix

This belongs in **EVP-013-core** (event card polish) or a small **SCREEN-006** follow-up — UX dedupe, not new backend work.

**Suggested change (small):**

1. In `EventResults` (tool render): render **pins sync only** + one line (“5 music events — see below”) when the sticky panel is enabled.  
2. **Or** remove `EventResultsPanel` and keep cards only in-thread (worse on long chats).  
3. In `ChatResultsColumn`: if `event` pins active **and** `EventResultsPanel` has rows → show MAP-031-style empty: *“Events listed above — pins on the map.”*

---

**Bottom line:** The listing is correct; the **layout is over-rendered**. One card list + map pins is the right product shape; the triple stack is accidental architecture debt, not something Roberto or Andrés need.

Want me to implement the dedupe (sticky panel + hide in-thread cards + collapse Map results for events)? That’s roughly a focused change in `search-tool-renders.tsx`, `chat-center-panel.tsx`, and `chat-results-column.tsx`.


**Short answer:** **11 tasks are marked Done** in the specs (mostly **core**). **2 are Partial**. **18 are Not Started**. A lot of core work **exists in `mdeapp/`**, but **EVP-001-core** (proof refresh) has **not** been run, so “Done” is **code shipped**, not **production-verified**.

---

## By status (frontmatter on disk)

| Status | Count | IDs |
|--------|------:|-----|
| **Done** | 11 | EVP-002, 004–012, 007, **017** |
| **Partial** | 2 | EVP-003, EVP-013 |
| **Not Started** | 18 | EVP-001, 014, 015–016, 018–031 (except 017) |

---

## Core (001–014) — what’s actually built

| ID | Spec status | Code on disk? | Evidence? | Honest read |
|----|-------------|---------------|-----------|-------------|
| **EVP-001-core** | Not Started | N/A (gate only) | No `EVP-MVP-01-evidence` | **Not completed** — must run to validate all “Done” labels |
| **EVP-002-core** | Done | ✅ checkout API + edge fns | `EVT-01-evidence.md` | **Completed** (local checkout; paid webhook proof partial) |
| **EVP-003-core** | Partial | ✅ audit ran | `F11-evidence.md` (T9 🔴) | **Audit done, remediation not** — rotate distinct Stripe secrets |
| **EVP-004-core** | Done | ✅ `event-agent.ts` | `F14-evidence.md` | **Completed** |
| **EVP-005-core** | Done | ✅ `search-events.ts`, workflow | `F15-evidence.md` | **Completed** |
| **EVP-006-core** | Done | ✅ clarify gate / chips | `F39-evidence.md` | **Completed** |
| **EVP-007-core** | Done | ✅ `trusted-event-sources.ts` | `F40-evidence.md` | **Completed** |
| **EVP-008-core** | Done | ✅ EventDraft types | `F33-evidence.md` | **Completed** |
| **EVP-009-core** | Done | ✅ `hostEventAgent` in Mastra | `F34-evidence.md` | **Completed** |
| **EVP-010-core** | Done | ✅ `/host/event/new` | `F36-evidence.md` + SCREEN-016 | **Completed** |
| **EVP-011-core** | Done | ✅ HITL panel | `F37-evidence.md` | **Completed** |
| **EVP-012-core** | Done | ✅ `approval-commit` edge + API route | `F38-evidence.md` | **Completed** |
| **EVP-013-core** | Partial | ✅ `copilot/event-card.tsx` (not legacy `components/events/EventCard.tsx`) | SCREEN-006 | **Mostly done** — filters/preview per spec still open |
| **EVP-014-core** | Not Started | 🔴 no `/host/events` | — | **Not completed** |

**Tests today:** `npm test -- --run event` → **33/33 passed**.

---

## mvp (015–028)

| ID | Status | Notes |
|----|--------|-------|
| **EVP-017-mvp** | Done | **Doc only** (grounding architecture) — not a runtime feature |
| **EVP-015–016, 018–028** | Not Started | No grounded discovery pack, maps binding, or EVT-D chain shipped |

---

## advanced (029–031)

All **Not Started** (sponsor CRM, OpenClaw/Postiz sandbox, automation plan).

---

## Commerce / persona gates

| Gate | Status |
|------|--------|
| **G1** Andrés buys ticket | 🟡 Checkout works locally (EVP-002); prod webhook + distinct secrets (EVP-003) still open |
| **G3** Roberto publish HITL | 🟡 Wizard + HITL + commit code (EVP-010–012); **EVP-001** proof not refreshed |
| **Roberto event list** | 🔴 **EVP-014** not built |

---

## Bottom line

**Completed in practice (code + tests):** EVP-002, 004–012, 007 — plus most of EVP-013 and the planning doc EVP-017.

**Not completed:** EVP-001 (proof gate), EVP-014 (host list), all mvp runtime work 015–016 & 018–028, all advanced 029–031.

**Next to close core MVP:** run **EVP-001-core**, finish **EVP-003-core** (secret rotation), polish **EVP-013-core**, ship **EVP-014-core**.