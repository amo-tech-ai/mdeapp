# Live-site QA — www.mdeai.co (Senior QA pass)

> **Date:** 2026-05-28 · **Target:** https://www.mdeai.co/ (production)
> **Method:** Chrome DevTools MCP (real browser, real network/SSE capture, real console). No code changed during this pass — test-and-report only.
> **Tester viewport:** desktop (default) for flows 1–8; `390×844×3, mobile, touch` (iPhone-class) for flow 9.
> **Evidence dir:** `tasks/testing/evidence/2026-05-28/` (screenshots + `.network-response` SSE captures referenced inline).

---

## TL;DR verdict

| Area | Verdict |
|---|---|
| **Rental fast-path** (search → cards → pins → empty-clear → mobile) | ✅ **WORKS end-to-end on prod.** This is the shipped C-010 path and it is solid. |
| **conciergeAgent / LLM verticals** (café, events, restaurants, day-trips) | ❌ **DEAD on prod.** Every `agent/run` to `conciergeAgent` terminates in `RUN_ERROR (EAUTHTIMEOUT) timeout while waiting for message` / `INCOMPLETE_STREAM`. No text, no cards, no pins, **and no user-facing error.** |
| **Price-wording bug** (`$500 a night` → monthly math) | ❌ **Reproduced on prod.** Fix is committed (`0660507`, branch `test/rentals-prod-qa-may28`) but **not merged to main and not deployed.** |
| **Auth gate** (`/saved`, `/trips`) | ✅ Correct redirect → `/login?next=…`, login renders. |
| **Intent routing** (no rental hijack) | ✅ `events in Laureles` does NOT hit the rental fast-path. PR #7 fix holds. |
| **Mobile** (390×844) | ✅ No horizontal scroll, cards fit, accessible map sheet with pin-count + focus mgmt. |

**One-line summary:** *Anything that does not require the LLM works well; everything routed through `conciergeAgent` is fully broken on prod with no error shown to the user.*

---

## Flow-by-flow results

