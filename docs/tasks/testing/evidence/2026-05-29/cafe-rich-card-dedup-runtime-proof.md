# Café rich-card + de-dup — localhost runtime proof

**Date:** 2026-05-29
**Branch:** `feat/c012-cafe-places-detail` (HEAD `895f459`)
**Persona/surface:** Tourist → concierge chat at `/` (the `/chat` path redirects home)
**Task:** #27 — Run floor + local café runtime proof
**User request being verified:** "it needs to show cards similar to when i search rentals with the cafe it shows it 3 times - it needs to have a card with info"

## 1. Floor gate — PASS (exit 0)

`npm run floor` → `FLOOR_EXIT=0`. lint → typecheck → build → test all run before `npm audit` under `&&`, so reaching audit implies they passed. The only audit output is **10 _moderate_** transitive advisories (`@copilotkit/runtime` → `@ag-ui/langgraph` / `langchain` / `uuid`); `npm run audit` uses `--audit-level=high`, so moderate does not fail the gate. No new vulnerabilities introduced by this branch.

The new regression test (`src/lib/__tests__/sanitize-assistant-chat-content.test.ts` → "strips a 'Maps grounding' heading the model echoes, keeping the intro") is part of the suite that ran inside floor.

## 2. Boot — clean

- Server: `npm run dev:ui` (`next dev --webpack -p 3001`) via preview launch config `mdeapp:ui-3001`.
- `GET /` → HTTP 200. `POST /api/copilotkit` → HTTP 200 (runtime connected; Mastra in-process).
- CopilotKit route serves the concierge agent in-process; Mastra Studio (4111) not required for the flow.

## 3. Repro steps (exact)

1. Open `http://localhost:3001/` (concierge chat).
2. Baseline: right-hand "Map results" panel reads **"No pins yet"**.
3. Type **`Quiet cafés near Laureles`** into `textarea.copilotKitTextarea`.
4. Click **Send** (`button[aria-label="Send"]`).
5. Agent calls the grounded café search; `GET /api/places/photo?...` → 200 (rich-card photo fetch).

## 4. Result — café renders ONCE as a rich card (was 3 surfaces)

Machine-verified via DOM assertions (not just a screenshot):

| Check | Expected (fixed) | Observed |
|---|---|---|
| Rich card in chat | 1 `article.overflow-hidden.rounded-lg` | ✅ present once |
| Card content | photo + name + rating + badges + chips + actions | ✅ `MATCH #1` · `Forest Coffee Shop` · `★ 4.6 (266)` · `Cafe`/`Open now` · `Google-verified candidate`/`Place ID`/`Places fields checked` · `Directions`/`Reviews`/`Details`/`Request` |
| "Maps grounding" heading text | absent | ✅ `hasMapsGroundingText: false` |
| Bulleted place list in chat | none | ✅ `chatBulletItems: 0` |
| "Open in Google Maps" text links | none (minimal-card + side-panel signature) | ✅ `gmapLinkCount: 0` |
| Duplicate "Map results / Café · place" side panel | suppressed | ✅ panel `PANEL_NOT_FOUND` (suppressed by rich-card registrar) |
| `/api/places/photo` images | 1 in chat card (+1 is the map InfoWindow, not a card) | ✅ photo[0] `inChat:true` (96×96), photo[1] `inMap:true` (300×160, `gm-style-iw-d`) |
| Assistant prose | does not list café by name | ✅ "I found one quiet café match near Laureles on the map. Would you like to focus on laptop-friendly spots, or strictly places within the Laureles neighborhood?" |

**Three surfaces → one.** Surface #1 (tool-render card) is now the rich `CafeResultCard`; surface #2 (`GroundingAttribution` "Maps grounding" list) is not mounted; surface #3 (generic "Map results" pin list) is suppressed via the rich-card registrar.

## 5. Caveat / scope

- This proves the **branch** behavior. Production runs `main`, which still shows the minimal card + "Maps grounding" list + side-panel rows (branch is undeployed). Shipping requires explicit approval (not done here).
- The sanitizer re-wire (`concierge-assistant-message.tsx`, `concierge-chat-messages.tsx`) is defense-in-depth for model prose disobedience; the primary fix is component-level (rich card + removed attribution + suppressed panel).
