---
id: GS-002
title: Web citation UI — CopilotKit “From the web”
status: Done
priority: P0
phase: Phase 2 — with MAP-002D
effort: 2-3h
owner: claude
depends_on: [GS-001, F49]
blocks: [GS-005]
parent_track: grounding-search
skill: [copilotkit-develop, shadcn, testing]
docs: ../docs/03-grounding-summary.md · ../docs/04-grounding.md
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  sections: [grounding_chunks, groundingSupports — Phase 2.1]
  skip: [search_entry_point HTML — ToS]
---

# GS-002 — Web citation UI

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · Map `grounding_chunks[].web.title` + `uri` from [02-playbook.md](../docs/02-playbook.md) to `WebCitationList` props (not `search_entry_point` HTML).

## At a glance

**Tourist** sees **source-backed** answers — title + link list under the assistant turn, separate from **Maps** `GroundingAttribution`.

| UI | When |
|----|------|
| `WebCitationList` | `source: web` tool render |
| “From the web” badge | `citations.length >= 1` |
| Stale / unverified badge | `metadata.reason` set |

## Deliverables

| File | Change |
|------|--------|
| `mdeapp/src/components/copilot/web-citation-list.tsx` | **New** |
| `mdeapp/src/components/copilot/search-tool-renders.tsx` | Wire `searchWebGroundedEventsTool` render |
| `mdeapp/src/platform/copilot/mastra-tool-action-names.ts` | Registry key |
| `mdeapp/src/components/copilot/__tests__/web-citation-list.test.tsx` | **New** |
| Amend **F49** generative table | One row for web citations |

**Do not** reuse Maps attribution component for web URIs.

## Acceptance criteria

1. Staging query with Search on → ≥1 clickable citation.
2. Flag off → no web badge (Maps-only path unchanged).
3. `GroundedPlaceCard` / Maps footer unchanged.
4. Playwright or Vitest: `data-testid="web-citation-link"`.

## Rollback

`NEXT_PUBLIC_WEB_CITATIONS=false` → text-only answers.

## Cookbook references

| Playbook | Use for GS-002 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Chunk `title` + `uri` list under IPL example — UI mock data |
| [01-playbook.md](../docs/01-playbook.md) | Optional: inline citation algorithm in Search section |
| [ADK — display grounding](https://adk.dev/grounding/google_search_grounding/#how-to-display-grounding-responses-with-google-search) | Citation UX patterns; defer `searchEntryPoint` widget |

## Definition of Done

Evidence: `tasks/notes/GS-002-evidence.md`.
