---
id: audit-13
title: Maps task system audit — ADK + Google Maps + Gemini
date: 2026-05-23
auditor: Codex forensic audit
scope: /home/sk/mdeai/tasks/maps · /home/sk/mdeai/plan/ADK · /home/sk/mdeai/mdeapp · local github/adk + github/maps repos
canonical_task_source: /home/sk/mdeai/tasks/maps/INDEX.md
---

# Maps + ADK forensic audit

## Executive Verdict

| Dimension | Score |
|---|---:|
| Architecture correctness | 🟢 **88/100** |
| Task ordering | 🟡 **84/100** |
| Task completeness | 🟡 **79/100** |
| Security / env hygiene | 🔴 **61/100** |
| Implementation readiness | 🔴 **52/100** |
| Production readiness | 🔴 **44/100** |
| **Final score** | 🟡 **78/100** |

**Verdict:** the new strategy is directionally correct, but the task system is **not 100% correct** and the plan will **not succeed without corrections**. The best architecture is the one in `tasks/maps/INDEX.md`: **CopilotKit UI -> Mastra product OS -> ADK grounding sidecar -> Grounding Lite MCP / Google Search -> strict JSON -> cards + pins + attribution**.

**Biggest blocker:** MAP-002 is partially implemented in `mdeapp` but not runnable. `services/adk-grounding/` is absent, and `npm run typecheck` fails in `mdeapp/src/mastra/tools/search-grounded-places.ts`.

**Top 5 critical fixes:**

1. 🔴 Fix MAP-002 status: it is **Partial / Broken**, not Not Started. Client/tool/UI pieces exist, sidecar does not.
2. 🔴 Remove `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` from `mdeapp/.env.local`; MAP-013 must run before MAP-002 smoke or Vercel.
3. 🔴 Fix `search-grounded-places.ts` TypeScript execute signature before any MAP-002 proof.
4. 🔴 Reconcile ADK plan docs: `plan/ADK/INDEX.md` and `plan/ADK/11-github-repos-plan.md` still say ADK is Phase 2, while `tasks/maps/INDEX.md` says MAP-002 ADK sidecar is MVP.
5. 🟡 Add ADK service auth/deploy acceptance: localhost-open is dev only; production needs Cloud Run/IAM/internal JWT/mTLS and Secret Manager.

## Sources Verified

Official references checked:

