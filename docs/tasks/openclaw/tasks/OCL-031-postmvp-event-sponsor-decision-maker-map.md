---
id: OCL-031-postmvp
tier: post-mvp
title: Events — sponsor decision-maker map
status: Open
priority: P1
depends_on: [OCL-019-postmvp, OCL-030-postmvp]
skill: [open-claw, mde-supabase, mastra, gemini]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.apify.com/platform/integrations/openclaw
---

# OCL-031-postmvp — Sponsor decision-maker map

## Objective

Identify the likely decision-maker type for each sponsor prospect so Patricia knows who should review a partnership proposal.

## Decision-maker types

| Sponsor type | Likely decision maker | Medellin example |
|---|---|---|
| Beauty/fashion brand | Marketing manager, brand manager, PR lead | salon, fashion boutique, makeup brand |
| Nightlife venue | General manager, event manager, owner/operator | Provenza club, Laureles bar |
| Hotel/tourism | Sales manager, partnerships manager, events manager | hotel near Plaza Mayor |
| Liquor/beverage | Trade marketing manager, on-premise activation lead | aguardiente, beer, premium spirits |
| Fitness/wellness | Founder, marketing lead, community manager | gym, spa, wellness studio |
| University/community | Partnerships lead, student life, cultural coordinator | student sponsor for event series |
| Corporate/B2B | HR, employer brand, field marketing | recruiting/event sponsor |

## Workflow

1. Input: approved event profile + sponsor category.
2. OpenClaw/Apify finds public company pages, website contacts, LinkedIn/company profile snippets, Instagram bio links, and press pages.
3. Gemini classifies decision-maker type and confidence.
4. Store draft record with source URLs and evidence.
5. Patricia approves lead promotion to sponsor CRM-lite.

## Acceptance Criteria

- Each prospect has source URLs and confidence.
- No direct outreach occurs.
- Private personal contact scraping is blocked.
- The output is a draft decision-maker map, not an authoritative identity claim.
- Existing sponsor lead is not overwritten without approval.
