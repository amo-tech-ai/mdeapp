# Nightlife (SAN-491) — plain-English summary — 2026-06-04

> **TL;DR**  
> **Nightlife browse is live and tested.** Open **https://www.mdeai.co/nightlife** (try Provenza). Merged in PR #67; Linear SAN-491 is **Done**.  
> Chat nightlife on **/** works too (cards + detail panel).  
> **4 of 5** related specs are shipped; only **007a** (tool `intent` field) is still open.  
> **Next:** prod journey tests (SAN-546), then `/cafes` browse (SAN-519) — don’t rework nightlife unless something breaks.

---

Quick reference after merge, prod smoke, and spec audit.

---

## What shipped

**Carlos** can browse clubs without chat:

- **Production:** https://www.mdeai.co/nightlife  
- **Provenza filter:** https://www.mdeai.co/nightlife?neighborhood=Provenza  
- **Chat nightlife:** https://www.mdeai.co/ — e.g. *"rooftop cocktails in Provenza tonight"*

**Code:** PR [#67](https://github.com/amo-tech-ai/mdeapp/pull/67) → `main` @ **`ae9a1e6`** · Linear **[SAN-491 Done](https://linear.app/sanjiovani/issue/SAN-491)**

**Tested on prod:** grid loads, Provenza-only cards, safety notice, Google Maps links, back to chat, anonymous booking sign-in gate. Evidence: `tasks/venues/tasks/evidence/SCREEN-022-evidence.md`

---

## The five MVP spec files — are they “done”?

| File | Plain name | Done? |
|------|------------|-------|
| `007-scr-nightlife-listings-map.md` | Full SCREEN-022 spec (chat + browse) | **Yes in prod** — markdown still says `Partial` (update docs) |
| `007-wire-nightlife-listings-map.md` | Wireframe doc | **Partial** — normal for wires; build matches P0 |
| `007a-ven-nightlife-grounding-intent.md` | Tool knows “nightlife” queries | **Not fully done** — works via query text, no `intent` field on tool yet · Linear **SAN-294 Todo** |
| `007b-ven-grounded-kind-split.md` | Chat shows nightlife cards, not café | **Yes** · Linear **SAN-295 Done** (PR #48) |
| `07c-ven-nightlife-detail-panel.md` | Right-column detail + booking | **Yes** · Linear **SAN-296 Done** (PR #48) |

**One-liner:** Browse + chat UI are live. Only **007a** (explicit tool `intent`) is still open.

---

## What you see vs what’s not built

| You get today | Not in this release |
|---------------|---------------------|
| `/nightlife` grid, filters, safety copy | Map column on browse (same as restaurants) |
| Chat cards → nightlife detail panel | `/nightlife/[slug]` detail page (POST-MVP) |
| Sign-in gate for anonymous booking | Real ADK grounding on prod if MAP-002B still blocked (may use curated DB fallback) |

---

## UI style (shadcn question)

Browse page **matches `/restaurants`** — semantic colors, `Badge`, `Skeleton`. Filter chips are **links** (good for URLs), not full shadcn `ToggleGroup` / `Card` composition. That’s intentional for launch; a shadcn polish pass should hit **restaurants + nightlife together**, not nightlife alone.

---

## Repo cleanup (june-4 commit plan)

Planning repo branch `docs/venues-index-canonical-order`:

| Slice | What | Status |
|-------|------|--------|
| 1 | gitignore + untrack Obsidian | ✅ `6b81fdf` |
| 2 | SAN-491 evidence + INDEX + sitemap | ✅ `e037ed0` pushed |
| 3–6 | plan→docs/plan, tasks import, MCP, scripts | ⏳ still pending |

App code lives in **`mdeapp/`** (separate git). `main` on clean worktree: **`/home/sk/mde-wt-search-clean`** @ `ae9a1e6`.

---

## Suggested next steps

1. **Prod journeys** — [SAN-546](https://linear.app/sanjiovani/issue/SAN-546) (J05–J08 includes Carlos nightlife on mdeai.co).  
2. **Optional docs** — flip `007-scr` / `007b` / `07c` frontmatter to `Done`; finish or narrow **007a** + **SAN-294**.  
3. **Next browse screen** — [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) `/cafes` (copy restaurants/nightlife pattern).  
4. **Don’t reopen** SAN-491 app code unless a new bug or Linear issue says so.

---

## Links

- Spec: `tasks/venues/tasks/mvp/007-scr-nightlife-listings-map.md`  
- Venue order: `tasks/venues/tasks/INDEX-VENUE.md`  
- Commit plan: `tasks/commit/june-4/COMMIT-PLAN.md`
