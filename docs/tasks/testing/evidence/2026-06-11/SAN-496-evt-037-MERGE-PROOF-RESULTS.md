# SAN-496 · EVT-037 — Request Proposal Modal — merge proof

**Date:** 2026-06-11  
**PR:** [#178](https://github.com/amo-tech-ai/mdeapp/pull/178) — **merged** `694a17b`  
**Persona:** Tourist (Camila) — `/chat` → venue CTA → proposal modal

## Build verification

| Check | Result |
|-------|--------|
| CI floor (#178) | ✅ SUCCESS |
| Proposal vitest (32 core + route + shell) | ✅ 32/32 on merged main |
| CodeRabbit / Vercel preview | ✅ SUCCESS |
| Local floor (san-496 worktree) | ⚠️ Turbopack worktree root issue — CI floor is source of truth |

## Browser / Playwright

| Check | Result |
|-------|--------|
| `e2e/san-496-event-proposal-submit.spec.ts` added | ✅ mocked API happy path + 409 UI |
| Live Chrome MCP submit + success screen | ⬜ Blocked — localhost:3001 not on merged branch during session; spec skips when no mapped venue CTA |
| POST `/api/events/proposal` network capture | ⬜ Needs signed-in user + mapped Mamacita card (State B) |

## Supabase / idempotency

| Check | Result |
|-------|--------|
| Migration `20260611160000_veb_mvp_004_bookings_idempotency.sql` on main | ✅ in repo |
| `idempotency_key` column applied on dev DB | ⬜ Supabase MCP `execute_sql` failed (`net::ERR_FAILED`) — run `npx supabase db push` locally |
| Duplicate POST → 409 + single row | ⬜ Vitest mocks prove 409 path; live duplicate not executed this session |

## Console

| Surface | Result |
|---------|--------|
| `/chat` load (Chrome MCP) | ✅ No errors observed in snapshot session |

## Verdict

**Merge-safe:** yes — architecture + vitest + CI floor green.  
**Production-validated (user rule):** not yet — live browser submit, Supabase row proof, and duplicate-submit DB proof still required before marking SAN-496 Done.

**Next:** merge **SAN-501** workflow (#TBD) → rebase **SAN-502** #171/#172 → full E2E chain.
