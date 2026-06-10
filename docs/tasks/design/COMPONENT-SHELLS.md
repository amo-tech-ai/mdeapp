---
title: Reusable Component Shells — mdeai design system
updated: 2026-06-08
owner: sanjiovani
scope: 5 shared shells that collapse ~40 screens into templates. Design contract only — no app code here.
tokens: DESIGN.MD (light luxury · oklch · teal primary + gold accent)
installed_primitives: D-07 (SAN-573) → tabs · command · avatar · carousel · sonner · sidebar
existing: ResultCardShell + BrowseLayout already shipped in D-08 (SAN-574)
---

# Reusable Component Shells

> **Build templates, not pages.** These 5 shells turn the backlog from ~40 bespoke screens into 5 components + props. Already shipped: **`ResultCardShell`** + **`BrowseLayout`** (D-08 / [SAN-574](https://linear.app/sanjiovani/issue/SAN-574)) and **`VenueDetailSheet`** ([SAN-245](https://linear.app/sanjiovani/issue/SAN-245)). The 5 below are net-new.
>
> Convention: compose from `src/components/ui/*` (shadcn base-nova). Only `npx shadcn add` the missing primitives noted. Pull layout blocks from 21st.dev, then re-token to DESIGN.MD (no hardcoded grays). WCAG 2.2: 24px min target, `:focus-visible` ring, `prefers-reduced-motion`, skeletons over spinners.

---

## 1 · `MarketingPageShell`

**One template for ~15 marketing/landing pages.** Section-slot composition.

```
<MarketingPageShell
  nav={<MarketingNav/>}              footer={<MarketingFooter/>}
  accent="gold|magenta|terracotta|caramel|teal"
  sections=[ Hero, FeatureGrid, HowItWorks, SocialProof, PricingTeaser, FAQ, CTABand ]  // pick + order per page
/>
```

| Sub-block | shadcn/ui | 21st.dev | Notes |
|---|---|---|---|
| `MarketingNav` | `navigation-menu` `button` | sticky transparent→solid nav | shared across all marketing routes |
| `Hero` | `button` `badge` | hero-with-radial / split-hero | accent radial; primary (accent) + ghost CTA |
| `FeatureGrid` | `card` `badge` | bento / 3-up feature cards | icon + head + body |
| `HowItWorks` | `card` `separator` | numbered steps | 3 steps |
| `SocialProof` | — | logo-marquee + stats band | `prefers-reduced-motion` fallback for marquee |
| `PricingTeaser` | `card` `badge` | pricing tier cards | links `/pricing` |
| `FAQ` | `accordion` | accordion FAQ | optional |
| `CTABand` | `button` | CTA section | lead `source` per page |
| `MarketingFooter` | `separator` | footer-columns | product · partners · legal · social |

**Consumers:** [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) hub · [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) /host · [SAN-661](https://linear.app/sanjiovani/issue/SAN-661) /venues · [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) /partners/rentals · [SAN-712](https://linear.app/sanjiovani/issue/SAN-712)/[713](https://linear.app/sanjiovani/issue/SAN-713)/[714](https://linear.app/sanjiovani/issue/SAN-714) venue landings · [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) /contact · [SAN-662](https://linear.app/sanjiovani/issue/SAN-662) /about · [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) /sponsors · [SAN-663](https://linear.app/sanjiovani/issue/SAN-663) /business/ai · [SAN-726](https://linear.app/sanjiovani/issue/SAN-726) /business · [SAN-695](https://linear.app/sanjiovani/issue/SAN-695) /pricing.
**Build first in:** [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) (current branch).

---

## 2 · `DashboardShell`

**Role-aware sidebar + tabbed modules.** Tab set computed from enabled services.

```
<DashboardShell
  brand={partner} role="restaurant|cafe|nightclub|host|broker|sponsor|vendor|admin"
  tabs=[Overview, Leads, Bookings, Revenue, Campaigns, Analytics, Reviews, Automations, AI, Opportunities]  // filtered by role
  topbar={<CompletionRing/> <AskAI/>}
/>
```

| Sub-block | shadcn/ui | 21st.dev | Notes |
|---|---|---|---|
| Sidebar | `sidebar` ✅ | dashboard sidebar | off-canvas drawer on mobile |
| Tabs | `tabs` ✅ | — | role-filtered |
| KPI row | `card` | stat-card row | `StatCard` ×N |
| Completion | `progress` | ring | "next best actions" (AI) |
| Topbar | `avatar` ✅ `dropdown-menu` | — | org switcher |
| Per-tab states | `skeleton` `alert` | — | loading/empty/error each tab |

**Consumers:** [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) partner dashboard · [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) /host/events · [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) admin events · [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) admin leads · [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) admin bookings · vendor dashboard (ECOM-M-004).
**Build first in:** [SAN-690](https://linear.app/sanjiovani/issue/SAN-690).

---

## 3 · `DataTable`

**Sortable / filterable / paginated table with row actions + drawer.** Wraps TanStack Table over shadcn `table`.

```
<DataTable columns=[…] data=[…] filterBy=[status, kind] rowAction={(row)=><HITLDrawer/>} empty={<EmptyState/>} />
```

| Concern | shadcn/ui | 21st.dev | Notes |
|---|---|---|---|
| Table | `table` + TanStack Table | data-table-with-row-actions | sort + column filters |
| Row drawer | `sheet`/`drawer` | side-drawer | HITL approve/edit/send |
| Toolbar | `input` `select` `button` | table toolbar | filter chips |
| States | `skeleton` `alert` | — | loading/empty/error |

**Consumers:** [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) leads CRM · [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) events queue · [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) booking queue · [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) event-request queue · [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) host events · partner-dashboard Leads/Bookings tabs · vendor orders.

---

## 4 · `FormKit`

**RHF + Zod + shadcn `Field` form factory.** One pattern for every form (locked stack per VEN-017 spec).

```
<FormKit schema={zodSchema} fields=[…] onSubmit={…} consent />   // RHF useForm + zodResolver, shadcn FieldGroup/Field
```

| Concern | shadcn/ui | Notes |
|---|---|---|
| Fields | `form` `field` `input` `textarea` `select` `checkbox` `radio-group` `label` | `data-invalid`/`aria-invalid` on fail |
| Date/time | `calendar` / date-picker | booking forms |
| Submit states | `button` `alert` `sonner` | idle/submitting/success/error |

**Locked stack:** react-hook-form + `@hookform/resolvers` + zod + shadcn `field`. **Do not use** TanStack Form / Formisch / multi-step in Phase 1 (per VEN-017).
**Consumers:** [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) VenueBookingSheet · [SAN-262](https://linear.app/sanjiovani/issue/SAN-262) schedule-viewing · [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) request-proposal · [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) contact · [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) signup steps · [SAN-661](https://linear.app/sanjiovani/issue/SAN-661)/[660](https://linear.app/sanjiovani/issue/SAN-660) demo forms.

---

## 5 · `WizardShell`

**Stepper + progress + per-step validation + optional HITL.** Wraps FormKit per step.

```
<WizardShell steps=[…] progress co-pilot? renderAndWaitForResponse?={hitlStep} />
```

| Concern | shadcn/ui | 21st.dev | Notes |
|---|---|---|---|
| Stepper | `progress` + stepper | multi-step stepper | step indicator |
| Step body | FormKit | — | reuses #4 |
| HITL | CopilotKit `renderAndWaitForResponse` | — | host wizard / approval |
| Nav | `button` | — | back/next/skip |

**Consumers:** [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) partner signup ✅(v1) · [SAN-240](https://linear.app/sanjiovani/issue/SAN-240) host event wizard ✅ · [SAN-269](https://linear.app/sanjiovani/issue/SAN-269) onboarding · [SAN-500](https://linear.app/sanjiovani/issue/SAN-500)/[513](https://linear.app/sanjiovani/issue/SAN-513) host venue step.

---

## Build order (maximize reuse)

1. **`MarketingPageShell`** → in [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) (unblocks ~11 landings).
2. **`DashboardShell` + `DataTable`** → in [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) (unblocks partner dashboard + 3 admin queues + host/vendor).
3. **`FormKit`** → in [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) (also fixes the VEN-017 RHF-refactor gap; unblocks all forms).
4. **`WizardShell`** → extract from shipped [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) signup wizard.

> **Already shared (do not rebuild):** `ResultCardShell`, `BrowseLayout`, `FilterBar`, `VenueCard` ([SAN-574](https://linear.app/sanjiovani/issue/SAN-574)) · `VenueDetailSheet` ([SAN-245](https://linear.app/sanjiovani/issue/SAN-245)) · empty/loading/error states (SCREEN-019).
