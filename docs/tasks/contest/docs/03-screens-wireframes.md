---
title: Contest Screens and Wireframes
status: Draft
date: 2026-06-02
skills:
  - mde-wireframe
  - copilotkit
  - shadcn
  - responsive-design
  - tailwind-responsive-ui
---

# Contest Screens and Wireframes

These are low-fidelity implementation wireframes for the contest task pack. Phase 1 remains English-only.

Detailed per-screen handoff files live in [`./wireframes/`](./wireframes/). Each file includes the route, persona, ASCII wireframe, states, responsive rules, testing proof, repo references, and local `mdeapp` code references to adapt.

## Screen Inventory

| Order | Path | Persona | Purpose | Task | MVP |
|---:|---|---|---|---|---|
| 1 | `/host/contests/new` | Roberto | AI-assisted contest creation wizard | CTEST-006 | Yes |
| 2 | `/host/contests` | Roberto | Organizer contest list and status | CTEST-006 | Yes |
| 3 | `/contests` | Fan/Contestant | Contest discovery/browse list | CTEST-010 | Yes |
| 4 | `/contests/[slug]` | Fan/Contestant | Public contest page, contestants, tickets, voting CTA | CTEST-006 | Yes |
| 5 | `/contests/[slug]/signup` | Contestant | Contestant application and public URL intake | CTEST-008 | Yes |
| 6 | `/contests/[slug]/contestants/[id]` | Fan/Contestant | Contestant profile, share, and vote page | CTEST-010 | Yes |
| 7 | `/contests/[slug]/vote` | Fan | Free/paid voting entry point | CTEST-006, CTEST-010 | Yes |
| 8 | `/me/contestant-profile` | Contestant | Private profile editor and completion checklist | CTEST-009 | Yes |
| 9 | `/me/contestant-profile/photos` | Contestant | Upload and manage profile photos | CTEST-009 | Yes |
| 10 | `/me/contestant-profile/coach` | Contestant | Chat coach, preparation guide, and next steps | CTEST-009 | Yes |
| 11 | `/me/tickets` | Andres/Miguel | Ticket QR wallet | CTEST-003 | Reuse existing event task pattern |
| 12 | `/admin/contests` | Patricia | Contest ops dashboard | CTEST-006 | Yes |
| 13 | `/admin/contests/[id]/contestants` | Patricia | Contestant review, profile approval, extraction review | CTEST-008, CTEST-009 | Yes |
| 14 | `/admin/contests/[id]/votes` | Patricia | Vote audit and fraud review | CTEST-006 | Yes |
| 15 | `/admin/contests/[id]/scores` | Judge/Patricia | Judge scoring and score lock | CTEST-006 | Yes |
| 16 | `/sponsors` | Patricia | Sponsor CRM and proposal queue | CTEST-006 | Yes |
| 17 | `/sponsors/proposals/[id]` | Patricia | AI proposal draft preview and approval | CTEST-006 | Yes |
| 18 | `/admin/discovery/contestants` | Patricia | Governed public lead discovery and invite draft review | CTEST-011 | Sandbox MVP |
| 19 | `/live/contests/[id]` | Producer | Live control and overlays | Future | Post-MVP |

Every MVP screen needs loading, empty, error, success, auth/role, mobile, tablet, desktop, and denied-access states. Use shadcn `Field`/React Hook Form for forms, `Sheet` or `Drawer` for mobile review/coach panels, `Table` for admin desktop data, and card/list transforms on mobile.

## Per-Screen Files

