# Audit — SCREEN-021 Cafe Listings + Map + Booking

**Date:** 2026-05-26  
**Auditor:** Cursor (task-verifier protocol)  
**Scope:** `SCREEN-021`, wireframe `26-cafe-listings-map-booking`, skills (copilotkit, copilotkit-develop, mastra, mde-maps, mde-supabase), disk + MCP cross-check

> **Corrections applied 2026-05-26:** `SCREEN-021` rescoped (Phases A/B/C), `CAFE-001` added, `tasks/screens/INDEX.md` order updated, wireframe + VEC-004/005 skills patched. **Phase A safe to execute** after spec read.

---

## Verification report

**Pre-patch grade:** Spec **F** · Execution **F** (6 blockers).

**Post-patch (2026-05-26):**

| Task | Spec /100 | Readiness /100 | Blockers | Safe? |
|---|---:|---:|---|---|
| SCREEN-021 Phase A | 78 | 75 | 0 | **Yes** |
| SCREEN-021 Phase B | — | 0 | VEC-004/005 | No |
| SCREEN-021 Phase C | — | 0 | CAFE-001 | No |

> **Historical blockers (resolved in spec):** fictional tool names, stale "missing" status, hard SCREEN-010/VEC deps on Phase A, wrong testids, pgvector on MVP hot path.

---

## Persona impact

**Tourist** on `/` already gets café map pins and grounded cards from `conciergeAgent` + `search-grounded-places`, but cannot open a Mindtrip-style ranked list, fit/trust scores, or an honest booking-request drawer until SCREEN-021 is rescoped and dependencies land.

---

## Claims verified ✅

| Claim | Probe | Result |
|---|---|---|
| SCREEN-001 Done | `tasks/screens/SCREEN-001-home-chat-chrome.md` frontmatter | `status: Done` |
| SCREEN-003 Done | `SCREEN-003-chat-query-bar.md` | `status: Done` |
| SCREEN-007 Done | `SCREEN-007-venue-detail-sheet.md` | `status: Done` |
| MAP-001 Done | `tasks/maps/INDEX.md` | Done |
| `conciergeAgent` registered | `mdeapp/src/mastra/index.ts` | Key `conciergeAgent` in `Mastra({ agents })` |
| UI agent name match | `grep useCoAgent.*conciergeAgent mdeapp/src` | Matches Mastra key (not `concierge-agent` id) |
| Café query → grounding tool | `mdeapp/src/mastra/agents/concierge.ts` | Instructs `search-grounded-places` for café/POI |
| Tool exists | `mdeapp/src/mastra/tools/search-grounded-places.ts` | `id: "search-grounded-places"`, ADK invoke |
| Event fast-path bypasses café | `event-query-classifier.ts` + PR #7 tests | `looksLikeNonEventSearch` for café/rental |
| Map pins from grounding | `e2e/maps-grounding.spec.ts` | Café query → pins + attribution |
| Places field mask helper | `google-places-client.ts` | `X-Goog-FieldMask` enforced when Places client used |
| Floor scripts exist | `mdeapp/package.json` | `floor`, `verify:console`, `smoke:map-pins` present |
| Skills exist | `.agents/skills/` | `mde-maps`, `mde-supabase`, `mastra`, `copilotkit-develop` |
| No SCREEN-021 components | `grep CafeSearchPanel\|CafeResultCard mdeapp` | **0 matches** |
| No SCREEN-021 e2e | `glob e2e/**/SCREEN-021*` | **0 files** |
| CopilotKit pinned 1.55.2 | `mdeapp/package.json` | `@copilotkit/*` 1.55.2 |

---

## Claims not verified / stale ⚠️

