---
updated: 2026-06-09
linear_chain: SAN-492 → SAN-493 → SAN-510 → SAN-511 → SAN-494 → SAN-495 → SAN-496
seed_spec: ./EVT-034-seed.md
---

# Venue booking test matrix

## Schema (SAN-492 / EVT-033)

| Check | Type | Command / assert |
|-------|------|------------------|
| Migration applies clean | Vitest / SQL | `npm run test -- supabase` |
| RLS smoke (12 checks) | SQL | `psql … -f docs/tasks/testing/scripts/san492-rls-smoke.sql` → **ALL PASS** |
| `partner_is_active()` in migration | Code review | SECURITY DEFINER; used in 3 public SELECT policies |
| RLS on all new tables | Hook / MCP | `source-command-supabase-rls-audit` |
| No service-role in `mdeapp/src` | Hook | `no-service-role-in-src.mjs` |
| Types exported | Build | `npm run build` |

## Seed (SAN-493 / EVT-034)

Spec: [`EVT-034-seed.md`](./EVT-034-seed.md)

| Check | Type | Assert |
|-------|------|--------|
| Partner status active | SQL | all seeded `partners.status = 'active'` |
| Partner type venue | SQL | all seeded `partners.type = 'venue'` |
| Locations event-capable | SQL | `accepts_event_bookings=true` AND `is_verified=true` |
| Mamacita has offerings | SQL / API | ≥1 `venue_event_offerings` + ≥1 `venue_event_packages` |
| 6 venue partners | SQL | count ≥6 seeded location rows |
| Draft partner invisible | SQL | anon SELECT excludes `status='draft'` parent |
| Deterministic IDs in dev | Seed script | documented UUIDs in PR |

## Wire companions (SAN-510, SAN-511)

| Check | Type | Assert |
|-------|------|--------|
| VEB-W01 linked from VEN-002 | Doc | `WIREFRAMES.md` + VEN-002 cross-ref |
| VEB-W02 linked from VEN-003 | Doc | modal fields match wire |
| testIds documented | Wire | `event-venue-cta`, sheet, proposal CTA |

## CTA (SAN-494 / VEN-001)

| Check | Type | Assert |
|-------|------|--------|
| CTA hidden without offerings | Vitest / e2e | no `[data-testid="event-venue-cta"]` |
| CTA visible for Mamacita | Playwright | chat prompt → restaurant-card → CTA |
| Touch target ≥44px | a11y | manual / axe |
| Opens offerings panel | e2e | click → sheet visible |

## Offerings panel (SAN-495 / VEN-002)

| Check | Type | Assert |
|-------|------|--------|
| Sheet opens from CTA | Playwright | package cards ≥1 |
| Capacity + price band | Vitest | card props from query |
| Request proposal CTA | e2e | navigates to modal |

## Proposal modal (SAN-496 / VEN-003)

| Check | Type | Assert |
|-------|------|--------|
| Form validation | Vitest | date, guests, budget required |
| Submit → pending row | API / Supabase | `bookings` row with `booking_type='event'`, `partner_status='pending'` |
| No Stripe / no auto-confirm | Code review | HITL only |
| HITL pattern | LESSONS.md | matches host publish OVL-003 |

## Prod smoke (post-chain)

```bash
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
# Browser: quiet rooftop dinner in Provenza → event-venue-cta (when seeded on prod)
```

Evidence: `tasks/testing/evidence/YYYY-MM-DD/venue-booking/`
