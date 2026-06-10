---
title: OpenClaw Events — Repos, Skills, Features, Use Cases Scorecard
updated: 2026-05-26
status: Research-backed planning reference
sources:
  - https://github.com/search?q=open+claw+event+&type=repositories
  - https://github.com/itsuzef/openclaw-live-events
  - https://github.com/Twigzolupolus/event-sample
  - https://github.com/sqzhang-jeremy/OpenClaw-Event-Preparation
  - https://github.com/stockii/event-skill-for-openclaw
  - https://github.com/bmoore117/luma-events
  - https://github.com/Remote55/openclaw
  - https://github.com/openclaw-mcp-vps/local-event-competitor-tracker
  - https://github.com/chris-openclaw/event-planner-os
  - https://github.com/ClawNewsde/openclaw-meetup-skill
  - https://github.com/b0kelmann/liveticker-skill
  - https://docs.apify.com/platform/integrations/openclaw
  - https://docs.apify.com/platform/integrations/mastra
  - https://apify.com/jakub.kopecky/actor-mastra-mcp-agent
  - https://docs.openclaw.ai/tools/skills
  - https://docs.openclaw.ai/clawhub
  - https://clawhub.ai/search?q=event&type=skills
---

# OpenClaw Events — Repos, Skills, Features, Use Cases Scorecard

## Executive Verdict

OpenClaw is useful for mdeai Events as an **approved execution and research layer**, not as the event platform itself.

Best uses:

- event discovery/import into review queues
- sponsor prospect research
- sponsor decision-maker mapping
- sponsor proposal drafts
- venue intelligence
- vendor recruitment research
- event-day ops screenshots and alerts
- Postiz/WhatsApp approved campaign handoff
- competitor monitoring

Do **not** use OpenClaw to own:

- event truth
- ticket/payment truth
- voting/winner truth
- pricing commits
- bookings/contracts
- unapproved outreach
- autonomous Instagram/Facebook/WhatsApp actions

## Top 20 GitHub Repos

| Rank | Repo | Score /100 | Use Level | What It Teaches | mdeai Adaptation | Avoid |
|---:|---|---:|---|---|---|---|
| 1 | `chris-openclaw/event-planner-os` | 93 | Strong reference | Timelines, tasks, vendors, volunteers, budgets | Roberto event planning checklist and vendor board | Copying JSON runtime as truth |
| 2 | `b0kelmann/liveticker-skill` | 90 | Strong reference | Multi-source live event coordination and role-specific updates | Event-day ops room, staff/sponsor updates | Unapproved fan-out messages |
| 3 | `bmoore117/luma-events` | 88 | Strong reference | Luma calendars, email source ingestion, upcoming/past event split, webhook output | Event import pipeline into review queue | Credentialed Luma scraping in MVP |
| 4 | `itsuzef/openclaw-live-events` | 86 | Strong reference | Ticketmaster Discovery plugin with `events_search` tool | Public event import pattern for Medellin calendars | US-centric Ticketmaster coverage |
| 5 | `ClawNewsde/openclaw-meetup-skill` | 84 | Strong reference | Nearby meetup/community discovery | Medellin meetup/hackathon discovery | Installing from ClawHub without audit |
| 6 | `openclaw/skills/1kalin/afrexai-event-management` | 83 | Pattern reference | Large event/conference lifecycle skill | Use as checklist taxonomy for events | Huge 990-line skill copied wholesale |
| 7 | `stockii/event-skill-for-openclaw` | 81 | Reference | Weekly event updates, Ticketmaster optional key, city/radius defaults | Weekly Medellin event digest | Low production maturity |
| 8 | `Remote55/openclaw` | 80 | Adjacent app reference | Hotel booking + real-time local events + Supabase + pgvector + Stripe | Tourism/event package inspiration | Booking/payment architecture drift |
| 9 | `openclaw-mcp-vps/local-event-competitor-tracker` | 79 | Pattern reference | Competitor tracking app shell | Local event competitor monitor for ticket price/sponsor overlap | Treating generated tool as production-ready |
| 10 | `apify/apify-openclaw-plugin` | 92 | Foundation integration | One `apify` tool: `discover`, `start`, `collect` | OCL-030 Apify sandbox | Broad `group:plugins` allowlist |
| 11 | `apify` Mastra MCP examples | 87 | Integration reference | Apify Actors exposed to Mastra via MCP tools | Use Mastra for review/reasoning, OpenClaw for async execution | Direct Apify tools in user chat without approval |
| 12 | `jakub.kopecky/actor-mastra-mcp-agent` | 76 | Experimental | Mastra agent inside Apify Actor | Spike only for remote agent/actor pattern | OpenAI default, pay-per-event cost surprise |
| 13 | `Twigzolupolus/event-sample` | 72 | UI inspiration | Public list, detail, admin CRUD, draft/published | Simple `/admin/events` and draft/publish UX | App architecture as source of truth |
| 14 | `sqzhang-jeremy/OpenClaw-Event-Preparation` | 58 | Low reference | Presentation/agent-loop experiment | Read for event-prep prompts only | Sparse docs, no production proof |
| 15 | `VibeCodingNights/superhero-skill` | 62 | Skill-pack reference | Persona/template packaging for event workshop | Persona pack inspiration for event operator roles | Domain mismatch |
| 16 | `openclaw/clawhub` | 70 | Registry reference | Skill registry mechanics | Audit and discovery only | Production installs from public registry |
| 17 | `openclaw/agent-skills` | 78 | Pattern reference | Shared SKILL.md patterns | Custom `mde-*` skill authoring | Third-party skill trust assumptions |
| 18 | `openclaw/lobster` | 74 | Post-MVP | Typed workflow composition | Multi-step crawl pipelines after OCL-013 | Premature workflow engine layer |
| 19 | `afrexai-event-planner` variants | 67 | Skill inspiration | Event-planner phrasing and flows | Use to shape Roberto prompts | Unvetted ClawHub install |
| 20 | `eventbrite/eventee/eventzilla` ClawHub skills | 64 | Discovery inspiration | Third-party event directory concepts | Map source coverage ideas | Authenticated scraping or brittle flows |

