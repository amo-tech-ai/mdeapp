# Phase A edge deletion — evidence

**Date:** 2026-05-24  
**Project:** `zkwcbyxiwklihegjhuql`  
**Backup:** `tasks/backup/edge-functions-2026-05-24/` + `edge-functions-2026-05-24.tar.gz`

## Deleted (10)

| Slug | Reason |
|------|--------|
| `ai-chat` | Replaced by Mastra `/api/copilotkit` |
| `ai-router` | Replaced by Mastra routing |
| `ai-search` | Replaced by Mastra pg tools |
| `ai-embed` | Batch/embed — not Phase 1 chat |
| `ai-suggest-collections` | Post-MVP |
| `ai-trip-planner` | Post-MVP |
| `ai-optimize-route` | MAP-011 defer |
| `rentals` | Mastra `search-rentals` tool |
| `hermes-ranking` | Phase 3 |
| `openclaw-concierge-webhook` | Phase 4 |

## Explicitly kept (mdeapp path)

- `chat-lead-capture`
- `ticket-checkout`
- `ticket-payment-webhook`
- `ticket-validate`

## Command

```bash
bash tasks/backup/edge-functions-2026-05-24/manifest/delete-phase-a-ai.sh
```

All 10 deletions exited 0.

## Restore any deleted fn

```bash
supabase functions deploy ai-chat --project-ref zkwcbyxiwklihegjhuql
# from tasks/backup/edge-functions-2026-05-24/deployed-live/supabase/functions/ai-chat/
```

## mdeapp impact

**None for chat** — mdeapp never called these slugs. Re-verify:

```bash
cd mdeapp && npm run smoke:map-pins && npm run verify:console:boot
```
