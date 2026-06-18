# SAN-1109 · RE-WIRE-001 — Route Tree + Broker Gate — Results

**Date:** 2026-06-16  
**Branch:** `ai/san-1109-re-wire-001-route-gate`  
**Class:** C (routing + server gate, no persona UI proof required for Done)

## Verdict

Broker rentals routes are gated by `landlord_profiles.user_id` (not `apartments.landlord_id`). Onboarding is exempt from the profile redirect to prevent loops.

## Route matrix

| Actor | Path | Expected | Implementation |
|-------|------|----------|----------------|
| Anonymous | `/host/rentals` | → `/login?next=…` | `host/rentals/layout.tsx` via `getBrokerContext()` |
| Anonymous | `/host/rentals/listings` | → login | same parent layout |
| Anonymous | `/host/rentals/onboarding` | → login | parent layout |
| Auth, no `landlord_profiles` | `/host/rentals/onboarding` | **allow** (no loop) | outside `(broker)` group |
| Auth, no profile | `/host/rentals/listings` | → `/host/rentals/onboarding` | `(broker)/layout.tsx` |
| Auth, no profile | `/host/rentals/dashboard` | → onboarding | `(broker)/layout.tsx` |
| Auth, no profile | `/host/rentals` | → onboarding | `(broker)/layout.tsx` |
| Auth, has profile | `/host/rentals/listings` | allow | `(broker)/layout.tsx` passes |
| Auth, has profile | `/host/rentals/dashboard` | allow | `(broker)/layout.tsx` passes |
| Auth, has profile | `/host/rentals/onboarding` | → `/host/rentals/listings` | `onboarding/page.tsx` |

## Redirect proof (unit)

`resolveBrokerRouteGate` tests in `src/lib/rentals/__tests__/broker-route-gate.test.ts`:

- anon → `redirect_login`
- auth without profile on onboarding → `allow`
- auth without profile on listings/home → `redirect_onboarding`
- auth with profile on listings/dashboard → `allow`
- auth with profile on onboarding → `redirect_broker_home`

## Nav proof (unit)

`HostNavRail` Rentals section links:

- Rentals home → `/host/rentals`
- Listings → `/host/rentals/listings`
- Dashboard → `/host/rentals/dashboard`
- Onboarding → `/host/rentals/onboarding`

Active-state tests in `src/components/host/__tests__/host-nav-rail.test.ts`.

## Shared loader

`getBrokerContext()` (`src/lib/rentals/get-broker-context.ts`):

```ts
{ user, landlordProfile, hasBrokerProfile } // + state union
```

Wrapped in `React.cache()` for single request dedupe across parent + broker layouts.

## Tests run

| Command | Result |
|---------|--------|
| `npm test -- --run src/lib/rentals` | **30/30 pass** |
| `npm test -- --run src/components/host/__tests__/host-nav-rail.test.ts` | **7/7 pass** |
| `npm run lint` | **pre-existing fail** — `scripts/linear-rentals-design-v2.mjs` unused vars (not introduced by this PR) |
| `npm run typecheck` | not re-run — pre-existing e2e helper import errors documented on stack |

## Screenshots

Not captured — requires broker test account on localhost. Class U proof deferred to SAN-1111.

## Files changed (summary)

- `src/lib/rentals/broker-route-gate.ts` — pure gate decisions
- `src/lib/rentals/get-broker-context.ts` — shared server loader
- `src/app/host/rentals/layout.tsx` — auth shell + `HostRentalsShell`
- `src/app/host/rentals/(broker)/layout.tsx` — profile gate
- `src/app/host/rentals/(broker)/{page,listings,dashboard}/` — moved gated routes
- `src/app/host/rentals/onboarding/page.tsx` — loop-safe onboarding
- `src/components/host/host-nav-rail.tsx` — Rentals nav section
- `src/components/host/rentals/host-rentals-shell.tsx` — shell with rail

## Out of scope (not built)

- SAN-1092 onboarding wizard
- SAN-1093 broker concierge
- SAN-1095 dashboard KPIs
- SAN-1111 E2E suite
- Consumer `/rentals`

## Next task

**SAN-1092 · RE-DES-005 — Broker Onboarding Wizard**
