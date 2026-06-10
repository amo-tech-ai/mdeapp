# UX-023 — ResultCardShell evidence (2026-06-02)

**Spec:** `tasks/PR/ux/UX-023-result-card-shell.md`  
**Linear:** SAN-437 (card unification M0)

## Skills / MCP verification

| Check | Result |
|-------|--------|
| shadcn skill | No `shadcn add` — compose existing `ui/card` primitives + domain `cards/` shell |
| copilotkit-develop | N/A — presentational refactor only |
| testing skill | Vitest + chat-smoke |

## Implementation

| File | Action |
|------|--------|
| `mdeapp/src/components/cards/result-card-shell.tsx` | **Created** — Shell, Body, Media, Header, Badges, Footer, Actions |
| `mdeapp/src/components/cards/__tests__/result-card-shell.test.tsx` | **Created** — attrs + placeholder |
| `mdeapp/src/components/cards/index.ts` | Re-exports |
| `mdeapp/src/components/copilot/cafe-result-card.tsx` | Refactored to shell (gold layout) |
| `mdeapp/src/components/copilot/rental-card.tsx` | `ResultCardShell` `mapSync={false}` |
| `mdeapp/src/components/copilot/event-card.tsx` | `ResultCardShell` `mapSync={false}` |

## Tests

```text
npm run test -- \
  src/components/cards/__tests__/result-card-shell.test.tsx \
  src/components/copilot/__tests__/cafe-result-card.test.tsx \
  src/components/copilot/__tests__/event-card.test.tsx \
  src/components/copilot/__tests__/rental-card-copy.test.tsx
→ 4 files, 10 passed
```

```text
npx eslint [UX-023 files] --max-warnings 0 && npm run typecheck
→ exit 0
```

```text
npm test (full)
→ see floor run — 436 tests (prior baseline)
```

## Smoke

```text
node tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
→ All checks passed (1 slow warning)

node tasks/testing/scripts/chat-smoke.mjs --base https://mdeai.co
→ All checks passed (1 slow warning)
```

## Floor note

`npm run floor` **blocked by pre-existing lint** in `src/app/restaurants/page.tsx` (`react-hooks/set-state-in-effect`) — **not introduced by UX-023**. Touched files lint clean.

## Acceptance (spec)

- [x] CafeResultCard uses shell; existing vitest green
- [x] RentalCard uses shell; rental-card-copy vitest green
- [x] EventCard uses shell; event-card vitest green
- [ ] Full `npm run floor` green — blocked by unrelated restaurants lint
- [ ] Visual screenshot parity — vitest/static markup only this slice

## Soak policy

SAN-462 soak **1/3** — implementation on branch; **no merge to main** until soak completes per PR tracker.
