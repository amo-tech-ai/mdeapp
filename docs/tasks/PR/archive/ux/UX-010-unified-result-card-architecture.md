---
title: "UX-010 — Unified result-card architecture (one result = one rich card + one pin)"
updated: 2026-06-01
owner: claude
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
linear: SAN-318
prod_sha_g2d: a8b33a2
main_sha: 3af7ea0
vercel: https://www.mdeai.co
archive_strategy: ../archive/shipped-on-vercel/specs/UX-010-CARD-UNIFICATION-STRATEGY.md
sev: High
difficulty: Med–Large (phased)
personas: [Tourist, Camila, Roberto]
surfaces: ["/", "/api/copilotkit"]
source_audit: tasks/ux/audit/10-audit-cards.md (+ §2 below)
branch_context: "main @ 7a5c91e+ (UX-036 #28 merged); re-verify line numbers on each PR"
related_evidence: ../testing/evidence/2026-05-29/cafe-rich-card-dedup-runtime-proof.md
execution_pack: tasks/ux/tasks/UX-010-CARD-UNIFICATION-STRATEGY.md
---

# UX-010 — Unified result-card architecture

> **Done on Vercel (2026-06-01).** Linear **[SAN-318](https://linear.app/sanjiovani/issue/SAN-318)** · G2c (#29, #30) + G2d (#33) prod smoke PASS.  
> Optional polish (UX-020…029, UX-028 photos) is **out of epic scope** — track on active [`INDEX.md`](INDEX.md).

> **The bar (from the request):** audit the result-card system for **rentals, cafés, restaurants, nightlife, attractions, events**, then converge on one rule:
>
> **one result = one rich card + one map pin — no duplicate cards, lists, or panels — rich cards for every known domain.**

## 0. TL;DR (read this first)

The café de-dup work proves the *target* pattern for one domain. The problem is **per-domain hand wiring**: **rentals, cafés, and events** now mount `<RichCardResultsRegistrar>` on `main`. **Restaurants and attractions** are still broken on the **agent tool render path** (`restaurantToolRender` / `attractionToolRender` use bare `GenericResults` without registrar). **All** `GenericResults` rows still omit `pinId`/`onSelect` → hover→pin dead for restaurant/attraction. Cards remain **minimal** (`PlaceResultCard`) until **UX-025/026**.

- **Root cause (one line):** Registrar + pin props must live in **one wrapper** (`DomainResults` / fixed `GenericResults`) so no path can ship pins without suppression or card↔pin sync. Today `RestaurantResults` (fast path, UX-036) has registrar but agent path and `GenericResults` internals do not pass `pinId`.
- **"Nightlife" is not a domain.** It is an *event* category (`event-discovery-workflow.ts`) and a rental amenity tag. Nightlife results render through `EventCard` / pin as `event`. No new map-pin category needed.
- **The fix is structural, not cosmetic:** bundle "card list + registrar + pin sync" into one shared wrapper so a domain **physically cannot** be wired with pins-but-no-registrar (today's exact bug), build all rich cards on one shared shell, and demote the side-panel list.

System UX today ≈ **70/100** on `main` (rentals/cafés/events wiring OK; restaurants show thin cards + pins via fast path; agent restaurant/attraction dup + no hover sync remain). Target ≈ **90+/100** across the board.

> **Status source of truth:** Child tasks UX-020…030 are **Not Started** until each PR merges. This doc tracks **disk truth** + phased plan — not "WIP" on the parent while children are open.

## 1. Beginner explanation (no jargon)

Picture the Tourist on `/` asking *"best ramen in Poblado."* The right answer is: **a stack of pretty cards in the chat** (photo, rating, buttons) and **a matching dot for each one on the map.** One restaurant = one card = one dot. Hover a card, its dot lights up. Click a dot, a little card pops up on the map.

Right now that works cleanly for **rentals**, **cafés**, and **events** (registrar mounted). For **restaurants on the agent path** and **attractions**, results can still **double** in the side panel because `GenericResults` in `restaurantToolRender` / `attractionToolRender` skips the registrar. Fast-path restaurants (UX-036) suppress the dup but cards are still **boring** (title + neighborhood + $/person). This doc glues pins + registrar + `pinId` in one wrapper (**UX-022**) then rich cards (**UX-025+**).

## 2. Audit — per-domain findings

Surface: concierge chat at `/` (the `/chat` path redirects home). Dispatch: `src/components/copilot/search-tool-renders.tsx`. Map pins: `ToolPinsSync` → `mergePinsByCategory`. Side panel: `ChatResultsColumn` inside `CenterPanelMapResultsSlot`.

| # | Domain | Card component | Rich/minimal | Duplicate render? | Pin↔card 1:1? | Grounding/source dup? | Side-panel dup? | UX /100 |
|---|--------|----------------|--------------|-------------------|---------------|----------------------|-----------------|---------|
| 1 | **Rentals** | `RentalCard` | **Rich** | No | Yes | N/A (no grounding) | **No** — suppressed via registrar | **92** |
| 2 | **Cafés** | `CafeResultCard` | **Rich** | No *(branch only)* | Yes | No — `GroundingAttribution` orphaned; footer link per card | **No** — suppressed via registrar | **90** |
| 3 | **Events** | `EventCard` | **Rich** | **No** *(registrar @ L343)* | Yes | Partial — web citations inline + `EventResultsPanel` footer | **No** | **72** |
| 4 | **Restaurants** | `PlaceResultCard` | **Minimal** | **Agent: Yes** · **Fast path: No** | Pins yes; **hover sync No** | N/A | **Agent: Yes** · **Fast path: No** | **55** |
| 5 | **Attractions** | `PlaceResultCard` | **Minimal** | **Yes** — agent `GenericResults` | Pins yes; **hover sync No** | N/A | **Yes** — no registrar | **48** |
| — | **Nightlife** | *(none — event facet only)* | Inherits `EventCard` | inherits events | inherits events | inherits events | inherits events | **n/a → 72** |

**Weighted system score ≈ 70/100** on `main` (2026-06-01). Re-audit after **UX-022** (expect ~78) and **UX-025** (expect ~85+).

### 2.1 The single root cause

```ts
// src/platform/copilot/rich-card-results.ts
export const RICH_CARD_CATEGORIES =
  ["rental", "event", "restaurant", "attraction", "grounded"] as const;

export function shouldSuppressGenericMapResults(counts, activeMapCategory) {
  if (activeMapCategory && (counts[activeMapCategory] ?? 0) > 0)
    return isRichCardCategory(activeMapCategory);
  return false; // ← counts[event|restaurant|attraction] is ALWAYS 0
}
```

…on `main` @ 2026-06-01 (`search-tool-renders.tsx`):

| Domain | `<ToolPinsSync>` | `<RichCardResultsRegistrar>` | `pinId`/`onSelect` on cards |
|--------|:----------------:|:----------------------------:|:---------------------------:|
| grounded (café) | ✅ | ✅ ~L129 | ✅ `CafeResultCard` |
| rental | ✅ | ✅ ~L211 | ✅ `RentalCard` |
| event | ✅ | ✅ ~L343 | ✅ `EventCard` |
| restaurant fast (`RestaurantResults`) | ✅ | ✅ ~L423 | ❌ `GenericResults` omits |
| restaurant agent (`restaurantToolRender`) | ✅ | ❌ bare `GenericResults` | ❌ |
| attraction agent (`attractionToolRender`) | ✅ | ❌ bare `GenericResults` | ❌ |

**UX-022 closes:** one `DomainResults` (or fixed `GenericResults`) for restaurant + attraction — registrar on **every** path + `pinId`/`onSelect` on every `PlaceResultCard` row. Route `restaurantToolRender` through `RestaurantResults` (same as fast path).

### 2.2 Secondary findings (cleanup debt)

- **Orphaned components (no JSX importer):** `GroundingAttribution.tsx` (the old "Maps grounding" list) and `grounded-place-card.tsx` (predecessor of `CafeResultCard`). Both still ship + carry tests.
- **Dead helpers:** `shouldShowGroundingAttribution` / `dedupeAttributionForDisplay` in `parse-grounded-tool-result.ts` are referenced **only by their own test** now that `GroundingAttribution` is unmounted.
- **Events have two web-citation surfaces:** inline `WebCitationList` in the chat tool render (`search-tool-renders.tsx:399`) **and** `EventResultsPanel` footer (`chat-center-panel.tsx:46`, fed by `EventWebCitationSync`/`Fetch`). Not a card duplicate, but a second "sources" surface to collapse.
- **Pin de-dup is already correct:** `mergePinsByCategory` replaces a category's pins wholesale and de-dupes by `placeId ?? id`; `ClusteredCategoryMarkers` renders exactly one marker per pin. The map side is healthy — the duplication is entirely in the **side panel + minimal cards**.
- **Map overlay is not a duplicate:** clicking a pin opens `SelectedPlaceOverlayCard` in an `InfoWindow` (the Mindtrip pattern). That is the map-side detail of the *same* entity, shown on demand — keep it.

## 3. Architecture — current vs. target

### 3.A Current state (the problem)

```mermaid
flowchart TD
    subgraph Tools["Mastra search tools (one per domain)"]
        T1[search-rentals]
        T2[search-grounded-places / cafes]
        T3[search-events]
        T4[search-restaurants]
        T5[search-attractions]
    end

    Tools --> D{SearchToolRenders dispatch}

    D -->|rental| R1["RentalCard - RICH<br/>+ registrar + pin sync"]
    D -->|grounded| C1["CafeResultCard - RICH<br/>+ registrar + pin sync"]
    D -->|event| E1["EventCard - RICH<br/>registrar + pin sync"]
    D -->|restaurant fast| RE1["RestaurantResults - MINIMAL<br/>registrar, NO pinId on cards"]
    D -->|restaurant agent| RE2["GenericResults - MINIMAL<br/>NO registrar"]
    D -->|attraction| A1["GenericResults - MINIMAL<br/>NO registrar"]

    R1 --> CHAT["In-chat card list<br/>(primary surface)"]
    C1 --> CHAT
    E1 --> CHAT
    RE1 --> CHAT
    RE2 --> CHAT
    A1 --> CHAT

    R1 -->|suppresses| SP["Side panel<br/>ChatResultsColumn pin rows"]
    C1 -->|suppresses| SP
    E1 -->|suppresses| SP
    RE1 -->|suppresses| SP
    RE2 -->|NOT suppressed = DUP| SP
    A1 -->|NOT suppressed = DUP| SP

    E1 -->|2nd web surface| EWC["EventResultsPanel<br/>web citations footer"]

    classDef dup fill:#fde2e2,stroke:#c0392b,color:#7b241c;
    classDef ok fill:#e7f6e7,stroke:#27ae60,color:#145a32;
    class RE2,A1 dup;
    class R1,C1,E1,RE1 ok;
    class R1,C1 ok;
```

### 3.B Target architecture (the best setup)

```mermaid
flowchart TD
    subgraph Tools["Mastra search tools (one per domain)"]
        T1[search-rentals]
        T2[search-cafes]
        T3[search-events / nightlife]
        T4[search-restaurants]
        T5[search-attractions]
    end

    Tools --> W["DomainResults wrapper (shared)<br/>card list + registrar + pin sync bundled"]

    W --> SHELL["ResultCardShell<br/>photo · header · badges · chips · footer · data-pin-id"]

    SHELL --> RC[RentalCard]
    SHELL --> CC[CafeCard]
    SHELL --> EC[EventCard]
    SHELL --> REC["RestaurantCard (new rich)"]
    SHELL --> AC["AttractionCard (new rich)"]
    SHELL --> FB["PlaceResultCard<br/>(fallback: unknown category only)"]

    RC --> CHAT["ONE visible surface:<br/>in-chat rich card list"]
    CC --> CHAT
    EC --> CHAT
    REC --> CHAT
    AC --> CHAT

    W -->|registrar always fires| SUP["Generic side-panel results list:<br/>SUPPRESSED for every domain"]
    W -->|mergePinsByCategory| MAP["Map: ONE glyph pin per result"]
    MAP -->|on click| OV["SelectedPlaceOverlayCard<br/>(InfoWindow, same data)"]

    classDef ok fill:#e7f6e7,stroke:#27ae60,color:#145a32;
    class RC,CC,EC,REC,AC,CHAT,MAP ok;
```

The three guarantees, enforced by structure:

1. **One rich card** — every domain renders through `ResultCardShell`; `PlaceResultCard` survives only as the unknown-category fallback.
2. **One pin** — `mergePinsByCategory` (already 1:1) stays; the shared wrapper owns pin sync so card `data-pin-id` and pin `id` are produced by the same builder.
3. **No duplicate surface** — the wrapper *always* registers a rich-card count, so `shouldSuppressGenericMapResults` fires for every domain; the side-panel results list stops being a parallel list.

## 4. Rendering flow (one search)

```mermaid
sequenceDiagram
    actor U as Tourist
    participant Chat as CopilotChat
    participant Agent as conciergeAgent (Gemini)
    participant Tool as search-* tool
    participant Disp as DomainResults wrapper
    participant Card as Domain rich card
    participant Reg as RichCardResults registry
    participant Map as Map + pins

    U->>Chat: "quiet cafes near Laureles"
    Chat->>Agent: prompt
    Agent->>Tool: call search-cafes
    Tool-->>Disp: results[] + attribution
    Disp->>Card: render ONE card per result
    Disp->>Reg: register count (grounded = N)
    Disp->>Map: mergePinsByCategory(grounded, pins)
    Reg-->>Map: suppress generic side-panel list
    U->>Map: hover / click a pin
    Map-->>U: SelectedPlaceOverlayCard (same data)
```

## 5. User journey (target)

```mermaid
journey
    title Tourist searches restaurants (target behaviour)
    section Ask
      Type "best ramen in Poblado": 4: Tourist
    section See results
      One rich card per restaurant in chat: 5: Tourist
      One pin per restaurant on map: 5: Tourist
      No duplicate side-panel list: 5: Tourist
    section Act
      Hover card, pin highlights: 5: Tourist
      Click pin, rich overlay opens: 5: Tourist
      Open Details or Directions: 5: Tourist
```

## 6. Recommended architecture (specifics)

### 6.1 `ResultCardShell` (new — `src/components/copilot/result-card-shell.tsx`)
Extract the skeleton already shared by `RentalCard` / `CafeResultCard` / `EventCard`:

```
<article data-result-kind data-pin-id onMouseEnter/onFocus={preview}>
  <Media>           // photo (proxy) OR category-glyph placeholder + attribution
  <Header>          // rank/badge · title · rating line
  <BadgeRow>        // type · price · open-now · availability (domain-supplied)
  <Body>            // blurb / matchReason / address (1 slot)
  <ChipRow?>        // verification chips (grounded only)
  <Footer>          // map links (Directions/Reviews/Maps) + domain CTAs (Details/Buy/Request)
</article>
```
Domain cards pass typed props + their CTA set; the shell owns layout, `data-pin-id`, hover→`panToPin`, selected-state ring, and graceful empty-field degradation (mirrors `SelectedPlaceOverlayCard`).

### 6.2 `DomainResults` wrapper (new — closes the bug for good)
One component that every domain render uses:

```tsx
<DomainResults
  category="restaurant"     // MapPinCategory
  result={result}           // raw tool payload
  rows={rows}               // normalized
  renderCard={(row) => <RestaurantCard {...row} />}
  emptyState={<GenericEmptyState .../>}
/>
// internally renders, in order:
//   <ToolPinsSync category={category} result={result} />
//   <RichCardResultsRegistrar category={category} count={rows.length} />
//   rows.map(renderCard)   // with scroll-into-view on selectedPinId
```
Because pins + registrar live in the same component, **you cannot ship pins without suppression again.**

### 6.3 New rich domain cards
- `RestaurantCard` — photo, rating, cuisine/price/open-now badges, blurb, Directions/Reviews + Details. (Restaurant tool already supplies place fields; reuse `places-display` formatters.)
- `AttractionCard` — same shell, attraction-appropriate badges (type, hours), Directions + Details.
- `CafeCard` — rename/keep `CafeResultCard` as a shell consumer.
- `PlaceResultCard` — retain **only** as `DomainResults` fallback when a category has no dedicated card.

### 6.4 Side panel + grounding
- **Demote** `ChatResultsColumn` / `CenterPanelMapResultsSlot`: it must not be a parallel results list. Either remove it or repurpose strictly as empty/loading affordance. The in-chat card list is the single visible result surface; the map (+ `SelectedPlaceOverlayCard`) is the spatial view.
- **Grounding = footer only:** delete orphaned `GroundingAttribution` + `grounded-place-card.tsx` + dead `shouldShowGroundingAttribution`/`dedupeAttributionForDisplay`; the per-card footer already carries the Maps link. Keep `sanitizeAssistantChatContent` as defense-in-depth against model-echoed lists.
- **Events:** collapse the two web-citation surfaces into one footer (`EventResultsPanel`); drop the inline `WebCitationList` in the event tool render (or vice-versa — pick one).

### 6.5 Nightlife decision
Keep nightlife as an **event facet** (recommended): zero new pin category, inherits `EventCard` + `event` pin automatically. Only add a `nightlife` `MapPinCategory` if product wants a distinct glyph/colour — not required for this work.

## 6.6 Implementation status (source of truth — 2026-06-01)

| Milestone | Status on `main` | Task |
|-----------|------------------|------|
| UX-014 agent emit | ✅ Merged (#26) | Cards can render without `writer.custom` |
| UX-036 restaurant fast path | ✅ Merged (#28) | Thin cards + pins; `RestaurantResults` + registrar |
| **M1** registrar + pin sync | ✅ Done | **UX-022** — `DomainResults`, agent/fast-path parity |
| M0 shell | ⚪ Not started | UX-023 (does **not** block UX-022) |
| M2 rich restaurant | ✅ Done | **UX-025** — `RestaurantCard` on fast path + agent |
| M3 rich attraction | ✅ Done | **UX-026** — `AttractionCard` |
| M4 cleanup | ⚪ Not started | UX-029 after rich cards stable |
| M5 tests | ⚪ Not started | UX-030 after UX-022 + **UX-021** |

**Authoritative build order:** see [`tasks/UX-010-CARD-UNIFICATION-STRATEGY.md`](tasks/UX-010-CARD-UNIFICATION-STRATEGY.md) §7.

**Done gate per slice:** screenshot + targeted Playwright + `npm run floor` → evidence under `tasks/testing/evidence/<date>/`.

## 7. Implementation plan & migration order

Ordered for **highest-impact-first** (UX-022 before shell/cleanup).

| Step | Scope | Risk | Persona win |
|------|-------|------|-------------|
| **M0** | Extract `ResultCardShell`; refactor `RentalCard`/`CafeResultCard`/`EventCard` onto it. **Pure refactor — snapshots unchanged.** | Low | none yet (foundation) — **after UX-022** |
| **M1** | `DomainResults` / fix `GenericResults` — **restaurant agent + attraction** paths + `pinId`/`onSelect`. Events already have registrar. | Low–Med | Tourist stops dup panel; hover highlights pin |
| **M2** | `RestaurantCard` (rich) on the shell; swap restaurant render. | Med | restaurants look like cafés |
| **M3** | `AttractionCard` (rich) on the shell; swap attraction render. | Med | attractions look like cafés |
| **M4** | Cleanup: delete `GroundingAttribution`, `grounded-place-card.tsx`, dead helpers; collapse event web-citations to one footer; demote/remove `ChatResultsColumn` results list. | Med | cleaner chat, smaller bundle |
| **M5** | Lock-in: unit + registry + pin-parity tests, per-domain Playwright "one card + one pin + no dup panel", floor green. | Low | Sofía/Lucía catch regressions |

**Sequencing note:** **Ship UX-022 first** — do not wait for M0 shell. Café branch is merged to `main`. One worktree, one PR per `mde-worktree-pr-flow`. No rental redesign. No nightlife `MapPinCategory`.

## 8. Risks & failure points

1. **Map-sync regression** — refactoring card/pin id wiring could break hover-highlight + scroll-into-view + overlay. *Mitigation:* single `pinId` builder per domain; assert `data-pin-id` == pin `id` parity in tests (§9).
2. **Suppression hides the *only* surface** — if a registry count sticks `>0` after results clear, the card list could be suppressed with nothing to show. *Mitigation:* registrar cleanup already sets 0 on unmount; add an explicit "clears on new/empty search" test.
3. **Sparse tool payloads** — restaurant/attraction results may lack photo/rating → rich card looks empty. *Mitigation:* shell degrades gracefully (glyph placeholder, hide empty rows), exactly as `SelectedPlaceOverlayCard` already does.
4. **Branch conflict** — café branch is undeployed; building M0 on `main` then merging café could collide on `CafeResultCard`. *Mitigation:* base this work on the café branch or merge it first (needs approval — not done here).
5. **Nightlife expectation mismatch** — request lists nightlife as a domain; it's events. *Mitigation:* documented in §6.5; default keeps it as an event facet.
6. **Don't redesign rentals** — RentalCard is the 92/100 reference. *Mitigation:* M0 is a non-visual extraction; rental snapshot must be byte-identical.

## 9. Test plan

- **Unit** — `ResultCardShell` renders each slot + degrades on missing fields; each domain card maps its props; `PlaceResultCard` still renders as fallback.
- **Registry** — `shouldSuppressGenericMapResults` returns `true` for **every** `RICH_CARD_CATEGORY` once `DomainResults` mounts; returns `false`/clears when rows empty.
- **Pin parity (the 1:1 invariant)** — for each domain: `cards.length === pins.length === markers.length`, and every card `data-pin-id` has a matching pin `id`.
- **Sanitizer** — existing `sanitize-assistant-chat-content.test.ts` stays green (model-echoed "Maps grounding"/place lists stripped).
- **E2E (Playwright, localhost `/`)** — per domain (rental, café, restaurant, attraction, event): exactly **1** `article` per result, **0** `[data-testid="results-pin-row"]`, **1** marker per result, hover→highlight, click→overlay, clean prose, no console errors.
- **Floor** — `npm run floor` exits 0 with the new tests (lint → typecheck → build → test → audit).

## 10. Acceptance criteria

- [ ] Every known domain — rentals, cafés, restaurants, attractions, events (incl. nightlife) — renders a **rich** card. `PlaceResultCard` appears only for unknown categories.
- [ ] For any single search, each result appears **once** on screen (1 chat card), with **exactly 1** map pin, and **0** duplicate side-panel / list / grounding rows.
- [ ] Card↔pin parity holds (`data-pin-id` == pin `id`); hover highlights the pin; click opens `SelectedPlaceOverlayCard`.
- [ ] `GroundingAttribution`, `grounded-place-card.tsx`, and the dead grounding helpers are removed; events expose **one** web-sources footer.
- [ ] Rentals output is visually unchanged (snapshot parity) — **no redesign**.
- [ ] `npm run floor` exits 0; per-domain localhost runtime proof captured under `tasks/testing/evidence/<date>/` per the CLAUDE.md Done gate.

## 11. Do NOT overbuild (scope guard)

- **No new map-pin category** unless product explicitly wants a distinct nightlife glyph. Nightlife = events.
- **No rental redesign.** RentalCard is the reference; only adapt it to consume the shared shell with identical output.
- **No Save/Trips functionality** — those buttons stay disabled. (Tooltip *copy* is owned by **UX-008/SAN-324**, which replaces the internal "SCREEN-011" string with user-facing "Saving is coming soon" — do not re-introduce the ticket name here.)
- **No backend/tool-schema changes** — this is a render-layer convergence. Tool payloads are consumed as-is.
- **No v2 CopilotKit** — stay on pinned 1.55.2; v1 imports only.
- This is a **render unification**, not a re-architecture of search, Mastra, or the map engine.

## 12. Evidence / provenance

- Plan revised 2026-06-01 per forensic verdict (82/100): stale event/registrar claims corrected; M1 WIP label removed; UX-022-first sequencing locked.
- Audit performed 2026-05-29; re-verified 2026-06-01 on `main` by reading: `search-tool-renders.tsx` (dispatch), all five card components, `rich-card-results.ts`, `rich-card-results-context.tsx`, `chat-results-column.tsx`, `center-panel-map-results-slot.tsx`, `chat-center-panel.tsx`, `GroundingAttribution.tsx`, `event-results-panel.tsx`, `event-search-results-context.tsx`, `parse-grounded-tool-result.ts`, `merge-pins-by-category.ts`, `active-map-category.ts`, `category-map-marker.ts`, `ClusteredCategoryMarkers.tsx`, `MapPinInfoWindow.tsx`, `SelectedPlaceOverlayCard.tsx`, plus grep confirmation of registrar/pin wiring and orphan status.
- Café single-domain proof that this pattern works: [`cafe-rich-card-dedup-runtime-proof.md`](../testing/evidence/2026-05-29/cafe-rich-card-dedup-runtime-proof.md).
- All four diagrams above validated via the mermaid validator (`valid: true`).