| Claim (spec/wireframe) | Reality on disk | Severity |
|---|---|---|
| “Screen does not exist yet” | Partial: chat cards + map pins via grounding; no ranked list UI | 🟡 Stale status |
| MVP flow: SQL → pgvector → Places → rerank | Café path: **ADK Grounding Lite** only; no pgvector step | 🔴 Architecture mismatch |
| `searchCafes`, `rankCafeResults`, `requestCafeBooking` tools | **Not defined** in `mdeapp/src/mastra/tools/` | 🔴 Spec drift |
| `openCafeDetail`, `saveCafe`, `requestCafeBooking` CopilotKit actions | **Not found** in `src/` | 🔴 Spec drift |
| `cafe-detail-drawer`, `cafe-booking-drawer` testids | Sheet uses `venue-detail-sheet`; rental/event only | 🔴 DoD unprovable as written |
| Read café rows from Supabase | No café listing table wired to UI; vector tables **planned only** (`VEC-002`) | 🔴 |
| `semantic_embeddings` vibe match | Table **not migrated** (VEC-002 Not Started) | 🔴 |
| Golden queries in VEC-005 | VEC-005 **Not Started** | 🔴 |
| SCREEN-010 map polish prerequisite | SCREEN-010 **Not Started** | 🔴 |
| PRD v6 café surface | `grep cafe plan/prd` — **no SCREEN-021 anchor** | 🟡 Planning-only hero |
| SCREEN-021 in testing index §10 | `SCREEN-TESTING-STANDARD.md` table ends at SCREEN-020 | 🟡 Missing row |

---

## Red flags & failure points

### 1. Dependency graph is not executable today

```
SCREEN-021 depends_on:
  SCREEN-001 ✅  SCREEN-003 ✅  SCREEN-007 ✅
  SCREEN-010 ❌  VEC-004 ❌  VEC-005 ❌
```

`tasks/screens/INDEX.md` row also omits **SCREEN-003** though the task file includes it.

**Failure mode:** Agent implements ranked cards before map panel polish or vector eval → rework when SCREEN-010 / VEC-005 change pin legend, attribution, or ranking contracts.

### 2. Dual maps architecture (spec vs runtime)

| Layer | Spec / wireframe says | Disk today |
|---|---|---|
| Discovery | Places API New + field mask | **ADK Grounding Lite** (`invokeAdkGrounding`) |
| Enrichment | Places details for hours/phone | `google-places-client.ts` exists but **not** wired into café chat path |
| UI | Dedicated `CafeMapPanel` + rank markers | Shared `ChatMap` + generic `ChatResultsColumn` |

**Failure mode:** Engineer implements Places Text Search in browser or duplicates ADK path → cost/regression vs MAP-002 Done stack.

**Skill alignment:** `mde-maps` documents both Grounding Lite and Places (New); spec must name **which layer owns café discovery** (recommend: keep ADK for discovery, Places client for detail drawer enrichment only).

### 3. Mastra / CopilotKit contract drift

- Spec lists **five new tools**; ship path should extend **`search-grounded-places`** + generative UI in `search-tool-renders.tsx` first.
- `conciergeAgent.id` is `"concierge-agent"` but CopilotKit **`name: "conciergeAgent"`** — correct today; spec must not introduce a new agent key.
- No **`useCopilotAction`** mirrors for café booking HITL (pattern exists for events/rentals).

### 4. Venue sheet reuse vs new drawers

SCREEN-007 **`VenueDetailSheet`** supports `kind: "rental" | "event"` only (`rental-ui-context.tsx`). Wireframe wants café-specific tabs (Work, Menu, Trust). **Extending the sheet** with `kind: "cafe"` is smaller than parallel `CafeDetailDrawer` — spec should pick one pattern.

### 5. Booking without schema

Wireframe sequence inserts `cafe_booking_requests` with Patricia approval. **No migration, RLS, or edge fn** referenced. DoD allows “stub behind feature flag” — good — but acceptance criterion “creates pending request row” still needs **table + RLS task** (likely new `F*` or supabase subtask).

### 6. OpenClaw / Phase scope creep

Build scope mentions OpenClaw enrichment + Patricia approval. Phase 1 rules defer OpenClaw product writes. Keep enrichment **explicitly Phase 2** in DoD; MVP = Places-grounded facts + request stub only.

