# SAN-660 — Event Hosts landing (`/host`)

**Date:** 2026-06-08  
**Branch:** `ai/san-660-mkt-for-event-hosts-landing-host`  
**Commit:** `7a5928b` (C-018)

## Skills applied

- **shadcn** — Button `nativeButton={false}` + `render={<Link />}`, full Card composition, Badge, semantic tokens
- **21st.dev** — Hero-1 patterns (`text-balance`, dual CTA, gradient band); pricing card grid adapted (no raw gray-*)
- **web-design-guidelines** — `text-balance`/`text-pretty`, `tabular-nums` on stats, `scroll-mt-24`, skip link via root layout

## Verification

| Check | Result |
|-------|--------|
| Vitest `event-host-landing` | **6/6 PASS** |
| Vitest middleware host public | **2/2 PASS** |
| Playwright `SAN-660-host-landing.spec.ts` | **1/1 PASS** (2026-06-08) |
| `GET /host` localhost | **200** (public, not 307 login) |
| Middleware scope | `/host` public · `/host/event/*` + `/host/events` gated |
| Header CTA tap targets | **44px** — `min-h-11 px-4` on Sign in + primary CTA (`partner-marketing-nav.tsx`) |

## CTAs

| CTA | href |
|-----|------|
| Primary | `/partners/signup?type=host` |
| Secondary | `/host/event/new` |
