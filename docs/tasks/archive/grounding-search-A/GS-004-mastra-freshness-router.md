---
id: GS-004
title: Mastra freshness intent router
status: Done
priority: P1
phase: Phase 2
effort: 2h
owner: claude
depends_on: [GS-001, MAP-002D]
blocks: []
parent_track: grounding-search
prd_ref: ../../../plan/maps/search-grounding-routing.md
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  sections: [with vs without search IPL comparison]
---

# GS-004 — Freshness intent router

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · [02-playbook.md](../docs/02-playbook.md) IPL section proves **when** Search helps (stale without) vs when Places/MCP is enough.

## At a glance

**Only** call Search grounding when the user needs **fresh web facts** — not on every Camila café query ([05-grounding.md](../docs/05-grounding.md) best practice).

## Router matrix (implement in Mastra)

| Intent signal | Primary | Search? |
|---------------|---------|---------|
| “this weekend”, “tonight”, “today”, “latest”, “official” | Supabase `events` first | Yes if SQL partial |
| “cafés near”, “rentals”, “map” | Grounding Lite MCP | **No** |
| “open now”, hours | Places Details | **No** (Search only if conflict) |
| “is this event real”, “verify ticket” | Search | Yes (GS-005 tools) |
| Sponsor / brand research | — | Admin Phase 3 only |

## Deliverables

| File | Change |
|------|--------|
| `mdeapp/src/mastra/lib/search-intent-router.ts` | `needsSearchGrounding(query, sqlResult): boolean` |
| `conciergeAgent` tool description | Instructs model when to call search tool |
| Amend `plan/maps/search-grounding-routing.md` | Pseudocode + examples |

## Acceptance criteria

1. Unit tests: 5 prompts → expected route (no live Gemini).
2. “Quiet cafés near Laureles” → **no** Search invoke in logs.
3. “Events this Friday Poblado” with empty SQL → Search invoke when flag on.

## Cookbook references

| Playbook | Use for GS-004 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Compare grounded vs non-grounded IPL responses — document in router unit tests |
| [05-grounding.md](../docs/05-grounding.md) | Intent routing table (“events this weekend” → Search) |
| [search-grounding-routing.md](../../../plan/maps/search-grounding-routing.md) | Canonical matrix to amend |

## Definition of Done

Evidence: `tasks/notes/GS-004-evidence.md`.
