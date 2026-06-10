---
title: Contest GitHub Repos Use Plan
status: Draft
date: 2026-06-02
local_root: /home/sk/mdeai/github/contest
---

# Contest GitHub Repos Use Plan

Use these repos as references. Do not copy/paste full apps into `mdeapp`.

Current recommendation: **do not fork a contest app**. Build the contest vertical inside `mdeapp` using Supabase, CopilotKit, Mastra, Stripe, shadcn, and Playwright. Use external repos as pattern references only.

## Local Repos Reviewed

| Repo | Local path | Use level | How to use |
|---|---|---|---|
| Helios Server | `/home/sk/mdeai/github/contest/helios-server` | Strong reference | Vote receipts, vote hashes, tally freeze, audit concepts. |
| OpenStreamPoll | `/home/sk/mdeai/github/contest/OpenStreamPoll` | Post-MVP reference | OBS overlay routes, QR live engagement, active poll UX. |
| Photography Contest ReactJS | `/home/sk/mdeai/github/contest/Photography_Contest_ReactJS` | UI inspiration | Contestant gallery/profile ideas only. |
| OpenClaw Web Scraper Plugin | `/home/sk/mdeai/github/contest/openclaw-plugin-web-scraper` | Post-MVP | Search/fetch/crawl adapter boundary for sponsor lead drafts. |
| Decodo OpenClaw Skill | `/home/sk/mdeai/github/contest/decodo-openclaw-skill` | Post-MVP | Optional paid enrichment provider after legal/TOS review. |
| OpenClaw Ultra Scraping | `/home/sk/mdeai/github/contest/openclaw-ultra-scraping` | Advanced/post-MVP | Enterprise scraping lab only; high compliance risk. |

## Other Repos To Use

| Repo | Location/source | Use level | How to use |
|---|---|---|---|
| CopilotKit Mastra Integration | `/home/sk/mdeai/CopilotKit/examples/integrations/mastra` | Foundation | Pattern 1 in-process `/api/copilotkit`, `useCoAgent`, `useCopilotAction`, approval cards. |
| Hi.Events | `/home/sk/mdeai/github/events/Hi.Events` | Strong reference | Ticket tiers, orders, attendees, QR check-in, capacity, webhooks. AGPL: no source copy. |
| Google ADK Samples | `/home/sk/mdeai/github/adk/adk-samples` | Post-core reference | Geo/sponsor/venue intelligence after MVP truth works. |
| TanStack Table | package/reference | Foundation | Admin tables for contestants, votes, sponsors, check-ins. |
| React Email | package/reference | Strong reference | Sponsor proposal and ticket email templates. |
| Playwright | package/reference | Foundation | E2E proof for routes, votes, Stripe, QR, admin. |
| Postiz | API/SaaS/self-host reference | Post-MVP | Approved campaign scheduling only. AGPL: no source copy. |
| Firecrawl | CLI/API reference | Foundation for URL extraction | Public URL scrape/search and schema extraction for contestant profile drafts. |
| Trigger.dev | future platform reference | Post-MVP | Durable jobs only if Supabase queues/Edge Functions are insufficient. |
| React Scan | dev tooling | Post-MVP | Performance checks for live dashboards/leaderboards. |

## Best Model Repos By Feature

| Feature | Best reference | Use | Guardrail |
|---|---|---|---|
| Ticketing, QR check-in, attendee/order ops | Hi.Events | Product modeling for ticket tiers, orders, attendees, QR scan logs, promo/referral concepts. | AGPL/additional terms: do not copy source into `mdeapp`. |
| Voting integrity | Helios Server | Receipts, tally freeze, audit concepts, threat modeling. | Do not overbuild full cryptographic elections for MVP. |
| Public profile/gallery UI | Photography Contest ReactJS and photo-contest topic scans | Layout inspiration for contestants and galleries. | Rebuild auth, vote, payment, and DB logic from scratch. |
| AI workspace | CopilotKit Mastra integration | In-process `/api/copilotkit`, generative UI cards, HITL patterns. | Keep mdeapp on installed CopilotKit `1.55.2`. |
| Social scheduling | Postiz | Approved campaign calendar and analytics ideas. | No autonomous publishing in MVP. |
| Discovery and URL extraction | Firecrawl + OpenClaw sandbox | Public web search, scrape, and structured extraction. | No private Instagram scraping, no login bypass, no autonomous outreach. |
| Pageant-specific feature shape | PageantOS as product reference | Contestant applications, judge scoring, approvals, People&apos;s Choice style public voting. | SaaS/product reference only; no repo/source reuse. |