| Order | Screen | File |
|---:|---|---|
| 1 | Host contest wizard | [`./wireframes/01-host-contests-new.md`](./wireframes/01-host-contests-new.md) |
| 2 | Host contest list | [`./wireframes/02-host-contests-list.md`](./wireframes/02-host-contests-list.md) |
| 3 | Contest discovery | [`./wireframes/03-contests-discovery.md`](./wireframes/03-contests-discovery.md) |
| 4 | Public contest page | [`./wireframes/04-public-contest-page.md`](./wireframes/04-public-contest-page.md) |
| 5 | Contestant signup and URL intake | [`./wireframes/05-contestant-signup-url-intake.md`](./wireframes/05-contestant-signup-url-intake.md) |
| 6 | Public contestant profile and vote | [`./wireframes/06-public-contestant-profile-vote.md`](./wireframes/06-public-contestant-profile-vote.md) |
| 7 | Contest vote checkout | [`./wireframes/07-contest-vote.md`](./wireframes/07-contest-vote.md) |
| 8 | Contestant profile editor | [`./wireframes/08-contestant-profile-editor.md`](./wireframes/08-contestant-profile-editor.md) |
| 9 | Contestant photos | [`./wireframes/09-contestant-photos.md`](./wireframes/09-contestant-photos.md) |
| 10 | Contestant coach | [`./wireframes/10-contestant-coach.md`](./wireframes/10-contestant-coach.md) |
| 11 | Ticket wallet | [`./wireframes/11-ticket-wallet.md`](./wireframes/11-ticket-wallet.md) |
| 12 | Admin contests dashboard | [`./wireframes/12-admin-contests-dashboard.md`](./wireframes/12-admin-contests-dashboard.md) |
| 13 | Admin contestant review | [`./wireframes/13-admin-contestants-review.md`](./wireframes/13-admin-contestants-review.md) |
| 14 | Admin vote audit | [`./wireframes/14-admin-vote-audit.md`](./wireframes/14-admin-vote-audit.md) |
| 15 | Admin judge scoring | [`./wireframes/15-admin-judge-scoring.md`](./wireframes/15-admin-judge-scoring.md) |
| 16 | Sponsor CRM | [`./wireframes/16-sponsor-crm.md`](./wireframes/16-sponsor-crm.md) |
| 17 | Sponsor proposal approval | [`./wireframes/17-sponsor-proposal-approval.md`](./wireframes/17-sponsor-proposal-approval.md) |
| 18 | Discovery contestants sandbox | [`./wireframes/18-discovery-contestants-sandbox.md`](./wireframes/18-discovery-contestants-sandbox.md) |
| 19 | Live contest control | [`./wireframes/19-live-contest-control-post-mvp.md`](./wireframes/19-live-contest-control-post-mvp.md) |

## 1. Roberto Contest Wizard

```text
Path: /host/contests/new
Persona: Roberto

+------------------------------------------------------------------+
| Header: New contest                                               |
+---------------+----------------------------------+---------------+
| Steps         | Form canvas                       | Copilot panel |
| 1 Basics      | Contest name                      | Draft setup   |
| 2 Venue       | Date / time                       | Missing data  |
| 3 Contestants | Divisions / rounds                | Approval card |
| 4 Tickets     | Ticket tiers                      |               |
| 5 Voting      | Free/paid voting windows          |               |
| 6 Review      | Publish preview                   |               |
+---------------+----------------------------------+---------------+
```

States: draft, missing required fields, ready for approval, approved, rejected.

## 2. Host Contest List

```text
Path: /host/contests
Persona: Roberto

+-------------------------------------------------------------+
| My contests                                      [New]       |
+-------------------+-------------------+---------------------+
| Status filters    | Contest table/list | Next action panel   |
| Draft / Published | Name / date / risk | Publish / edit / QR |
+-------------------+-------------------+---------------------+
```

States: no contests, loading, draft contests, published contests, archived contests, role denied.

## 3. Contest Discovery

```text
Path: /contests
Persona: Fan / Contestant

+-------------------------------------------------------------+
| Upcoming contests                                            |
+-------------------------------------------------------------+
| [Search] [Category] [Date] [Neighborhood]                    |
| Contest card: title / date / venue / apply / vote / tickets  |
| Contest card: title / date / venue / apply / vote / tickets  |
+-------------------------------------------------------------+
```

States: no contests, filtered no results, applications open, voting open, ticket sales open.

## 4. Public Contest Page

```text
Path: /contests/[slug]
Persona: Fan / Contestant

+-------------------------------------------------------------+
| Miss Medellin Beauty Contest Finals                         |
| Date / Venue / Buy tickets / Apply / Vote now               |
+-------------------------------------------------------------+
| Contestants grid                                            |
| [Photo][Name][District][Vote] [Photo][Name][District][Vote] |
+---------------------------+---------------------------------+
| Schedule                  | Sponsor highlights              |
| Rehearsal / final rounds  | VIP sponsor cards               |
+---------------------------+---------------------------------+
```

States: unpublished, published, applications closed, voting closed, sold out, empty contestants.

## 5. Contestant Signup And URL Intake

