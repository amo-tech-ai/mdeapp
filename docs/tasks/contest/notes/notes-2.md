Yes — the tasks and docs share one model. **`01-github-repos.md` right now is only a Helios/OpenStreamPoll snippet** (not the full index). The canonical “what repo vs what code” spec is:

- [`tasks/contest/docs/02-github-repos-use.md`](tasks/contest/docs/02-github-repos-use.md) — master table + **Wireframe Code Source Map**
- [`tasks/contest/tasks/CTEST-000`](tasks/contest/tasks/CTEST-000-diagrams-repo-decisions.md) — gate + repo classification
- Per-task `repo_refs` / `docs:` frontmatter where present
- [`tasks/contest/docs/wireframes/*.md`](tasks/contest/docs/wireframes/) — per-screen `code_refs` + `repo_refs` (CTEST-006 rule)

---

## The model (one sentence)

**GitHub = read patterns · `mdeapp` = ship code · Supabase = truth.**

Do **not** fork Helios, OpenStreamPoll, Hi.Events, or Photography Contest into the app.

---

## Two columns every implementer uses

| Column | Meaning | Example |
|--------|---------|---------|
| **Repo / reference** | Clone or docs under `/home/sk/mdeai/github/contest/` or `CopilotKit/examples/…` | `helios-server` → receipt/freeze **ideas** |
| **Code to use** | Real paths in **`mdeapp/`** you extend or mirror | `src/app/host/event/new/page.tsx`, `src/app/api/tickets/checkout/route.ts` |

From [`02-github-repos-use.md`](tasks/contest/docs/02-github-repos-use.md) §Wireframe map — that **is** the “code to use” model for UI tasks.

---

## CTEST task → GitHub refs → mdeapp code

| Task | GitHub / external (pattern only) | Code to use in `mdeapp` |
|------|----------------------------------|-------------------------|
| **CTEST-000** | All repos classified in doc §7 | **None** (docs only) |
| **CTEST-001** | — | `mdeapp/supabase/migrations/*contest*`, RLS, storage, `database.types.ts` |
| **CTEST-002** | `github/contest/helios-server` | New migrations/RPCs: `vote_ledger`, receipts, snapshots; optional Realtime `vote:tally:{id}` |
| **CTEST-003** | `github/events/Hi.Events` (AGPL, no copy) | Reuse EVP ticket paths: `api/tickets/checkout`, Stripe webhooks, `me/tickets` |
| **CTEST-004** | `CopilotKit/examples/integrations/mastra` | `api/copilotkit`, `copilot-kit-provider`, host contest pages (new) |
| **CTEST-005** | Same + Mastra patterns | `src/mastra/agents/*`, tools, `ai-runs` logging on CopilotKit path |
| **CTEST-006** | Per wireframe `repo_refs` | Documents `code_refs` per screen; no single path |
| **CTEST-007** | Playwright (package) | `mdeapp/e2e/` contest specs |
| **CTEST-008** | Firecrawl (API/skill) | shadcn forms, `user-scoped.ts`, `contestant_profile_extractions` |
| **CTEST-009** | CopilotKit Mastra | `chat-canvas`, coach panel, profile editor routes |
| **CTEST-010** | Helios (receipt UX); Photography ReactJS (layout only) | `events/[slug]`-style pages, vote RPC + share; **not** Helios code |
| **CTEST-011** | Firecrawl + OpenClaw (sandbox) | `contestant_discovery_*`, `contestant_invite_drafts`; mastra search tools as boundary refs |
| **CTEST-012** | — | Linear/docs sync only |

**MVP-A** tasks mostly use **mdeapp + Supabase + CopilotKit/Mastra + Firecrawl API**.  
**MVP-B** adds **Hi.Events patterns (tickets)**, **OpenStreamPoll (overlay UX only)**, **OpenClaw discovery**.

---

## Copy vs pattern (global rule)

| Repo | Copy source? | Use for |
|------|--------------|---------|
| CopilotKit/Mastra example | Adapt patterns | Wiring only |
| Helios | **No** | Ledger/receipt/freeze design |
| OpenStreamPoll | **No** | OBS/QR/live bar UX (post-MVP) |
| Hi.Events | **No** (AGPL) | Ticket/order/check-in modeling |
| Photography Contest ReactJS | **No** | Gallery/profile **layout** |
| Firecrawl | CLI/API only | Public URL extraction |
| OpenClaw/* | **No** | Discovery adapter ideas (CTEST-011) |

---

## How a task author should read it

1. Open **CTEST-00x** → `docs:` links → usually `02-github-repos-use.md`.
2. If UI → **CTEST-006** → matching **`docs/wireframes/NN-*.md`**.
3. Implement only **`code_refs`** paths; skim **`repo_refs`** for behavior, not imports.
4. New contest routes go in **`mdeapp`** (not `github/contest/*`).

---

## Gap to fix in notes

[`01-github-repos.md`](tasks/contest/notes/01-github-repos.md) should either point at **`02-github-repos-use.md`** or duplicate the full local repo table (Helios, OSP, Photography, OpenClaw, etc.) — right now it’s incomplete vs the tasks pack.

**Bottom line:** Tasks **reference** GitHub repos; they **never** say “vendor that repo into production.” They always say **which existing `mdeapp` files** to extend, with repos as **domain/UI/security patterns** only. That’s the code-to-use model.