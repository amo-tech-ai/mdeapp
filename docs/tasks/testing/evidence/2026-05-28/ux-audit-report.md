# UX Architect Audit — www.mdeai.co

> **Date:** 2026-05-28 · **Target:** https://www.mdeai.co/ (production)
> **Basis:** Evidence-only. Every finding traces to a captured network/SSE response, DOM read, or screenshot from the live-site QA pass ([`live-site-qa-checklist.md`](./live-site-qa-checklist.md), findings F-1…F-6). No guesses — where root cause is unknown I say so.
> **Lens:** Camila (apartment seeker) and the Tourist (cafés / restaurants / attractions) — the two personas a visitor actually exercises on the homepage today.
> **Rating key:** Severity = `critical / high / medium / low`. Difficulty = `easy (<1h) / medium (½–1 day) / hard (multi-day or needs infra)`. Impact = the persona-visible consequence.

---

## 1. Executive audit

mdeai presents itself on the homepage as a **"Concierge — rentals, events, food, map."** In production today, exactly **one of those four pillars works: rentals.** The other three (events, food, and every other LLM-routed ask) are not degraded — they are **completely dead, and they fail silently.**

Two products are effectively running behind one chat box:

1. **The rental fast-path (C-010)** — a deterministic NL parser that turns "1BR in Laureles under $80/night" into a `POST /api/rentals/search` with **no LLM in the loop**. This path is genuinely good: 5 inline cards in 1:1 sync with 5 map pins, correct empty-state clearing, no intent-hijack, clean mobile, zero console errors. This is shippable.

2. **The conciergeAgent (the actual LLM)** — everything café / event / restaurant / attraction / day-trip routes here via `POST /api/copilotkit`. On prod **every** run terminates in `RUN_ERROR (EAUTHTIMEOUT) … INCOMPLETE_STREAM` after emitting only `RUN_STARTED`. The user sees their own message echo and then nothing, forever. No spinner-end, no error, no retry.

**The headline UX problem is not that a feature is broken — it's that the homepage actively advertises the broken half** (greeting says "I can help with rentals, events, restaurants, and day trips"; "Events" and "Food & cafés" filter chips are right there) **and then dead-ends the user with zero feedback.** A first-time Tourist's most likely outcome is "this app is dead," even though the rental engine underneath is solid.

The fastest path to a credible production state is therefore not a redesign — it is: (1) get conciergeAgent answering at all, (2) never let a run fail silently, (3) ship the already-committed price-parsing fix. None of these is a UI overhaul.

**Production-readiness today: 48 / 100** (breakdown in §10). The rental experience alone would score ~80; the silent death of 3 of 4 advertised pillars drags the product down.

---

## 2. Top 10 fixes (ranked by impact ÷ effort)

