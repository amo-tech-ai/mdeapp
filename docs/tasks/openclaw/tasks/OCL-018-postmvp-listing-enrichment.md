---
id: OCL-018-postmvp
tier: post-mvp
title: Real estate — listing enrichment crawl
status: Open
priority: P2
depends_on: [OCL-010-mvp, OCL-003-core]
skill: [open-claw, mde-supabase, mde-real-estate]
mcp: [user-supabase]
plan_ref: ../../../plan/openclaw/real-estate/
docs: ../../../tasks/openclaw/docs/14-openclaw-user-stories.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
  - https://docs.openclaw.ai/tools/web-fetch
github:
  - https://github.com/openclaw/openclaw
---

# OCL-018-postmvp — Listing enrichment

**Andrés / Camila:** scrape public listing pages → draft amenities/description in `openclaw_job_results` → host + Patricia approve → edge promotes to `apartments`.

## job_type

`listing_enrichment` · payload `{ listing_id }`

## Stack

Mastra proposes · OpenClaw browser · Supabase write via edge callback · **not** OpenClaw → Stripe.

## Acceptance

1. One approved job enriches seeded listing.
2. No invented `place_id` or rent amount — human or Places verify.
