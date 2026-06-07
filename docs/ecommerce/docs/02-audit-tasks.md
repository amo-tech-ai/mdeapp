# Commerce Task Audit - Core/MVP Medusa Backlog

Date: 2026-06-06  
Auditor: Codex forensic audit  
Scope: `/home/sk/mdeai/tasks/ecommerce`, `/home/sk/mdeai/mdeapp`, `.claude/skills/medusa`, `.claude/skills/task-verifier`  
Linear project: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues

## Executive Verdict

**Verdict: 🔴 Not production ready. 🟡 Good task direction, but not 100% correct yet.**

The commerce task pack is architecturally sane: Medusa owns commerce, Supabase owns embeddings/links/analytics, Mastra owns tools, CopilotKit owns the shopping UI, and marketplace complexity is deferred until Core checkout works.

It is **not safe to call the plan production-ready** because the task specs fail the strict `task-verifier` template, some proof commands point to the wrong migration path, the Medusa implementation does not exist yet, and the current `mdeapp` floor is not green.

## Score Summary

| Area | Dot | Percent Correct | Verdict |
|---|---:|---:|---|
| Architecture direction | 🟢 | 90% | Correct bounded-context plan. |
| Task ordering | 🟢 | 88% | Core before marketplace is right. |
| Task spec completeness | 🔴 | 62% | Missing strict 1-10 lifecycle sections and frontmatter fields. |
| Proof commands | 🟡 | 78% | Mostly useful, but several paths/commands need correction. |
| Current app readiness | 🔴 | 55% | Tests pass, build passes, but lint/typecheck floor is not green. |
| Medusa implementation readiness | 🔴 | 40% | Medusa service, SDK, commerce tools, and components are missing. |
| Production readiness | 🔴 | 45% | Too early; Core proof does not exist. |
| Overall task pack | 🟡 | 76% | Good plan, must patch before execution. |

## Dot Legend

| Dot | Meaning |
|---|---|
| 🟢 | 90-100%, strong / safe after normal execution proof |
| 🟡 | 75-89%, usable but needs corrections |
| 🔴 | below 75% or blocking issue |
| ⚪ | deferred / not applicable yet |

## Commands Run

| Probe | Result | Audit Meaning |
|---|---|---|
| `node task parser over tasks/ecommerce/tasks` | 31 tasks, 0 dependency/section-base problems | Basic task graph is internally consistent. |
| `node package script/dependency probe` | scripts exist; `@medusajs/js-sdk` and `@medusajs/types` missing | ECOM-C-007 cannot execute without dependency installation. |
| `task-verifier/scripts/probe-disk.sh` | 51 green, 6 yellow, 2 red | Probe script flags route mismatch and service-role env presence. |
| `npm test` | 135 files passed, 604 tests passed | Unit test suite is green. |
| `npm run build` | exit 0 | Next production build works. |
| `npm run audit` | exit 0, but 18 low/moderate vulnerabilities reported | High-severity policy passes; vulnerabilities still need tracking. |
| `npm run typecheck` | exit 134, Node heap OOM | Normal proof command is not usable; blocker. |
| `NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck` | stopped after >2 minutes, no result | Needs scoped/excluded typecheck fix. |
| `npm run lint` | exit 1, 107,838 findings | ESLint scans nested `workspace/.../.next` generated artifacts. |
| `test -d commerce/medusa` | missing | Medusa service not implemented. |
| `test -d mdeapp/src/lib/commerce` | missing | Client wrapper not implemented. |
| `test -d mdeapp/src/components/commerce` | missing | ProductCard/cart UI not implemented. |
| `test -d mdeapp/src/mastra/tools/commerce` | missing | Commerce tools not implemented. |
| `find mdeapp/src/app/api/copilotkit` | actual route is `api/copilotkit/[[...path]]/route.ts` | Verifier script has stale direct-route expectation; app route exists. |
| `find ... migrations` | actual path is `mdeapp/supabase/migrations` | Several ECOM tasks use wrong `supabase/migrations` proof path. |

## Critical Blockers