| # | Fix | Evidence | Severity | Difficulty | Why this rank |
|---|-----|----------|----------|------------|---------------|
| 1 | **Restore conciergeAgent on prod** — diagnose `EAUTHTIMEOUT/INCOMPLETE_STREAM` from prod server logs (check Gemini key in Vercel env, Mastra serverless transport init, function timeout) | F-1 (`events-in-laureles-RUN_ERROR-613.network-response`) | **Critical** | Easy→Hard (unknown until logs) | 3 of 4 advertised pillars are down. Nothing else matters if the concierge can't answer. |
| 2 | **Surface a user-facing error on `RUN_ERROR`/timeout** — render a retryable "I couldn't reach that right now" message instead of silence | F-2 | **High** | Easy–Medium | Even after #1, transient timeouts will recur. Silent-forever is the worst failure mode in a chat UI. Cheap insurance. |
| 3 | **Merge + deploy the price-wording fix** (`0660507`) so `$500 a night` ≠ monthly math | F-3 | **High** | Easy (code already written) | Already committed on `test/rentals-prod-qa-may28` with unit tests. Pure merge+deploy. Stops silent wrong answers for Camila. |
| 4 | **Don't advertise dead pillars while concierge is down** — soften greeting + hide/disable "Events" and "Food & cafés" chips until #1 lands | F-1 + homepage copy | **High** | Easy | Stops sending every Tourist into a dead end. A 1-hour mitigation that buys time for #1. Revert when concierge is healthy. |
| 5 | **Add a loading/working indicator for concierge runs** — show the user the agent is thinking between `RUN_STARTED` and first token | F-1/F-2 (no spinner-end observed) | Medium | Easy | A chat with no "typing" state feels broken even when it's working. Pairs with #2. |
| 6 | **Make "New chat" actually reset** thread + map markers (not just navigate to `/`) | F-5 | Medium | Easy–Medium | Camila/Tourist expect a clean slate; today stale state carries over. |
| 7 | **Clear residual `gmp-advanced-marker` DOM on empty results** | F-4 | Medium | Medium | Side-panel clears correctly (PR #12) but old map-layer markers can linger until reload. Misleads on "no results." |
| 8 | **Show a "filters applied" affordance** when working-memory carries `minBedrooms`/budget across turns | F-6 | Low | Easy | Explains why a vague follow-up is still scoped to "1 BR." Small clarity win. |
| 9 | **Make `Save` either work or read as "coming soon"** — it's disabled with a dev-string tooltip ("Saved collections ship with SCREEN-011") | DOM read (flow 2/8) | Low | Easy (copy) / Hard (feature) | A disabled primary action on every card looks broken to users. At minimum, friendlier copy; ideally ship SCREEN-011. |
| 10 | **Add a prod synthetic check for conciergeAgent** — a scheduled `agent/run` smoke that alerts on `RUN_ERROR` | F-1 (went undetected to a live QA pass) | Medium | Medium | This outage was invisible until manual QA. A 1-line synthetic would have paged on it. |

---

## 3. Quick wins (< 1 hour each)

Ship these today; none requires a redesign or risky refactor.

- **[#3] Merge + deploy `0660507`** — the `$500 a night` fix is written and unit-tested. *Severity High · Difficulty Easy.* (Per repo rule "one worktree, one PR" — open the PR, don't force-merge.)
- **[#4] Greeting + chip mitigation** — change the greeting to lead with what works ("Try: *1BR in Laureles under $80/night*") and disable the "Events"/"Food & cafés" chips with a "coming back soon" title while concierge is down. *High · Easy.* Revert when §2#1 lands.
- **[#2 minimal] Generic concierge error** — when a `POST /api/copilotkit` stream ends in `RUN_ERROR` or exceeds ~20s with no token, append a plain assistant message: "Sorry — I couldn't reach that just now. Tap to retry." *High · Easy.*
- **[#5] Working indicator** — render the existing typing/loading state on `RUN_STARTED`, end it on `RUN_FINISHED`/`RUN_ERROR`. *Medium · Easy.*
- **[#9 copy] Save tooltip** — replace the internal string "Saved collections ship with SCREEN-011" with user-facing "Saving is coming soon." *Low · Easy.* (Ships internal ticket IDs to end users today.)
- **[#8] "Filters applied" chip** — surface the carried `1 BR` / budget as a dismissible chip above the results. *Low · Easy.*

---

## 4. MVP-safe fixes (low regression risk, do before calling it MVP)

These are required for an honest MVP because they restore advertised functionality or stop silent wrong answers — and none touches the working rental fast-path.

| Fix | Why MVP-blocking | Risk to existing rental path |
|-----|------------------|------------------------------|
| §2#1 conciergeAgent restore | The product is sold as a 4-pillar concierge; 3 pillars dead = not an MVP | None (isolated `/api/copilotkit`; QA confirmed dead concierge doesn't poison fast-path) |
| §2#2 error on `RUN_ERROR` | Silent-forever fails the most basic chat expectation | None (additive client handling) |
| §2#3 price-wording fix | Common phrasing → silent wrong answer for the *one* persona that works | Low — guarded by the 5 new unit cases in `0660507` |
| §2#5 working indicator | Distinguishes "thinking" from "dead" | None |
| §2#6 New-chat reset | Basic session hygiene | Low — scope to thread+map reset |

**Sequencing:** #3, #2, #5 (quick wins) → #1 (the real work) → #6. Then re-enable the chips/greeting (undo #4).

---

## 5. Post-MVP (valuable, not blocking)

- **Save / Saved collections (SCREEN-011)** — make the disabled `Save` button real. *Impact: Camila can shortlist; Difficulty: Hard (new surface).*
- **Stale-marker cleanup (F-4)** if it proves edge-case-only after PR #12 re-verify. *Medium.*
- **"Filters applied" affordance (F-6)** elevated from chip to an editable filter bar (tap to remove "1 BR"). *Low impact, Medium effort.*
- **Concierge result cards** — once the LLM answers, café/event/restaurant results deserve the same inline-card + map-pin treatment the rentals get (consistency). *Medium.*
- **Latency budget for concierge** — once live, hold first-token < 3s (rentals already feel instant; LLM must not feel like the dead state it replaces). *Medium.*
- **Conversation persistence** — confirm thread survives reload/cold-start (the F13 storage-adapter concern from CLAUDE.md). *Medium.*

---

## 6. Mobile (390 × 844, iPhone-class) — flow 9

**Verdict: the best-executed surface in the app.** Evidence (`09a-mobile-baseline.png`, `09b-mobile-map-sheet.png`):

- ✅ **No horizontal scroll** — `scrollWidth == clientWidth`. Cards render 358px wide in a 390px viewport (correct gutters).
- ✅ **Accessible map sheet** — hamburger "Open navigation" + an "Open map with **5 pins**" toggle (pin count surfaced in the label — nice). Map opens as a proper `dialog` with helper text ("Tap a pin or close to return to chat. Escape closes this sheet."), focus moves to Close on open, Escape closes. This is real a11y work, not an afterthought.
- ✅ **5 pins = 5 cards parity** on mobile, same as desktop.
- ✅ **Zero console errors** on mobile.

**Mobile-specific issues:** none unique. Mobile inherits every concierge failure (F-1/F-2) and the price bug (F-3) identically — the dead café/event experience is just as dead on a phone, and arguably worse because the chips are the most tappable thing on a small screen.

*Severity (mobile-only): none new. Difficulty to keep it good: Easy — just don't regress it.*

---

## 7. AI / response quality

A crucial nuance the homepage hides: **the part that works isn't the AI, and the AI doesn't work.**

- **Deterministic parser (works, good quality):** the rental rationale is grounded and specific — "In Laureles · 1 BR fits your bedroom ask · Within ~$80/night budget · Fast WiFi · Pet-friendly," a "BEST MATCH" badge, and per-card price normalization ($25/night ~$750/mo). This is high-quality, no-hallucination output because it's templated from real DB rows, not generated. Keep it.
- **The price-parser is an NLU-quality defect (F-3):** "$500 a night" is misclassified as monthly and silently divided by 30. That's an AI-comprehension failure of an utterly normal phrasing — exactly the kind of thing that erodes trust because the wrong answer looks confident.
- **The actual LLM (conciergeAgent) produces zero tokens on prod (F-1).** There is no response quality to assess because there are no responses. Any judgment of café/event answer quality is impossible until §2#1 is fixed.

**Recommendations:**
1. Fix the comprehension bug (#3) — *High · Easy*.
2. Once the LLM answers, **evaluate grounding**: café/event answers must cite real inventory (the events prompt literally says "from inventory") and not hallucinate venues. Hold them to the same no-invented-listings bar the rentals meet (QA item B4). *Medium.*
3. Give the LLM path the same inline-card UX as rentals so quality is *visible and structured*, not a prose dump. *Medium.*

---

## 8. Map

The map is a strength on the rental path and an unknown on the concierge path (because concierge never returns).

- ✅ **1:1 card↔pin sync** — 5 results → 5 markers, verified desktop and mobile.
- ✅ **Auto-pan to results**, sensible empty state ("No pins yet" / "Ask the concierge for rentals or quiet cafés near Laureles and Poblado").
- ✅ **Empty-clear (PR #12)** — side panel and pin count go to 0 on a no-match search.
- ⚠️ **F-4 stale markers** — residual `gmp-advanced-marker` DOM can persist on the Google-map layer after a clear, even when the side panel shows zero. *Medium · Medium.* Re-verify against the deployed PR #12 build; if reproducible, clear markers on result-set change, not just the panel.
- ⚠️ **`mapId` invariant** — CLAUDE.md requires every `<AdvancedMarker>` to sit under a `<Map mapId=…>`; keep this enforced as concierge pins come online (otherwise advanced markers silently don't render).
- ❓ **Concierge pins** — the empty state *promises* "quiet cafés near Laureles" pins, but with conciergeAgent dead, that promise can't be kept. Tie map-promise copy to actual capability (see §2#4).

---

## 9. Suggested tests (close the gaps this audit exposed)

The existing checklist already enumerates parser/backend/sanitizer/pin unit gaps (D1–D17 in [`01-rentals-checklist.md`](../prompts/01-rentals-checklist.md)). The **highest-value additions this audit surfaces**, in priority order:

1. **Prod synthetic monitor for conciergeAgent** (would have caught F-1): scheduled `POST /api/copilotkit` `agent/run` asserting the stream reaches `RUN_FINISHED` (not `RUN_ERROR`) within N seconds; alert on failure. *Highest value — turns a silent outage into a page.*
2. **UI test: `RUN_ERROR` renders an error** (F-2): mock an `agent/run` SSE that ends in `RUN_ERROR`; assert a retryable error message appears in the chat. *Locks in §2#2.*
3. **Price-wording unit cases** (F-3): the 5 cases in `0660507` (`$500/night` nightly, `$500 a night` nightly, `$500 nightly` nightly, `$500/month` monthly, bare `$500` monthly). *Already written — land them.*
4. **Concierge happy-path E2E** (post-#1): café + events prompts return cards/pins, not a timeout. *Can't pass today; add as the regression gate for the fix.*
5. **"New chat" reset E2E** (F-5): after a search, click New chat → assert thread empty + map "No pins yet."
6. **Cross-vertical pin survival** (D14): rentals → café → empty rental search → café pins remain. *Becomes testable once concierge works.*
7. **Stale-marker assertion** (F-4): after empty-clear, assert `gmp-advanced-marker` count == 0 on the map layer (not just the panel).

---

## 10. Production-readiness score: **48 / 100**

Scored by pillar weight, then by the silent-failure penalty (a broken feature that *tells* the user is far less damaging than one that doesn't).

| Dimension | Weight | Score | Notes |
|-----------|--------|-------|-------|
| **Core value — rentals (Camila)** | 25 | 21/25 | Works end-to-end, solid. −4 for the `$500 a night` silent-wrong-answer bug (fix committed, undeployed). |
| **Core value — concierge: events/food/attractions (Tourist)** | 30 | 2/30 | Dead on prod for all LLM verticals (F-1). +2 only because the routing/plumbing exists and isolation is clean. |
| **Failure handling / trust** | 15 | 3/15 | Silent-forever on concierge (F-2) and silent-wrong on price (F-3). Worst-category UX failures. |
| **Mobile** | 10 | 9/10 | Excellent; only loses with the inherited concierge deadness. |
| **Map** | 10 | 7/10 | Strong sync + empty-clear; −3 for stale markers (F-4) + unkept concierge-pin promise. |
| **Polish / honesty of UI** | 10 | 6/10 | Advertises dead pillars; ships internal ticket IDs in tooltips ("SCREEN-011"); disabled `Save` on every card. |
| **Total** | **100** | **48** | |

**Interpretation:** This is a **strong vertical slice masquerading as a broken whole.** If the product scoped itself to "Medellín rental search" today, it would ship at ~80. As a "concierge for rentals, events, food, map," it is not production-ready, because three of the four advertised pillars are silently dead.

**The single highest-leverage move:** get `conciergeAgent` answering (§2#1) and never let a run fail silently (§2#2). Those two changes alone would lift the score from 48 to roughly 75 — without touching the rental path that already works.

---

## Constraints honored

- **Evidence-based, not guessed** — every finding cites a captured response, DOM read, or screenshot; where root cause needs prod logs (F-1), I say so rather than inventing one.
- **Simple/high-impact first** — §2 is ranked by impact ÷ effort; §3 is the <1h set.
- **No unnecessary redesign** — the recommendations restore/expose existing functionality; the only UI changes proposed are an error message, a loading state, copy tweaks, and a temporary chip mitigation.
- **Camila/Tourist prioritized** — scoring weights core persona value (55/100) above polish.
- **No failures hidden** — the dead concierge is the headline of both this audit and the QA report; the score reflects it.
- **No code changed, no branch switched, nothing pushed/merged** during this audit — test-and-report only.
