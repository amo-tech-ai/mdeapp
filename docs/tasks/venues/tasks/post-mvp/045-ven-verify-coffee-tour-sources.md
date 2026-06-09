---
id: VEN-045
title: verifyCoffeeTourSources (Search Grounding)
status: Open
priority: P2
phase: CTI-B
effort: 4h
owner: claude
depends_on: [VEN-032, MAP-002D, GS-001]
blocks: []
skill: [mastra, gemini, mde-maps, copilotkit-debug]
mcp: [gemini-api-docs-mcp, user-mastra]
mcp_verify_before_code:
  - MAP-002D enabled in .env
  - gemini search grounding docs
---

# VEN-045 — Verify tour sources

## In plain English

Use **Google Search Grounding** (MAP-002D) to confirm booking pages, Instagram, and blogs exist — then store trust scores so cards can show “Official site verified” or “Unverified.”

## User story

**As a Tourist,** I want booking links I can trust, **so that** I do not click a hallucinated GetYourGuide URL the model invented.

## Real-world example

Patricia runs verify on La Sierra → `coffee_tour_sources` gets `trust_score: 0.9` for `toursurbanos.com`; a blog-only rumor stays `unknown` and lowers the card confidence badge.

## Goals

1. Tool `verifyCoffeeTourSources` → updates `coffee_tour_sources.trust_score`.
2. Unknown URLs marked `unknown` — never invented.
3. Read-only tool.

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Tool | `mdeapp/src/mastra/tools/verify-coffee-tour-sources.ts` | Create |
| Tasks | `tasks/grounding-search/` MAP-002D | Must be Done |

## Success criteria

1. La Sierra tour: official site row in `coffee_tour_sources` after verify.
2. Failed verify → `source_confidence` drop, badge on card.
3. Tool is read-only — no auto-publish to chat without human review.
4. Phase A works without this task (blocked on MAP-002D + GS-001).

## Blocked until

MAP-002D + GS-001 shipped — Phase A works without this task.
