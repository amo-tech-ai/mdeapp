---
id: OCL-006-core
tier: core
title: OpenClaw VPS — Gemini provider + model routing
status: Open
priority: P0
phase: OCL-0
effort: 3h
owner: claude
depends_on: [OCL-001-core]
blocks: [OCL-009-mvp, OCL-010-mvp]
roadmap: ../docs/100-openclaw-plan.md
skill: [open-claw, gemini, mde-hostinger]
mcp: [gemini-api-docs-mcp]
external_docs:
  - https://docs.openclaw.ai/providers/google
  - https://fast.io/resources/openclaw-gemini-integration-guide/
  - https://haimaker.ai/blog/best-gemini-models-for-openclaw/
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.openclaw.ai/providers/google
github:
  - https://github.com/openclaw/openclaw
---

# OCL-006-core — Gemini on VPS

## At a glance

Configure Hostinger OpenClaw gateway with **API key auth** (not CLI OAuth) and model routing aligned with mdeai (`gemini-3.5-flash` default; cheap model for heartbeat).

## Goals

1. `openclaw onboard --auth-choice gemini-api-key` on VPS; key in Infisical → `~/.openclaw/.env`.
2. `agents.defaults.model.primary` = `google/gemini-3.5-flash` (fallback `google/gemini-3-flash-preview` if list missing).
3. Document heartbeat model = `google/gemini-2.5-flash-lite` or `google/gemini-2.0-flash-001`.
4. `openclaw models list --provider google` saved in evidence.

## Acceptance criteria

1. `openclaw status` shows Google provider healthy.
2. Test prompt returns response; usage logged.
3. No `google-gemini-cli` OAuth in production compose.
4. Key not in `mdeapp/` or git.

## Verify

```bash
openclaw status
openclaw models list --provider google
openclaw doctor --fix
```

## Do not

- Use same key in client-side Next.js.
- Enable thinkingBudget disabled sentinels on Gemini 3.x (OpenClaw maps to thinkingLevel per docs).
