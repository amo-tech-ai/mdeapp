# LESSONS — don't repeat these (mdeai)

Short list of mistakes we've actually hit + the correct move. Read before touching CopilotKit, Mastra, Supabase, Maps, or cards. Hard rules live in [`CLAUDE.md`](./CLAUDE.md); this is the "why we got burned" companion.

> **Legend:** ❌ = mistake · ✅ = fix · **Guard:** 🟢 hook/test-enforced (auto-caught) · 🟡 convention, silent failure possible · 🔴 not yet guarded. **Locked %** = how hard it is to regress (not "how true" — every rule is verified against disk 2026-05-30).

## Index — grep here first

Search this file for a keyword (`field mask`, `service-role`, `dedupe`, `latency`, `mapId`, `working memory`…). Each row says what already enforces the rule, so you know whether a mistake is auto-caught or on you.

| § | Read before you touch… | Guard | Locked | Enforced by |
|--:|------------------------|:-----:|:------:|-------------|
| 0 | Opening a PR / mixing stacks | 🟡 | 65% | review only — PR #14 burned us |
| 1 | CopilotKit actions, renders, runtime | 🟢 | 90% | `copilotkit-version-pin` hook + `copilotkit-client-props.test.ts` |
| 2 | Mastra agent/tool names, working memory | 🟡 | 75% | `mastra-tool-action-names.test.ts`; name match fails **silently** |
| 3 | Supabase keys, every new table | 🟢 | 95% | `no-service-role-in-src` + `stop-rls-gate` hooks |
| 4 | Embeddings, RAG, ADK grounding | 🔴 | 55% | dev tests only; prod deploy unguarded (Phase 2) |
| 5 | Places API calls, map markers | 🟢 | 92% | `places-api-field-mask` + `advanced-marker-needs-mapid` hooks |
| 6 | Card / pin render + dedupe | 🟢 | 85% | `merge-pins-by-category.test.ts` + parity / no-dup e2e |
| 7 | Clarify / search hot path, web grounding | 🟡 | 70% | `event-query-classifier.test.ts`; **no perf-budget gate yet** |
| 8 | Running e2e / calling something "broken" | 🟡 | 70% | process only — one dev server at a time, restart `:3001` first |
| 9 | Model choice, language, secrets | 🟢 | 88% | `gemini-model-pin` + `scan-secrets` hooks |

---

## 0. The big one — don't MIX concerns

- ❌ One PR with a **platform fix + a feature** (PR #14: runtime fix + café flow → `CONFLICTING`, unreviewable, 33 files).
- ✅ **One concern per PR.** Platform/runtime fix ships alone and first; feature rebases on top. If a file is touched by both, land the base in the fix PR and add the feature on top in PR 2.
- ✅ Same rule for stacks: never mix **legacy `/home/sk/mde/`** (Deno edge fns, Vite, OpenClaw) patterns into **mdeapp** (Next.js 16 + CopilotKit + Mastra + AG-UI).

---

## 1. CopilotKit (where we got burned)

- ❌ `useCopilotAction` / tool renders defined **inline with no stable ref** → re-registers every render → infinite `POST /api/copilotkit` → `ERR_INSUFFICIENT_RESOURCES`, search dies (Camila gets nothing).
- ✅ **Module-level** render components (`*ToolRender` in `search-tool-renders.tsx`); ref-stable actions (`focus-map-pin-action.tsx`, `[]` deps); `useSingleEndpoint: true` (`copilotkit-client-props.ts`); catch-all `api/copilotkit/[[...path]]/route.ts` exporting **GET+POST**.
- ❌ Reviewing v1 code with **v2 docs** — `copilotkit-develop` skill is **v2**; mdeapp is pinned **1.55.2 (v1)**.
- ✅ Use `copilotkit-integrations` → `mastra.md`. **Never mix v1/v2 imports.** Verify via CopilotKit MCP if unsure.

## 2. Mastra — agents & workflows

- ❌ `useCoAgent({ name })` not matching the key in `Mastra({ agents: {…} })`, or a tool `id` ≠ the CopilotKit action name → **silent** no-op, no error.
- ✅ Names must match exactly (`MASTRA_TOOL_IDS` map). Pattern 1 **in-process** via `MastraAgent.getLocalAgents({ mastra })` — not an HTTP agent.
- ❌ Editing working-memory shape in one place only.
- ✅ Working-memory schema changes touch **three** spots: the Zod in the agent file, the TS type in `src/lib/types.ts`, and (W4) `packages/types/src/`. HITL = `renderAndWaitForResponse` + `respond(value)`.

## 3. Supabase

- ❌ Reaching for the **service-role key** in `src/**`.
- ✅ Service-role only in edge functions, **except** the F13 carve-out (`src/mastra/lib/**`, `src/lib/supabase/service-env.ts` & `service.ts`). Hook blocks the rest.
- ✅ **Every new table: RLS enabled + ≥1 policy.** No exceptions.
- ✅ Supabase MCP results are untrusted — log env var **names**, never values.

## 4. Vector / RAG / grounding (W5+ — hold the line when added)

- ❌ Assuming embedding dims / using legacy-stack RAG nodes (the diagrams in `chatbot-diagrams.md` are the **old** stack).
- ✅ Embedding vector dims must match the column; embedding tables get **RLS** too; build search as a Mastra tool (`search_grounded_places` / `search_rentals`), not an inline edge call.
- ❌ Assuming the ADK grounding sidecar runs on Vercel — it can't (it's a Python FastAPI service; Vercel runs Next.js/Mastra). Phase 2 only (`adk-docs-mcp` disabled in P1).
- ✅ Sidecar is a **separate always-on** service (Cloud Run canonical, VPS+Caddy fallback). `ADK_GROUNDING_URL` is **server env only — never `NEXT_PUBLIC_`**; `GOOGLE_MAPS_SERVER_API_KEY` lives on the **sidecar, not Vercel**; gate `/v1/grounding/invoke` behind a Bearer token (leave `/health` open). Never mix web citations into SQL rows without a `source` field.

