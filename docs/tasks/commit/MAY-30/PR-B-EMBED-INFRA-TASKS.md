# PR B — Embedding cache + worker infra (C-015)

**Branch:** `feat/mis-embed-cache-worker` (from `main` after PR A merges)  
**Linear:** VEC-003, VEC-004, AI-004, SAN-396  
**Depends on:** PR A merged

## Pre-flight

```bash
MDEAI_ALLOW_MIGRATION_EDIT=1  # required by hook for supabase/migrations/**
```

## Commit slices

### C-015a — VEC-003 embedding registry

**Files:**
- `src/mastra/lib/embedding-registry.ts`
- `src/mastra/lib/__tests__/embedding-registry.test.ts`

**Verify:** `npm run test -- embedding-registry`

### C-015b — VEC-004 query cache + migration

**Files:**
- `src/mastra/lib/query-embedding.ts` (cache read/write)
- `supabase/migrations/20260601120900_vec004_query_embedding_cache.sql` (**create from remote**)
- `../scripts/intelligence/verify-mis-phase1.mjs` (cache table check)

**Verify:** `npm run verify:mis-phase1` includes cache table; repeat embed shows cache hit in logs

### C-015c — embed worker

**Files:**
- `scripts/intelligence/embed-worker.ts`
- `package.json` → `"embed:worker": "npx tsx scripts/intelligence/embed-worker.ts"`

**Verify:** `npm run embed:worker -- --limit=1` (with pending jobs)

### C-015d — AI-004 grounding verifier

**Files:**
- `src/mastra/lib/verify-card-grounding.ts`
- `src/mastra/lib/__tests__/verify-card-grounding.test.ts`
- `scripts/intelligence/verify-grounding-cards.ts`
- `package.json` → `"verify:grounding-cards"`

**Verify:** `npm run verify:grounding-cards`

## Done gate

- [ ] Migration file in repo matches remote `query_embedding_cache`
- [ ] Fresh clone + `supabase db push` (or documented apply) creates cache table
- [ ] PR A still passes without this PR (direct Gemini embed)
- [ ] `npm run floor` exit 0

## PR title

`feat(intel): query embed cache + embedding worker (VEC-004)`

## Defer

- Cron scheduling for embed-worker (Phase 1b ops — not MVP)
- `grounding_failures` table (AI-004 spec — only verifier script shipped)
