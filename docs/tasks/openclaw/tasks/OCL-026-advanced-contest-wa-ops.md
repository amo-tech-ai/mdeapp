---
id: OCL-026-advanced
tier: advanced
title: Contests — WA leaderboard / reminder drafts
status: Open
priority: P3
depends_on: [G1-G5, OCL-029-advanced, OCL-022-advanced]
skill: [open-claw, mde-paperclip]
plan_ref: ../../../plan/openclaw/openclaw-contests.md
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/channels/whatsapp
github:
  - https://github.com/openclaw/openclaw
---

# OCL-026-advanced — Contest WA ops

**Diego / contestants:** draft WA broadcasts (leaderboard, T-24h) — **never** vote tallies or winner selection.

## Forbidden

`vote-cast`, fraud, payments — Supabase edges only.

## Acceptance

1. Draft message in `openclaw_job_results`; Patricia approve → OCL-029-advanced send.
2. Ship gate: G1–G5 ticketing green.

## Ref

`plan/openclaw/openclaw-contests.md` § forbidden table.
