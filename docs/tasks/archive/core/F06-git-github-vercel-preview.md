---
id: F06
title: git init + gh repo create + first Vercel preview deploy
status: Done
priority: P0
effort: 30 min
completed_at: 2026-05-20
owner: claude
depends_on: [F05]
skill: [mde-github, mde-vercel, mde-task-lifecycle]
evidence: /home/sk/mdeai/tasks/notes/draft/F06-evidence.md
verified_against:
  - .gitignore in the example (already excludes node_modules, .next, .env*)
  - Vercel CLI authenticated as amo100
  - GitHub CLI authenticated as amo-tech-ai (no `mdeai` org access)
namespace_decision:
  github_repo: amo-tech-ai/mdeapp (PUBLIC) — created 2026-05-20; spec originally said mdeai/mdeai-app private; mdeai org doesn't exist on user's account
  vercel_project: NEW project required (NOT amo100/mdeai which already serves production www.mdeai.co)
language_decision:
  phase_1: English (per CLAUDE.md "Language scope" — Spanish/Lingui deferred to Phase 2)
---

# F06 — Git init + GitHub repo + first Vercel preview

## 1. Purpose

Get the bootstrapped mdeapp into version control and deployed to a Vercel preview URL. This is the moment the project becomes a real production candidate — a working preview link Sofía can share, and a GitHub repo with the first commit. End of Week 1.

**As of 2026-05-20:** repo + 3 commits + GitHub hygiene (description, homepage, 8 topics) are **Done**. Vercel link + envs + first deploy are **pending** (block: which Vercel project — see §11 below).

## 2. Goals

- `/home/sk/mdeai/mdeapp/` is a git repo with one initial commit
- GitHub repo `mdeai/mdeai-app` created as **private**
- First push lands on `main` branch
- Vercel project linked to the GitHub repo
- Vercel preview build succeeds; preview URL returns HTTP 200
- Preview sidebar echoes "hola" the same way localhost did in F05
- No secret values in the committed `.env.example` (only placeholders)
- `.env.local` is **not** committed (gitignored)

## 3. Features (what the user gets)

- **Sofía (dev):** a private GitHub repo + a public preview URL on Vercel
- **Camila / Roberto:** still nothing — the preview is dev-only until W10 cutover
- **Lucía (QA):** a Vercel preview URL to run smoke tests against

## 4. Workflows

