---
title: Contest Per-Screen Wireframes
status: Draft
date: 2026-06-03
skill: mde-wireframe
---

# Contest Per-Screen Wireframes

These files are the screen-by-screen handoff for `CTEST-006`. They are wireframe specs only; production React should be implemented in a later task from these references.

## Screen Files

| Order | Screen | Route | File |
|---:|---|---|---|
| 1 | Host contest wizard | `/host/contests/new` | [01-host-contests-new.md](./01-host-contests-new.md) |
| 2 | Host contest list | `/host/contests` | [02-host-contests-list.md](./02-host-contests-list.md) |
| 3 | Contest discovery | `/contests` | [03-contests-discovery.md](./03-contests-discovery.md) |
| 4 | Public contest page | `/contests/[slug]` | [04-public-contest-page.md](./04-public-contest-page.md) |
| 5 | Contestant signup and URL intake | `/contests/[slug]/signup` | [05-contestant-signup-url-intake.md](./05-contestant-signup-url-intake.md) |
| 6 | Contestant public profile and vote | `/contests/[slug]/contestants/[id]` | [06-public-contestant-profile-vote.md](./06-public-contestant-profile-vote.md) |
| 7 | Contest vote checkout | `/contests/[slug]/vote` | [07-contest-vote.md](./07-contest-vote.md) |
| 8 | Contestant profile editor | `/me/contestant-profile` | [08-contestant-profile-editor.md](./08-contestant-profile-editor.md) |
| 9 | Contestant photos | `/me/contestant-profile/photos` | [09-contestant-photos.md](./09-contestant-photos.md) |
| 10 | Contestant coach | `/me/contestant-profile/coach` | [10-contestant-coach.md](./10-contestant-coach.md) |
| 11 | Ticket wallet | `/me/tickets` | [11-ticket-wallet.md](./11-ticket-wallet.md) |
| 12 | Admin contests dashboard | `/admin/contests` | [12-admin-contests-dashboard.md](./12-admin-contests-dashboard.md) |
| 13 | Admin contestant review | `/admin/contests/[id]/contestants` | [13-admin-contestants-review.md](./13-admin-contestants-review.md) |
| 14 | Admin vote audit | `/admin/contests/[id]/votes` | [14-admin-vote-audit.md](./14-admin-vote-audit.md) |
| 15 | Admin judge scoring | `/admin/contests/[id]/scores` | [15-admin-judge-scoring.md](./15-admin-judge-scoring.md) |
| 16 | Sponsor CRM | `/sponsors` | [16-sponsor-crm.md](./16-sponsor-crm.md) |
| 17 | Sponsor proposal approval | `/sponsors/proposals/[id]` | [17-sponsor-proposal-approval.md](./17-sponsor-proposal-approval.md) |
| 18 | Discovery contestants sandbox | `/admin/discovery/contestants` | [18-discovery-contestants-sandbox.md](./18-discovery-contestants-sandbox.md) |
| 19 | Live contest control | `/live/contests/[id]` | [19-live-contest-control-post-mvp.md](./19-live-contest-control-post-mvp.md) |

## Code Source Map

| Screen group | Primary code to adapt | Repo/reference to study |
|---|---|---|
| Host contest setup | `/home/sk/mdeai/mdeapp/src/app/host/event/new/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-shell.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-form.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-copilot-bridge.tsx` | CopilotKit Mastra integration, existing host event flow |
| Public contest pages | `/home/sk/mdeai/mdeapp/src/app/events/[slug]/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/events/event-detail-view.tsx`, `/home/sk/mdeai/mdeapp/src/components/events/event-ticket-tiers.tsx` | Photography Contest ReactJS for gallery inspiration only |
| Ticket wallet and voting receipt | `/home/sk/mdeai/mdeapp/src/app/me/tickets/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/tickets/my-tickets-list.tsx`, `/home/sk/mdeai/mdeapp/src/components/tickets/ticket-qr-display.tsx`, `/home/sk/mdeai/mdeapp/src/lib/tickets/wallet-format.ts` | Hi.Events concepts for ticket modeling; Helios concepts for receipt integrity |
| AI chat and agent panels | `/home/sk/mdeai/mdeapp/src/app/api/copilotkit/[[...path]]/route.ts`, `/home/sk/mdeai/mdeapp/src/components/copilot/copilot-kit-provider.tsx`, `/home/sk/mdeai/mdeapp/src/mastra/agents/host-event.ts`, `/home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts` | CopilotKit Mastra integration |
| URL extraction and discovery | `/home/sk/mdeai/mdeapp/src/mastra/tools/search-web-grounded-events.ts`, `/home/sk/mdeai/mdeapp/src/mastra/lib/search-logs.ts`, `/home/sk/mdeai/mdeapp/src/app/api/grounding/event-web/route.ts` | Firecrawl API/CLI now; OpenClaw sandbox later |
| Admin tables and review | Existing shadcn primitives in `/home/sk/mdeai/mdeapp/src/components/ui`, new TanStack Table components | TanStack Table docs and shadcn table patterns |

## Handoff Rules

- Each screen file lists `repo_refs` and `code_refs`; implementation tasks must cite the relevant file before coding.
- Use shadcn primitives already installed where possible: `Button`, `Card`, `Input`, `Label`, `Badge`, `Sheet`, `Dialog`, `Tooltip`, `Skeleton`, plus `Field`, `Form`, `Table`, `Tabs`, `Textarea`, `Select`, and `Avatar` when added.
- Use React Hook Form and Zod for all contestant, host, sponsor, and judge forms.
- Use mobile-first layouts with verified widths `375`, `414`, `768`, `1024`, and `1440`.
- Do not copy source from AGPL or old demo apps into `mdeapp`; use them only for domain modeling or visual inspiration.