## Wireframe Code Source Map

Each contest screen now has a separate wireframe handoff in [`./wireframes/`](./wireframes/). Implementation tasks should cite the relevant file before coding.

| Screen group | Wireframe files | Code to use in `mdeapp` | Repo/reference to use | Guardrail |
|---|---|---|---|---|
| Host contest setup | `01-host-contests-new.md`, `02-host-contests-list.md` | `/home/sk/mdeai/mdeapp/src/app/host/event/new/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-shell.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-form.tsx`, `/home/sk/mdeai/mdeapp/src/components/host/host-event-copilot-bridge.tsx` | CopilotKit Mastra Integration, existing host event flow | Reuse structure; replace event-specific fields with contest fields. |
| Public contest discovery/page/profile | `03-contests-discovery.md`, `04-public-contest-page.md`, `06-public-contestant-profile-vote.md` | `/home/sk/mdeai/mdeapp/src/app/events/[slug]/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/events/event-detail-view.tsx`, `/home/sk/mdeai/mdeapp/src/components/events/event-ticket-tiers.tsx`, shadcn cards/buttons/badges | Photography Contest ReactJS for gallery/profile visual inspiration | No source copy from old demo apps; rebuild with current mdeapp auth/data. |
| Contestant signup and profile management | `05-contestant-signup-url-intake.md`, `08-contestant-profile-editor.md`, `09-contestant-photos.md` | shadcn `Form`/`Field`, React Hook Form, Zod, `/home/sk/mdeai/mdeapp/src/lib/supabase/user-scoped.ts`, Supabase Storage policies | Firecrawl for allowed public URL extraction; shadcn React Hook Form docs | Extracted URL content stays draft/review-only until approved. |
| Contestant coach and AI actions | `10-contestant-coach.md` | `/home/sk/mdeai/mdeapp/src/app/api/copilotkit/[[...path]]/route.ts`, `/home/sk/mdeai/mdeapp/src/components/copilot/copilot-kit-provider.tsx`, `/home/sk/mdeai/mdeapp/src/components/chat/chat-canvas.tsx`, `/home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts` | CopilotKit Mastra Integration, Mastra | AI may suggest profile/prep changes; user/admin approval publishes them. |
| Votes, receipts, and tickets | `07-contest-vote.md`, `11-ticket-wallet.md`, `14-admin-vote-audit.md` | `/home/sk/mdeai/mdeapp/src/app/api/tickets/checkout/route.ts`, `/home/sk/mdeai/mdeapp/src/app/me/tickets/page.tsx`, `/home/sk/mdeai/mdeapp/src/components/tickets/ticket-qr-display.tsx`, Supabase vote ledgers/RPCs | Helios Server for receipt/tally concepts; Hi.Events for ticket/order concepts | Vote truth must be server/ledger derived, never client derived. |
| Admin review, judge scoring, sponsors | `12-admin-contests-dashboard.md`, `13-admin-contestants-review.md`, `15-admin-judge-scoring.md`, `16-sponsor-crm.md`, `17-sponsor-proposal-approval.md` | TanStack Table, shadcn `Sheet`/`Dialog`/`Badge`/`Button`, `/home/sk/mdeai/mdeapp/src/components/approvals/ApprovalPanel.tsx`, `/home/sk/mdeai/mdeapp/src/app/api/approval-commit/route.ts` | TanStack Table, React Email, PageantOS product reference | Admin/sponsor actions require role gates and approval history. |
| Discovery sandbox and live overlays | `18-discovery-contestants-sandbox.md`, `19-live-contest-control-post-mvp.md` | `/home/sk/mdeai/mdeapp/src/mastra/tools/search-web-grounded-events.ts`, `/home/sk/mdeai/mdeapp/src/mastra/lib/search-logs.ts`, `/home/sk/mdeai/mdeapp/src/mastra/tools/audit-wrapper.ts` | Firecrawl now; OpenClaw and OpenStreamPoll post-MVP | No private/login-gated scraping, no autonomous outreach, no overlay-as-vote-truth. |

