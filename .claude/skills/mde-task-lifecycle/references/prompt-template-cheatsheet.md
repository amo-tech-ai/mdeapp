---
title: Prompt template cheat sheet
impact: MEDIUM
impactDescription: tasks-template.md sections for Phase 1
tags: mde-task-lifecycle, prompts, tasks-template
---

# Prompt template cheat sheet

Quick reference of [tasks/tasks-template.md](../../../../tasks/tasks-template.md). Use during Phase 1.

---

## Required sections (in order)

1. Frontmatter (YAML)
2. Summary table
3. Description (5-part)
4. Rationale
5. User stories
6. Goals + Acceptance criteria (≤10)
7. Wiring plan
8. Schema (only if migration)
9. Edge cases
10. Real-world examples (2-3, named persona)
11. Outcomes table (3-5 before/after rows)

---

## Frontmatter fields

| Field | Required | Example |
|-------|----------|---------|
| `task_id` | yes | `17A` |
| `title` | yes | `paperclip-bridge Docker service` |
| `phase` | yes | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `priority` | yes | `P0`, `P1`, `P2`, `P3` |
| `status` | yes | `Not Started` (initial), then `In Progress`, then `Done` |
| `estimated_effort` | yes | `1 day`, `3 days`, `1 week` |
| `area` | yes | `frontend`, `backend`, `infrastructure`, `trio`, `ai-agents`, `auth` |
| `schema_tables` | if any | `[apartments, bookings]` |
| `depends_on` | yes (can be `[]`) | `[06A, 06B]` |
| `description` | yes | One line — what this task ships |

---

## Acceptance criteria — examples

Good (observable, single-verb):

- `POST /api/bookings returns 200 with { id, confirmation_code }`
- `Loading skeleton renders for ≤300ms after mount`
- `RLS rejects SELECT from a different org_id with status 403`
- `Build size for the route chunk is ≤45KB gzipped`

Bad (unobservable, multi-verb):

- ~~"Booking flow works well"~~ → unobservable
- ~~"User can save and export and share"~~ → multi-verb, split
- ~~"Performance is good"~~ → unmeasurable
- ~~"Tests pass"~~ → tautology

---

## Wiring plan format

| Layer | File | Action |
|-------|------|--------|
| Page | `src/pages/RentalDetail.tsx` | Modify |
| Component | `src/components/rentals/RankingPopover.tsx` | Create |
| Hook | `src/hooks/useRankingSignals.ts` | Create |
| Edge function | `supabase/functions/ai-search/index.ts` | Modify |
| Migration | `supabase/migrations/20260509_add_signals.sql` | Create |
| Types | `src/types/listings.ts` | Modify |

Every row needs Create or Modify. No "TBD".

---

## Real-world example pattern

```markdown
**Scenario 1 — Camila finds a Laureles loft:**
Camila opens /apartments and filters for Laureles. Today she sees a flat
list with no ranking signal. **With this implementation,** each card
shows a "92 match" badge; hovering reveals: "Walking distance to El
Poblado (35%), Pet-friendly (22%), Recent reviews (18%)…". She picks
the top result in 30 seconds instead of scrolling 50 listings.
```

Use a persona from PRD §2.1: Miguel, Camila, Sofía, Andrés B., Roberto, Patricia, Daniela, Juan Pablo, Natalia.

---

## Outcomes table

```markdown
| Before | After |
|--------|-------|
| Apartment cards show one number with no context | Cards show a labeled match badge with hover-detail |
| Right panel is empty during browsing | Right panel surfaces top-3 signal weights for the focused listing |
| Camila scrolls 50 listings before booking | Camila books in 30s using the top-ranked card |
```

3-5 rows. Each is a concrete before/after pair, not vague.

---

## Schema section pattern

```markdown
### Table: ranking_signals

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| apartment_id | uuid | FK apartments(id) ON DELETE CASCADE |
| signal_name | text | NOT NULL |
| weight | numeric(5,4) | NOT NULL CHECK (weight BETWEEN 0 AND 1) |
| created_at | timestamptz | default now() |

### RLS

| Policy | Op | Rule |
|--------|----|------|
| select_public | SELECT | true |
| insert_service | INSERT | (select auth.role()) = 'service_role' |
```

Always include RLS. Always use `(select auth.uid())` subquery, never `auth.uid()` directly.

---

## Common errors caught by validation

- `status` not set to `Not Started` on a fresh prompt
- `depends_on` references an ID that doesn't exist
- AC has 12 rows (split into siblings)
- Wiring plan missing the Create/Modify column
- No persona named in real-world example
- Outcomes table has 1 row (need 3-5)
- Schema section present but no RLS rows