| Dot | Blocker | Impact | Required Fix |
|---|---|---|---|
| 🔴 | `npm run typecheck` OOMs at normal heap | Cannot use required floor proof. | Exclude `workspace/**`, `.worktrees/**`, nested `.next/**`; consider scoped tsconfig or increased CI heap. |
| 🔴 | `npm run lint` scans generated nested worktree artifacts | Floor cannot pass; false noise blocks releases. | Add ignores for `workspace/**`, `.worktrees/**`, `**/.next/**`, and any generated worktree dirs in ESLint config. |
| 🔴 | Medusa service is missing | Core cannot start. | Execute ECOM-C-002 before any commerce tool/UI work. |
| 🔴 | Medusa JS SDK/types are missing in `mdeapp` | ECOM-C-007 cannot compile. | Add install step to ECOM-C-007 or create separate dependency task. |
| 🔴 | Task specs miss strict `task-verifier` template | Not 100% verifier-compliant. | Rewrite or augment each task with sections `1. Purpose` through `10. Tests`; add `effort`, `owner`, `verified_against`. |
| 🔴 | Supabase migration proof path is wrong in 5 tasks | Verifiers will check the wrong directory. | Replace `supabase/migrations` with `mdeapp/supabase/migrations`. |
| 🟡 | `COMMERCE_*` env plan ignores Infisical convention | Drift from `CLAUDE.md`; local env is not source of truth. | Add Infisical injection notes and commerce secret names to ECOM-C-003. |
| 🟡 | Checkout task says `checkout_link` but Medusa v2 payment flow must be verified | Risk of wrong API method or incomplete checkout lifecycle. | Add method-verification subtask before coding ECOM-C-013. |
| 🟡 | `task-verifier` probe expects old Copilot route path | False red in audits. | Patch verifier or audit note to accept `api/copilotkit/[[...path]]/route.ts`. |

## Is Anything Missing?

| Missing Item | Why It Matters | Add To |
|---|---|---|
| Medusa version pin decision | Avoid installing against moving docs/API. | ECOM-C-002 |
| Medusa Postgres/local Docker strategy | Service cannot boot reliably without DB setup. | ECOM-C-002 |
| Store CORS for `mdeapp:3001` | Medusa default storefront assumptions may not match mdeai. | ECOM-C-002 |
| Region/sales channel/publishable API key setup | Medusa pricing and product visibility need region/channel context. | ECOM-C-006 or new C-006a |
| Minimal fulfillment/shipping setup | Medusa order completion may require shipping/fulfillment config. | ECOM-C-004/C-006 |
| Exact Medusa checkout/payment collection method verification | Prevents guessed SDK/API calls. | ECOM-C-013 |
| `@medusajs/js-sdk` and `@medusajs/types` dependency install | Required by client wrapper/admin/storefront best practices. | ECOM-C-007 |
| Commerce feature flag before UI work | Needed for rollback and to avoid breaking existing mdeai MVP. | ECOM-C-014 or earlier |
| Infisical secret workflow | Repo guidance says env injects via Infisical. | ECOM-C-003 |
| Webhook idempotency proof | Payment webhooks must tolerate retries. | ECOM-C-004/C-016 |
| Order confirmation/return URL plan | E2E proof needs a deterministic post-checkout route. | ECOM-C-013/C-016 |
| Evidence file path standard | Done gates require evidence files. | ECOM-C-016/C-018 |
| Linear issue creation/import step | User linked Commerce Platform project, but tasks are local only. | New ECOM-OPS-001 |

## Overall Success Forecast

| Question | Answer |
|---|---|
| Will the task pack succeed? | 🟡 Yes, if the blockers above are fixed before implementation. |
| Can Core succeed in 30 days? | 🟡 Possible, but only after Medusa setup, SDK install, floor repair, and exact checkout flow verification. |
| Is it production ready today? | 🔴 No. Core implementation does not exist and floor is not green. |
| Best first milestone? | One paid Stripe test order through an AI ProductCard creating a Medusa order. |
| Current chance of success as-is | 62% |
| Chance after corrections | 82% |

## Per-Task Audit Scores and Corrections

Scores are spec quality before implementation, not completion status. Execution readiness is lower for all tasks because Core implementation is absent and floor is not green.

