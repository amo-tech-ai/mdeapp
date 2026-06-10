Fetching the current Linear state for all INT issues.

I can see two discrepancies between local task files and Linear:
- **INT-006** (SAN-409): local = Done, Linear = In Progress — needs updating
- **INT-021** (SAN-424): Linear = Done, local = Not Started (partial impl, not on main) — needs a note

Applying the surgical updates now.

Updating INT-006 state to Done and adding comments on both issues in parallel.

Done. Here's what landed in Linear:

- **[SAN-409](https://linear.app/sanjiovani/issue/SAN-409)** → state flipped to Done + proof comment (435 tests, live Supabase, hybrid path fixed)
- **[SAN-424](https://linear.app/sanjiovani/issue/SAN-424)** → comment flagging the discrepancy; left state for you to flip since partial implementation exists (restaurant slice) but venue wrapper is not on main

---

## Suggested next steps

**1. Mark INT-010 Done (5 min)**
The Zod drift fix (`genericAskPending`, `checkIn`, `checkOut` on `lastRentalQuery`) was absorbed into INT-006 and is already on main. SAN-413 still shows In Progress — flip it to Done. The only open item (`scope: resource` spike) is explicitly deferred to Phase 2.

**2. Ship UX-001 — this unblocks the entire INT-003/004/009 chain**
INT-003 (smart clarify routing) and INT-004 (remove canned bypass) are In Review but can't go to prod until `conciergeAgent` is restored on prod (EAUTHTIMEOUT). Both tasks have the deployment gate comment. Once UX-001 lands, INT-003 → INT-004 → INT-009 all become unblocked.

**3. INT-009 — CopilotKit readable UI state (can start now)**
Doesn't depend on UX-001 for local dev. Add `useCopilotReadable` for `mapUi` (viewport + `selectedPinId`) in the map components. The verify steps are now written. This is one of the higher-impact gaps: Camila panning the map and asking "show me options here" currently has no viewport context for the agent.

**4. INT-021 — complete the venue wrapper (flip SAN-424 to In Progress)**
Restaurant fast-path is green; the venue specialist clarify + `search-grounded-places` wiring is the remaining work. The INT-005 fixture rows for restaurant/venue also need adding before this can be called Done.

**5. INT-011/012 (schema + interactions) when POST-MVP window opens**
These are Backlog-gated on Phase 1 stabilising. Don't start until CORE (INT-003/004) is off the review queue.


Fetching the current Linear state for all INT issues.

I can see two discrepancies between local task files and Linear:
- **INT-006** (SAN-409): local = Done, Linear = In Progress — needs updating
- **INT-021** (SAN-424): Linear = Done, local = Not Started (partial impl, not on main) — needs a note

Applying the surgical updates now.

Updating INT-006 state to Done and adding comments on both issues in parallel.

Done. Here's what landed in Linear:

- **[SAN-409](https://linear.app/sanjiovani/issue/SAN-409)** → state flipped to Done + proof comment (435 tests, live Supabase, hybrid path fixed)
- **[SAN-424](https://linear.app/sanjiovani/issue/SAN-424)** → comment flagging the discrepancy; left state for you to flip since partial implementation exists (restaurant slice) but venue wrapper is not on main

---

## Suggested next steps

**1. Mark INT-010 Done (5 min)**
The Zod drift fix (`genericAskPending`, `checkIn`, `checkOut` on `lastRentalQuery`) was absorbed into INT-006 and is already on main. SAN-413 still shows In Progress — flip it to Done. The only open item (`scope: resource` spike) is explicitly deferred to Phase 2.

**2. Ship UX-001 — this unblocks the entire INT-003/004/009 chain**
INT-003 (smart clarify routing) and INT-004 (remove canned bypass) are In Review but can't go to prod until `conciergeAgent` is restored on prod (EAUTHTIMEOUT). Both tasks have the deployment gate comment. Once UX-001 lands, INT-003 → INT-004 → INT-009 all become unblocked.

**3. INT-009 — CopilotKit readable UI state (can start now)**
Doesn't depend on UX-001 for local dev. Add `useCopilotReadable` for `mapUi` (viewport + `selectedPinId`) in the map components. The verify steps are now written. This is one of the higher-impact gaps: Camila panning the map and asking "show me options here" currently has no viewport context for the agent.

**4. INT-021 — complete the venue wrapper (flip SAN-424 to In Progress)**
Restaurant fast-path is green; the venue specialist clarify + `search-grounded-places` wiring is the remaining work. The INT-005 fixture rows for restaurant/venue also need adding before this can be called Done.

**5. INT-011/012 (schema + interactions) when POST-MVP window opens**
These are Backlog-gated on Phase 1 stabilising. Don't start until CORE (INT-003/004) is off the review queue.



Here's where things stand, in plain terms:

---

## What just shipped ✅

| Task | What it does for Camila |
|---|---|
| **INT-006** (today) | "rentals june 1–30 $1000" now extracts real ISO dates, filters the DB for available listings, and sorts monthly rentals first |
| **INT-022** (last session) | Every routing decision logs a structured record (debug-only) so you can tune confidence thresholds with real data |

---

## Three open tracks right now

### Track 1 — INT-010 PR close-out (quick, 10 min)
**PR #39** at `amo-tech-ai/mdeapp` was fixing a Zod drift — `genericAskPending` missing from `lastRentalQuery`. **INT-006 just fixed that same field** in `concierge.ts`. PR #39 may now conflict or be redundant. You should:
1. Check if PR #39 is still needed or can be closed
2. Once resolved, flip INT-010 → Done in Linear + archive the spec

### Track 2 — INT-021 Restaurant & venue wrapper (in progress, ready to continue)
Half-done. The restaurant fast-path search exists; the `venue_search` wrapper doesn't. This doesn't depend on anything blocked. It's the natural "do next" item.

### Track 3 — INT-003 / INT-004 unblocking (stuck, needs prod fix first)
These are the Gemini smart-clarify routing tasks — code is on `main` but they can't be verified/closed because **`conciergeAgent` crashes on prod** (`EAUTHTIMEOUT`). They're blocked until **UX-001** (restore concierge agent) is done. Nothing you can do on INT-003/004 until that's fixed.

---

## My recommendation (simplest path)

```
1. INT-010 close-out — check PR #39, merge or close (10 min)
2. INT-021 finish — wire venue_search wrapper (1–2 hours)
3. UX-001 — fix conciergeAgent prod crash (unblocks INT-003/004)
```

INT-009 (CopilotKit readable state) is after INT-003 in the chain, so it stays blocked until #3. The POST-MVP tasks (INT-011 user preferences schema) are next in line after the MVP sequence clears.

Want me to start on any of these?