---
id: GS-008
title: Neighborhood news search (Search fallback)
status: Not Started
priority: P3
phase: Phase 2.1
effort: 3h
owner: claude
depends_on: [MAP-002D, MAP-012A]
blocks: []
parent_track: grounding-search
maps_to_external: REAL-ESTATE-SEARCH-001 (04-grounding.md)
persona: Camila
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  also: ../docs/05-grounding.md
---

# GS-008 — Neighborhood news search

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · [05-grounding.md](../docs/05-grounding.md) neighborhood / geo-intelligence rows.

## At a glance

**Camila:** safety / protest / transit snippets for hood compare — **after** MAP-012A picks Aggregate vs curated path.

Search supplements `medellin.json` — never replaces curated safety copy without Patricia review.

## Cookbook references

| Playbook | Use for GS-008 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | Multi-source summary + citations |
| [03-grounding-summary.md](../docs/03-grounding-summary.md) | §8 Real estate / Camila |

## Definition of Done

Router sends hood-news intents to Search; citations required; disclaimer on unverified claims.
