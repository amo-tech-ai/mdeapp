---
title: Active commit ledger
updated: 2026-05-28
base_sha: a4c1ecb
main_tip: e8d2a60
c004_pr: https://github.com/amo-tech-ai/mdeapp/pull/4
c004_sha: fa8be0c
branch_shipped: ship/may27-maps-events
status: ledger_commits_complete
audits: ./audits/INDEX.md
tracker: ./PROGRESS-TASK-TRACKER.md
---

# Active commit ledger

> **All ledger commits on `main` @ `f37291d` (2026-05-27).** Production: https://www.mdeai.co/

**Preflight (main):** `cd mdeapp && npm run lint && npm run typecheck && npm run floor`

## Shipped stack (PR #1 + post-ship PRs)

| ID | Status | Message (short) | SHA |
|----|--------|-----------------|-----|
| C-000 | shipped | `chore: ignore supabase CLI temp cache (C-000)` | f993b81 |
| C-001 | shipped | `feat(maps): category markers, clustering, and pin sync (C-001)` | fec2a8f |
| C-002 | shipped | `feat(places): Places client, photo proxy, and grounded cards (C-002)` | ef8c540 |
| C-003 | shipped | `feat(agent): search router, ADK grounding, and concierge tools (C-003)` | 7b5212b |
| C-004 | shipped | `feat(chat): wire event web citations` | fa8be0c (PR #4) |
| C-005 | shipped | `feat(events): local clarify fast path and zero-runtime event search (C-005)` | 7f64f3e |
| C-005b | shipped | `feat(events): keep ticket checkout in chat sheet (C-005b)` | d7a57f7 |
| C-006 | shipped | `chore(deps): declare @googlemaps/places and markerclusterer for Vercel build` | 768ee3b |
| — | shipped | `fix(chat): remove invalid CopilotKit Input import` | cf5df05 |
| merge | shipped | Merge pull request #1 | 7ee9431 |

### Verification record

| Check | Result | When |
|-------|--------|------|
| Vercel preview (PR #4) | Ready | 2026-05-27 |
| Vercel prod | Live @ `7ee9431`+ | 2026-05-26 |
| `npm run floor` on `main` | PASS | 2026-05-27 (`f37291d`; **278** tests) |
| Prod smoke (events/maps/checkout) | PASS | 2026-05-26 |
| C-004 stale-citation fix | PASS | 2026-05-27 (`e10cec9` in PR #4) |
| `smoke:ticket-checkout` | PASS | 2026-05-27 |
| `smoke:ticket-paid-proof` | PASS (session + webhook inventory) | 2026-05-27 |

---

## Post-ship fixes (merged)

| PR | SHA | Purpose | Status |
|----|-----|---------|--------|
| [#2](https://github.com/amo-tech-ai/mdeapp/pull/2) | `a5c3e54` | `dev:ui` webpack default; `dev:ui:turbopack` opt-in | **MERGED** |
| [#3](https://github.com/amo-tech-ai/mdeapp/pull/3) | `2a83425` | `MASTRA_DEV_LIBSQL` + HMR storage singleton (EMAXCONN fix) | **MERGED** |
| [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) | `fa8be0c` | C-004 web citations + stale-citation fix | **MERGED** |
| [#5](https://github.com/amo-tech-ai/mdeapp/pull/5) | `4e50f67` | Event clarify: category-only answer clears stale chip filters | **MERGED** |
| [#6](https://github.com/amo-tech-ai/mdeapp/pull/6) | `57a36ab` | Chat: dedupe event result panels; relax card scroll cap | **MERGED** |
| [#7](https://github.com/amo-tech-ai/mdeapp/pull/7) | `f37291d` | Search: stop event fast-path hijacking rental/café queries | **MERGED** |

**Local dev:** `MASTRA_DEV_LIBSQL=1` in `mdeapp/.env.local` (required).

---

## C-004 — shipped (PR #4 merged)

| ID | Status | Branch | SHA | PR |
|----|--------|--------|-----|-----|
| C-004 | **shipped** | `fix/c004-web-citations` | `fa8be0c` | [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) |

**Includes:** `e10cec9` — `setWebCitations([])` when agent tool returns empty `webGrounding`.

Audit: [audits/C-004-chat.md](./audits/C-004-chat.md).

### C-004 files (on `main`)

```
src/components/copilot/event-web-citation-fetch.tsx
src/components/copilot/event-web-citation-sync.tsx
src/components/chat/event-search-results-context.tsx
src/components/copilot/search-tool-renders.tsx
src/platform/copilot/mastra-tool-action-names.ts
src/components/chat/geo-chat-shell.tsx
src/components/chat/event-results-panel.tsx
src/hooks/use-event-search-fast-path.ts
```

---

## Never stage

```
.env.local
supabase/.temp/**
tmp/**
test-results/**
/home/sk/mdeai/screenshots/**
scripts/smoke-laureles-flow*.mjs   # local-only unless lint-clean
```

---

## Done criteria (ship stack)

- [x] Branch `ship/may27-maps-events` created and pushed
- [x] C-000, C-001, C-002, C-003, C-004, C-005, C-005b, C-006 + Input fix on `main`
- [x] PR #1 merged; prod verified
- [x] C-004 merged (PR #4 @ `fa8be0c`)
- [x] PR #2 merged (dev webpack) @ `a5c3e54`
- [x] PR #3 merged (Mastra dev LibSQL) @ `2a83425`
- [x] PR #5 merged (event clarify stale filters) @ `4e50f67`
- [x] PR #6 merged (event panel dedupe) @ `57a36ab`
- [x] PR #7 merged (search classifier hijack) @ `f37291d`
- [x] `npm run floor` exit 0 on `main` @ `f37291d` (278 tests)
- [ ] Andrés Stripe **live** paid-path proof — checkout smokes pass; manual test payment → `paid` row evidence (**ops gate, not a code commit**)

---

## After the ledger (May 28 extension)

**Shipped:** PR #8–#12 (C-008…C-010c) @ `e8d2a60`. See [PROGRESS-TASK-TRACKER.md](./PROGRESS-TASK-TRACKER.md).

**Open commit tasks:** [may-27/tasks/INDEX.md](./may-27/tasks/INDEX.md)

| Priority | ID | PR slot | Scope |
|----------|-----|---------|-------|
| 1 (optional) | C-010d | test PR after #12 | Prod e2e pin-clear gate |
| 2 | C-012 | **next product PR** | Café Places detail |
| 3 | C-013 | **after C-012** | Event fast-path panel |
| 4 | **C-016** | **shipped** | Partner signup landing (SAN-723 UI slice) — PR #124 → `19c2329` |
| 5 | **C-017** | **shipped** | Partner hub `/partners` (SAN-692) — PR #126 merged |

**Ops (not C-###):** Andrés G1 live Stripe `paid` evidence.

### C-016 — partner signup landing (SAN-723)

| ID | Status | Branch | Scope |
|----|--------|--------|-------|
| C-016 | **shipped** | `main` @ `19c2329` | `PartnerSignupTypePicker`, `partner-signup-nav`, `accordion`, wizard polish, tests |

**Files:** `src/app/partners/signup/page.tsx`, `src/components/partners/partner-signup-*.tsx`, `src/lib/partners/partner-type-picker-config.ts`, `src/components/ui/accordion.tsx`, `src/components/partners/__tests__/partner-signup-type-picker.test.tsx`

### C-017 — partner hub (SAN-692)

| ID | Status | Branch | Scope |
|----|--------|--------|-------|
| C-017 | **shipped** | `main` (PR #126) | `/partners` page, 8-card shadcn grid, `partner-hub-config`, tests |

**Files:** `src/app/partners/page.tsx`, `src/components/partners/partner-hub.tsx`, `src/lib/partners/partner-hub-config.ts`, `src/__tests__/partners/partner-hub.test.tsx`
