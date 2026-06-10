---
id: OCL-019-postmvp
tier: post-mvp
title: Marketing — sponsor prospect research
status: Open
priority: P2
depends_on: [OCL-009-mvp, MAP-002D, OCL-030-postmvp]
skill: [open-claw, gemini, mastra, mde-supabase]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/gemini-search
  - https://docs.apify.com/platform/integrations/openclaw
github:
  - https://github.com/openclaw/openclaw
---

# OCL-019-postmvp — Sponsor prospects

**María / Patricia:** find local brands sponsoring events; handoff to `leads` via Mastra (ADK `search_sponsor_opportunities` optional).

## job_type

`sponsor_prospect_research`

## Flow

ADK/Mastra proposes list → OpenClaw/Apify enriches public sponsor evidence → Patricia approve → `leads` insert via edge.

## Sponsor categories

- beauty, fashion, hair, makeup, wellness
- nightlife, restaurants, bars, hotels, tourism
- liquor, beverage, consumer packaged goods
- gyms, universities, coworking, HR/employer brand
- media partners, creators, photographers, production companies

## Related follow-ups

- OCL-031 maps sponsor decision-maker type.
- OCL-032 drafts sponsor proposal packs.

## Acceptance

1. No auto-contact; draft outreach only.
2. Sources stored per lead.
3. Each lead includes sponsor category, source confidence, and recommended next reviewer.
