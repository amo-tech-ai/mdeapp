---
id: F32
title: Production smoke against https://mdeapp.vercel.app
status: Not Started
priority: P0
phase: core
persona: sanjiovani
project: sofia-platform
milestone: P0
imp: "084"
linear: SAN-100
percent: 0
blocked_by: []
blocks: []
effort: 30 min (probe + evidence)
owner: sanjiovani
depends_on: [F06]
skill: [testing, mde-vercel]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - F06 evidence — prod URL `https://mdeapp.vercel.app` exists per INDEX
  - 2026-05-20 gate-9 rule — localhost proof required for Done; PROD proof is a separate gate
---

# F32 — Production smoke against `https://mdeapp.vercel.app`

## 1. Purpose

Gate 9 (localhost runtime proof) was added 2026-05-20 — every task is verified booting `npm run dev` locally. **Production** is still unverified. F06 closed with "amo100/mdeapp · prod `https://mdeapp.vercel.app`" in the INDEX status line but no probe captured the prod URL responding. F32 closes that gap with a 30-min smoke run + a documented baseline so subsequent tasks can verify against prod instead of only localhost.

This addresses the "production claims exceed runtime proof" critique directly.

## 2. Goals

- `tasks/notes/F32-prod-smoke-2026-05-20.md` exists with:
  - `curl -sI https://mdeapp.vercel.app/` → expected HTTP 200 + content-type text/html
  - `curl -sX POST https://mdeapp.vercel.app/api/copilotkit -d '{}'` → expected HTTP 400 (endpoint alive, parsing requests)
  - `curl -sI https://mdeapp.vercel.app/login` → expected HTTP 200 (F08 auth surface up)
  - `vercel inspect <prod-url>` last-deploy timestamp + status `READY`
- Anti-fake-done gate 9.5 (new) added to `task-verifier/references/anti-fake-done-checklist.md` — "PROD proof" for any task affecting deployed surfaces
- Update `CLAUDE.md` Hard rules: add "PROD smoke required for tasks touching `src/app/**` AND deployed to Vercel" (one line)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Sofía** | A documented prod URL she can text the designer ("look at https://mdeapp.vercel.app/login") with confidence it serves |
| **Lucía** | Baseline probe she can re-run after any deploy to catch regressions |
| **Patricia** | Compliance artifact — prod surface verified responding on a captured timestamp |

## 4. Workflows

1. Probe with `curl -sI` (head-only, no body download — fast):
   ```bash
   curl -sI https://mdeapp.vercel.app/ | head -5
   curl -sI https://mdeapp.vercel.app/login | head -5
   curl -sI https://mdeapp.vercel.app/signup | head -5
   ```
2. Probe `/api/copilotkit` with a bad payload (expect structured 400, not 5xx):
   ```bash
   curl -sX POST -H 'Content-Type: application/json' --data '{}' \
     https://mdeapp.vercel.app/api/copilotkit
   ```
3. Check Vercel deployment status:
   ```bash
   vercel inspect https://mdeapp.vercel.app --token "$VERCEL_TOKEN" 2>&1 | head -20
   # OR via CLI: vercel ls amo100/mdeapp --token "$VERCEL_TOKEN" | head -3
   ```
4. Optional — Lighthouse run (chrome-devtools MCP):
   ```bash
   # Once chrome-devtools MCP reconnects; record perf score + LCP
   ```
5. Write `tasks/notes/F32-prod-smoke-2026-05-20.md` with: probe commands + verbatim responses + status verdict.
6. Append the new gate 9.5 to anti-fake-done checklist.
7. Append the new Hard rule sentence to CLAUDE.md.

## 5. User journeys

- **Sofía after merging F24** → runs F32-style prod probe → confirms `https://mdeapp.vercel.app/rentals/preview` returns 200 → flips F24 to Done.
- **Lucía catching a regression** → re-runs the F32 probe set → 502 on `/api/copilotkit` → opens incident.
- **Patricia on compliance review** → opens `tasks/notes/F32-prod-smoke-*.md` → sees timestamped proof of prod up.

## 6. Agents

None — pure HTTP probes + doc update.

## 7. Integrations

| Integration | Purpose |
|---|---|
| `curl` | All probes |
| Vercel CLI (`vercel inspect`) | Last-deploy timestamp + status |
| `task-verifier` skill | Owns the new gate 9.5 |
| `CLAUDE.md` Hard rules | Adds the prod-smoke requirement |

## 8. Summary

Run 5 curl probes against prod, capture verbatim responses, document. Add gate 9.5 to anti-fake-done. Add one line to CLAUDE.md. ~30 min. Closes the "claims exceed runtime proof" gap raised in `plan/audit/07-mvp-assessment-verification.md`.

## 9. Definition of Done

- [ ] `tasks/notes/F32-prod-smoke-2026-05-20.md` exists with ≥ 4 verbatim probe responses
- [ ] All 4 prod URLs returned HTTP 200 / 400 (alive) — no 5xx
- [ ] `vercel inspect` shows last deploy `READY`
- [ ] Anti-fake-done checklist updated with gate 9.5
- [ ] `CLAUDE.md` Hard rules has the new prod-smoke sentence
- [ ] Evidence file timestamped
- [ ] No code change in `mdeapp/src/**` (this is observation, not implementation)

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | GET / | HTTP 200 + content-type text/html |
| T2 | GET /login | HTTP 200 |
| T3 | GET /signup | HTTP 200 |
| T4 | POST /api/copilotkit (bad payload) | HTTP 400 structured error (not 5xx) |
| T5 | vercel deployment status | `READY` (case-sensitive) |
| T6 | Evidence file exists | `test -f tasks/notes/F32-prod-smoke-*.md` |

### Negative test

| Tn1 | Run F32 immediately after a deploy that breaks the build | T1 should return 502/504 — caught by the probe |

## 11. Rollback

Nothing to rollback. F32 is observation + documentation only.

## Notes

- **No CopilotKit interference:** F32 only probes; doesn't touch code.
- **VERCEL_TOKEN:** stored in repo-root `.env.local`. Don't paste it into evidence.
- **Why a separate gate 9.5 (not 9):** localhost (gate 9) covers most dev iteration. PROD (9.5) only applies when the task ships to Vercel. Doc + spec tasks skip 9.5; F22-F31 hit both.
- **Future automation:** F32 is a manual probe today. Once F21B (auto-review hooks) lands, can wrap this in a `/prod-smoke` slash command.
