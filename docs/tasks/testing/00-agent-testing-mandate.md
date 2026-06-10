# Agent testing mandate (strict)

> **Who:** Every agent (Cursor, Claude Code, Codex) working on `mdeapp/` or persona-visible UI.  
> **Cursor rule:** [`.cursor/rules/mdeai-testing.mdc`](../../.cursor/rules/mdeai-testing.mdc)  
> **Screen Done gate:** [`tasks/screens/SCREEN-TESTING-STANDARD.md`](../screens/SCREEN-TESTING-STANDARD.md)

---

## Non-negotiable

**You are responsible for testing.** Not the user. Not “please verify on your machine.”

Before you say a UI/chat/map feature **works**, **ships**, or moves a task toward **Done**, you must:

1. **Restart the dev server** (fresh process — HMR is not enough for CopilotKit tool renders, map sync, or agent wiring).
2. **Test on localhost** (`http://localhost:3001/` when 3000 is occupied — read the `[ui]` port from `npm run dev`).
3. **Test on production** [`https://www.mdeai.co/`](https://www.mdeai.co/) for the same persona-visible behavior (or document why prod is blocked, e.g. deploy not merged yet).

Skipping any of the three is a **process failure**, same as skipping lint.

---

## What “responsible” means

| You must | You must not |
|----------|----------------|
| Run kill + `npm run dev` yourself | Assume an already-running dev server is fresh |
| `curl` or Browser MCP on `/` until **200** | Trust “it compiled” or hot reload |
| Run at least one test pack from [`INDEX.md`](./INDEX.md) or matching Playwright spec | Hand testing off with “try it locally” |
| Hit **both** localhost and `https://www.mdeai.co/` when the change affects prod-deployed surfaces | Mark Done from code review alone |
| Save evidence under `tasks/testing/evidence/YYYY-MM-DD/` | Claim PASS without a results file when the task spec requires evidence |

**User only steps in for:** login/passkey, billing, secrets you cannot access, or explicit approval to move Linear **Done** (see [`tasks/linear/04-completion-approval.md`](04-completion-approval.md)).

---

## Procedure (every UI/agent touch)

### A — Restart dev (localhost)

Run in **separate** commands (do not chain `pkill && npm run dev` — can kill the new process):

```bash
pkill -f "next dev" 2>/dev/null; pkill -f "mastra dev" 2>/dev/null; sleep 2
cd /home/sk/mdeai/mdeapp && npm run dev
```

Wait for `[ui] ✓ Ready`, then:

```bash
curl -s -o /dev/null -w "localhost GET / -> %{http_code}\n" http://localhost:3001/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
```

### B — Localhost interactive proof

Pick a pack from [`INDEX.md`](./INDEX.md) (events → `01`, multi-intent → `02`, cafés → `03`) or the screen’s `playwright_spec`.

- **Browser MCP:** navigate → snapshot → send sample prompt → assert cards/pins/modal → screenshot.
- **Playwright:** `cd mdeapp && PW_SKIP_WEBSERVER=1 npx playwright test …` when a spec exists.

### C — Production proof

Same checks on **prod** (deploy must include your commit; if not deployed yet, say so and leave task **In Review**):

```bash
curl -s -o /dev/null -w "prod GET / -> %{http_code}\n" https://www.mdeai.co/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

- **Browser MCP:** `browser_navigate` → `https://www.mdeai.co/` → repeat the pack’s sample prompt.
- Record **localhost vs prod** in `RESULTS.md` (PASS/FAIL per environment).

### D — Floor (before commit/PR)

```bash
cd /home/sk/mdeai/mdeapp && npm run floor
```

---

## Evidence template

`tasks/testing/evidence/YYYY-MM-DD/<TASK-ID>-RESULTS.md`:

```markdown
## Dev restart
- [ ] kill 3001/4111 + `npm run dev` — port: ___
- [ ] GET / → 200

## Localhost
- Pack: ___
- Prompt: ___
- Result: PASS | FAIL — ___

## Production (https://www.mdeai.co/)
- [ ] GET / → 200
- Same prompt: PASS | FAIL — ___
- Deploy SHA / note if not yet live: ___

## Playwright / floor
- spec: ___
- floor: exit ___
```

---

## When this mandate does not apply

- Pure docs under `plan/`, `tasks/` with **zero** `mdeapp/src/**` changes — say **N/A** explicitly.
- CI-only or script-only changes with no runtime surface — `npm run floor` only.

Everything else: **restart + localhost + prod** unless you document a blocker.

---

## Quick reference

| Environment | Base URL |
|-------------|----------|
| Local (default) | `http://localhost:3001/` |
| Local (if 3000 free) | `http://localhost:3000/` |
| Production | `https://www.mdeai.co/` |

**Production project:** Vercel `amo100/mdeai` serves `www.mdeai.co` — do not confuse with experimental preview URLs unless the task says so.
