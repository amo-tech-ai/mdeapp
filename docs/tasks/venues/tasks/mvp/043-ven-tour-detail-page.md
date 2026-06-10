task_id: ven-043
mvp_step: 043
id: VEN-043
title: /tours/[slug] detail page
status: Open
priority: P3
phase: CTI-C
effort: 6h
owner: claude
depends_on: [VEN-032, VEN-038]
blocks: []
skill: [nextjs, mde-vercel, shadcn, mde-maps]
mcp: []
---

# VEN-043 — Tour detail page

## In plain English

A **public page per tour** (`/tours/la-sierra`) Camila can share on WhatsApp — facts from DB only, optional map, sources listed — no agent required.

## User story

**As a Tourist,** I want a link I can send my friend, **so that** they see the same tour details (price hints, map, sources) without opening chat.

## Real-world example

`https://mdeapp.vercel.app/tours/tour-urbano-la-sierra` shows hero, score, why recommended, verified sources — fields missing in DB are hidden, not invented.

## Goals

1. `mdeapp/src/app/tours/[slug]/page.tsx`
2. Server fetch by `slug` — RLS public read on `coffee_tours` policy TBD.
3. OG tags later (MAP-023).

## Success criteria

1. `/tours/tour-urbano-la-sierra` renders seeded row.
2. No hallucinated fields — null → hidden.
3. Server Component fetch by `slug`; public read policy documented.
4. Mobile-first layout (85% mobile users).
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-043](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-043-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-043 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

