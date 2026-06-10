---
title: OpenClaw Events Use Cases — Core, Post-MVP, Advanced
updated: 2026-05-26
sources:
  - https://docs.apify.com/platform/integrations/openclaw
  - ./100-openclaw-plan.md
  - ../../events/INDEX.md
---

# OpenClaw Events Use Cases

## Architecture Rule

OpenClaw is the approved execution worker. Supabase owns truth, Stripe owns money, Mastra orchestrates, CopilotKit renders approval UI, Gemini drafts/classifies, Google Maps/ADK grounds geo facts, and OpenClaw/Apify execute approved research or channel jobs.

## Apify Pattern

The Apify OpenClaw plugin should be used as an async sandbox:

```text
discover actor/schema
  -> approve actor + input
  -> start run
  -> collect dataset
  -> store raw evidence
  -> normalize draft
  -> human approval
```

## Core Use Cases

| Use case | Why | Task |
|---|---|---|
| Gateway health and kill switch | Stop unsafe jobs fast | OCL-001, OCL-005 |
| Jobs schema and approvals | Audit every side effect | OCL-002, OCL-003 |
| Admin approval UI | Patricia must approve execution | OCL-008 |
| Enqueue job from Mastra | Product can request approved work | OCL-011 |
| E2E no-job-without-approval | Prevent silent automation | OCL-012 |

## Post-MVP Event Use Cases

| Use case | Example | Task |
|---|---|---|
| Apify sandbox | Discover/start/collect a public actor run | OCL-030 |
| Venue intelligence | Compare Provenza rooftop capacity, hours, vibe | OCL-016 |
| Event directory import | Public calendars into review queue | OCL-017 |
| Sponsor prospect research | Find beauty/fashion/liquor/tourism sponsors | OCL-019 |
| Decision-maker map | Classify brand manager vs owner vs partnerships lead | OCL-031 |
| Sponsor proposal drafts | Package + pitch + ROI draft | OCL-032 |
| Vendor recruitment | Makeup, AV, security, livestream, photographers | OCL-033 |
| Social intelligence | Instagram/Facebook public demand signals | OCL-034 |

## Advanced Use Cases

| Use case | Example | Task |
|---|---|---|
| WhatsApp reminders | Ticket holders, staff, sponsor asset reminders | OCL-022, OCL-023 |
| Sponsor ROI screenshots | Browser captures for renewal decks | OCL-024 |
| External publish draft | Draft Facebook/Instagram/event directory posts | OCL-025 |
| Postiz handoff | Approved scheduled social content | OCL-027 |
| Approved campaigns | WhatsApp/Postiz/email execution with logs | OCL-035 |
| Contest ops | Leaderboard/reminder drafts, never votes/payments | OCL-026 |

## Forbidden

- Autonomous sponsor outreach.
- Autonomous WhatsApp blasts.
- Autonomous Instagram/Facebook DMs, likes, follows, or comments.
- Vote, ticket, payment, booking, ranking, or winner mutation.
- Private-account scraping or credentialed scraping without legal/TOS review.
- Unvetted ClawHub skills in production.
