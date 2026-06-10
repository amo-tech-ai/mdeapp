**Queue updated 2026-06-05** — soak signed off, D-08 assignable.

### Done ✅

| # | Action | Result |
|---|--------|--------|
| 1 | **[SAN-462](https://linear.app/sanjiovani/issue/SAN-462) → Done** | 4/4 scheduled prod synthetics; sign-off checklist complete |
| 2 | **Prod verify** (`cb3deb2`) | GET `/` → 200 · chat-smoke PASS |
| 3 | **Linear sync** | SAN-573 Done · SAN-566 → `tasks/design/tasks/INDEX.md` · SAN-574 unblocked |
| 4 | **Evidence on disk** | `tasks/testing/evidence/2026-06-05/d-07-shadcn-install-RESULTS.md` |

### Start now — SAN-574 (D-08)

**[SAN-574](https://linear.app/sanjiovani/issue/SAN-574) — VenueCard + BrowseLayout**

Spec: [`tasks/design/tasks/D-08-venue-card.md`](../tasks/D-08-venue-card.md)

Prep (read before branch):
- `mdeapp/src/components/cards/restaurant-card.tsx`
- `mdeapp/src/components/cards/cafe-result-card.tsx`
- `mdeapp/src/components/cards/rental-card.tsx`

Branch: `ai/san-574-d-08-shared-browse-system-venuecard-browselayout`

### Parallel (doesn't block D-08)

| Item | Notes |
|------|--------|
| **SAN-478** `/rentals` (Track A) | D-09 can't skin `/rentals` until functional |
| **Chore PR** | Remove unused `next-themes` from `package.json` |
| **tsconfig tsserver fix** | Separate PR — exclude `github/` from TS index |

### Design track status

```
D-01–07 ✅  →  D-08 (SAN-574)  →  parallel D-13 + D-10  →  D-09 … D-14
Epic SAN-566: 7/14
```

**Bottom line:** Start SAN-574 implementation when ready.
