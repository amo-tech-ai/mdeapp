Good call pushing on this — "is it *complete*" is exactly the right question, and the answer exposed real duplication, not just missing labels. Executing the plan you picked: I'll wire the overlaps as Linear relations now, then hand you the map + the one filter step.

Wiring the high-confidence relations into the epic (append-only `relatedTo`, nothing destructive):

All 7 relation writes succeeded — the epic is now cross-linked to the existing work. Let me persist the dedup map into the index doc, then I'll show it to you.

Relations are wired and the map is saved. One important thing surfaced that changes a task's scope — let me lock it in, then give you the picture.

**D-08 is the big catch:** a card system *already exists* (shipped RestaurantCard/AttractionCard/RentalCard + a half-done `ResultCardShell` extraction). D-08 was written as "build VenueCard" — that would rebuild shipped work. Reframing it to "consolidate + finish the existing shell":

Done — here's where the "full design queue" stands. I broadened the scope to all design work, wired the overlaps so nothing gets built twice, and reframed the one task that would have rebuilt shipped code.

## What I changed
- **18 relations wired** across the epic → existing issues (D-05/08/09/10/11/12/14 now `relatedTo` their real-surface twins).
- **D-08 reframed** (SAN-574): from "build VenueCard" → **"consolidate the existing RestaurantCard/AttractionCard/RentalCard + finish `ResultCardShell` (SAN-360/437) — don't rebuild."** This was about to duplicate Done work.
- **Dedup map saved** into `index-design.md`.

## The dedup map (the answer to "is anything duplicated")

| New task | Existing twin(s) | Action |
|---|---|:--|
| **D-08** cards | SAN-360 · 437 (+ Done 318/439/442/324) | **Reuse — consolidate, don't rebuild** ✅ done |
| **D-05** discovery wf | SAN-261 · 244 · 267 (`WIRE-*`) | **Supersede** (stale wireframes) |
| **D-09** re-skin | SAN-478 · 490 · 491 · 519 | **Input** to route builds (Track A) |
| **D-10** dashboard | SAN-255 · 259 · 251 · 253 | **Extend** existing builds |
| **D-11** map | SAN-247 (`WIRE-008`) · 524 | **Supersede/extend** |
| **D-12** concierge | SAN-523 · 522 (mobile) | **Fold in** |
| **D-14** polish | SAN-265 · 268 (*In Review*) | **Merge — don't double-track** |

## Your one manual step (no MCP for view filters)
> ux-tasks view → **Filter → Label → is any of → `track:ux`, `scr`** → add **Status → is not → Done, Canceled** → **Save view**.

That makes the view show **all active design work** — your epic *plus* every live screen/mobile/maps issue — in one place. That's the "complete design queue" you asked for.

## One decision left
Four stale `WIRE-*` wireframe issues (SAN-244/247/261/267) are now redone by D-05/D-09/D-11. They're linked, but leaving them open recreates the exact double-queue you flagged.

No. The roadmap is only partially reflected in Linear. What’s there splits into three buckets — and several items conflict on labels or execution order.

Verdict: ~35% fully covered · ~25% overlap/shell issues · ~40% not in Linear
Authoritative execution order is INDEX-revenue.md + existing task trees (TRP, REAL, INT, OCL) — not the roadmap’s narrative Phase 0→6 as-is.

