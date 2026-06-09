---
id: OCL-034-postmvp
tier: post-mvp
title: Events — Instagram/Facebook social intelligence
status: Open
priority: P2
depends_on: [OCL-030-postmvp, EVP-015-mvp]
skill: [open-claw, mde-supabase, gemini]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.apify.com/platform/integrations/openclaw
---

# OCL-034-postmvp — Event social intelligence

## Objective

Research public Instagram/Facebook/TikTok signals for event discovery, audience fit, venue demand, sponsor fit, and creator opportunities.

## Scope

| Signal | Use |
|---|---|
| Public event posts | Fresh candidate events for review. |
| Venue tagged posts | Demand/vibe signals for Roberto's venue choice. |
| Sponsor mentions | Brands already activating in nightlife, fashion, tourism, food, and wellness. |
| Creator posts | Potential influencer collaborators. |
| Comment themes | Qualitative audience interest, not authoritative statistics. |

## Forbidden

- No credentialed scraping of private accounts.
- No automated likes, follows, comments, or DMs.
- No unapproved publishing.
- No claiming exact attendance from social engagement alone.

## Acceptance Criteria

- Results are stored as source-labeled drafts.
- Public source URLs are retained.
- Social metrics are labeled directional, not truth.
- Event candidates require human approval before publishing to mdeai.
- Sponsor/creator leads require approval before CRM promotion.
