---
id: ECOM-C-018
title: Core Commerce Exit Gate
phase: 1
priority: P0
complexity: S
status: Done
linear_issue: SAN-646
linear_url: https://linear.app/sanjiovani/issue/SAN-646
---

# ECOM-C-018

# Title

Core Commerce Exit Gate — Phase 1 Done Checklist

# Goal

Formal sign-off that Phase 1 commerce standalone proof is complete. No Phase 2 work starts until this gate passes.

# Business Value

Prevents premature AI bridge, embeddings, or Stripe Connect work. Gives Patricia/Sofía a single checklist for audit and Linear status flip.

# Scope

**In scope**

- Evidence bundle under `tasks/testing/evidence/YYYY-MM-DD/`
- `commerce-phase-1-RESULTS.md` checklist
- All C-001 through C-016 acceptance criteria ticked
- Explicit deferrals documented for Phase 2+
- Update task INDEX statuses to Done

**Out of scope**

- mdeapp integration smoke
- Production deploy
- Linear bulk update (optional)

# Files Likely Touched

| Path | Action |
|---|---|
| `tasks/testing/evidence/YYYY-MM-DD/commerce-phase-1-RESULTS.md` | Create |
| `docs/ecommerce/tasks/INDEX.md` | Status → Done |
| `docs/ecommerce/tasks/PHASE-1-OVERVIEW.md` | Gate passed note |

# Official Documentation

| Topic | URL |
|---|---|
| Mercur getting started | https://docs.mercurjs.com/getting-started/introduction |
| mdeai testing rule | `.cursor/rules/mdeai-testing.mdc` |
| Phase 1 overview | `docs/ecommerce/tasks/PHASE-1-OVERVIEW.md` |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-001 | — |
| ECOM-C-002 | — |
| ECOM-C-003 | — |
| ECOM-C-004 | — |
| ECOM-C-005 | — |
| ECOM-C-006 | — |
| ECOM-C-016 | ECOM-C-007+ (Phase 2) |

# Acceptance Criteria

- [ ] Mercur `/health` → 200 (evidence: curl output)
- [ ] Store API `count >= 20` (evidence: jq output)
- [ ] One paid order id recorded (evidence: C-016 file)
- [ ] Stripe webhook verified (evidence: stripe listen log snippet)
- [ ] No secrets in git (`git grep` clean)
- [ ] ADR merged (C-001)
- [ ] No Supabase product/price/inventory tables added
- [ ] No CopilotKit/Mastra commerce code in mdeapp
- [ ] No Stripe Connect in `medusa-config.ts`
- [ ] `commerce-phase-1-RESULTS.md` signed with date + task ids

# Proof Commands

```bash
# Gate script (run all) — use Infisical for secrets:
DATE=$(date +%Y-%m-%d)
EVID="tasks/testing/evidence/$DATE"
mkdir -p "$EVID"

curl -s -o /dev/null -w 'health=%{http_code}\n' http://localhost:9000/health | tee "$EVID/health.txt"

PK="${MEDUSA_PUBLISHABLE_KEY}"
curl -s -H "x-publishable-api-key: $PK" http://localhost:9000/store/products | jq '.count' | tee "$EVID/product-count.txt"

test -f "$EVID/commerce-paid-order.md" && echo 'paid order evidence OK'

git grep -E 'sk_live|sk_test' -- commerce/ docs/ || echo 'no leaked keys OK'

grep -r 'stripe-connect' commerce/mercur/packages/api/medusa-config.ts && echo 'FAIL connect present' || echo 'no connect OK'
```

# Test Plan

1. Reviewer opens `commerce-phase-1-RESULTS.md` — all rows PASS
2. Re-run proof commands on fresh terminal — same results
3. Confirm Phase 2 tasks (C-007) remain Not Started in INDEX
4. task-verifier anti-fake-done: localhost Mercur booted during verification

# Risks

| Risk | Mitigation |
|---|---|
| Partial completion marked Done | Hard dependency on C-016 evidence file |
| Evidence stale | Date-stamped folder; re-run on gate day |
| Phase 2 starts early | INDEX + roadmap gate section |

# Rollback Plan

Revert INDEX statuses to Partial; archive evidence folder. Phase 2 work stopped until gate re-passed.

# Estimated Complexity

**S** — assembly + verification, not new features

# Priority

**P0**

# Gate checklist template

```markdown
| Check | Task | Result | Evidence |
|-------|------|--------|----------|
| ADR merged | C-001 | | adr/001-standalone-mercur.md |
| Mercur health 200 | C-002 | | health.txt |
| Secrets safe | C-003 | | git grep |
| Stripe checkout works | C-004 | | stripe session log |
| Demo seller active | C-005 | | admin screenshot |
| 20 products in Store API | C-006 | | product-count.txt |
| Paid order | C-016 | | commerce-paid-order.md |
| No Connect / no AI / no Supabase products | — | | config grep |
```
