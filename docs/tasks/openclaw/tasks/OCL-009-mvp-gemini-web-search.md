---
id: OCL-009-mvp
tier: mvp
title: OpenClaw web_search — Gemini grounding provider
status: Open
priority: P1
phase: OCL-0
effort: 2h
owner: claude
depends_on: [OCL-006-core]
blocks: [OCL-020-postmvp, OCL-019-postmvp, OCL-013-mvp]
skill: [open-claw, gemini]
mcp: []
external_docs:
  - https://docs.openclaw.ai/tools/gemini-search
  - https://www.openclawplaybook.ai/guides/how-to-use-openclaw-gemini-search/
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/tools/gemini-search
github:
  - https://github.com/openclaw/openclaw
---

# OCL-009-mvp — Gemini web_search

## At a glance

OpenClaw enrichment jobs need **cited synthesized** answers (booking pages, blogs) — not Brave-style SERP lists.

## Config sketch

```json5
{
  tools: { web: { search: { provider: "gemini" } } },
  plugins: {
    entries: {
      google: { config: { webSearch: { model: "<verify via openclaw models list>" } } },
    },
  },
}
```

## Acceptance criteria

0. Model ID verified on VPS via `openclaw models list` (do not hardcode deprecated IDs; mdeapp chat uses `gemini-3.5-flash` per CLAUDE.md — VPS may differ).
1. Skill test query returns answer + citation URLs (resolved per SSRF guard).
2. Job logs label output as **synthesized** — not Supabase facts.
3. `freshness` / `date_after` tested for sponsor research (OCL-019-postmvp).
4. Document: `country`, `language`, `domain_filter` **unsupported** on Gemini provider.

## Use in verticals

- OCL-013-mvp: verify tour booking URL
- OCL-020-postmvp/002: competitor + sponsor research
- **Not** Camila `/chat` — Mastra + ADK only