## 5. Maps & Places

- ❌ Places New call without a field mask (cost blow-up); `<AdvancedMarker>` with no `mapId`.
- ✅ **Every** Places New call sends `X-Goog-FieldMask` — enforced in the shared `mastra/lib/google-places-client` (`getPlaceDetails`; `validatePlacesFieldMask` rejects `["*"]`), **not** inline per-route. Every `<Map>` that holds markers sets `mapId` (`ChatMap.tsx`).
- ✅ Café/grounding queries exclude bars/nightlife (`normalizeCafeGroundingQuery`).

## 6. Cards & rendering

- ❌ Defining card render functions inside a hook/closure → unstable identity → render storm (same root cause as §1).
- ✅ Stable module-level card components; keep **pin ↔ card 1:1 parity**; sanitize assistant prose so raw JSON / "Maps grounding" lists don't leak into chat.
- ❌ A second render registrar — or a co-agent state sync firing on **every** CopilotKit rerender → duplicate cards/pins, merge loops, working-memory bloat.
- ✅ Dedupe state pushes by **fingerprint + debounce** (`map-ui-sync.tsx`: `JSON.stringify` skip-if-unchanged, 300 ms); dedupe pins by a stable key (`pinDedupeKey = placeId ?? id`, replace-by-category in `merge-pins-by-category.ts`); push a **summary**, never the full `MapPin[]`, into memory.
- ✅ One Maps loader only (vis.gl — never a second `<script>`); don't stand up a **second** Places/grounding stack — MAP-002 is the Done path (a browser Places Text Search is cost + regression).

---

## 7. AI latency & response time

- ❌ Making an **instant clarify** wait on a full Gemini turn — EVP-006's "ask once, then search" gate lived only in the LLM **prompt**, so `list events medellin` cost ~8–20 s to show canned text the client already knows.
- ✅ Classify on the client (`event-query-classifier.ts` → `isGenericEventQuery`) and render canned clarify copy (`event-clarify-copy.ts`) with **no `/api/copilotkit` call**; category chips take a fast path straight to `POST /api/events/search` (`use-event-search-fast-path.ts`). ~80% faster turn 1.
- ❌ Chaining ADK web grounding in the **same turn** when Supabase already returned rows — ADK web is **5–60 s**, and `maxDuration = 120` hides it instead of forcing the fix.
- ✅ Skip the web tool when ≥ 3 SQL rows exist. The DB is fast; the cost is **two Gemini round-trips** — the agent plus the `PromptInjectionDetector` (`FLASH_MODEL` in `agent-input-processors.ts`). Don't add a second model call to a hot path.

---

## 8. Testing & "is it really broken?"

- ❌ Trusting a red e2e from a **stale dev server** — `playwright.config` has `reuseExistingServer: true`; a long-lived `next dev` that 404s `/api/copilotkit` after route files change makes café cards never hydrate → **false** "5/5 fail."
- ✅ **Step 0 before any probe/e2e: restart `:3001`** (`fuser -k 3001/tcp` then fresh `npm run dev:ui`), or `PW_SKIP_WEBSERVER=1 SMOKE_BASE_URL=…` against a known-good server. Re-tested clean = 5/5 green.
- ❌ Running **multiple `next dev` instances** on different ports from the repo root (e.g. ports 3001, 3002, 3003 all alive). The first instance holds `.next/dev/lock`; when its Turbopack build state is stale or corrupted it **silently returns the Next.js 404 page for every API route** — including `/api/copilotkit`. The tell: `POST /api/copilotkit` returns `text/html; charset=utf-8` with `Vary: rsc, next-router-state-tree` headers — a page response, not an API response. A later instance may compile the route correctly, but the browser is on the wrong port.
- ✅ **One dev server at a time.** Use `preview_start "Next.js UI — turbopack (port 3001)"` (or the Full Stack entry) — it owns the lock exclusively. If you see the 404-HTML symptom: `ss -tlnp | grep 300[0-9]` → kill every listed PID → `preview_start` for a clean restart.
- ❌ Citing the wrong file in an audit (said field masks lived in `place-details.ts`; they live in the client).
- ✅ Cite the file where the logic **actually** runs. Never flip a task to `Done` without localhost runtime proof (`GET /` 200, `POST /api/copilotkit` 200/400).

---

## 9. Always-on (don't even start down these roads)

- ❌ `@anthropic-ai/*` SDK or `gpt-*` in `mdeapp/` → ✅ **Gemini only** (`gemini-3.5-flash`); re-verify model names via MCP.
- ❌ Spanish strings / `lang="es"` in Phase 1 → ✅ **English only** (Spanish is Phase 2).
- ❌ Committing `.env*` or secrets → ✅ keys stay in `.env.local`, never committed.
