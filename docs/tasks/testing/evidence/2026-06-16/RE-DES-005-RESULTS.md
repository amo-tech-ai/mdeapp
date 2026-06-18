# SAN-1092 · RE-DES-005 — Broker onboarding wizard — RESULTS

**Date:** 2026-06-16  
**Task:** [SAN-1092 · RE-DES-005 — Broker onboarding wizard UI](https://linear.app/sanjiovani/issue/SAN-1092/d-10-re-des-005-broker-onboarding-wizard-ui)  
**Class:** U  
**Surface:** Roberto `/host/rentals/onboarding` → `/host/rentals/listings`

## Verdict

🟢 **Done-ready** — Playwright Class U proof passed; `landlord_profiles` + draft `apartments` row verified via service role.

## Browser proof (2026-06-16)

| Step | Check | Result |
|------|-------|--------|
| 1 | Fresh user (no `landlord_profiles`) → `/host/rentals/onboarding` | ✅ |
| 2 | Profile step (display name + neighborhood) | ✅ `SAN-1092-onboarding-step1.png` |
| 3 | Listing step (address, beds, rent) | ✅ `SAN-1092-onboarding-step2.png` |
| 4 | Review + `ro-ack` checkbox | ✅ `SAN-1092-onboarding-step3.png` |
| 5 | Submit → redirect `/host/rentals/listings` | ✅ `SAN-1092-onboarding-listings.png` |
| 6 | DB: `landlord_profiles` for user | ✅ |
| 7 | DB: draft `apartments` with `price_monthly` | ✅ |

**Command:**

```bash
PW_SKIP_WEBSERVER=1 infisical run --silent --env=dev --path=/ -- \
  npx playwright test e2e/san-1092-broker-onboarding.spec.ts --project=chromium
```

**Spec:** `e2e/san-1092-broker-onboarding.spec.ts`

## Unit tests

```bash
npm test -- --run src/lib/rentals/__tests__/broker-onboarding-validate.test.ts \
  src/lib/rentals/__tests__/broker-route-gate.test.ts
# 13+ passed (full rentals: 38)
```

## Screenshots

| File | Step |
|------|------|
| `SAN-1092-onboarding-step1.png` | Profile |
| `SAN-1092-onboarding-step2.png` | Listing |
| `SAN-1092-onboarding-step3.png` | Review + ack |
| `SAN-1092-onboarding-listings.png` | Post-submit listings |

## PR

[#243](https://github.com/amo-tech-ai/mdeapp/pull/243) — stacks on [#242](https://github.com/amo-tech-ai/mdeapp/pull/242) (SAN-1109).
