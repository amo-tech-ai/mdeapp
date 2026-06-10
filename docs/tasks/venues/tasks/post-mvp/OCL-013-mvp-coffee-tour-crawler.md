---
id: OCL-013-mvp
tier: mvp
title: Coffee tours — source crawler + verify
status: Open
priority: P0
depends_on: [VEN-032, VEN-034, OCL-009-mvp, OCL-010-mvp]
skill: [open-claw, gemini, mde-supabase, mde-maps]
mcp: [user-supabase, gemini-api-docs-mcp]
roadmap_cti: ../../../tasks/agent/10-cafeintelligence-plan.md
listings: ../../../tasks/listings/cafes/prompt-tours.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
  - https://docs.openclaw.ai/tools/web
github:
  - https://github.com/openclaw/openclaw
---

# OCL-013-mvp — Coffee tour crawler

**Tourist:** authenticity + booking/IG verification for `coffee_tour_sources`.

## job_type

`coffee_tour_crawl` · `{ tour_id | slug }`

## Flow

1. Browser: operator site, GetYourGuide public page
2. OCL-009-mvp: Gemini search verify claims
3. Write `coffee_tour_sources`, bump `source_confidence`

## Acceptance

1. 5 seeded tours (VEN-034) gain ≥1 verified source each.
2. VEN-045 (Mastra Search Grounding) can defer if OCL-009-mvp sufficient for ops.
3. Linked VEN-019-ARCHIVED in agent roadmap.

## Do not

Invent coordinates — Places/`place_id` only for facts.