| # | Flow | Prompt | Result | Evidence |
|---|------|--------|--------|----------|
| 1 | Baseline load | (load `/`) | ✅ PASS | `01-baseline.png` |
| 2 | Rentals happy | `1BR in Laureles under $80/night` | ✅ PASS — 5 cards + 5 pins | `02-rentals-happy.png` |
| 3 | Rentals empty | `1BR in Laureles under $1/night` | ✅ PASS — cards+pins clear to 0, no crash (PR #12) | `03-rentals-empty.png` |
| 4a | Price wording (slash) | `$500/night rental in Laureles` | ✅ PASS — 5 cards, "Within ~$500/night budget" | `04a-price-slashnight.png` |
| 4b | Price wording (prose) | `$500 a night rental in Laureles` | ❌ **FAIL/BUG** — "No rentals matched"; API got `maxPricePerNight:17` | `04b-price-anight-BUG.png` |
| 5 | Café | `Quiet cafés near Laureles` | ❌ **FAIL** — conciergeAgent, no output | `05-cafe-search.png` |
| 6 | Events | `Show 10 upcoming Medellín events from inventory` | ❌ **FAIL** — conciergeAgent, no output | `06-events-FAIL.png`, `events-run-431.network-response` |
| 7 | Saved/Trips nav | (nav `/saved`, `/trips`) | ✅ PASS — gated to login | `07-auth-gate-login.png` |
| 8 | Cross-intent regression | `events in Laureles` → rental | ✅ routing PASS / ❌ events output FAIL / ✅ rental recovery PASS | `08-cross-intent-rental-after-events.png`, `events-in-laureles-RUN_ERROR-613.network-response` |
| 9 | Mobile 390×844 | `1BR in Laureles under $80/night` | ✅ PASS — cards fit, map sheet works | `09a-mobile-baseline.png`, `09b-mobile-map-sheet.png` |

---

## Bugs / failures (with exact reproduction steps)

### 🔴 F-1 (CRITICAL) — conciergeAgent is dead on prod for ALL LLM verticals

**Severity:** Critical · **Real-world impact:** Tourist persona (cafés/restaurants/attractions) and any non-rental concierge ask get **nothing**. Homepage actively advertises "events, food" and shows "Events" + "Food & cafés" filter chips, so this is a prominent, user-visible dead end.

**What happens:** A `POST /api/copilotkit` `agent/run` to `conciergeAgent` emits `RUN_STARTED`, then (after a timeout) terminates with:

```
data: {"type":"RUN_ERROR","message":"(EAUTHTIMEOUT) timeout while waiting for message","code":"INCOMPLETE_STREAM"}
```

(captured verbatim — see `events-in-laureles-RUN_ERROR-613.network-response`). No `TEXT_MESSAGE_*`, no `TOOL_CALL_*`, no `RUN_FINISHED`.

**Repro (any of the three reproduces it):**
1. Open https://www.mdeai.co/ (fresh load).
2. Type **`Quiet cafés near Laureles`** (or `Show 10 upcoming Medellín events from inventory`, or `events in Laureles`) and Send.
3. Wait ~30s.
4. **Observed:** your message echoes in the chat; nothing else ever appears. Map stays "No pins yet". No error shown.
5. **Forensic confirm:** DevTools → Network → the `agent/run` `POST /api/copilotkit` row → Response is the two-line SSE above (`RUN_STARTED` then `RUN_ERROR EAUTHTIMEOUT / INCOMPLETE_STREAM`).

**Why "EAUTHTIMEOUT"?** The terminal event is a *timeout waiting for a message* from the agent runtime — i.e. the conciergeAgent run never produces output within the serverless window. Likely root causes to check (in priority order): (a) Gemini API key / `GOOGLE_GENERATIVE_AI_API_KEY` missing or wrong in the prod Vercel env so the model call hangs/rejects; (b) Mastra in-process agent transport not initializing on the serverless function (cold-start / storage adapter); (c) function timeout shorter than the upstream call. **This needs prod server logs to pin down** — the client side only sees the timeout.

> **Capture note (no failure hidden):** Café (flow 5) and events (flow 6) initial captures showed *only* `RUN_STARTED` — that was because the SSE stream was read before the timeout fired. The events-in-Laureles run (flow 8, reqid 613) was read after a longer delay and revealed the terminal `RUN_ERROR`. All three are the same failure.

---

### 🔴 F-2 (HIGH) — conciergeAgent failure is silent to the user

**Severity:** High · **Real-world impact:** Even once F-1 is fixed, this will bite again on any transient timeout. Today the user types a café/event request, sees their own bubble, and then… nothing — forever. No spinner-end, no error toast, no "I couldn't reach that right now, try again."

**Repro:** Same as F-1. After the `RUN_ERROR` arrives, the DOM shows the greeting + the user message only; no assistant node, no alert. The `RUN_ERROR` SSE event is **not surfaced** in the UI.

**Fix direction:** Handle the AG-UI `RUN_ERROR` / stream-incomplete event in the chat client and render a retto-able error message.

---

### 🟠 F-3 (HIGH, BUG) — `$500 a night` parsed as monthly → wrong/empty results

**Severity:** High · **Real-world impact:** Camila types a perfectly normal phrasing ("$500 a night") and gets "No rentals matched" because the parser divides by 30 → `maxPricePerNight ≈ 17`. Silent wrong answer.

**Repro on prod:**
1. https://www.mdeai.co/ → type **`$500 a night rental in Laureles`** → Send.
2. **Observed:** "No rentals matched." Network: `POST /api/rentals/search` body = `{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":17,"limit":8}` (500÷30≈17). Compare `$500/night` (flow 4a) → 5 cards.

**Root cause** (`src/lib/rental-query-parser.ts`, current prod/this-branch line 78):
```ts
if (amount >= 400 && !/\/\s*night|per night/i.test(text)) {   // "a night"/"nightly" not matched → monthly branch
  return { maxPricePerNight: Math.round(amount / 30), budgetType: "monthly" };
}
```

**Fix status:** ✅ committed as `0660507` on branch `test/rentals-prod-qa-may28` (widens guard to `!/\bnight(?:ly)?\b/i` + adds `src/lib/__tests__/rental-query-parser.test.ts`, 5 cases). ❌ **NOT merged to main, NOT on the currently-checked-out branch (`test/c010d-prod-pin-clear-e2e`), NOT deployed.** Prod confirmed still buggy this session.

---

### 🟡 F-4 (MEDIUM) — stale Google-map markers after results clear *(prior-session observation, carry-forward)*

After a rental result set clears (side panel → "No pins yet", `data-pin-category` count 0), residual `gmp-advanced-marker` elements for the old listings can persist on the Google map until a full reload. Re-verify against the deployed PR #12 build. (Flow 3 this session showed the side-panel/pin-count clearing correctly; the residual-marker case is the map-layer DOM, tracked separately.)

### 🟡 F-5 (MEDIUM) — "New chat" does not reset the session *(prior-session observation)*

Clicking "New chat" (a link to `/`) within a live SPA session can leave prior messages / markers in place; a full reload is needed. Expected: clear thread + map.

### 🔵 F-6 (LOW / by-design) — sticky filters across turns

`minBedrooms` (and other filters) carry across turns via working-memory merge (`s.minBedrooms ?? q?.minBedrooms`). Intended behavior, but worth a visible "filters applied" affordance so the user understands why a later, vaguer query is still scoped to "1 BR".

---

## What passed (positive evidence)

- **Rental fast-path is genuinely good.** `1BR in Laureles under $80/night` → 5 inline cards (`$25` Cozy Studio … `$80` Segundo Parque), each with Details / Schedule viewing / Save, "BEST MATCH" badge, "Within ~$80/night budget" rationale, **5 map markers in 1:1 sync with the 5 cards**, map auto-pans to results. Fast (first card well under the 30s wait; API alone ~0.66s per the curl smoke).
- **Empty-result clearing (PR #12)** works: `…under $1/night` → cards and pins both go to 0, no crash, panel returns to "No pins yet".
- **Intent routing holds (PR #7).** `events in Laureles` fired **only** `POST /api/copilotkit` (conciergeAgent) — **no** `POST /api/rentals/search`, **zero** rental cards. No hijack.
- **No state poisoning.** After the broken `events in Laureles` run, a follow-up `1BR in Laureles under $80/night` returned a full 5-card + 5-pin result set. The dead concierge does not corrupt the fast-path.
- **Auth gate** is correct: `/saved` → `/login?next=%2Fsaved`, `/trips` → `/login?next=%2Ftrips`; login page renders email magic-link + Google OAuth, and `next` is preserved into the Sign-up link.
- **Mobile (390×844)** is well-built: no horizontal scroll (`scrollWidth == clientWidth`), 5 cards each 358px in a 390px viewport, hamburger nav, **"Open map with 5 pins"** toggle (pin count surfaced), map opens as an accessible `dialog` ("Tap a pin or close to return to chat. Escape closes this sheet."), focus moves to Close on open, 5 pins = 5 cards parity. Zero console errors.
- **Console hygiene:** no critical console errors observed on any flow (desktop or mobile).

---

## Timings (observed, prod, cold-ish session)

| Action | Observed |
|---|---|
| `GET /` first paint / map-ready | fast (≤1s class; baseline 200 in 0.66s prior) |
| Rental fast-path → first card | well under 30s wait window; API ~0.66s |
| conciergeAgent (café/events) | **times out** → `EAUTHTIMEOUT` terminal (no successful completion to measure) |

---

## Deploy / branch state (reconciled this session)

- Git root: `/home/sk/mdeai/mdeapp`. Currently on `test/c010d-prod-pin-clear-e2e` (clean tree).
- This branch has the **PR #12 prod gate** commit (`db8ba6a`) but **not** the price-wording fix.
- The price-wording fix + unit test live on **`test/rentals-prod-qa-may28`** (`0660507`), unmerged.
- **Prod is running neither the price fix nor (evidently) a working conciergeAgent.** Confirm the deployed commit in Vercel `amo100/mdeai` before claiming any of the above fixed.

---

## Anti-fake-done attestation

- All ✅/❌ above are backed by real prod network captures, DOM reads, and screenshots in this evidence dir — not assumptions.
- Failures are reported, not hidden (F-1 café/event dead path is the headline finding).
- No source files were modified during this QA pass.
- The price-wording fix is **committed but undeployed**; this report does **not** claim it is live.
