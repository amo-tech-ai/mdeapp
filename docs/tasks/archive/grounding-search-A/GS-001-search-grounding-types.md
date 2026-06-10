---
id: GS-001
title: Search grounding — Zod contracts + sidecar parser
status: Done
priority: P0
phase: Phase 2 — ships with MAP-002D
effort: 2-3h
owner: claude
depends_on: [MAP-002]
blocks: [GS-002, GS-004, MAP-002D]
parent_track: grounding-search
skill: [mastra, gemini, mde-supabase]
docs: ../docs/03-grounding-summary.md
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  sections: [google_search, grounding_metadata, IPL fixture]
---

# GS-001 — Search grounding types + parser

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · **Implement from:** [02-playbook.md](../docs/02-playbook.md) (`generate_content` + `google_search`) · **Also:** [01-playbook.md](../docs/01-playbook.md) `#search_grounding`

## At a glance

Normalize Gemini **`groundingMetadata`** into strict JSON the Mastra bridge and CopilotKit UI can trust. **Fail-closed** when `groundingChunks` is empty.

| Who | Effect |
|-----|--------|
| **Sofía** | Vitest fixtures from cookbook IPL example |
| **Patricia** | `webSearchQueries` in logs for billing audit |

## Deliverables

| File | Change |
|------|--------|
| `mdeapp/src/mastra/lib/search-grounding-types.ts` | Zod: `WebCitation`, `SearchGroundedResponse`, `EventCandidate` |
| `mdeapp/src/mastra/lib/search-grounding-types.test.ts` | Parse fixture; reject empty chunks |
| `services/adk-grounding/search_grounding.py` | `googleSearch` call + metadata → JSON |
| `services/adk-grounding/test_search_grounding.py` | Mock `generateContent` response |
| `plan/ADK/sidecar-api-contract.md` | `search_grounded_events` I/O |

## Contract (minimum)

```typescript
// citations[].url required; metadata.reason if grounded === false
SearchGroundedResponse: { answer, citations[], confidence, webSearchQueries?, metadata }
```

## Acceptance criteria

1. Cookbook-style `groundingMetadata` → ≥1 citation with valid URL.
2. Empty chunks → `metadata.reason = 'no_grounding_metadata'`.
3. No invented URLs in parser.
4. `npm run floor` green.

## Cookbook references

| Playbook | What to extract |
|----------|-----------------|
| [02-playbook.md](../docs/02-playbook.md) | IPL example → `__fixtures__/search-grounding-ipl.json`; `grounding_chunks`, `web_search_queries` |
| [01-playbook.md](../docs/01-playbook.md) | Grep `google_search` in config JSON — confirm field names match sidecar |
| [ADK Search grounding](https://adk.dev/grounding/google_search_grounding/) | `groundingSupports` + `segment` indices for Phase 2.1 |

```bash
rg "grounding_metadata|google_search" tasks/grounding-search/docs/02-playbook.md
```

## Definition of Done

Evidence: `tasks/notes/GS-001-evidence.md`. Commit: `feat(grounding): search grounding types + sidecar parser (GS-001)`.