| Task | Dot | Percent Correct | Will It Succeed? | Biggest Correction |
|---|---:|---:|---|---|
| ECOM-C-001 | 🟡 | 84% | Yes after template patch | Add full lifecycle sections, `effort`, `owner`, `verified_against`; include Infisical and floor repair decision. |
| ECOM-C-002 | 🟡 | 78% | Likely | Add exact Medusa version, DB/Postgres strategy, CORS for `3001`, local port proof, deployment target. |
| ECOM-C-003 | 🟡 | 80% | Likely | Align env contract with Infisical; do not assume `.env.local` is source of truth; add secret name collision checks. |
| ECOM-C-004 | 🟡 | 76% | Risky | Specify exact Medusa v2 Stripe/payment collection flow and webhook idempotency proof. |
| ECOM-C-005 | 🟡 | 79% | Likely | Choose/verify exact Cloudinary provider for the pinned Medusa version before implementation. |
| ECOM-C-006 | 🟡 | 82% | Likely | Add region, sales channel, publishable key, inventory, fulfillment/shipping prerequisites. |
| ECOM-C-007 | 🔴 | 72% | Blocked until deps installed | Add `@medusajs/js-sdk` and `@medusajs/types` install/check; verify SDK methods before coding. |
| ECOM-C-008 | 🔴 | 68% | Blocked until path fixed | Change proof path to `mdeapp/supabase/migrations`; add RLS SQL proof and vector dimension/model registry. |
| ECOM-C-009 | 🟡 | 76% | Likely | Decide subscriber vs script vs worker; keep service role out of client imports; add retry/idempotency details. |
| ECOM-C-010 | 🟡 | 82% | Likely | Add deterministic fallback path and exact Supabase RPC/vector query proof. |
| ECOM-C-011 | 🟢 | 88% | Likely | Add exact Store API/SDK method verification requirement. |
| ECOM-C-012 | 🟡 | 80% | Likely | Add region/cart persistence details and stock conflict negative tests. |
| ECOM-C-013 | 🔴 | 70% | Risky | Rename or clarify `checkout_link`; verify real Medusa checkout/payment methods; define return URL/order completion. |
| ECOM-C-014 | 🟡 | 82% | Likely | Add `DESIGN.MD` requirement, product-card alt text, no emoji UI, and variant-selection strategy per product type. |
| ECOM-C-015 | 🟡 | 84% | Likely | Add cart persistence, variant display, and mobile safe-area proof. |
| ECOM-C-016 | 🟡 | 80% | Likely after C-013 fix | Add exact Stripe test card flow, return route, Medusa order lookup command, and evidence path. |
| ECOM-C-017 | 🟢 | 88% | Likely | Add explicit test-mode refund evidence command. |
| ECOM-C-018 | 🟡 | 78% | Depends on floor repair | Add lint/typecheck workspace exclusions as readiness prerequisites. |
| ECOM-M-001 | 🟡 | 80% | Likely post-Core | Add exact official recipe commit/reference, camelCase module name, and migration file expectations. |
| ECOM-M-002 | 🟡 | 79% | Likely | Add RLS policy names, admin review surface, and no auto-Connect guarantee. |
| ECOM-M-003 | 🟡 | 76% | Risky | Add auth middleware, typed request schema, workflow compensation, and invite expiry. |
| ECOM-M-004 | 🟡 | 76% | Risky | Add Medusa Admin SDK client setup, React Query loading pattern, and vendor isolation proof. |
| ECOM-M-005 | 🔴 | 72% | Risky | Add country/capability assumptions, Connect account lifecycle, and legal/accounting approval gate. |
| ECOM-M-006 | 🔴 | 70% | High risk | Add split-order data model, compensation behavior, retry/idempotency, and "one vendor per cart" rollback. |
| ECOM-M-007 | 🟡 | 78% | Likely post-M-006 | Add Stripe status mapping table and no-custom-ledger rule. |
| ECOM-M-008 | 🟡 | 80% | Likely post-Core | Add Chatwoot API verification, consent rule, and human-triggered-only guard. |
| ECOM-M-009 | 🔴 | 72% | Blocked until path fixed | Change `supabase/migrations` to `mdeapp/supabase/migrations`; add event id FK/RLS proof. |
| ECOM-M-010 | 🔴 | 72% | Blocked until path fixed | Change migration path; add trip item relationship and no price/stock copy proof. |
| ECOM-M-011 | 🔴 | 72% | Blocked until path fixed | Change migration path; add venue/anchor relationship and Maps not-source-of-truth note. |
| ECOM-M-012 | 🟡 | 74% | Needs privacy pass | Add analytics schema, RLS, retention, and PII minimization. |
| ECOM-M-013 | 🟡 | 78% | Likely later | Add explicit sponsored/featured labeling requirement and manual billing workflow. |

## Corrections Required Before Execution

### 1. Patch All Task Specs to the Strict Lifecycle Template

