---
id: OCL-039-postmvp
tier: post-mvp
title: Events — source health and connector drift monitor
status: Open
priority: P2
depends_on: [OCL-021-postmvp, OCL-038-postmvp]
skill: [open-claw, mde-task-lifecycle]
sources_index: ../docs/sources.md
research:
  - ../docs/event-repos-skills-scorecard.md
---

# OCL-039-postmvp — Event source health monitor

## Objective

Monitor public event sources and connector adapters for breakage, schema drift, empty result spikes, and suspicious source changes.

## Why this is needed

Public event sources change often. A broken Luma-like, Meetup-like, or Apify-backed source should create an ops alert, not silently degrade the Medellin event graph.

## Scope

| Check | Requirement |
|---|---|
| Fetch health | Track success rate, latency, empty result rate, and source errors. |
| Schema drift | Detect missing required fields from connector outputs. |
| Volume drift | Alert when candidate count changes beyond configured thresholds. |
| Cost drift | Alert on unexpected Apify run count or spend estimate. |
| Evidence | Store source snapshots and connector run IDs for replay. |

## Acceptance Criteria

- Source health dashboard shows last run, status, count, error, and cost estimate.
- Broken source creates an ops item for Patricia/Sofia.
- Monitor never retries in a tight loop.
- Kill switch disables source runs.
- Tests cover broken schema, zero-result spike, and cost-threshold alert.