```text
Path: /contests/[slug]/signup
Persona: Contestant

+-------------------------------------------------------------+
| Apply for Miss Medellin                                     |
+-------------------------------+-----------------------------+
| Form                          | Draft helper                |
| Name / email / WhatsApp       | Paste Instagram/site URL    |
| Division / city / availability| Extracted public hints      |
| Consent checkboxes            | Missing questions           |
| [Submit application]          | Source links                |
+-------------------------------+-----------------------------+
```

States: manual-only, URL extraction pending, extraction failed, draft ready, submitted, already applied, closed applications, auth required.

Questions the guide should ask:

- What name should appear publicly?
- Which city or neighborhood should be shown?
- Which category or division are you applying for?
- What are your talent, fashion, platform, or story highlights?
- Which three photos should be considered for the public profile?
- Are you available for casting, rehearsal, interviews, and finals?
- May the organizer use your approved profile/photo for contest promotion?

## 6. Public Contestant Profile / Voting Page

```text
Path: /contests/[slug]/contestants/[id]
Persona: Fan / Contestant

+-------------------------------------------------------------+
| Photo carousel      Name / Division / Rank or status        |
|                     [Vote] [Share] [Buy vote pack]          |
+-------------------------------------------------------------+
| Bio / story / social links                                  |
| Vote receipt or eligibility state                           |
+-------------------------------+-----------------------------+
| Upcoming contest events       | Promotion tips / share URLs |
+-------------------------------+-----------------------------+
```

States: approved public profile, unapproved hidden profile, voting open, voting closed, already voted, paid credits available, suspicious vote review, share copied.

## 7. Voting Page

```text
Path: /contests/[slug]/vote
Persona: Fan

+-----------------------------------------------------+
| Vote for Miss Medellin                              |
+-----------------------------------------------------+
| Voting window status: Open until 8:30 PM            |
| Contestant selected: [Name + photo]                 |
| [Free vote] [Buy vote pack]                         |
| Receipt panel after submit                          |
| hash: vote_...                                      |
+-----------------------------------------------------+
```

States: eligible, already voted, paid credits available, closed window, suspicious/review.

## 8. Contestant Private Profile Editor

```text
Path: /me/contestant-profile
Persona: Contestant

+-------------------------------------------------------------+
| Profile completion 72%                                      |
+---------------------------+---------------------------------+
| Fields                    | Review status                   |
| Name / bio / city         | Pending changes                 |
| Division / talent / links | Approved public version         |
| [Save draft] [Submit]     | Patricia feedback               |
+---------------------------+---------------------------------+
```

States: draft saved, submitted for review, approved, rejected with notes, locked during finals, missing required fields.

## 9. Contestant Photos

```text
Path: /me/contestant-profile/photos
Persona: Contestant

+-------------------------------------------------------------+
| Photo uploads                                               |
+---------------------------+---------------------------------+
| Upload dropzone           | Photo grid                      |
| Requirements              | Pending / approved / rejected   |
| Consent reminder          | Primary profile image selector  |
+---------------------------+---------------------------------+
```

States: no photos, upload progress, invalid file, pending review, approved, rejected, primary selected.

## 10. Contestant Coach And Prep Guide

```text
Path: /me/contestant-profile/coach
Persona: Contestant

+-------------------------------------------------------------+
| Contestant coach                                            |
+-------------------------------+-----------------------------+
| Chat                          | Next steps                  |
| "Improve my profile"          | Casting checklist           |
| "What should I prepare?"      | Events to attend            |
| "How do I promote my page?"   | Outfit/docs/photo tasks     |
+-------------------------------+-----------------------------+
```

States: profile incomplete, casting upcoming, rehearsal upcoming, finals week, promotion active, coach unavailable.

## 11. Patricia Admin Dashboard

```text
Path: /admin/contests
Persona: Patricia

+------------------------------------------------------------+
| Admin contests                                             |
+--------------+---------------------------------------------+
| Filters      | Table: Contest / Status / Votes / Revenue   |
| Status       | Actions: Review / Freeze / Publish          |
| Date         |                                             |
| Risk level   |                                             |
+--------------+---------------------------------------------+
```

Use TanStack Table or shadcn Table when installed. Required states: loading, empty, error, success, filtered no results.

## 12. Contestant Review Admin