## Top 20 ClawHub / OpenClaw Skills

Treat every public skill as **read-only inspiration** until OCL-004 safety review passes.
The generic ClawHub search page may return zero results for `event`; this table uses direct skill URLs supplied for review plus GitHub mirrors where available.

| Rank | Skill | Score /100 | Tier | What It Does | mdeai Adaptation | Risk |
|---:|---|---:|---|---|---|---|
| 1 | `chris-openclaw/event-planner-os` | 94 | Core/Post-MVP | Event timelines, tasks, vendors, volunteers, budgets | Roberto planning board and vendor checklist | Skill data model not Supabase truth |
| 2 | `mariovallereyes/luma-event-manager` | 90 | Post-MVP | Public Luma discovery, host/attendee modes, guest lists, RSVP, calendar sync | Public Luma discovery into review queue | Cookies/auth flows risky |
| 3 | `ClawNewsde/meetup` | 87 | Post-MVP | Nearby community events, meetups, hackathons | Medellin startup/community discovery | Coverage and ClawHub trust |
| 4 | `1kalin/afrexai-event-management` | 85 | Post-MVP | Corporate event lifecycle and ROI | Conference/workshop event checklist | Too large to copy |
| 5 | `1kalin/afrexai-event-planner` | 82 | Post-MVP | Event planning prompts/workflows | Roberto setup assistant ideas | Unknown quality |
| 6 | `afrexai-cto/afrexai-event-planning` | 81 | Post-MVP | Planning workflow variant | Compare with event-planner-os | Unknown quality |
| 7 | `googleworkspace-bot/persona-event-coordinator` | 80 | Post-MVP | Coordinator persona workflow | Patricia/Roberto ops persona | Workspace integration drift |
| 8 | `chris-openclaw/church-event-planner` | 78 | Post-MVP | Volunteer/community event planning | Staff/volunteer logistics | Domain mismatch |
| 9 | `byungkyu/eventbrite` | 76 | Post-MVP | Eventbrite discovery/management concepts | Directory import source | Auth/scraping risk |
| 10 | `ivangdavila/events` | 74 | Post-MVP | General event skill | Prompt/source ideas | Unknown quality |
| 11 | `gora050/eventee` | 73 | Post-MVP | Event platform integration idea | Source coverage idea | Unknown quality |
| 12 | `gora050/eventzilla` | 72 | Post-MVP | Event directory integration idea | Source coverage idea | Unknown quality |
| 13 | `udiedrichsen/event-planner` | 72 | Post-MVP | Planning skill variant | Compare task prompts | Unknown quality |
| 14 | `edwardrodriguez703-design/book-event-planner` | 70 | Post-MVP | Booking/planning concept | Human-approved vendor booking drafts | Booking automation risk |
| 15 | `kimchichobo/plvr-event-discovery` | 70 | Post-MVP | Event discovery concept | Discovery prompts and filters | Unknown data model |
| 16 | `openclaw-live-events` plugin | 86 | Post-MVP | Ticketmaster event search tool | External event candidates | API geographic fit |
| 17 | `event-skill-for-openclaw` | 81 | Post-MVP | Weekly event digest | Weekly Medellin digest | Low maturity |
| 18 | `liveticker-skill` | 90 | Advanced | Live signals and role-specific updates | Event-day ops center | Message fan-out risk |
| 19 | `superhero-skill` | 62 | Inspiration | Persona/template skill packaging | Event operator persona templates | Domain mismatch |
| 20 | `Apify OpenClaw plugin` | 92 | Foundation/Post-MVP | Universal Actor discovery/start/collect | OCL-030 sandbox | Cost, compliance, overbroad tools |

