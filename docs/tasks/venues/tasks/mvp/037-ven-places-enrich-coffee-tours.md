task_id: ven-037
mvp_step: 037
id: VEN-037
title: Places API enrich for coffee tour rows
status: Open
priority: P1
phase: CTI-A
effort: 2h
owner: claude
depends_on: [VEN-034, MAP-018B, MAP-004]
blocks: [VEN-038]
skill: [mde-maps, mastra, gemini]
mcp: [google-maps-code-assist, user-mastra]
mcp_verify_before_code:
  - google-maps-code-assist — Places API New field masks
---

# VEN-037 — Places enrich tours

## In plain English

For tours that have a real Google **`place_id`**, pull photos, hours, and review counts from Places API (with field masks) — same pipeline Camila already uses for grounded restaurants.

## User story

**As a Tourist,** I want to see a photo and star rating on a tour card when Google has them, **so that** the card feels as trustworthy as a restaurant suggestion — without the agent making up ratings.

## Real-world example

La Casa Grande’s card shows a hero image from `/api/places/photo`, `4.8 ★ (120 reviews)`, and opening hours — all from Places Details for its verified `place_id`. A row without `place_id` still shows with a “limited verification” badge.

## Goals

1. `enrichCoffeeTourWithPlaces` tool or inline step in `searchCoffeeTours` when `place_id` set.
2. `X-Goog-FieldMask` on every Places call.
3. Cache via `place_details_cache` (MAP-018E).

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Tool/helper | `mdeapp/src/mastra/tools/enrich-coffee-tour-places.ts` | Create |
| Reuse | MAP-018B client / `normalize-tool-output.ts` | Import |

## Success criteria

1. Seeded tour with valid `place_id` returns photo proxy URL on card.
2. Missing `place_id` → card still renders with "limited verification" badge.
3. No client-side Places API key.
4. Every Places call includes `X-Goog-FieldMask`; cache via MAP-018E where possible.

## Tests

```bash
cd mdeapp && npm test -- enrich-coffee-tour
```
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-037](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-037-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-037 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