Every task currently uses a compact structure (`Objective`, `Scope`, `Acceptance Criteria`, etc.). The `task-verifier` quality gate requires:

1. Purpose
2. Goals
3. Features
4. Workflows
5. User journeys
6. Agents
7. Integrations
8. Summary
9. Definition of Done
10. Tests

Also add frontmatter:

```yaml
effort:
owner:
verified_against:
```

### 2. Fix Migration Paths

Replace these commands:

```bash
supabase/migrations
```

with:

```bash
mdeapp/supabase/migrations
```

Affected tasks:

- ECOM-C-008
- ECOM-M-009
- ECOM-M-010
- ECOM-M-011
- ECOM-M-012

### 3. Repair mdeapp Floor Before Commerce Work

`npm test` and `npm run build` pass, but floor is not green because lint/typecheck are blocked.

Recommended patch:

```js
// mdeapp/eslint.config.mjs
ignores: [
  ".next/**",
  "**/.next/**",
  "node_modules/**",
  "coverage/**",
  ".mastra/**",
  "dist/**",
  "github/**",
  "CopilotKit/**",
  "workspace/**",
  ".worktrees/**",
]
```

And update `tsconfig.json`:

```json
"exclude": [
  "node_modules",
  "supabase/functions",
  "workspace",
  ".worktrees",
  "**/.next/**"
]
```

### 4. Add a Dependency Install Task or Expand ECOM-C-007

Current probe:

```text
@medusajs/js-sdk: MISSING
@medusajs/types: MISSING
```

Add to ECOM-C-007:

```bash
cd mdeapp && npm install @medusajs/js-sdk @medusajs/types
```

Then verify exact SDK methods before code.

### 5. Clarify Medusa Checkout Flow

ECOM-C-013 should not assume a generic "checkout link" exists. It should verify:

- how the pinned Medusa version creates/updates carts
- how payment sessions/payment collections are initialized
- how Stripe checkout/Elements/hosted session is created
- how order completion is triggered
- how the app returns from Stripe to mdeai

### 6. Add Linear Sync Task

The local tasks are not yet represented in the Commerce Platform Linear project.

Add `ECOM-OPS-001 - Create/import Commerce Platform Linear issues`:

- Source: `tasks/ecommerce/tasks/INDEX.md`
- Target: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
- Preserve Core/MVP order.
- Add phase labels.
- Add easy descriptions for non-engineers.
- Do not create Advanced/deferred issues until Core is green.

## Production Readiness Gates

| Gate | Dot | Current State |
|---|---:|---|
| Gate 1: Medusa health + APIs | 🔴 | Medusa service missing. |
| Gate 2: Stripe test order creates Medusa order | 🔴 | Not implemented. |
| Gate 3: Product cards show live Medusa price/stock | 🔴 | Commerce components missing. |
| Gate 4: AI search hydrates from Medusa before display | 🔴 | Commerce tools missing. |
| Gate 5: Checkout from CopilotKit works | 🔴 | Not implemented. |
| Gate 6: Supabase only stores embeddings/links | 🟡 | Plan says correct; migration not implemented. |
| Gate 7: Manual support/refund playbook exists | 🔴 | Not implemented. |
| Gate 8: Core can deploy without breaking mdeai MVP | 🔴 | `npm run lint` and normal `npm run typecheck` fail. |

## Best-Practice Findings

| Dot | Finding | Best Practice |
|---|---|---|
| 🟢 | Core before marketplace is correct. | Keep Stripe Connect, vendor dashboard, WhatsApp, and split orders post-Core. |
| 🟢 | Data ownership plan is correct. | Medusa owns mutable commerce. Supabase owns embeddings/links/analytics. |
| 🟡 | Medusa SDK methods are not yet verified. | Verify exact methods against official docs/MCP before coding. |
| 🟡 | Admin dashboard tasks are too thin. | Use Medusa Admin SDK, Medusa UI, React Query display-on-mount, separate modal/display queries. |
| 🟡 | Product card tasks need design proof. | Read `DESIGN.MD`; follow ProductCard accessibility/mobile requirements. |
| 🔴 | Floor command is not green. | Fix ignores/excludes before claiming any commerce task Done. |
| 🔴 | Typecheck is not usable as-is. | Exclude generated/workspace artifacts or split tsconfig. |

## Real-World Persona Impact

