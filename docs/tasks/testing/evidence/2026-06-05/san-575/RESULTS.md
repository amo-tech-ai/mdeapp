# SAN-575 — restaurants re-skin evidence (2026-06-05)

| Check | Result |
|-------|--------|
| Vitest (531 full suite) | PASS |
| Affected Vitest (restaurant-card, domain-results, venue-card-shell) | PASS (13) |
| SCREEN-023 Playwright | PASS (2) |
| SAN-575 visual @ 375/768/1280 | PASS (3) |
| Scope gate | PASS |
| `npm run build` | PASS |
| PR #80 Floor CI (`75a1f83`) | PASS |
| PR #80 Vercel | PASS |
| **Prod** GET `/restaurants` | **200** |
| **Prod** Laureles filter (SCREEN-023) | **PASS** |
| **Prod** 16:10 cover cards (`aspect-[16/10]` / `mediaLayout`) | **PASS** (HTML) |
| **Prod** console hygiene (SCREEN-023 grid) | **WARN** — duplicate `data-testid="restaurants-browse"` on prod (strict mode); Laureles test passes |

Screenshots: `375-restaurants.png`, `768-restaurants.png`, `1280-restaurants.png`

Slice: `/restaurants` browse — nova cover media; chat stays `composition="legacy"`.

PR: https://github.com/amo-tech-ai/mdeapp/pull/80  
| **Prod** GET `/cafes` | **200** |
| **Prod** Laureles filter (SCREEN-028) | **PASS** (re-run after deploy @ `adb1178`) |

Merge: `adb1178` PR #83