```text
Path: /admin/contests/[id]/contestants
Persona: Patricia

+-------------------------------------------------------------+
| Contestants                                                 |
+--------------+-----------------------+----------------------+
| Filters      | Applications table    | Review drawer        |
| Status       | Name / source / risk  | Extracted fields     |
| Division     | Profile completeness  | Photos / notes       |
| Risk flags   | Actions               | Approve / edit / ask |
+--------------+-----------------------+----------------------+
```

States: pending applications, extraction failed, missing consent, approved, rejected, needs follow-up.

## 13. Vote Audit

```text
Path: /admin/contests/[id]/votes
Persona: Patricia

+-------------------------------------------------------------+
| Vote audit                                                  |
+--------------+-----------------------+----------------------+
| Filters      | Vote ledger table     | Review details       |
| Window/type  | Receipt / contestant  | Fraud signals        |
| Risk level   | Source / status       | Approve / hold       |
+--------------+-----------------------+----------------------+
```

States: normal, risk flagged, duplicate attempt, closed-window attempt, review decision locked.

## 14. Judge Scoring

```text
Path: /admin/contests/[id]/scores
Persona: Judge / Patricia

+-------------------------------------------------------------+
| Judge scoring                                               |
+---------------------------+---------------------------------+
| Contestant list           | Score grid                      |
| Round/category filters    | Criteria sliders/inputs         |
| Lock status               | [Submit scores] [Lock snapshot] |
+---------------------------+---------------------------------+
```

States: scoring not open, assigned judge, submitted, locked, Patricia overview, formula snapshot.

## 15. Sponsor CRM

```text
Path: /sponsors
Persona: Patricia

+-------------------------------------------------------------+
| Sponsors                                                    |
+--------------+-----------------------+----------------------+
| Pipeline     | Sponsor lead table    | AI proposal preview  |
| New          | Brand / fit / package | Draft only           |
| Qualified    | Status / next step    | Approve / edit       |
| Proposal     |                       |                      |
+--------------+-----------------------+----------------------+
```

MVP rule: no automatic outreach. AI proposal drafts only.

## 16. Sponsor Proposal Approval

```text
Path: /sponsors/proposals/[id]
Persona: Patricia

+-------------------------------------------------------------+
| Sponsor proposal                                            |
+-------------------------------+-----------------------------+
| Draft package                 | Approval controls           |
| Sponsor goals / fit evidence  | Edit / approve / reject     |
| Activation ideas              | Audit trail                 |
+-------------------------------+-----------------------------+
```

States: draft, edited, approved, rejected, exported, send-disabled.

## 17. Discovery Sandbox

```text
Path: /admin/discovery/contestants
Persona: Patricia

+-------------------------------------------------------------+
| Contestant discovery sandbox                                |
+--------------+-----------------------+----------------------+
| Query setup  | Lead results          | Invite draft         |
| Sources      | Name / source / risk  | Approval required    |
| Allowlist    | Evidence snippets     | No auto-send         |
+--------------+-----------------------+----------------------+
```

States: no search run, running, results ready, blocked source, invite draft pending approval, approved draft not sent.

## Mobile Notes

| Screen | Mobile behavior |
|---|---|
| Contest wizard | Stepper becomes top tabs; Copilot panel collapses into drawer. |
| Host contest list | Status filters become segmented control; rows become list cards. |
| Contest discovery | Search first, contest cards single column. |
| Public contest page | Hero, CTAs, contestant cards single column. |
| Contestant signup | Single-column form; extraction helper below fields or in drawer. |
| Contestant profile | Photo first, sticky vote/share bar, tabs collapse to segmented control. |
| Voting page | Sticky bottom vote button; receipt panel inline. |
| Private editor | Fields stack; review status becomes top alert; save/submit sticky bottom. |
| Photo uploads | One-column grid; upload controls stay at least 44px tall. |
| Coach | Chat first; prep checklist below or in sheet. |
| Admin tables | Priority columns only; detail drawer for row actions. |
| Sponsor CRM | Pipeline tabs above list; proposal preview in full-screen sheet. |
| Discovery sandbox | Query form first; results list; invite draft in full-screen sheet. |

## Responsive Validation

- Test widths: 375, 414, 768, 1024, 1440.
- No horizontal overflow on any screen.
- Touch targets at least 44px.
- Body text at least 16px and small text at least 14px.
- Tables convert to priority-card lists or use controlled horizontal scroll on mobile.
- Images use stable aspect-ratio containers and never stretch.
- Hero-scale type is reserved for public contest/profile pages, not admin tables or compact panels.
