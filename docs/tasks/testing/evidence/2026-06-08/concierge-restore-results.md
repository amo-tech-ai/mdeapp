# Concierge restore — smoke results (SAN-733 / PR #134)

**Date:** 2026-06-08  
**Branch:** `ai/san-733-fix-chat-restore-geochatshell-homepage-q-handoff`  
**Commit (PR head):** `65d0608`  
**PR:** https://github.com/amo-tech-ai/mdeapp/pull/134  
**Preview URL:** https://mdeapp-git-ai-san-733-fix-chat-restore-geochatshe-6fa795-amo100.vercel.app  
**Vercel deployment:** https://vercel.com/amo100/mdeapp/AbJsYLWuJ7hL7nma9dnhNRJh9b4Y  

## Task 1 — Vercel Preview (curl)

| Check | Result | Notes |
|-------|--------|-------|
| `curl -I <preview>/chat` | **401** | Preview deployment is **Ready** (Vercel check ✅) but URL is **SSO-protected** — CLI curl cannot reach app without Vercel auth cookie |
| `curl <preview>/` | **401** | Same SSO gate |
| Vercel GitHub check | **SUCCESS** | Deployment completed 2026-06-08 ~13:13 UTC |
| Floor CI | **SUCCESS** | GitHub Actions floor green |

**Action:** Open preview URL in browser (logged into Vercel team) and manually verify `/chat` → 200.

## Task 2 — Local smoke (localhost:3001)

Dev: `infisical run -- npm run dev` — UI `:3001`, Mastra `:4111`.

### curl

```text
GET /           → 200
GET /chat       → 200
GET /?q=test    → 307 location: /chat?q=test
```

### chat-smoke.mjs (localhost)

```text
All checks passed (2 slow warnings on rentals/events POST latency)
```

### Browser MCP (Chrome, 2026-06-08 session)

| Flow | Result |
|------|--------|
| Home hero → `suggest cafes in medellin` | `/chat` · auto-send · **4 café cards** · URL stripped to `/chat` |
| FAB "Open AI concierge" | `/chat` · GeoChatShell loads |
| Direct `/chat` | Shell + chat input · rentals query sent |

### Playwright

| Spec | Result |
|------|--------|
| `e2e/maps-layout-desktop.spec.ts` (nav/chat/map @1280) | **PASS** |
| `e2e/home-to-chat.spec.ts` (hero + FAB) | **FAIL** — hero Search button submit flaky in headless (React controlled input); FAB `waitForURL` timeout. Manual/browser path confirmed working. |

### Direct `/chat` verticals (prior session + layout spec)

- `/chat` mounts `chat-canvas`, `map-panel`, `copilot-chat-region` ✅
- Rentals / cafés / events / restaurants: verified in browser MCP earlier in cycle; full 4-vertical matrix not re-run in this evidence pass (use `e2e/live-audit-verticals.spec.ts` post-merge).

## Task 3 — Production (pre-merge baseline)

```bash
curl -I https://www.mdeai.co/chat
```

```text
HTTP/2 307
location: /
```

Prod still on `main` @ pre-SAN-733 — **expected until PR #134 merges**.

### Prod Tier-1 (chat-smoke)

```text
GET / → 200
POST /api/copilotkit (empty) → 401 (prod auth gate; not 5xx)
Rentals/events API shape → PASS
```

## Uncommitted local fixes (not on PR yet)

Working tree has review follow-ups (not pushed):

- `src/components/chat/concierge-initial-prompt.tsx` — send-then-strip, whitespace `?q=`, remove DOM poll
- `src/lib/concierge-send-user-message.ts` — full-chain try/catch + error log

Recommend: commit + push to PR branch before merge.

## Success criteria scorecard

| Criterion | Localhost | Preview | Prod |
|-----------|-----------|---------|------|
| `/chat` 200 | ✅ | ⏳ SSO — browser only | ❌ 307→/ |
| Home handoff | ✅ | ⏳ | ❌ |
| Auto-send once | ✅ | ⏳ | ❌ |
| URL → `/chat` | ✅ | ⏳ | ❌ |
| Cards + pins | ✅ (cafés, rentals) | ⏳ | N/A |
| Evidence saved | ✅ this file | — | — |
| PR #134 merged | — | — | ❌ open |

## Task 4 — Merge recommendation

**Do not merge on curl alone** — preview returns 401 without SSO session.

**Merge when:**

1. Browser check on preview URL confirms `/chat` 200 + home `?q=` handoff.
2. (Optional) Push uncommitted review fixes to PR branch.
3. Approve + merge PR #134.

## Task 5 — Post-merge prod verification

```bash
curl -I https://www.mdeai.co/chat   # expect HTTP/2 200
node tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

Browser: `/` → search → `/chat` → cards + pins.
