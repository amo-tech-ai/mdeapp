---
id: MAP-013
title: Maps / ADK / Places env & key hygiene (doc + grep gate)
status: Done
priority: P0
phase: MVP — run before MAP-002 smoke and Vercel prod
effort: 1-2h
owner: claude
depends_on: [MAP-001]
blocks: []
skill: [mde-maps, mde-task-lifecycle, mde-vercel]
prd_ref: ../../../plan/ADK/maps-adk-prd.md · tasks/maps/INDEX.md § Environment
---

# MAP-013 — Env & key verification

> **No product features.** Safety task so **Camila**’s browser never gets Places/MCP keys and **Sofía**’s Vercel deploy does not ship `NEXT_PUBLIC_GOOGLE_PLACES_*`.

## 1. Purpose

Verify env split matches INDEX: browser Maps JS key + Map ID only; server Places + Maps + ADK + Gemini.

## 2. Goals

| Check | Pass criteria |
|-------|----------------|
| Browser | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` set; referrer restricted to app origins |
| Server Places | `GOOGLE_PLACES_API_KEY` — **no** `NEXT_PUBLIC_GOOGLE_PLACES_*` in `mdeapp/.env.local` or Vercel |
| ADK | `GOOGLE_MAPS_API_KEY` + `ADK_GROUNDING_URL` server-only |
| Gemini | `GOOGLE_GENERATIVE_AI_API_KEY` server-only |
| Source grep | `rg "NEXT_PUBLIC_GOOGLE_PLACES" mdeapp/src` → 0 (tests may mention as negative) |
| Scripts | Smoke scripts must not require `NEXT_PUBLIC_GOOGLE_PLACES` as map fallback |

## 3. Workflows

1. Audit `mdeapp/.env.local` + repo root `.env.local` (names only in evidence — redact values).
2. `cd mdeapp && npm test -- maps-security` → pass.
3. Document Vercel env checklist (Preview + Production) — align with F06 deploy task.
4. Optional: extend F09 floor grep for `NEXT_PUBLIC_GOOGLE_PLACES` in `mdeapp/.env*`.

## 4. Definition of Done

- Evidence: `tasks/notes/MAP-013-evidence.md` with pass/fail table (no secret values)
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` removed from local env or documented as **removed + why**
- INDEX env table matches disk
