---
title: PR pack — spec verification standard
updated: 2026-06-01
main_sha: a9eb176
audit: docs/01-06-26-audit.md
---

# PR pack verification standard

Every task under `tasks/PR/` is **100% spec-accurate** when:

1. **Paths** — active DATA in `tasks/PR/tasks-data/`; done DATA in `tasks/data/archive/`; UX in `tasks/PR/ux/`.
2. **No duplicate work** — see `INDEX.md` duplicate map (DATA-048 = PR-04 only).
3. **Re-verify at execution** — `git fetch origin main` + line numbers (merge train moves).
4. **Human gates** — merge, `db push`, close PR, branch protection (never auto).
5. **Testing & proof** — every `tasks/PR/tasks/PR-*.md` spec includes a **`## Testing & proof`** section (persona journey, pre-ship commands, implementation evidence). Do not mark **Done** until that section’s pass criteria are met and evidence is linked (see `tasks/testing/evidence/`).

## Spec vs execution

| Term | Meaning |
|------|---------|
| **Spec 100%** | Facts, deps, gates match disk + GitHub on audit date |
| **Execution Done** | Code merged + floor + evidence in task **`## Testing & proof`** |

Wave 1 + DATA chain (PR-01–09, PR-13/14/17): **execution Done** on `main` @ `a9eb176` — see each task’s **Testing & proof** table. Remaining open work: PR-10–12, PR-15–16, PR-18 (+ UX-020 #45 during soak).

## Required frontmatter (PR-01…18)

```yaml
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
```

## Re-verify commands

```bash
cd mdeapp
git fetch origin main
git show origin/main:src/mastra/tools/search-events.ts | sed -n '218,260p'
git show origin/main:src/components/chat/chat-center-panel.tsx | rg sessionKey|EventResults
git ls-tree origin/main supabase
gh pr view 19 23 32 38 45 --repo amo-tech-ai/mdeapp
cd mdeapp && npm test -- --run src/mastra/tools
```

## Prod smoke bundle (Stable Beta)

```bash
cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:prod-synthetic
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:new-chat
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:visual-cards
```

Soak gate: only **scheduled** nightly runs count — [prod-synthetic-smoke workflow](https://github.com/amo-tech-ai/mdeapp/actions/workflows/prod-synthetic-smoke.yml). Manual `workflow_dispatch` does not count toward 3 consecutive PASS.
