task_id: ven-035
mvp_step: 035
id: VEN-035
title: rankCoffeeTours scoring function
status: Open
priority: P1
phase: CTI-A
effort: 3h
owner: claude
depends_on: [VEN-033, VEN-034, F50b]
blocks: [VEN-036, VEN-038]
note: Ship before VEN-036 — ranker must exist when searchCoffeeTours calls it.
listings_ref: ../../listings/cafes/05a-coffee-tours.md
skill: [testing, mastra, mde-maps]
mcp: []
---

# VEN-035 — rankCoffeeTours

## In plain English

Build the **scoring brain** that orders tours using facts (ratings, distance, verified sources) plus intent — not Gemini guesses. Ship **before** VEN-036 so the search tool always returns a sorted list.

## User story

**As a Tourist,** I want *“social impact coffee tour”* to surface La Sierra first, **so that** recommendations match what I asked — with weak or unverified tours hidden or flagged.

## Real-world example

| Query intent | Expected top result | Hidden |
|--------------|---------------------|--------|
| *“social impact farm tour”* | Tour Urbano / La Sierra | Score &lt; 55 |
| *“near Laureles”* (map bias) | Closest verified tours | Unverified junk |
| *“beginner friendly”* | Tours tagged `best_for: beginner` | Low-confidence Artisan |

## Goals

1. Pure TypeScript/SQL ranker — no LLM in the math.
2. Score /100 with documented weights.
3. Thresholds: hide &lt;55; “limited verification” &lt;70.
4. **No pgvector** until VEN-044.

## Formula (Phase A — SQL only)

| Component | Weight |
|-----------|--------|
| Rating + review confidence | 25% |
| Authenticity / farm | 20% |
| Source verification | 15% |
| Social impact | 15% |
| Distance / viewport (F50b) | 10% |
| Language fit | 5% |
| Price/duration fit | 5% |
| Booking confidence | 5% |

**Thresholds:** &lt;55 hide from chat; &lt;70 show "limited verification".

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Ranker | `mdeapp/src/mastra/lib/rank-coffee-tours.ts` | Create |
| Signals | `coffee_tour_rank_signals` upsert on rank | Optional in VEN-032 |

## Success criteria

1. Vitest: `intent: social_impact` boosts La Sierra tour.
2. Vitest: viewport bias reorders by distance.
3. Vitest: score &lt; 55 → filtered out; score 55–69 → `limitedVerification: true`.
4. `rankCoffeeTours` pure function — no Gemini in score math; **no pgvector** until VEN-044 wires vector blend.

## Tests

```bash
cd mdeapp && npm test -- rank-coffee-tours
```
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-035](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-035-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-035 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

