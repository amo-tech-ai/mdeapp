---
title: Discovery Contestants Sandbox Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-18
path: /admin/discovery/contestants
persona: Patricia
task: CTEST-011
phase: Sandbox MVP
repo_refs:
  - Firecrawl
  - OpenClaw Web Scraper Plugin
  - OpenClaw Ultra Scraping
code_refs:
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-web-grounded-events.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/search-logs.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/audit-wrapper.ts
---

# Discovery Contestants Sandbox

## Purpose

Patricia searches public sources for potential contestants, reviews risk flags, and drafts invites that are never sent automatically.

## Wireframe

```text
+--------------------------------------------------------------------------------+
| Contestant discovery sandbox                         Search public sources      |
+------------------------------+-------------------------------------------------+
| Query builder                | Results table                                    |
| City, category, source type  | Name/source/confidence/risk/status               |
| Compliance checklist         | Invite draft drawer, approve/manual contact only |
+------------------------------+-------------------------------------------------+
```

## Components And Code To Use

- Use Firecrawl for approved public search/extraction.
- Use OpenClaw only as a governed sandbox adapter with compliance review.
- Use existing Mastra audit wrapper/search logs for tool provenance.
- Use shadcn `Input`, `Button`, `Badge`, `Table`, `Sheet`, `Dialog`.

## States

No query, search running, no results, high-risk result, invite draft pending, approved for manual contact, blocked source, role denied.

## Responsive

Mobile requires single-column flow and explicit risk review before draft. Desktop uses query/results/review layout.

## Tests / Proof

No login-gated scraping test, no autonomous outreach test, source/risk logging proof, invite approval proof, responsive screenshot.

## Confidence

Medium. Compliance review is the main risk.
