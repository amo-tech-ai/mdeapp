---
id: OCL-020-postmvp
tier: post-mvp
title: Marketing — local SEO / competitor page monitor
status: Open
priority: P2
depends_on: [OCL-009-mvp, OCL-010-mvp]
skill: [open-claw, mde-firecrawl, gemini]
plan_ref: ../../../plan/openclaw/docs/
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/gemini-search
github:
  - https://github.com/openclaw/openclaw
---

# OCL-020-postmvp — SEO monitor

**Patricia:** weekly diff on Medellín city-guide competitors; gaps for content calendar.

## job_type

`seo_competitor_monitor`

## Tools

OCL-009-mvp Gemini search + browser snapshot; store diff in `research_snapshots`.

## Acceptance

1. Report JSON with URLs cited.
2. No auto-publish — human writes SEO pages.
