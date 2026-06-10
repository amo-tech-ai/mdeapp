---
id: OCL-033-postmvp
tier: post-mvp
title: Events — vendor recruitment research
status: Open
priority: P2
depends_on: [OCL-016-postmvp, OCL-030-postmvp]
skill: [open-claw, mde-supabase, gemini]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.apify.com/platform/integrations/openclaw
---

# OCL-033-postmvp — Vendor recruitment research

## Objective

Build vetted vendor shortlists for Roberto's events: production, AV, photographers, makeup, styling, security, catering, staffing, florals, hosts, DJs, and livestream crews.

## Use cases

| Event type | Vendor categories |
|---|---|
| Beauty contest | makeup, hair, runway coach, photographer, livestream, stage, security |
| Nightlife event | DJ, sound, lighting, security, ticket staff, photographer |
| Corporate event | AV, catering, host, translation, registration staff |
| Fashion show | runway, styling, backstage crew, sponsor activation booth |

## Workflow

1. Roberto selects event type, date, area, budget range.
2. OpenClaw researches public vendor pages, social proof, service area, contact channel, and portfolio links.
3. Gemini normalizes category, fit, risk, and missing info.
4. Patricia/Roberto approves which vendors enter the event planning board.
5. No outreach is sent until a separate approved message task exists.

## Acceptance Criteria

- Vendor shortlist includes category, source URLs, location, confidence, and contact channel type.
- No vendor is marked booked or confirmed by AI.
- No WhatsApp or Instagram DM is sent.
- Risk flags include stale profile, no public contact, bad reviews, or missing portfolio.