## Top Event Use Cases For mdeai

| # | Use Case | Score /100 | Tier | Real-World Example | OpenClaw Role | mdeai Owner |
|---:|---|---:|---|---|---|---|
| 1 | Event planning checklist | 94 | Core/Post-MVP | Roberto plans Miss Medellin final timeline | Generate task checklist from template | Mastra + Supabase |
| 2 | Venue shortlist research | 92 | Post-MVP | Compare Provenza rooftops for pageant afterparty | Browser/Apify research with sources | OCL-016 |
| 3 | Vendor recruitment | 90 | Post-MVP | Find makeup, AV, photographer, livestream vendors | Research shortlist; no outreach | OCL-033 |
| 4 | Sponsor prospect research | 92 | Post-MVP | Find salons, fashion boutiques, liquor brands | Public evidence and category tags | OCL-019 |
| 5 | Sponsor decision-maker type map | 91 | Post-MVP | Identify likely brand manager vs owner | Classify role type with confidence | OCL-031 |
| 6 | Sponsor proposal drafts | 90 | Post-MVP | Draft salon sponsorship package | Generate proposal for approval | OCL-032 |
| 7 | Event directory import | 88 | Post-MVP | Import local events from public calendars | Candidate queue only | OCL-017 |
| 8 | Luma discovery | 88 | Post-MVP | Find Medellin startup/networking events | Public discovery only | OCL-017 |
| 9 | Ticketmaster-style API discovery | 84 | Post-MVP | Concert/festival candidates | API import pattern | OCL-017 |
| 10 | Meetup/hackathon discovery | 86 | Post-MVP | Tech meetups for sponsors | Candidate queue | OCL-017 |
| 11 | Competitor event tracker | 87 | Post-MVP | Track competing fashion/nightlife events | Weekly diff report | OCL-020 |
| 12 | Ticket urgency draft | 82 | Advanced | "VIP nearly sold out" copy | Draft only | OCL-035 |
| 13 | WhatsApp attendee reminders | 88 | Advanced | T-24h venue and QR reminder | Template send after approval | OCL-023/OCL-035 |
| 14 | Sponsor asset reminders | 86 | Advanced | Logo/banner deadline reminder | Approved WhatsApp/email | OCL-035 |
| 15 | Staff call-time reminders | 86 | Advanced | Door staff arrival and scanner link | Approved operational template | OCL-035 |
| 16 | Vendor deadline reminders | 85 | Advanced | Makeup vendor arrival confirmation | Draft/send after approval | OCL-035 |
| 17 | Social campaign drafts | 86 | Advanced | IG countdown post for finalist night | Draft + Postiz handoff | OCL-027/OCL-035 |
| 18 | Postiz scheduled publishing | 84 | Advanced | Sponsor co-branded announcement | Approved schedule only | OCL-027 |
| 19 | Public social intelligence | 88 | Post-MVP | Instagram buzz around Provenza venues | Source-labeled signals | OCL-034 |
| 20 | Creator/influencer shortlist | 85 | Post-MVP | Local beauty/fashion creators | Research only | OCL-034 |
| 21 | Sponsor ROI screenshots | 87 | Advanced | Post-event sponsor recap assets | Browser capture | OCL-024 |
| 22 | Live event ops ticker | 86 | Advanced | Staff/sponsor role-specific updates | Ops dashboard signals | OCL-041 |
| 23 | No-show recovery drafts | 80 | Advanced | Confirm attendance and waitlist release | Template draft | OCL-023/OCL-035 |
| 24 | Facebook Events research | 82 | Post-MVP | Public event candidate discovery | Apify/browser research | OCL-034 |
| 25 | Google Maps venue evidence | 87 | Post-MVP | Venue place link/hours/reviews | Use Maps/Places first, OCL supplemental | MAP + OCL-016 |
| 26 | Budget variance monitor | 82 | Post-MVP | Vendors exceed pageant budget | Report only | OCL-033 |
| 27 | Volunteer/staff roster | 80 | Post-MVP | Pageant backstage support | Checklist reminders | Future OCL |
| 28 | Sponsor renewal packet | 89 | Advanced | PDF/email after event | Draft, screenshots, metrics | OCL-024/OCL-032 |
| 29 | Partnership package research | 86 | Post-MVP | Tourism + hotel + event bundle | Research package ideas | OCL-031/032 |
| 30 | Event source health monitor | 81 | Post-MVP | Check if source sites changed/broke | Alert only | OCL-039 |
| 31 | Venue contract risk checklist | 78 | Advanced | Missing insurance/payment clause | Checklist, not legal advice | Future OCL |
| 32 | Event PR/media list research | 80 | Post-MVP | Find local media contacts | Research only | Future OCL |
| 33 | Photo/video asset collection | 82 | Advanced | Gather approved event assets | Organize, no publish | OCL-035 |
| 34 | Contest finalist announcement drafts | 82 | Advanced | Finalists social copy | Draft only | OCL-026/035 |
| 35 | WhatsApp sponsor report delivery | 80 | Advanced | Sponsor gets approved report | Approved send | OCL-035 |
| 36 | Instagram competitor ads watch | 77 | Advanced | Public ad/creative monitoring | Research only | OCL-034 |
| 37 | Event page QA crawler | 85 | Core/Post-MVP | Verify links, maps, CTA, ticket tiers | Browser QA before publish | OCL-040 |
| 38 | QR/check-in ops screenshots | 83 | Advanced | Door dashboard capture | Screenshot, no validation writes | OCL-024 |
| 39 | Event knowledge base update | 81 | Post-MVP | Save cited docs to pgvector | Draft chunks for approval | OCL-017/034 |
| 40 | Apify Actor experiment queue | 85 | Post-MVP | Test Instagram/Facebook/Maps Actors safely | Sandbox `discover/start/collect` | OCL-030 |

## Core vs Advanced Cut

| Horizon | Build | Do Not Build |
|---|---|---|
| Core | Approval tables, kill switch, admin preview, no-job-without-approval E2E, event page QA crawler | Apify production, WhatsApp sends, Postiz publishing |
| Post-MVP | Apify sandbox, venue research, event import, sponsor prospects, vendor research, social intelligence | Autonomous outreach, private-account scraping |
| Advanced | Approved WhatsApp templates, Postiz handoff, sponsor ROI screenshots, event-day ops ticker | Auto-DMs, auto-contracts, auto-bookings, auto-publish |

## mdeai Adaptation Rules

1. Use OpenClaw/Apify for research and evidence collection.
2. Use Mastra for orchestration and proposal generation.
3. Use CopilotKit for approval cards.
4. Use Supabase for truth and audit.
5. Use Stripe for payment truth.
6. Use Postiz only after campaign approval.
7. Use WhatsApp only for opted-in templates.
8. Never install ClawHub skills into production without OCL-004 review.
9. Never let OpenClaw mutate votes, winners, payments, tickets, bookings, or published event truth.
