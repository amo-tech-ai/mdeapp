---
id: MAP-002D
title: Enable ADK SearchAgent (Google Search Grounding)
status: Done
priority: P2
phase: Phase 2 — after MAP-002 MVP stable
effort: 4-6h
owner: claude
depends_on: [MAP-002]
blocks: []
skill: [mde-maps, mastra, copilotkit-integrations]
prd_ref: ../../../plan/maps/search-grounding-routing.md · ../../../plan/ADK/maps-adk-prd.md
parent_task: MAP-002-grounding-attribution.md
subtasks:
  - ../../grounding-search/tasks/GS-001-search-grounding-types.md
  - ../../grounding-search/tasks/GS-002-web-citation-ui.md
  - ../../grounding-search/tasks/GS-003-search-quota-logging.md
  - ../../grounding-search/tasks/GS-004-mastra-freshness-router.md
playbook_ref:
  guide: ../../grounding-search/docs/00-playbook-guide.md
  primary: ../../grounding-search/docs/02-playbook.md
  secondary: ../../grounding-search/docs/01-playbook.md
  audit: ../../grounding-search/docs/03-grounding-summary.md
official:
  - https://ai.google.dev/gemini-api/docs/google-search
  - https://adk.dev/grounding/google_search_grounding/
---

# MAP-002D — Search grounding enablement

> **Before coding:** read [00-playbook-guide.md](../../grounding-search/docs/00-playbook-guide.md) → grep [02-playbook.md](../../grounding-search/docs/02-playbook.md) for `google_search` and `grounding_metadata`.

> **Not MVP.** MAP-002 ships **SearchAgent stub** (`metadata.reason = 'search_disabled'`). This task turns on production **Google Search Grounding** for time-sensitive web facts with citations.
>
> **Distinction:** This is **Gemini Google Search** ([docs](https://ai.google.dev/gemini-api/docs/google-search)) — **not** Gemini Maps (`googleMaps` tool). Maps discovery stays Grounding Lite MCP (MAP-002). Maps Gemini fallback → [**MAP-002E**](./MAP-002E-gemini-maps-fallback-runbook.md) + [**MAP-002 § G4**](./MAP-002-grounding-attribution.md#post-ship-follow-ons-maps-checklist-2026-05-26).

## 1. Purpose

**Tourist** asks *"rooftop events in Poblado this Friday"* — MVP uses Supabase `events` + disclaimer. Phase 2 adds ADK **SearchAgent** → Gemini Search grounding → inline web citations (never mixed into SQL rows without `source`).

## 2. Goals

- Product flag `ENABLE_SEARCH_GROUNDING=1` on ADK service + Mastra router guard.
- ADK `SearchAgent` returns strict JSON: `{ citations, snippets, confidence, reason, groundingMetadata }`.
- Mastra tool `search-grounded-events` (or extend router) — quota + fail-closed **before** Gemini call.
- UI: inline “web” badge + **inline citation chips** per [`search-grounding-routing.md`](../../../plan/maps/search-grounding-routing.md) — **not** `GroundingAttribution` alone (Maps attribution stays separate).

### Billing & quota (Gemini 3+ — verify at implementation)

Per [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search):

| Rule | mdeai policy |
|------|--------------|
| Billed **per search query** when model decides to search (Gemini 3+) | Increment Mastra/Supabase quota **per successful SearchAgent invoke**, not per chat turn |
| Free tier / daily caps | Patricia dashboard on `grounding_quota_log` — separate counter from Grounding Lite MCP |
| `groundingMetadata.groundingChunks` | Parse for `web.uri` + title → citation list; never invent URLs |
| `groundingSupports` / inline segments | Optional Phase 2.1 — link spans in assistant prose |

### Response contract (strict)

```json
{
  "citations": [{ "url": "https://...", "title": "...", "snippet": "..." }],
  "confidence": 0.0,
  "metadata": { "reason": null, "searchQueries": ["..."] }
}
```

- Fail-closed: empty citations + `reason: "search_disabled"` when flag off (MVP parity).
- Fail-closed: SQL ticketed events never overwritten — merge with `source: "supabase" | "web"`.

## 3. Workflows

1. Read routing matrix — confirm intent → Search vs Maps vs Supabase.
2. Extend `services/adk-grounding/` SearchAgent — Gemini `generateContent` + `tools: [{ googleSearch: {} }]` (or Interactions API if team standardizes — document choice in evidence).
3. Extend sidecar contract: `tool: "search_grounded_events"` input/output in [`sidecar-api-contract.md`](../../../plan/ADK/sidecar-api-contract.md).
4. Mastra: new tool or branch on `conciergeAgent`; `recordMastraRun` + **dedicated** quota bucket (do not share MCP 100 QPM blindly).
5. F49-style `useCopilotAction` render with citation list (kebab tool id + registry key documented).
6. Staging smoke: compare billable search count in Gemini console vs Supabase log row count (±1 tolerance).

## 4. Out of scope

- Replacing Supabase ticketed events
- Browser Search API keys
- CopilotKit → ADK `HttpAgent`
- Gemini **Maps** tool on every turn (see MAP-002 G4 / future MAP-002E)

## 5. Cookbook references

| Doc | Use when implementing MAP-002D |
|-----|--------------------------------|
| [00-playbook-guide.md](../../grounding-search/docs/00-playbook-guide.md) | Workflow: fixture → sidecar → Mastra → UI |
| [02-playbook.md](../../grounding-search/docs/02-playbook.md) | **Primary** — `tools: [{ google_search: {} }]`, IPL before/after, metadata fields |
| [01-playbook.md](../../grounding-search/docs/01-playbook.md) | `#search_grounding` REST shape; **ignore** `#maps_grounding` for this task |
| [03-grounding-summary.md](../../grounding-search/docs/03-grounding-summary.md) | mdeai routing + task breakdown |
| [ADK Search grounding](https://adk.dev/grounding/google_search_grounding/) | Agent pattern + `groundingSupports` interpretation |

## 6. Definition of Done

- Flag off → same MVP stub behavior
- Flag on + staging smoke: promo query returns ≥1 citation with **real** `groundingMetadata` URL + disclaimer when SQL empty
- Quota row written per SearchAgent invoke; Patricia evidence shows counter ≠ chat message count
- Evidence: `tasks/notes/MAP-002D-evidence.md`
- `npm run floor` green
