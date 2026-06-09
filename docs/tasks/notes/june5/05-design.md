Per my standing practice on pasted audits, I'll verify each claim against the live ticket + disk before changing anything — these audits are often partly stale or cite files that don't exist. Two checks I can't skip: what **SAN-574 (D-08 — Shared browse system)** actually says today, and whether the Playwright test files the audit wants me to cite are real.

Forensic verdict first, then I'll make the changes that check out.

## The pasted audit is **mostly correct — but it has one real error I'm not going to copy into the ticket**

I verified every claim against the live tickets + disk. Here's the claim-by-claim:

| Audit claim | Verdict | Evidence |
|---|---|---|
| SAN-574 owns shared `VenueCard` + `BrowseLayout` | ✅ True | Body + title say exactly this; "CANONICAL owner — card system" |
| "Reuse, don't rebuild" | ✅ True | Body: "do NOT build a new card from scratch" |
| Blocks downstream card/map tasks | ✅ True | Blocks SAN-576/579/577/442/438/443/323/575 |
| Deps D-02/D-03/D-05 Done | ✅ True | All Phase-0, completed last session |
| **Still blocked by SAN-462 soak** | ✅ True *but* | Soak is actually **met 4/4** — stale block, not a real one |
| Missing mobile responsive proof | ✅ True | No 375/768/desktop check in acceptance |
| "Visual parity" vague | 🟡 Partly | Body *does* name `/` + `/restaurants` + a screenshot — but not per-surface |
| **Proposed test files** `SCREEN-021-cafe.spec.ts` / `SCREEN-023-restaurant.spec.ts` | ❌ **WRONG** | **Those files don't exist.** Real names: `SCREEN-021-cafe-listings.spec.ts`, `SCREEN-023-restaurant-listings.spec.ts` |
| SAN-462: scheduled-only, manual doesn't count, freezes risk, blocks SAN-574 | ✅ All true | Verified in body |
| SAN-462 "1/3 vs SAN-574 says 3/3" needs reconcile | ✅ True | Real answer: **4/4, gate met** |
| No failure-reset rule / no unfreeze checklist | ✅ True | Both genuinely missing |

**Bottom line:** the audit is sound on substance. Its one concrete mistake is the made-up test filenames — exactly the kind of codebase-mismatched fix these pasted audits tend to carry. I'll use the **real** filenames.

One correction to the audit's premise: it says *"don't start SAN-574 until SAN-462 is truly 3/3."* Agreed — and the good news is **it's already 4/4** (Jun 2–5, all verified as real scheduled runs that executed the smoke step). So that condition is met, not pending.

Now let me load the edit tool and make the two description changes.

**Verdict: the audit is correct enough to act on — with the filename fix.** I'm making the two description edits now (surgical, single-ticket, exactly the tickets the audit covers). I am **not** flipping either ticket's status — declaring Stable Beta and moving D-08 to In Progress are your launch calls, and the classifier blocks me from status flips anyway.

Both edits are live. Linear auto-linked the ticket mentions — everything saved cleanly.

## Done — what I changed (verified, then written)

**SAN-462 (OPS-001 — Stable Beta soak gate):**
- Scoreboard corrected: **"1 of 3" → "4 of 4 ✅ GATE MET"**, with all four real run links (Jun 2–5) and a note that I confirmed each one actually ran the smoke test (not skipped).
- Added the **failure rule** the audit wanted: any scheduled run that fails resets the count to 0/3.
- Added the **unfreeze checklist**: run links, prod SHA, Vercel URL, smoke output, sign-off date + who signed, and the Done-flip step.

