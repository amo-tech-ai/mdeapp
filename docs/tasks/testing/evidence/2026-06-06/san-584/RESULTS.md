# SAN-584 — Events nav enable (SCR-002b)

**Merge:** PR #87 → `main` @ `7137608`  
**Date:** 2026-06-06  
**Linear:** SAN-584 → **Done**

## Change

| Item | Before | After |
|------|--------|-------|
| `EXPLORE_ITEMS` events | `href: null` (Coming soon) | `href: "/events"` |
| Rentals | `href: null` | unchanged |
| Cafés | `href: null` | `href: "/cafes"` (PR #89) |

**File:** `mdeapp/src/components/chat/chat-nav-rail.tsx`

## Tests

| Check | Result |
|-------|--------|
| Floor CI (PR #87) | PASS |
| Playwright SCREEN-027 nav → catalog | 6/6 PASS |
| Prod `/` Events nav is live link | PASS (no `aria-disabled`) |
| Prod `/` → click Events → `/events` | PASS (34 cards, title "Events in Medellín") |

## Prod smoke (2026-06-06)

```bash
curl -s https://www.mdeai.co/ | grep 'href="/events"'   # nav link present post-deploy
curl -s -o /dev/null -w "%{http_code}\n" https://www.mdeai.co/events  # 200
```

Browser: `https://www.mdeai.co/` → Explore **Events** → `/events` catalog.

## Evidence

- `prod-nav-to-events.png`

## Unblocks

- Andrés persona: sidebar → events catalog without typing in chat
- Events nav: this file (PR #87)
- Cafés nav: `../san-584-cafes-nav/RESULTS.md` (PR #89)
