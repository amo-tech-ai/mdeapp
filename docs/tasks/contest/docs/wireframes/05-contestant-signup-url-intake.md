---
title: Contestant Signup And URL Intake Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-05
path: /contests/[slug]/signup
persona: Contestant
task: CTEST-008
phase: MVP
repo_refs:
  - Firecrawl
  - OpenClaw Web Scraper Plugin
  - shadcn React Hook Form docs
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/api/grounding/event-web/route.ts
  - /home/sk/mdeai/mdeapp/src/mastra/tools/search-web-grounded-events.ts
  - /home/sk/mdeai/mdeapp/src/components/ui/input.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/button.tsx
---

# Contestant Signup And URL Intake

## Purpose

A contestant applies, optionally provides a public Instagram/profile URL, reviews extracted profile suggestions, and confirms consent.

## Wireframe

```text
+------------------------------------------------------------------+
| Apply for Miss Medellin                                          |
+------------------------------+-----------------------------------+
| Application form             | Profile draft helper              |
| Name, email, phone           | Public URL input                  |
| Division, city, attendance   | Extract button                    |
| Consent checkboxes           | Suggested name/bio/photos        |
| Submit application           | Risk flags and confirm fields    |
+------------------------------+-----------------------------------+
```

## Components And Code To Use

- Use shadcn `Form`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Button`, `Card`, `Badge`.
- Use React Hook Form and Zod.
- Use Firecrawl for allowed public extraction. OpenClaw is sandbox/post-MVP only and must not access login-gated Instagram.
- Store extraction as a reviewable draft, not public content.

## States

Empty form, URL extraction pending, extraction failed, low confidence extraction, consent missing, submitted, duplicate application, auth optional/required.

## Responsive

Desktop uses two panels. Mobile shows the form first and opens extraction review in a `Sheet` after URL processing.

## Tests / Proof

Form validation, URL extraction fallback, consent-required test, mobile sheet screenshot, source/risk flag persistence proof.

## Confidence

High for MVP with Firecrawl and manual fallback. Instagram extraction remains limited to public, allowed content.
