# SAN-1092 · RE-DES-005 — Broker onboarding wizard — RESULTS

**Date:** 2026-06-16  
**Task:** [SAN-1092 · RE-DES-005 — Broker onboarding wizard UI](https://linear.app/sanjiovani/issue/SAN-1092/d-10-re-des-005-broker-onboarding-wizard-ui)  
**Class:** U  
**Surface:** Roberto `/host/rentals/onboarding`

## Verdict

🟢 Implementation landed — 3-step wizard, `create_broker_onboarding_draft()` RPC, minimal chrome, route-gate redirects.

## Linear amendments (pre-impl)

| Check | Result |
|-------|--------|
| Blockers → SAN-1107 + SAN-1109 (not SAN-1104 alone) | ✅ Updated issue body + blockedBy |
| RPC `create_broker_onboarding_draft()` | ✅ Server action |
| Photo optional (URL only) | ✅ No storage gate |
| Profile exists → `/host/rentals/listings` | ✅ `onboarding/page.tsx` |
| Minimal chrome (no HostNavRail) | ✅ `onboarding/layout.tsx` |

## Disk

| Path | Purpose |
|------|---------|
| `src/app/host/rentals/onboarding/page.tsx` | Gate + wizard mount |
| `src/app/host/rentals/onboarding/layout.tsx` | Minimal chrome |
| `src/components/host/rentals/rentals-onboarding-wizard.tsx` | 3-step UI + testids |
| `src/lib/rentals/submit-broker-onboarding.ts` | RPC + RLS PATCH |
| `src/lib/rentals/broker-onboarding-validate.ts` | Validation |
| `src/app/host/rentals/layout.tsx` | Auth only |
| `src/app/host/rentals/(broker)/layout.tsx` | Shell + profile gate |

## Tests

```bash
npm test -- --run src/lib/rentals/__tests__/broker-onboarding-validate.test.ts src/lib/rentals/__tests__/broker-route-gate.test.ts
# 13 passed
```

## Route-gate matrix (code)

| Case | Expected | Implementation |
|------|----------|----------------|
| anon → `/host/rentals/listings` | login | `(broker)/layout` + root layout |
| auth, no profile → onboarding | allow wizard | `onboarding/page.tsx` |
| auth, no profile → listings | redirect onboarding | `(broker)/layout` |
| auth, has profile → onboarding | redirect listings | `onboarding/page.tsx` |

## Browser (manual / follow-up)

- [ ] Complete wizard as new broker → lands on listings with draft row
- [ ] Screenshot: `tasks/testing/evidence/2026-06-16/SAN-1092-onboarding.png`
