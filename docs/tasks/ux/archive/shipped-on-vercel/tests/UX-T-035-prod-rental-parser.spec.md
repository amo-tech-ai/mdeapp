---
id: UX-T-035
title: Playwright — prod rental parser verify
status: Not Started
priority: P1
implements: UX-035
depends_on: [UX-003]
blocks: []
skill: [testing, playwright-cli]
output: mdeapp/e2e/prod-rental-parser.spec.ts
base_url: https://www.mdeai.co
description: Read-only prod smoke — rental query returns cards without parser leak strings in assistant text.
---

# UX-T-035 — prod rental parser spec

## Target file

`mdeapp/e2e/prod-rental-parser.spec.ts`

## Config

Use Playwright project or env:

```typescript
test.use({ baseURL: process.env.SMOKE_BASE_URL ?? "https://www.mdeai.co" });
test.describe.configure({ timeout: 120_000 });
```

Tag: `@prod` — **do not run in default CI** without secret URL override.

## Scenario

| Step | Action | Assert |
|------|--------|--------|
| 1 | `gotoHome` against prod | 200, chat panel visible |
| 2 | Send `1BR in Laureles under $80/night` | ≥1 `[data-testid="rental-card"]` within 120s |
| 3 | Read assistant text in `#copilot-chat-region` | No raw parser tokens: `$80/night` leak patterns, `INT-002`, JSON blobs |
| 4 | Screenshot | `tasks/testing/evidence/<date>/prod-rental-parser.png` |

## Anti-patterns

- Do not mock APIs on prod
- Do not assert exact card count (data varies)
- Skip if `SMOKE_BASE_URL` unset in CI

## Acceptance criteria

- [ ] Spec passes manually against www.mdeai.co post-deploy
- [ ] Document run command in spec header comment
- [ ] Linked from UX-035 task Done evidence

## Command

```bash
cd mdeapp
SMOKE_BASE_URL=https://www.mdeai.co npx playwright test e2e/prod-rental-parser.spec.ts --project=chromium
```
