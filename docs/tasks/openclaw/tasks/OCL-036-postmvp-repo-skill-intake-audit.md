---
id: OCL-036-postmvp
tier: post-mvp
title: Events — repo and OpenClaw skill intake audit gate
status: Open
priority: P1
depends_on: [OCL-004-core, OCL-030-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
---

# OCL-036-postmvp — Repo and skill intake audit gate

## Objective

Create the repeatable intake gate for every GitHub repo, ClawHub skill, Apify Actor, or OpenClaw skill mdeai wants to learn from for Events.

## Why this is needed

The scorecard identifies useful references, but none should be copied or installed directly into production. Patricia and Sofia need a standard review path before any external repo pattern becomes an mdeai task, skill, connector, or worker job.

## Scope

| Area | Requirement |
|---|---|
| Source metadata | Record URL, owner, license, last update, docs quality, test status, secrets/config surface, and runtime assumptions. |
| Security review | Flag network calls, auth scopes, browser automation, scraping targets, outbound messaging, and credential storage. |
| Production decision | Classify as `learn_pattern`, `adapt_prompt`, `custom_mde_skill`, `sandbox_connector`, `reject`, or `defer`. |
| Task linkage | Every approved adaptation must link to a concrete OCL task or create a new one. |
| ClawHub rule | Public skills remain inspiration until OCL-004 safety review passes. |

## Outputs

- Intake checklist template under OpenClaw docs.
- Approved/rejected source register.
- One-page decision record for each source adapted into mdeai Events.

## Acceptance Criteria

- No repo/skill can move from scorecard to implementation without an intake record.
- Intake records include license, security, data-source, and approval conclusions.
- At least five scorecard sources are reviewed: `event-planner-os`, `luma-events`, `openclaw-live-events`, `liveticker-skill`, and Apify OpenClaw plugin.
- Rejected or deferred sources state the exact reason.
- Link/fence checks pass.