## Screen Handoff Rule For Tasks

When a task implements a contest screen:

1. Open the matching file in [`./wireframes/`](./wireframes/).
2. Use the listed `code_refs` as the local implementation pattern.
3. Use the listed `repo_refs` as domain or UI references only.
4. Add Playwright/mobile proof for `375`, `414`, `768`, `1024`, and `1440` widths.
5. Keep tasks labeled `CONT` and `EVT` in Linear.

## What To Copy vs Not Copy

| Repo | Copy code? | Copy pattern? | Reason |
|---|---|---|---|
| CopilotKit Mastra Integration | Limited local adaptation | Yes | Already matches mdeapp's intended architecture, but replace demo domain/OpenAI with Gemini. |
| Helios | No | Yes | Voting integrity concepts are valuable; full crypto election stack is overkill. |
| OpenStreamPoll | No | Yes later | Live overlay pattern useful; official vote truth must be stronger. |
| Hi.Events | No | Yes | AGPL risk; model event/ticket concepts only. |
| Photography Contest ReactJS | No | UI only | Old stack and weak production proof. |
| OpenClaw variants | No | Adapter concepts later | Compliance and approval gates required. |
| Postiz | No | API integration later | Approved scheduling only. |
| Firecrawl | CLI/API usage only | Yes | Use for public URL extraction with schemas and source logging. |
| TanStack Table / React Email / Playwright | Install packages | Yes | Production-ready libraries. |

## Public URL / Instagram Intake Tooling

Recommended implementation path:

1. Accept an Instagram/public URL from the contestant as an optional profile-draft helper.
2. Prefer manual form fields when extraction fails.
3. Use Firecrawl for public page scrape/search and schema extraction when allowed by the source.
4. Use OpenClaw only in a sandbox for approved public discovery runs, never for private/login-gated Instagram content.
5. Store extracted values as `contestant_profile_extractions` with `source_url`, `extracted_json`, `confidence`, `risk_flags`, and `review_status`.
6. Require Patricia/Roberto approval before extracted text/photos become public profile content.

Suggested extraction schema:

| Field | Notes |
|---|---|
| `display_name` | Public name from page or contestant confirmation. |
| `bio` | Short public summary, source-attributed. |
| `public_image_candidates` | Public image URLs only; do not download private/media behind auth. |
| `city_or_neighborhood` | Low-confidence unless explicitly stated. |
| `category_or_division_hint` | Draft only; contestant confirms. |
| `source_url` | Required. |
| `evidence_snippets` | Short non-sensitive snippets. |
| `risk_flags` | Login-gated, private, unsupported source, no consent, extraction uncertain. |

Questions to ask the contestant after extraction:

- Is this the correct public profile?
- Which name should appear on the contest page?
- Which photo should be the main profile photo?
- What story, talent, or platform should fans know?
- Which events can you attend: casting, rehearsal, interviews, finals?
- Who should be contacted for logistics?
- Do you consent to approved profile content being used for contest promotion?

## mdeai Beauty Contest Example

For Miss Medellin Beauty Contest:

| Need | Repo reference |
|---|---|
| Trusted public votes | Helios concepts + Supabase SQL ledger |
| VIP tickets and QR entry | Hi.Events concepts + Stripe webhook truth |
| Audience QR during finals | OpenStreamPoll post-MVP |
| Organizer AI workspace | CopilotKit + Mastra |
| Sponsor CRM/admin tables | TanStack Table |
| Sponsor proposal email | React Email |
| Social campaign scheduling | Postiz post-MVP |
| Sponsor/contestant lead discovery | Firecrawl now for public source extraction; OpenClaw post-MVP sandbox |
| Proof | Playwright |
