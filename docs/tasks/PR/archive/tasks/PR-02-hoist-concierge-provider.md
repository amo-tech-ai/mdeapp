---
task_id: PR-02
title: Hoist ConciergeCoAgentProvider above GeoChatShell
phase: HIGH
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: frontend
skill: copilotkit, react-best-practices
source: docs/02-pr-audit.md (#30 latent bug)
depends_on: []
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
stable_beta_train: after soak — independent of PR-04
description: Move the CoAgent provider to a shared layout so consumers outside GeoChatShell don't throw.
---

## Summary

| Field | Value |
|-------|-------|
| Bug | `ConciergeCoAgentProvider` is mounted **only inside** `geo-chat-shell.tsx` (L46–93 on `main`) |
| Impact | Any `useCoAgent`/`useConciergeCoAgent` consumer rendered outside that subtree **throws** ("must be used within ConciergeCoAgentProvider") |
| Fires when | Roberto's `/host/event/new` wizard (W3–W4) or any non-chat CoAgent surface mounts |
| Fix | Hoist the provider to the route-group layout that wraps every CoAgent consumer |

## Problem

Verified on `main`: provider import + mount live in `geo-chat-shell.tsx:6,45–90`; **not** in `layout.tsx`. Latent today (only `/chat` uses CoAgent), but a guaranteed crash the moment a second CoAgent surface ships.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Layout | `src/app/layout.tsx` (or the chat/host route-group layout) | Modify — wrap children in `ConciergeCoAgentProvider` |
| Component | `src/components/chat/geo-chat-shell.tsx` | Modify — remove the now-duplicate provider mount |
| Context | `src/components/chat/concierge-coagent-context.tsx` | Inspect — ensure provider is SSR-safe at layout level |

## Skill to use

- **`copilotkit`** — confirm provider placement doesn't break the v1 runtime wiring or re-introduce the POST-storm #30 fixed (unstable props → re-render). **Research gate before editing.**
- **`react-best-practices`** — provider hoisting + context boundary correctness.

## Gates / Acceptance

- [ ] A `useConciergeCoAgent` consumer rendered **outside** GeoChatShell does not throw (add a smoke mount or test).
- [ ] `/chat` still works; **no POST storm** to `/api/copilotkit` (the regression #30 guarded) — verify in preview Network panel.
- [ ] CopilotKit still pinned `1.55.2`, v1 imports only.
- [ ] `/verify-floor` green; localhost runtime proof (POST `:3001/api/copilotkit` 200, `/chat` reachable).

## Testing & proof

### Persona / journey

**Camila** (`/chat`) — CoAgent context available without nesting inside `GeoChatShell`. **Roberto** (future `/host/event/new`) — `useConciergeCoAgent` must not throw when wizard mounts outside chat shell.

### Pre-ship (localhost)

```bash
cd mdeapp && npm run dev
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/          # 200
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/copilotkit -H "Content-Type: application/json" -d '{}'  # 400/200
npm run test:e2e:copilot-budget    # no POST storm after hoist
npm run floor
```

### Implementation proof (Done · PR **#41** @ `a9eb176`)

| Check | Evidence | Result |
|-------|----------|--------|
| Provider hoisted | `src/app/layout.tsx` wraps `ConciergeCoAgentProvider` | merged #41 |
| Duplicate removed | `geo-chat-shell.tsx` no longer sole provider mount | merged #41 |
| POST budget | `PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npx playwright test e2e/copilotkit-request-budget.spec.ts` | ✅ PASS 2026-06-01 |
| Prod synthetic | [run 26775309213](https://github.com/amo-tech-ai/mdeapp/actions/runs/26775309213) @ `a9eb176` | ✅ success |

**Evidence:** `tasks/PR/NOTES/notes-5.md` · Vercel Production @ `a9eb176` (2026-06-01T18:51:56Z)

## Risks / Notes

- **Do not** destabilize #30's provider-prop fix — research first. If hoisting forces prop changes, keep object/array props referentially stable (memoize).
- Fresh branch off latest `main`. Persona: **Camila** (chat) must stay stable; **Roberto** (future wizard) is the consumer this unblocks.
