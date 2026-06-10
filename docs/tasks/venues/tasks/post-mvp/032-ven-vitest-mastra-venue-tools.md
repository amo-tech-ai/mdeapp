---
task_id: ven-032
post_mvp_step: 032
title: Vitest venue tools + agent tool list
layer: vitest
priority: P1
status: Not Started
depends_on: [ven-011, VEN-016, VEN-022]
skills: [vitest, mastra, testing]
doc: ../docs/12-mastra-venues-routing.md
description: Tool schema tests + conciergeAgent.listTools() includes venue tools.
---

# VEN-032 — Vitest — Mastra venue tools


## At a glance

| | |
|---|---|
| **For** | Sofía |
| **Surface** | Vitest |
| **Layer** | vitest |

## What we're building

Unit tests for ven-011/015/021 tool schemas, filters, and mocked Supabase inserts.

## Features

- Vitest in mastra/tools/__tests__
- Mocked RLS paths

## Agents & tools

Tools under test

## Workflows

Optional workflow step mocks

## User journey

1. Developer changes nightlife filter.
2. Vitest catches café leakage.
3. Floor gate stays green.

## Coverage

- ven-011 nightlife filter unit tests
- VEN-016 insert mock (no live Supabase in CI if mocked)
- VEN-022 draft shape
- Agent registry keys match VEN-018 map

## Acceptance

- [ ] `npm test` exit 0 from mdeapp
- [ ] No live Gemini in default CI path
