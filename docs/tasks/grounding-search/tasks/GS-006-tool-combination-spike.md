---
id: GS-006
title: Gemini tool combination spike (Search + MCP)
status: Not Started
priority: P2
phase: Phase 2.1
effort: 2-4h
owner: claude
depends_on: [MAP-002D]
blocks: []
parent_track: grounding-search
official: https://ai.google.dev/gemini-api/docs/tool-combination
playbook_ref:
  guide: ../docs/00-playbook-guide.md
  primary: ../docs/02-playbook.md
  sections: [Search with custom tools — Live API tail only]
  defer: [Live API production]
---

# GS-006 — Tool combination spike

> **Read first:** [00-playbook-guide.md](../docs/00-playbook-guide.md) · Skim [02-playbook.md](../docs/02-playbook.md) “Search with custom tools” for **concept only** — do not ship Live API to mdeapp Phase 1.

## At a glance

**Evidence-only** — can one Gemini 3 call combine `googleSearch` + custom tools per [Google blog Mar 2026](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tooling-updates/)?

**Do not ship to prod** until latency, cost, and response-shape documented.

## Spike output

`tasks/notes/GS-006-spike-evidence.md` with go/no-go for merging Search + `search_grounded_places` in one ADK invoke.

## Cookbook references

| Playbook | Use for GS-006 |
|----------|----------------|
| [02-playbook.md](../docs/02-playbook.md) | `search_tool` + `set_climate_tool` combined — latency/cost notes only |
| [01-playbook.md](../docs/01-playbook.md) | End of notebook if tool combo with Maps documented |
| [Tool combination docs](https://ai.google.dev/gemini-api/docs/tool-combination) | Official go/no-go vs Mastra multi-tool sequential |

## Definition of Done

Written recommendation only; no prod flag.