| Persona | Surface | Impact If Fixed |
|---|---|---|
| Camila | `/chat` | Can ask for a product and receive trustworthy live cards instead of stale recommendations. |
| Andrés / Miguel | Stripe checkout | Payment proof becomes isolated from ticket/sponsor flows and safe to audit. |
| Patricia | Future admin/vendor ops | Vendor dashboard tasks will be safer if admin SDK/loading rules are added now. |
| Sofía | Local/CI | Floor becomes trustworthy again after lint/typecheck path fixes. |
| Lucía | Playwright QA | E2E checkout proof becomes a repeatable launch gate. |

## Verification Report - 2026-06-06 - Codex

| Task Group | Spec Score /100 | Execution Readiness /100 | Blockers | Safe To Execute? | Required Fixes |
|---|---:|---:|---:|---|---|
| Core tasks ECOM-C-001..018 | 79 | 55 | 5 | No | Template patch, migration path fix, SDK install, floor repair, checkout flow verification. |
| MVP tasks ECOM-M-001..013 | 76 | 45 | 6 | No | Wait for Core proof, patch template, fix migration paths, add Connect/legal gates. |
| Overall commerce task pack | 76 | 52 | 7 | No | Fix blockers listed above. |

### Claims Verified

- `tasks/ecommerce/tasks` has 31 task files plus index - node parser result: `taskCount: 31`.
- Internal task dependencies resolve - node parser result: `problemCount: 0`.
- `npm test` passes - 135 files, 604 tests.
- `npm run build` passes - Next build completed and generated 26 pages.
- `npm run audit` exits 0 under high-severity policy - still reports 18 low/moderate vulnerabilities.
- Medusa service is missing - `test -d commerce/medusa` returned `MEDUSA_SERVICE_MISSING`.
- Commerce lib/components/tools are missing - all `test -d` probes returned missing.
- Actual CopilotKit route exists at `mdeapp/src/app/api/copilotkit/[[...path]]/route.ts`.
- Migration directory exists at `mdeapp/supabase/migrations`, not root `supabase/migrations`.

### Claims Not Verified

- Exact Medusa v2 checkout implementation - no Medusa service or SDK installed yet.
- Stripe commerce webhook proof - no commerce webhook exists yet.
- Supabase commerce RLS - migration not implemented.
- Product embedding sync - no implementation exists yet.
- ProductCard/cart UI - no implementation exists yet.

### Stale Assumptions

- `task-verifier` disk probe expects `src/app/api/copilotkit/route.ts`, but the app uses `src/app/api/copilotkit/[[...path]]/route.ts`.
- Some task proof commands assume `supabase/migrations`, but this repo uses `mdeapp/supabase/migrations`.
- `CLAUDE.md` says env files are intentionally empty and Infisical injects secrets, but the disk probe saw env names present in `mdeapp/.env.local`; env guidance should be reconciled before commerce secrets are added.

### Missing Dependencies

- `@medusajs/js-sdk`
- `@medusajs/types`
- Medusa backend service package/app
- Commerce feature flag
- Commerce evidence directory/path convention
- Linear sync/import task for Commerce Platform project

### Commands To Run Before Execution

1. `cd mdeapp && npm run lint` - must pass after ignore patch.
2. `cd mdeapp && npm run typecheck` - must pass without OOM.
3. `cd mdeapp && npm test` - currently green, keep it green.
4. `cd mdeapp && npm run build` - currently green, keep it green.
5. `node task parser over tasks/ecommerce/tasks` - rerun after template patch.
6. `rg -n "supabase/migrations" tasks/ecommerce/tasks` - must return no stale paths.

### Commands To Run After Execution

1. `curl -fsS http://localhost:9000/health` - Medusa health.
2. `curl -fsS http://localhost:9000/store/products` - Store API catalog.
3. `cd mdeapp && node --env-file=.env.local scripts/smoke-commerce-client.mjs` - client wrapper.
4. `cd mdeapp && node --env-file=.env.local scripts/smoke-commerce-paid-proof.mjs` - paid order proof.
5. `cd mdeapp && npm run test:e2e -- e2e/commerce-checkout.spec.ts --project=chromium --workers=1` - browser proof.

### Stop Condition

Not ready. These blockers must be fixed first:

1. Patch task files to the strict lifecycle template.
2. Fix `mdeapp` lint/typecheck floor.
3. Correct migration proof paths.
4. Add/install Medusa SDK/types before client wrapper work.
5. Verify exact Medusa checkout/payment flow before ECOM-C-013.
6. Implement Medusa service before any commerce UI/tool task.