- [ADK home](https://adk.dev/) — ADK is a production agent framework with Python/TS/Go/Java/Kotlin support.
- [ADK MCP tools](https://adk.dev/tools-custom/mcp-tools/) — ADK can consume MCP servers via `McpToolset`; production requires connection cleanup, timeouts, auth, tool filtering, monitoring, and secure deployment.
- [Maps Grounding Lite](https://developers.google.com/maps/ai/grounding-lite) and [MCP reference](https://developers.google.com/maps/ai/grounding-lite/reference/mcp) — correct runtime endpoint is `mapstools.googleapis.com/mcp`.
- [Gemini Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search) — Search returns `groundingMetadata`; Search citations are web citations, not Maps attribution.
- [Places field masks](https://developers.google.com/maps/documentation/places/web-service/choose-fields) — Places New calls must define field masks; wildcard `*` is development-only, not production.
- [vis.gl react-google-maps](https://github.com/visgl/react-google-maps) and [js-markerclusterer](https://github.com/googlemaps/js-markerclusterer) — current repo choices are correct.

## ✅ Correct

- `tasks/maps/INDEX.md:48-76` gives a mostly correct execution order and keeps `integrations/mastra` as the production runtime foundation.
- `tasks/maps/INDEX.md:100-109` preserves the right architecture: CopilotKit + vis.gl -> Mastra -> `services/adk-grounding/` -> JSON pins/cards/attribution.
- `tasks/maps/INDEX.md:113-124` correctly separates browser Maps JS keys from server Maps/Places/ADK/Gemini keys.
- `plan/ADK/maps-adk-prd.md:61-72` has the right ownership split: CopilotKit renders, Mastra orchestrates, ADK grounds, Places enriches, Maps JS renders.
- `plan/ADK/maps-adk-prd.md:135-144` correctly separates Grounding Lite, Places New, Search Grounding, and Maps JS.
- `mdeapp/src/app/api/copilotkit/route.ts` uses CopilotRuntime + Mastra local agents; it does **not** switch to CopilotKit `HttpAgent`.
- `mdeapp/package.json` pins CopilotKit at `1.55.2` and uses `@vis.gl/react-google-maps`.
- Greps found **no** `react-google-maps/api`, **no** `react-wrapper`, and **no** `maps-grounding-client` in `mdeapp/src`.
- `npm test` passed: **16 files, 76 tests**.

## 🟡 Warnings

- `tasks/maps/INDEX.md:11` now says core MAP-001-012 plus MAP-002D and MAP-013. That is reasonable, but it violates the older “MAP-001-012 only” framing. Keep MAP-002D/MAP-013, but update old docs to stop implying 12 total tasks.
- `tasks/maps/MAP-002-grounding-attribution.md:175` still says Grounding Lite `search_places` is 100 QPM / 1,000 QPD. Re-verify against the current Google quota page before implementation; do not ship quota code from stale notes.
- `mdeapp/src/platform/copilot/mastra-tool-action-names.ts` maps Copilot renders to Mastra registry keys, while F49 text partly says names must match `createTool({ id })`. Current code registers duplicate rental renders only; MAP-002 should require proof of the actual streamed AG-UI action name.
- `mdeapp/src/mastra/lib/storage.ts:14-24` uses Postgres when `DATABASE_URL` exists and in-memory LibSQL otherwise. That is acceptable for local dev, but production must fail closed if `DATABASE_URL` is missing.
- `tasks/maps/VERIFICATION-CHECKLIST.md` G7 currently greps string mentions of `GOOGLE_MAPS_API_KEY`; this creates false positives for help text. Tighten it to distinguish env reads/imports from explanatory UI copy.

## 🔴 Blockers

| Blocker | Evidence | Required correction |
|---|---|---|
| MAP-002 is partial and broken | `mdeapp/src/mastra/lib/adk-grounding-client.ts`, `mdeapp/src/mastra/tools/search-grounded-places.ts`, and `GroundingAttribution.tsx` exist; `services/adk-grounding/` does not. | Change MAP-002 status to Partial / Broken; split evidence for 002A, 002B, 002C. |
| TypeScript fails | `npm run typecheck` -> `search-grounded-places.ts(33,21): Property 'context' does not exist...` | Fix Mastra tool execute signature / context typing before MAP-002 smoke. |
| ADK sidecar absent | `find /home/sk/mdeai/services` shows only `/home/sk/mdeai/services`, no `adk-grounding`. | Scaffold `services/adk-grounding/` with agents-cli/ADK, FastAPI endpoint, MCP wiring, evals. |
| Public Places key present | `mdeapp/.env.local:6` contains `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` (value redacted). | MAP-013 must remove this and verify Vercel envs. |
| Script still checks wrong public key | `mdeapp/scripts/verify-rental-map-pins.mjs:11-14` fails if the key exists; good detection, but it proves current env is bad. | Run script after env removal and record evidence. |
| ADK plan conflict | `plan/ADK/INDEX.md:34` and `plan/ADK/11-github-repos-plan.md:20-25` say ADK service is Phase 2; `tasks/maps/INDEX.md:57` says MAP-002 is MVP. | Make `tasks/maps/INDEX.md` and `maps-adk-prd.md` canonical everywhere. |
| Production auth missing | `plan/ADK/sidecar-api-contract.md` says auth is internal JWT or mTLS TBD. | Add explicit MAP-002 acceptance for Cloud Run IAM/internal auth before prod. |

## Task Scorecard

| Task | Score | Status | Will succeed? | Main blocker | Required correction |
|---|---:|---|---|---|---|
| MAP-001 | 🟢 90 | Done | Yes | Browser/prod proof still needed | Keep; require Playwright/browser evidence before prod. |
| F48 | 🟢 88 | Done | Yes | Sidebar layout is CK v1 compromise | Keep; no center-chat rewrite until CK v2/headless. |
| F49 | 🟡 76 | In progress | Conditional | Manual pin proof incomplete; duplicate action-name strategy uneven | Finish Playwright/card+pin proof and register/verify all streamed names. |
| F50 | 🟡 82 | Not started | Yes | Needed before MAP-007 | Keep; do not store full pins in co-agent state. |
| MAP-013 | 🔴 64 | Not started | Yes, but urgent | Public Places env exists now | Move before MAP-002 and Vercel smoke; make it a hard gate. |
| MAP-002 | 🔴 58 | Partial / broken | No, not yet | No ADK service; typecheck failure | Split 002A sidecar, 002B bridge, 002C UI; fix TS; add auth/evals. |
| MAP-002D | 🟡 80 | Phase 2 | Yes later | Needs Search citation UX/cost gating | Keep deferred; separate Search web citations from Maps attribution. |
| MAP-004 | 🟡 82 | Not started | Likely | Depends on MAP-002 and field masks | Keep; enforce Places New masks and no wildcard in prod. |
| MAP-005 | 🟡 78 | Not started | Conditional | Edge/cache/RLS scope can sprawl | Split cache tables if PR grows; keep browser key out. |
| MAP-006 | 🟡 80 | Not started | Likely | Depends on MAP-005 and F46 | Keep post-MVP; require `googleMapsLinks.placeUri`. |
| MAP-007 | 🟡 81 | Not started | Likely | Depends on F50/MAP-002/F49 | Keep after pin proof and shared state. |
| MAP-008 | 🟢 86 | Not started | Yes | Needs real prod Map ID | Move before production preview; fail on `DEMO_MAP_ID` in prod. |
| MAP-009 | 🟢 85 | Not started | Yes | Needs MAP-008 and marker lifecycle tests | Keep post-MVP. |
| MAP-010 | 🟡 80 | Not started | Likely | Needs MAP-005/F34/session token proof | Keep post-MVP; no browser Places SDK. |
| MAP-011 | 🟡 76 | Not started | Conditional | Sidecar contract only models query/pageSize today | Extend sidecar request schema for origin/destination/travelMode. |
| MAP-012 | 🟡 79 | Not started | Conditional | Needs cached data/RLS/legal review | Keep post-MVP; no LLM crime/safety claims. |

## Architecture Corrections

1. **Keep Mastra as the only CopilotKit runtime.** Do not copy `CopilotKit/examples/integrations/adk/src/app/api/copilotkit/route.ts` into `mdeapp`; that example wires `HttpAgent` directly to Python ADK and would create a second runtime.
2. **ADK sidecar is Google intelligence only.** It should expose `/v1/grounding/invoke`, return strict JSON, and never import Supabase or Stripe.
3. **MCP belongs inside ADK for MAP-002.** No inline browser MCP and no long-term `maps-grounding-client.ts` in Mastra.
4. **Search Grounding is not Maps Grounding.** Search Grounding returns web citation metadata; Maps/Places require Google Maps attribution.
5. **Places New is structured enrichment.** Field masks are mandatory on Text/Nearby/Details/Autocomplete; do not use `*` in production.

## Dependency Corrections

- MAP-013 must run before MAP-002 smoke, not merely “4a” optional hygiene.
- MAP-008 should be before any Vercel production marker proof because AdvancedMarker needs a real Map ID in production.
- MAP-011 cannot depend only on MAP-002/MAP-004 as written; it also needs sidecar contract expansion for `compute_routes`.
- MAP-002 should explicitly depend on ADK scaffold/eval readiness, not just F49 pin proof.
- MAP-004 is correctly after MAP-002 for MVP trust, but it can be developed independently if MAP-002 stalls; do not let Places field-mask work block on ADK unless the MVP sequence requires it.

## Missing / Recommended Tasks

Do not create a new MAP number unless `NUMBERING.md` changes. Prefer subtasks or ADK-prefixed docs.

| New task | Priority | Why |
|---|---:|---|
| MAP-002A-01 ADK scaffold + eval harness | P0 | `services/adk-grounding/` is absent; official ADK flow expects scaffold/run/eval/deploy. |
| MAP-002A-02 sidecar auth + deployment contract | P0 | Prod cannot expose localhost/open ADK HTTP. |
| MAP-002B-01 Mastra tool typecheck + streamed action-name proof | P0 | Current typecheck fails; UI action name must match actual AG-UI stream. |
| MAP-002C-01 attribution compliance test | P0 | Grounded places without attribution are a legal/product trust failure. |
| MAP-004A field-mask CI gate | P0 | Field masks are the cost lever; enforce no wildcard in prod. |
| MAP-SEARCH-001 Search Grounding citations | P1 Phase 2 | Keep web citations separate from Maps attribution and SQL inventory. |
| MAP-PROD-001 Vercel `/api/copilotkit` storage smoke | P0 prod | Postgres path exists, but production proof is still required. |

## Requested Checks

| Check | Result |
|---|---|
| `grep -R "MAP-003"` | ✅ Current `tasks/maps` says MAP-003 is reserved/merged. 🟡 Stale old audits/plans still mention MAP-003. |
| `grep -R "maps-grounding-client" mdeapp/src` | ✅ 0 matches. |
| `grep -R "react-google-maps/api" mdeapp/src` | ✅ 0 matches. |
| `grep -R "react-wrapper" mdeapp/src` | ✅ 0 matches. |
| `grep -R "NEXT_PUBLIC_GOOGLE_PLACES"` | 🔴 Found in `mdeapp/.env.local:6`, scripts/tests/docs. Env entry must be removed. |
| `grep -R "GOOGLE_MAPS_API_KEY" mdeapp/src/components mdeapp/src/app` | 🟡 Only explanatory UI text in maps auth help/provider; no direct secret read found there. |
| `npm test` | ✅ 16 files / 76 tests passed. |
| `npm run lint` | ✅ Passed on rerun. |
| `npm run typecheck` | 🔴 Failed: `search-grounded-places.ts(33,21)`. |

## Final Recommendation

**Are the maps tasks 100% correct?** No. They are strategically good but operationally inconsistent.

**Will the plan succeed?** Yes only if the first fixes are MAP-013, MAP-002 typecheck, and actual `services/adk-grounding/` scaffolding with eval/auth.

**What must be fixed first?** Remove the public Places key, repair the MAP-002 Mastra tool type error, and change MAP-002 status from Not Started to Partial / Broken.

**Which tasks should be modified?** MAP-002, MAP-013, MAP-011, F49, and the ADK planning index.

**Which tasks should be deferred?** MAP-002D Search Grounding, MAP-005-012 except MAP-008 production Map ID hardening.

**Is the old `/home/sk/mde` layout reuse strategy correct?** Yes only as read-only layout/map-pattern reference. Do not port legacy chat/runtime logic.

**Are the Google Maps GitHub repos being used correctly?** Mostly yes: vis.gl, Grounding Lite sample, ADK samples, and markerclusterer are the right sources. Do not use `react-wrapper`, legacy `@react-google-maps/api`, or browser Places server keys.

**Is the CopilotKit + Mastra + ADK strategy correct?** Yes: keep Pattern 1 (`/api/copilotkit` -> Mastra local agents). Use ADK as a sidecar intelligence layer, not as CopilotKit’s runtime.