**SAN-574 (D-08 — Shared browse system: the VenueCard + BrowseLayout):**
- Header now reads **"soak — ✅ MET 4/4, ready for sign-off"** (was "soak 3/3"), so the two tickets finally agree.
- Added 5 acceptance checks: **mobile at 375/768/desktop · no data-shape changes · no map-pin changes · CTAs preserved · before/after screenshots for `/`, `/restaurants`, rental card**.
- Added a Playwright proof command **using the real filenames** — `SCREEN-021-cafe-listings.spec.ts`, `SCREEN-023-restaurant-listings.spec.ts`, `SCREEN-005-rental-card.spec.ts` (the audit's `SCREEN-021-cafe.spec.ts` / `SCREEN-023-restaurant.spec.ts` don't exist, so I did **not** copy them in).

## What I did NOT touch (on purpose)
Neither ticket's **status**. I left:
- **SAN-462 (OPS-001 — Stable Beta soak gate)** → still **In Progress**
- **SAN-574 (D-08 — Shared browse system)** → still **Backlog**

## Your two calls (the only things left to unblock the build)
1. **Declare Stable Beta + flip SAN-462 (OPS-001 — Stable Beta soak gate) → Done.** The gate is genuinely met (4 clean nights). This is a launch sign-off, so it's yours.
2. **Move SAN-574 (D-08 — Shared browse system) → In Progress** once #1 is closed.

The instant #1 closes, **SAN-574 (D-08 — Shared browse system)** and 7 other tickets unblock — and D-08 is the master blocker for the rest of the design build (D-09 re-skin, D-10 dashboard, D-11 map, D-13 home). One sign-off frees the whole queue.

Want me to also add the "1 of 3 → 4 of 4" correction to the soak tracker file (`tasks/PR/PROGRESS-TRACKER.md`) so the doc matches Linear?

## In plain words: the gate isn't broken — it already finished. Nobody updated the scoreboard.

**What SAN-462 (OPS-001 — "Stable Beta soak gate") actually is:** a waiting rule. Before we're allowed to call the live app "stable," a robot has to open **www.mdeai.co** three nights in a row and check that the concierge chat still works — the thing Camila and the tourist persona use. Three clean nights = the app proved it's steady = we're allowed to move on.

**What happened:** the robot has run **four nights straight (Jun 2, 3, 4, 5) and passed every time.** The rule was met on Jun 4. But the Linear ticket still shows a handwritten note saying "1 of 3 done" from Jun 2. The check kept passing automatically; a human just never went back to update the count. So it *looked* stalled when it was actually finished two days ago.

Think of it like a 3-stamp loyalty card that's already full — but the card still shows one stamp because nobody flipped it over to look.

---

## What I want to do next — two jobs

