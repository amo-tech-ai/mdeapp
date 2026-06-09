---
id: OCL-015-postmvp
tier: post-mvp
title: Cafés — Instagram / creator discovery crawl
status: Open
priority: P2
depends_on: [OCL-010-mvp]
skill: [open-claw, mde-firecrawl, mde-maps]
plan_ref: ../../../tasks/listings/cafes/
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
  - https://docs.openclaw.ai/tools/firecrawl
github:
  - https://github.com/openclaw/openclaw
---

# OCL-015-postmvp — IG café discovery

**Tourist hidden gems:** public IG location tags → staging POIs → merge with MAP-002 grounded search.

## job_type

`cafe_social_discovery` · `{ neighborhood, query }`

## Risks

ToS / anti-bot — public pages only; rate limits; Patricia approve batch.

## Acceptance

1. ≥10 staging rows with `source=instagram` + URL provenance.
2. Does not replace `search-grounded-places` in chat (Phase 1).