### 7. Task template / verifier gaps

SCREEN-021 **missing** mde-task-lifecycle sections **1–10** (no numbered Purpose/Goals/Agents/Integrations/Summary), no **`verified_against`** frontmatter, no rollback plan. Fails task-verifier §6 template gate.

---

## Critical fixes (before execution)

| # | Fix | Why |
|---|---|---|
| 1 | **Rescope MVP into phases** — A: ranked grounding cards + café `VenueDetailTarget`; B: pgvector after VEC-004/005; C: booking table + Patricia queue | Removes false blocker on vector for first demo |
| 2 | **Replace fictional tool names** with `search-grounded-places` + optional `getPlaceDetails` (Places client) + `requestCafeBooking` stub | Matches mastra skill + disk |
| 3 | **Resolve SCREEN-010 dependency** — either mark optional for MVP or schedule SCREEN-010 first | Unblocks map UX acceptance |
| 4 | **Add Supabase subtask** for `cafe_booking_requests` (+ RLS) or narrow DoD to feature-flag stub with no DB write | mde-supabase rule: every new table needs RLS |
| 5 | **Update Current status** to “partial — grounding MVP; ranked list + booking missing” | Stops duplicate ADK work |
| 6 | **Align testids** with implementation (`venue-detail-sheet` + new `cafe-booking-sheet` OR wireframe ids) | Playwright DoD provable |
| 7 | **Add SCREEN-021 row** to `SCREEN-TESTING-STANDARD.md` §10 | Testing standard compliance |
| 8 | **Add `verified_against: disk@2026-05-26`** + patch INDEX depends to include SCREEN-003 | task-verifier hygiene |

---

## Recommended execution order

```text
1. SCREEN-010 (map panel polish)     — OR decouple from SCREEN-021 MVP
2. VEC-002 schema draft              — semantic_embeddings + search logs
3. SCREEN-021 Phase A                — CafeResultCard + extend VenueDetailTarget
4. VEC-004 / VEC-005                 — embeddings + golden café queries
5. SCREEN-021 Phase B                — fit/trust rerank
6. Supabase booking migration        — then booking drawer writes
```

---

## Commands to run before execution

```bash
# Dependency status
grep -E '^status:' tasks/screens/SCREEN-010*.md tasks/vector/VEC-00*.md

# Disk truth — no duplicate café stack
rg 'searchCafes|CafeSearchPanel|search-grounded-places' mdeapp/src

# Agent/tool inventory
node -e "import('./mdeapp/src/mastra/agents/concierge.ts').then(m => m.conciergeAgent.listTools().then(console.log))"

# Maps regression baseline
cd mdeapp && npm run smoke:map-pins && npx playwright test e2e/maps-grounding.spec.ts
```

---

## Commands to run after execution (Done gate)

```bash
cd mdeapp && npm run floor
npm run verify:console
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
```

Evidence: `tasks/notes/SCREEN-021-evidence.md` + screenshots under `mdeapp/tmp/screenshots/SCREEN-021/`.

---

## Skill / MCP alignment summary

| Skill | Verdict |
|---|---|
| **task-verifier** | Spec fails template §6 + execution readiness; audit complete |
| **copilotkit / copilotkit-develop** | Reuse `useCoAgent({ name: "conciergeAgent" })`, generative UI in `search-tool-renders.tsx`; add disabled mirror actions if HITL needed |
| **mastra** | Extend existing tool; do not add parallel `searchCafes` unless router dispatches separately |
| **mde-maps** | Discovery = Grounding Lite (MAP-002); details = Places New + field mask; every `<AdvancedMarker>` needs parent `mapId` ✅ |
| **mde-supabase** | Block booking Done until migration + RLS; `semantic_embeddings` per VEC-002 |

---

## Safe to execute?

**Phase A — Yes.** Patch spec applied; start with `CafeResultCard` + `kind: "cafe"` venue sheet + booking stub.

**Phase B/C — No** until VEC-004/005 and CAFE-001 respectively.