What is in Linear (correctly wired)
Roadmap area	Linear	Labels / order
R1 C13 → C1 → C2
SAN-550 → SAN-552 → SAN-551
phase:post-mvp ✓ · blockers: gates + 550→551 ✓ · 552 has no explicit blocks 551 (both only depend on 550)
Phase 4 Chatwoot
SAN-553 → … → SAN-557
CW chain ✓ · phase:post-mvp ✓
Phase 3 Trips (partial)
SAN-275, SAN-276, TRP-*
Pre-existing TRP specs · phase:mvp · not linked to improvement roadmap doc
Phase 6 OpenClaw (partial)
SAN-192+ AUT/OCL issues
Older OpenClaw track · not cross-linked to roadmap
Improvement shells (roadmap PR #73 session) — triaged but not canonical
These map to revenue specs; do not implement from these alone:

Linear	Roadmap item	Canonical spec	Status
SAN-563
Checkout widget
SAN-551 (C2)
Backlog · blockedBy 551 ✓
SAN-559
Nightlife VIP deposit
C10 (R2, not imported)
Backlog · blockedBy 551 ✓
SAN-560
Restaurant reservations
M7 (R4, not imported)
Backlog · blockedBy 551 ✓
SAN-561
Events promo / upsell
C14/C15/C6
Backlog · blockedBy 551 ✓
SAN-562
Rental lead billing
C4/C8 (R3-A)
Backlog · blockedBy 551 ✓
SAN-565
Sales Agent + Gemini fallback
C6 + separate Phase 0 reliability
Backlog · blockedBy 551 and wrongly SAN-564
Red flags (labels + order wrong)
1. SAN-564 duplicates SAN-551 — biggest problem
SAN-551 (canonical)	SAN-564 (duplicate)
State
Backlog
Todo
Phase
phase:post-mvp
phase:mvp
Blockers
178, 115, 368, 550
None
Blocks
559–563, 565
563, 561, 565
SAN-564 looks like the “start here” ticket in Cycle 1 but skips C13 and MVP gates. It should be duplicateOf: SAN-551 and canceled.

2. SAN-558 (Cafés live) — not triaged
Still Todo + phase:mvp, no link to venues specs or roadmap Phase 1 ordering. Should either stay in MVP cycle (if pre-revenue) or Backlog + phase:post-mvp with explicit dependency.

3. Phase label split
Issue	Label	Problem
SAN-550..557, 559–563, 565
phase:post-mvp
Correct for revenue pilot
SAN-558, SAN-564
phase:mvp
Cycle-1 scope creep / duplicate path
Roadmap phases → Linear coverage
Phase	Roadmap tasks	In Linear?
0 Hybrid search
Merge in-review hybrid search
Partial — embed/hybrid work (SAN-545, VEC/INT issues); no single “Phase 0” umbrella
0 Gemini fallback + cache
Bundled into SAN-565 only — should be separate reliability issue
0 WIP cap / venues recipe doc / latency budget
Not in Linear (process/docs)
1 create_checkout
SAN-551 ✓ + duplicate SAN-564 ✗
1 Checkout widget
SAN-563 → merge into 551 ✓
1 Sales Agent
SAN-565 shell → C6 (R2 not imported)
1 VIP / restaurant payment loops
SAN-559, SAN-560 shells
1 Cafés live
SAN-558 (untriaged)
1 C1 Agency
SAN-552 only — no improvement shell (fine; use 552)
2 Rentals E2E
SAN-562 shell + REAL-* (SAN-262 G2, etc.) — C4/C8 not imported
3 Trips
TRP track (SAN-275+) — exists, not roadmap-linked
4 WhatsApp/Chatwoot
SAN-553..557 ✓
5 Knowledge base, memory, ADK A-grade, speed, UX flows
Scattered INT/VEC/MAP issues — no Phase 5 import
6 OpenClaw, Postiz, Marketing Agent, featured listings, Connect, agency packages
OCL (SAN-192+), revenue C1/C5/C7 specs — most R2–R4 not in Linear
Deferred by design (per LINEAR-REVENUE.md): R2 (C3, C6, C11, C12, C15, C9, C10), R3-A/B, R4 (M1–M12), R5 A-series.

Correct implementation order (what Linear should show)
MVP gates: SAN-178 · SAN-115 · SAN-368
    ↓
R1: SAN-550 (C13) → SAN-552 (C1) ∥ SAN-551 (C2)  ← 551 after 550; C1 parallel after C13
    ↓
R2 import when 551 In Progress: C11, C3, C6, C15, C10… (+ merge shells 559/561/565)
    ↓
CW parallel (post-gate): SAN-553 → 554 → 555 → 556 → 557
    ↓
R3-A: C4/C8 (shell SAN-562)
    ↓
R4: M7 (shell SAN-560), Connect, portals…
Trips (Phase 3) stays on TRP order: SAN-275 before SAN-276+ — already correct in TRP graph.

Do not use: SAN-564 as entry point; do not run improvement shells before SAN-551.

Scorecard
Criterion	Score	Notes
All roadmap items in Linear
40/100
~40% missing or only in old task trees
Correct labels
70/100
Pilot + shells good; 564 + 558 wrong
Correct blockers
75/100
R1/CW good; 564 unblocked; 565 blocked by 564
Single canonical owner per work item
60/100
551 vs 564, shells vs REV-C* specs
Implementation order match INDEX-revenue
80/100
550→552/551 documented; Linear UI doesn’t enforce 552 before 551
Recommended fixes (small batch)
Cancel SAN-564 as duplicateOf: SAN-551; remove its blockers from 563/561/565.
Triage SAN-558 — MVP vertical vs post-MVP; add blocker if after venues recipe.
Split SAN-565 — C6 upsell → defer to R2 C6 import; Gemini fallback → new Phase 0 issue (prefix:INT, phase:post-mvp or launch reliability).
R2 import when SAN-551 → In Progress (C6, C10, C15, C3, C11…) and close shells 559/561/565.
Add roadmap link on SAN-550 description (already has doc links) as the index issue for “improvement roadmap → Linear map”.
Want me to run the SAN-564 dedupe + SAN-558 triage in Linear now?