---
id: VEN-019-ARCHIVED
title: OpenClaw coffee tour crawler (OCL-013-mvp)
status: Cancelled
priority: P3
phase: CTI-C
canonical_openclaw: OCL-013-mvp
effort: 8h
owner: claude
depends_on: []
roadmap_openclaw: ../../openclaw/docs/100-openclaw-plan.md
superseded_by: ../tasks/post-mvp/OCL-013-mvp-coffee-tour-crawler.md
listings_ref: ../../listings/cafes/prompt-tours.md
skill: [open-claw, mde-hostinger, mde-firecrawl, mde-supabase]
mcp: []
---

# VEN-019-ARCHIVED — OpenClaw tour crawler (cancelled — use OCL-013-mvp)

> **Do not implement this task.** Canonical crawler: **[OCL-013-mvp](../../openclaw/tasks/OCL-013-mvp-coffee-tour-crawler.md)**. Phase C only; approval-gated VPS worker — **out of Phase A.**

## In plain English (reference only)

A **VPS browser worker** (OpenClaw) would crawl IG and booking sites to refresh `coffee_tour_sources` — after Patricia approves automation. Chat in Phase A uses human seed (VEN-034), not crawlers.

## User story (implemented by OCL-013, not VEN-019-ARCHIVED)

**As Patricia (admin),** I want approved crawls to update source URLs and confidence, **so that** tour cards stay current without manual copy-paste — but never auto-publish junk to Tourist chat.

## Real-world example

OpenClaw job `coffee_tour_crawl` finishes → updates `source_confidence` on La Sierra’s Instagram row → Patricia reviews in admin → only then visible on cards. **Track in OCL-013-mvp.**

## Goals (reference — see OCL-013)

1. Job type `coffee_tour_crawl` in `openclaw_jobs`.
2. Output → `coffee_tour_sources` + `source_confidence` update.
3. Human seed (VEN-034) remains source for Phase A chat.

## Success criteria (OCL-013-mvp, not this file)

1. No job runs without `automation_approvals.approved`.
2. Crawl uses [`prompt-tours.md`](../../listings/cafes/prompt-tours.md) checklist.
3. Results never auto-publish to chat without review.
4. VEN-019-ARCHIVED remains **Cancelled** in INDEX.

## Blocked until

OpenClaw **001–012** on VPS (`OCL-001-core` … `OCL-012-mvp`) before **OCL-013-mvp**.

## Skills note

Per [`index-skills.md`](../../../index-skills.md): `open-claw` + `mde-hostinger` are Phase 2+ — load only for this task.
