---
id: OCL-014-postmvp
tier: post-mvp
title: Restaurants — menu PDF/HTML extraction
status: Open
priority: P2
depends_on: [OCL-010-mvp, OCL-009-mvp]
skill: [open-claw, gemini, mde-maps]
plan_ref: ../../../plan/openclaw/restaurants/openclaw-restaurant.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/browser
github:
  - https://github.com/openclaw/openclaw
---

# OCL-014-postmvp — Menu extraction

**Tourist:** dish-level search later on `/chat` via Mastra; OpenClaw extracts menu → `restaurant_profiles.payload`.

## job_type

`menu_extraction` · `{ place_id | restaurant_profile_id }`

## Tools

Browser + Gemini structure (VPS) · optional OCL-009-mvp for menu URL discovery.

## Acceptance

1. Structured dishes + price bands in JSON result.
2. Owner/Patricia approve before live in chat.
3. No autonomous reservation booking (defer P5).

## Ref

Mindtrip/Yelp “best dish” pattern in `12-openclaw.md`.
