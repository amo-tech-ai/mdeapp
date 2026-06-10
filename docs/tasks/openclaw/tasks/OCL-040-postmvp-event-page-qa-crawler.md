---
id: OCL-040-postmvp
tier: post-mvp
title: Events — event page QA crawler
status: Open
priority: P1
depends_on: [OCL-012-mvp, OCL-016-postmvp, OCL-017-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
---

# OCL-040-postmvp — Event page QA crawler

## Objective

Create an approved OpenClaw QA job that checks public event pages before launch or campaign pushes.

## Why this is needed

Before Roberto promotes an event, mdeai should catch obvious public-page failures: broken ticket CTA, missing map link, wrong date/time, bad sponsor logo, missing QR/ticket information, or unapproved draft content.

## Scope

| Area | Requirement |
|---|---|
| Page checks | Event title, date, venue, map link, ticket CTA, sponsor block, social preview, mobile viewport. |
| Evidence | Store screenshots, response codes, and extracted facts as job results. |
| Approval | Run from `/admin/approvals` or event publish checklist, never silently. |
| Output | QA report with pass/fail/warn items and links to evidence. |
| Boundaries | QA crawler reports only; it does not fix or publish pages. |

## Acceptance Criteria

- QA job can run against a staging event URL.
- Broken CTA, missing map link, and date mismatch are detected.
- Screenshots are stored with trace ID.
- Results appear on Patricia's approval screen.
- Playwright or browser-job test proves failed QA blocks campaign approval.