**Job 1 — Fix the scoreboard (I'll do this).**
Go into **SAN-462 (OPS-001 — Stable Beta soak gate)** and correct the note from "1 of 3" to "4 of 4," and paste the four run links as proof. This is just fixing a stale record on one ticket. Low-risk, no decisions involved.

**Job 2 — Call it stable and close the ticket (your call, not mine).**
Marking **SAN-462 (OPS-001 — Stable Beta soak gate)** as *Done* is a "we're declaring the app stable" decision — that's a launch sign-off, and it should be a person's call, not mine. (The system also blocks me from changing a ticket's status anyway.)

---

## Why Job 2 is worth doing today

The moment you close **SAN-462 (OPS-001 — Stable Beta soak gate)**, eight tickets that were waiting behind it are free to start. The big one is:

- **SAN-574 (D-08 — Shared browse system: the VenueCard + BrowseLayout).** This is the master blocker for the whole design build — the single restaurant/rental/café card and the cards-plus-map screen layout. Four other design tasks wait behind *it*. So this one ticket has been the cork in the bottle, and it's been ready to pop since Jun 4.

The other seven freed-up tickets:

| Number | Name (what it does) | Persona it touches |
|---|---|---|
| SAN-387 | SEARCH-002 — Wire hybrid event search (also reopens the frozen PR #38) | Tourist / events |
| SAN-443 | UX-029 — Delete the dead, orphaned "GroundedPlaceCard" leftover code | Cleanup |
| SAN-438 | UX-024 — Hover a card → its map pin lights up | Camila (rentals map) |
| SAN-323 | UX-033 — Clear leftover map pins after an empty search | Camila (rentals map) |
| SAN-546 | OPS-JOURNEY — Test the full live user journeys end-to-end | QA (Lucía) |
| SAN-460 | PR-18 — Lock GitHub Actions to exact versions (security) | Dev (Sofía) |
| SAN-458 | PR-16 — Turn on branch-protection rules | Dev (Sofía) |

---

**So — want me to do Job 1 now** (fix the "1 of 3 → 4 of 4" note on **SAN-462 / OPS-001 — Stable Beta soak gate** with the four proof links)? Then you decide Job 2 — whether to declare Stable Beta and close it, which sets **SAN-574 (D-08 — Shared browse system)** free to start.


On it. The fastest way to know *why* it's stuck is to look at the actual GitHub Actions run history for the `prod-synthetic-smoke` workflow — that tells me whether the nightly checks are failing, not firing at all, or passing-but-untracked. Let me gather the evidence.

Let me verify these "success" runs actually executed the smoke test (not skipped via the `PROD_SMOKE_ENABLED` gate, which would still show run-level "success").

Conclusive evidence now. Let me pull the **live** SAN-462 ticket to confirm the gate's exact wording and that the tracker still reads 1/3 (forensic check before I report).

## Found it: SAN-462 (OPS-001 — Stable Beta soak gate) isn't stuck — **it already passed. The Linear ticket is just stale.**

The gate needs **3 scheduled nightly prod-smoke greens**. It's had **four in a row**. Nobody updated the tracker after the first one, so it still reads "1/3" while CI has quietly been passing it every single night.

### The evidence — actual GitHub run history

| Run ID | Date | Event | Smoke step | Counts? |
|---|---|---|---|---|
| 26820069434 | Jun 2 | **schedule** | ✅ ran + passed | ✅ (the one the ticket knows about) |
| 26887029076 | Jun 3 | **schedule** | ✅ ran + passed | ✅ **new** |
| 26949717537 | Jun 4 | **schedule** | ✅ ran + passed | ✅ **new** |
| 27013456467 | Jun 5 | **schedule** | ✅ ran + passed | ✅ **new** |

I verified each one isn't a false "success" — drilled into the job steps and confirmed the **"Run prod synthetic smoke"** step actually executed (not skipped). The repo gate `PROD_SMOKE_ENABLED=true` and `PROD_SMOKE_BASE_URL=https://www.mdeai.co` are both set, so these are real Playwright runs hitting live prod, all `event=schedule` (not manual dispatch, which wouldn't count).

**The gate was satisfied on Jun 4** (Jun 2 + 3 + 4 = three consecutive scheduled greens). As of Jun 5 there's a fourth. Both readings of the rule — "3 consecutive" or "3 total scheduled" — are met.

### Why it *looked* stuck
The cron is nominal `09:00 UTC`, but the runs land 11:46–13:11 UTC. That's GitHub's normal best-effort scheduling delay, not a failure — `event=schedule` confirms they're the real nightly runs. The only thing that didn't happen: someone updating SAN-462's progress table from "1/3." The live ticket (pulled just now) still shows `scheduled PASS: 1/3 (33%)`, status **In Progress**, `completedAt: null`.

### Why this matters — it's the pacing gate for the whole build
SAN-462 **blocks 8 tickets**, and they've all been clear to go since Jun 4:

- **SAN-574 — D-08 (Shared browse system: VenueCard + BrowseLayout)** ← the design-track master blocker. D-09/D-10/D-11/D-13 all sit behind this. **The thing pacing the entire UX build has been green for 2 days.**
- SAN-387 — SEARCH-002 (wire hybrid_search_events + event_signals) — also unfreezes **PR #38**, currently held open by the soak freeze
- SAN-443 — UX-029 (retire orphaned GroundedPlaceCard)
- SAN-438 — UX-024 (hover/focus → pin highlight on RentalCard + EventCard)
- SAN-323 — UX-033 (clear stale AdvancedMarker DOM after empty search)
- SAN-546 — OPS-JOURNEY (prod live journey matrix J05–J20)
- SAN-460 — PR-18 (SHA-pin GitHub Actions)
- SAN-458 — PR-16 (floor + review branch protection)

### The unblock — two actions, one is your call
1. **Correct SAN-462's record** (I can do this — surgical, single ticket): update the progress table to **4/4 scheduled greens** with the four run IDs as evidence, so the tracker stops lying.
2. **Declare Stable Beta + flip SAN-462 → Done** — this is a launch sign-off decision (and the Auto-Mode classifier blocks me from flipping status anyway), so it's yours to make. The moment it's Done, D-08 and the other 7 unblock automatically and the CopilotKit-wiring/PR-#38 freeze lifts.

Want me to post the evidence comment + fix the "1/3 → 4/4" progress table on SAN-462 now? Then you make the Stable-Beta call and flip it, and **D-08 (the design-track master blocker) is officially go.**

Let me check my work against the actual documented process before answering — I shouldn't claim I followed it without verifying.

Good question to force — I checked my work against the actual process doc (`design-process.md`) rather than assuming. **Short answer: yes, the steps were followed correctly and in the right order. We've finished the entire "paper" half of the process and are sitting exactly at the handoff to the build half.**

## Did we follow the correct steps?

The process doc lays out 5 steps. Here's each one mapped to what got built and its status — every task with its name:

|Process step|What it produces|Task (name)|Status|
|---|---|---|---|
|0. Lock decisions|light-final · 2 colors · code-first|—|✅ locked|
|1. **Journey + IA first** (colors come later)|the site map|**SAN-567 (D-01 — site map / journey)**|✅ Done|
|2. Wireframe the gaps|Explore blueprint|**SAN-571 (D-05 — Explore wireframe)**|✅ Done|
|2. Wireframe the gaps|Dashboard blueprint|**SAN-572 (D-06 — Dashboard wireframe)**|✅ Done|
|3. System + Images (in parallel)|the style guide|**SAN-568 (D-02 — design system)**|✅ Done|
|3. System + Images (in parallel)|the photo plan|**SAN-569 (D-03 — image strategy)**|✅ Done|
|(+) Component inventory|the parts list|**SAN-570 (D-04 — component inventory)**|✅ Done|
|4. **Re-skin + build**|install → shared card → re-skins|**SAN-573–579 (D-07…D-13)**|⬜ **not started — we're here**|
|5. Polish|mobile + accessibility|**SAN-580 (D-14 — mobile/a11y)**|⬜ ongoing gate|

**Three things confirm the method was right, not just the order:**

- ✅ **Journey before color** — the site map (D-01) came first, exactly as the process insists ("users don't care about colors yet").
- ✅ **Code-first, not Figma** — the wireframes are real token-accurate HTML, and the style guide _documents the colors already shipped in `globals.css`_ instead of inventing new ones.
- ✅ **The wireframe carries the component map** — each dashboard zone names its own building blocks, so we didn't make a wasteful separate "mapping" document.

**Two honest gaps I won't paper over:**

- The **editorial display font (Playfair-style headlines)** — the luxury headline lever — is _designed but not yet wired_. Flagged in the style guide, not silently assumed.
- The **build half (steps 4–5) hasn't started.** That's expected — Phase 0 just finished — but it means everything below is "next," not "done."

The process doc's own "do-now" list was: build Explore wireframe → write the 2 docs → build Dashboard wireframe → **run the install**. We did the first three. **We're literally at item 4.**

## Suggested next tasks (ranked, names on each)

**▶️ Do now — nothing blocks these:**

1. **SAN-573 (D-07 — install 6 prebuilt UI pieces)** — the literal next build step. One command (`tabs command avatar carousel sonner sidebar`), then confirm the app still builds clean. I can do this now.
2. **Investigate SAN-462 (OPS-001 — the stuck stability soak)** — it's frozen at 1-of-3 since June 2 and it's the real thing blocking the whole redesign. Find out _why_ (failing checks vs. stale tracker).
3. **Close 3 small spec gaps before the Explore re-skin** — the ⌘K search commands, the per-category filter list, and the map loading-skeleton. Small paper tasks that make **SAN-575 (D-09 — Explore re-skin)** actually buildable instead of half-specified.

**🟡 Needs your yes — Linear cleanup (~80 tickets):**

4. Sort the remaining tickets into the milestone buckets.
5. Close 2 now-duplicate card tickets — **SAN-437 (UX-023 — extract ResultCardShell)** and **SAN-360 (AIA-011 — extract shared card shell)** — both replaced by the new shared card.
6. Tiny fixes: link the map dependency (**SAN-575 D-09 needs SAN-577 D-11**), drop the stale `scr` label, fix `index-design.md`.

**⛔ Blocked — don't start until the soak clears:**

7. **SAN-574 (D-08 — the shared place-card)** → then the re-skins **SAN-575 (D-09 Explore) · SAN-576 (D-10 Dashboard) · SAN-577 (D-11 Map) · SAN-579 (D-13 Home)**, with **SAN-578 (D-12 Concierge)** running alongside.

---

**My recommendation:** start with **#2 (find out why SAN-462 / OPS-001 is stuck)** — because it's the one thing pacing the entire build, and you've got a stalled gate that nobody's looking at. Then kick off **#1 (SAN-573 / D-07 install)** since it's free and unblocked.

Want me to investigate the stuck soak, run the D-07 install, or both?

Let me pull the actual ticket so I explain it accurately, not from memory.

Good catch — **SAN-462 and OPS-001 are the same ticket.** "OPS-001" is the human nickname; "SAN-462" is its Linear number. So when I wrote "SAN-462 (OPS-001)" I was naming one thing twice, which was confusing. Here's what it actually is.

## SAN-462 / OPS-001 — "Stable Beta soak gate"

The ticket's own plain-English summary says it best:

> *"Wait for three nightly automated production chat health checks to pass in a row before declaring Stable Beta."*

In everyday terms:

- A robot runs through **Camila's AI chat on the *live* production site every night** at 9:00 AM UTC (a "synthetic" test = fake user, real site).
- To pass the gate, it has to come back **green 3 nights in a row**.
- While you're waiting, the team **freezes** anything risky — no changes to the AI chat wiring, the map pins, or the café results.

It's a quality checkpoint: *prove the live site is stable for 3 straight nights before piling new work on top of it.*

## Where it stands right now (worth your attention)

| Fact | Value |
|---|---|
| Status | **In Progress · Urgent** |
| Progress | **1 of 3 nights green** (33%) |
| Last green | **June 2** — and it's June 5, still at 1/3 |

**That's a yellow flag.** It's been stuck at 1-of-3 for three days. Either the nightly checks have been failing, or the tracker is stale — either way it's worth confirming, because everything below is waiting on it.

## Why it blocks your design work

This gate **freezes the exact code the shared card needs to touch** (café results, cards, pins). So it directly blocks:

| Code | Name — what it is |
|---|---|
| **SAN-574 (D-08)** | Build the one shared place-card — *the master task 4 re-skins depend on* |
| **SAN-443 (UX-029)** | Retire the old orphaned place-card + dead AI-grounding UI |
| **SAN-438 (UX-024)** | Make cards highlight their map pin on hover |
| **SAN-323 (UX-033)** | Clear leftover map pins after an empty search |

**The chain in one line:** `SAN-462 (soak) → SAN-574 (shared card) → restyle Explore / dashboard / map / home`. If the soak stays stuck, the whole "make it look luxurious" phase waits.

**Why it matters for Camila:** the soak is proving her AI chat actually works reliably in production before anyone rebuilds the screens around it. Sensible gate — but right now it's the single thing standing between you and starting the visible redesign.

---

Noted on **always pairing every task number with its name** — I'll keep doing that from here on. Want me to check the live GitHub Actions runs to see *why* the soak is stuck at 1 of 3 since June 2?