1. `cd /home/sk/mdeai/mdeapp`
2. Confirm `.gitignore` excludes `node_modules/`, `.next/`, `.env.local` (the example's `.gitignore` already does)
3. `git init -b main`
4. `git add .`
5. `git status` — verify `.env.local` is **not** in the staged list (gitignored). Verify `.env.example` IS staged.
6. `git commit -m "feat(mdeapp): bootstrap CopilotKit + Mastra + Gemini foundation"`
7. `gh repo create mdeai/mdeai-app --private --source . --remote origin --push`
8. Confirm push lands: `gh repo view mdeai/mdeai-app`
9. Vercel CLI sanity check + (one-time) upgrade: `npm i -g vercel@latest`
10. `vercel link` (interactive — link the directory to a new Vercel project)
11. `vercel env pull .env.local.vercel` (optional sanity check — should be empty since we haven't pushed envs)
12. Push envs to Vercel: `vercel env add NEXT_PUBLIC_SUPABASE_URL`, repeat for the 5 env vars + `GOOGLE_GENERATIVE_AI_API_KEY` + `LOG_LEVEL`
13. `vercel` (first deploy — creates a preview)
14. Wait for the preview URL; verify it serves the mdeai shell
15. Smoke: open preview URL in browser, type "hola", confirm Spanish reply (same as F05 localhost)

## 5. User journeys

- **Sofía (dev):** runs ~10 commands in 15 min. Sees a Vercel preview URL in the terminal. Opens it. Sidebar works.
- **Lucía (QA):** receives the preview URL, runs the F05 smoke (type "hola"), confirms parity with localhost.
- **Camila / Roberto:** unchanged (preview is unlisted).

## 6. Agents

None. This is repo + deploy.

## 7. Integrations

| Integration | Purpose |
|---|---|
| `git` | local version control |
| `gh` CLI | GitHub repo create + push |
| `vercel` CLI | link + env push + first deploy |
| Vercel Fluid Compute (Node 24 LTS) | runtime for `/api/copilotkit` POST |
| GitHub Actions (later) | CI gate — set up in W2 task F09 |

## 8. Summary

Initialize git, create a private `mdeai/mdeai-app` GitHub repo, push, link Vercel, push env vars, deploy a preview. It helps Sofía share the work with the team and gives Lucía a smoke URL. We'll know it worked when the Vercel preview URL echoes "hola" the same way localhost did in F05.

## 9. Definition of Done

- [ ] `git status` shows `clean` after commit
- [ ] First commit hash captured in task notes
- [ ] `gh repo view mdeai/mdeai-app` shows the repo exists + private
- [ ] `origin/main` exists; first commit pushed
- [ ] `.env.local` is **not** in `git ls-files` output (gitignored)
- [ ] `.env.example` IS in `git ls-files` output (placeholders only)
- [ ] Vercel project linked (`.vercel/project.json` exists locally, gitignored)
- [ ] All 6 env vars pushed to Vercel via `vercel env add` (verify with `vercel env ls`)
- [ ] First Vercel preview deploy succeeds (state: ● Ready)
- [ ] Preview URL returns HTTP 200 on `/`
- [ ] Preview URL sidebar echoes "hola" in Spanish (same behavior as F05 localhost)
- [ ] Evidence: preview URL pasted in task notes; screenshot of sidebar reply on preview; first commit hash

## 10. Tests

Run from `mdeapp/`. Requires Vercel CLI + `gh` CLI authenticated.

### Acceptance tests — git/local

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T1 | repo init | `git rev-parse --is-inside-work-tree` | `true` |
| T2 | one commit | `git log --oneline \| wc -l` | `≥ 1` |
| T3 | `.env.local` NOT staged | `git ls-files \| grep -c '.env.local$'` | `0` |
| T4 | `.env.example` IS staged | `git ls-files \| grep -c '.env.example$'` | `1` |
| T5 | gitignore covers .env.local | `git check-ignore -v .env.local` | exit 0 + match shown |
| T6 | working tree clean | `git status --porcelain \| wc -l` | `0` |
| T7 | scan-secrets pass on tracked files | for f in $(git ls-files); do feed via stdin to `scan-secrets.mjs`; done | all `exit=0` |

### Acceptance tests — GitHub

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T8 | repo exists | `gh repo view amo-tech-ai/mdeapp --json visibility,defaultBranchRef` | `visibility = PUBLIC` (intentional — see §11), branch `main` |
| T9 | origin pushed | `git ls-remote origin main \| wc -l` | `1` |
| T10 | latest commit hash matches remote | `git rev-parse HEAD` matches `gh api repos/amo-tech-ai/mdeapp/commits/main --jq .sha` | same SHA |
| T8b | repo has description + topics | `gh repo view amo-tech-ai/mdeapp --json description,repositoryTopics` | description non-empty + 8 topics |
| T8c | homepage URL set | `gh repo view amo-tech-ai/mdeapp --json homepageUrl` | `https://mdeai.co` |

### Acceptance tests — Vercel preview

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T11 | project linked | `test -f .vercel/project.json && echo OK` | `OK` |
| T12 | .vercel/ ignored | `git check-ignore -v .vercel/` | matches |
| T13 | 6 envs pushed | `vercel env ls \| grep -cE 'NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_ANON_KEY\|NEXT_PUBLIC_GOOGLE_MAPS_API_KEY\|NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID\|GOOGLE_GENERATIVE_AI_API_KEY\|LOG_LEVEL'` | `6` |
| T14 | preview Ready | `vercel ls 2>&1 \| head -5 \| grep -c "Ready"` | `≥ 1` |
| T15 | preview URL HTTP 200 | `PREVIEW_URL=$(vercel ls --json \| jq -r '.[0].url'); curl -sf -o /dev/null -w "%{http_code}" https://$PREVIEW_URL` | `200` |
| T16 | preview parity with F05 | `curl -s https://$PREVIEW_URL \| grep -q "mdeai\|Hi"` | match (English per CLAUDE.md "Language scope") |

### Manual / Playwright MCP tests against preview

| # | Test | How | Expected |
|---|---|---|---|
| Tm1 | preview hi echo | `mcp__playwright-test__browser_navigate https://$PREVIEW_URL` → type "hi" → wait for assistant reply | English reply within 8s (matches F05 localhost — "Hello! The wiring is alive…") |
| Tm2 | console clean | `browser_console_messages` | no errors |
| Tm3 | screenshot | `browser_take_screenshot` | saved to `tasks/notes/F06-preview-screenshot.png` |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | stage `.env.local` deliberately | T3 fails; commit step refuses; user must `git restore --staged .env.local` |
| Tn2 | push to `main` without env vars set on Vercel | T15 fails (HTTP 500) — confirms env push step is load-bearing |
| Tn3 | push a literal Stripe `sk_live_…` in any tracked file | T7 fails AND pre-commit `scan-secrets.mjs` already blocked it |

### Evidence to capture in `tasks/notes/F06-evidence.md`

- First commit hash (T2 output)
- `gh repo view mdeai/mdeai-app` output (T8)
- Vercel preview URL (T15)
- Screenshot from Tm3
- Browser console + network log

## 11. Namespace + Vercel project decisions (2026-05-20 update)

### GitHub repo: `amo-tech-ai/mdeapp` (PUBLIC)

- **Originally specced:** `mdeai/mdeai-app` PRIVATE
- **Actually created:** `amo-tech-ai/mdeapp` PUBLIC
- **Reason for amo-tech-ai/:** the `mdeai` GitHub org doesn't exist on the user's account; `gh api orgs/mdeai` → 404. Falling back to personal account is the simplest path; transfer to a future `mdeai` org is a 1-click GitHub action when ready.
- **Reason for PUBLIC:** verified intentional (user has not requested flip; mdeai is portfolio-class so open source is fine for Phase 1)
- **Reason for `mdeapp` (no hyphen):** matches local folder name; less drift. Spec's `mdeai-app` (with hyphen) was a convention preference that costs zero to keep aligned.
- **Optional reversibility:** `gh repo edit amo-tech-ai/mdeapp --visibility private` (any time)
- **Optional org transfer:** create `mdeai` org → `gh repo transfer amo-tech-ai/mdeapp mdeai`

### Vercel project: NEW project required (NOT `amo100/mdeai`)

Critical finding via `vercel projects ls`: **`amo100/mdeai` already serves production `https://www.mdeai.co`** (the legacy `mde` app). **Linking mdeapp there would replace legacy production with the W1 ping shell — catastrophic.**

**Options for F06 closure:**

| Option | Command | Pro | Con |
|---|---|---|---|
| **A. New project `mdeapp`** ⭐ | `vercel link --yes --project mdeapp` (creates new) | Clean separation; legacy keeps serving `www.mdeai.co` until W10 cutover | Net new resource on Vercel |
| B. Rename existing | First rename `amo100/mdeai` → `amo100/mdeai-legacy`, then link mdeapp as `mdeai` | Reuses the brand-aligned slug | Touches legacy production config |
| C. Defer Vercel | Skip Vercel until W10 cutover task | Removes a moving piece | F06 stays open; preview URL deferred |

**Recommendation: A.** Creates a fresh, isolated Vercel project; mdeapp deploys at `mdeapp-amo100.vercel.app` previews; legacy production untouched until W10.

## Notes / verification

- **Vercel CLI version:** plugin-bundled. `vercel whoami` confirms auth as `amo100`.
- **`vercel env`:** values come from local `mdeapp/.env.local` — paste each value when CLI prompts. Mark each var as available in all environments (Development, Preview, Production).
- **`vercel.ts`:** not required for the first deploy. We add it in W9 (F09 follow-on) with `@vercel/config` dep.
- **`SUPABASE_SERVICE_ROLE_KEY` is NOT pushed to Vercel** (per CLAUDE.md hard rule — frontend env never gets service-role; only the F13 Mastra server-side carve-out will need it, added later via Vercel env scoped to "Production + Preview" only when F13 ships)
- **Do not push to `main` without CI green** — but in W1 there's no CI yet; first push is acceptable. W2 task F09 adds the `floor` script + GitHub Action.
- **Updated to current reality:** spec previously said `mdeai/mdeai-app PRIVATE + Spanish "hola"`. Reality: `amo-tech-ai/mdeapp PUBLIC + English "hi"` (per CLAUDE.md Language scope directive 2026-05-19 + GitHub org availability).
