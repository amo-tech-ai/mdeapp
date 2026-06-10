---
id: UX-018
title: Set ADK_GROUNDING_URL on Vercel (Phase 2)
status: Deferred
priority: P2
phase: Phase 2 — live Google grounding
effort: 1-2h
owner: claude
depends_on: [UX-013]
blocks: []
sequence: after ADK Cloud Run / VPS deploy exists
skill: [mde-task-lifecycle, mde-vercel, gemini]
related:
  - ../tests/24-mde-audit.md
  - ../tests/notes-ux.md
  - ../../evidence/ADK/INDEX.md
description: Production defaults ADK_GROUNDING_URL to localhost:8000 — grounding always fails on Vercel. Set env when Phase 2 ADK service is deployed; UX-013 curated fallback remains first-line until then.
---

# UX-018 — Set `ADK_GROUNDING_URL` on Vercel

## Plain-English problem

Café tool tries ADK first; on Vercel the URL is `http://localhost:8000` → instant fail → fallback. UX-013 fixes fallback with anchors; this task enables **live Google grounding** on prod.

## User impact

- **Tourist:** richer live pins + fresher POIs when ADK is up; anchors remain backup.

## Implementation steps

1. Deploy ADK grounding service (see `tasks/evidence/ADK/`).
2. Set `ADK_GROUNDING_URL` in Vercel project env (preview + production).
3. Smoke: grounding path returns pins without localhost error in logs.
4. Verify cost/field-mask rules per `mde-maps`.

## Acceptance criteria

- [ ] Vercel prod has non-localhost `ADK_GROUNDING_URL`.
- [ ] Grounding smoke passes on preview deploy.
- [ ] Fallback to `venue_anchors` still works when ADK errors.

## Do not overbuild

- No ADK service implementation in this task — env + verify only.

## Flow diagram

```mermaid
flowchart LR
  Vercel[Vercel env] --> URL[ADK_GROUNDING_URL]
  URL --> Tool[search-grounded-places]
  Tool --> ADK[ADK Cloud Run]
  ADK -->|fail| FB[venue_anchors fallback UX-013]

  style ADK fill:#e7f6e7,stroke:#27ae60
  style FB fill:#fff3cd,stroke:#c80
```

## Verification (2026-05-31)

| Claim | Result |
|-------|--------|
| Env var name | ✅ `ADK_GROUNDING_URL` in adk-grounding-client.ts |
| Default localhost | ✅ Confirmed — prod broken without override |
| Depends UX-013 | ✅ Fallback must work when ADK fails |
