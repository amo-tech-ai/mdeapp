Act as a Principal Product Manager, Chatwoot Architect, AI Systems Architect, Marketplace Strategist, and Technical Program Manager.

Research official Chatwoot documentation, GitHub repositories, APIs, Agent Bots, integrations, and Chatwoot Skills before generating recommendations.

Sources:

* https://www.chatwoot.com/
* https://www.chatwoot.com/features
* https://www.chatwoot.com/deploy
* https://www.chatwoot.com/help-center
* https://developers.chatwoot.com/api-reference/introduction
* https://www.chatwoot.com/hc/user-guide/en/categories/features-explained
* https://www.chatwoot.com/hc/user-guide/en/categories/advanced-features-explained
* https://www.chatwoot.com/hc/user-guide/en/categories/apps-and-integrations
* https://www.chatwoot.com/hc/user-guide/articles/1677497472-how-to-use-agent-bots
* https://github.com/chatwoot/chatwoot
* https://github.com/chatwoot/ai-agents
* https://github.com/chatwoot/chatwoot-sdk-python
* https://github.com/chatwoot/implementation-examples
* https://github.com/fazer-ai/chatwoot-skills

Current mdeai stack:

* Chatwoot
* WhatsApp Cloud API
* Instagram
* Facebook Messenger
* Mastra
* CopilotKit
* Gemini
* Google Maps
* Google Places
* Google Grounding
* Supabase
* pgvector
* Stripe
* OpenClaw
* n8n
* Hetzner
* Coolify

Business areas:

* Rentals
* Restaurants
* Cafes
* Nightlife
* Events
* Trips
* Concierge
* Relocation

Important Rules:

1. Do NOT over-engineer.
2. Do NOT design a complex multi-agent system unless justified.
3. Prefer simple workflows over advanced architecture.
4. Build the smallest MVP that can generate revenue.
5. Focus on implementation order and dependencies.
6. Recommend what NOT to build yet.
7. Prioritize WhatsApp-first user experience.
8. Use Chatwoot as the communication layer and Mastra as the AI brain.
9. Follow official Chatwoot best practices.
10. Optimize for speed, simplicity, maintainability, and production readiness.

Generate:

# Executive Summary

* Why Chatwoot
* Build vs Buy
* Strategic fit
* MVP recommendation

# PRD

Include:

* goals
* personas
* user stories
* success metrics
* requirements
* acceptance criteria

# Chatwoot Architecture

Show how Chatwoot integrates with:

* WhatsApp
* Instagram
* Facebook
* Mastra
* Supabase
* Stripe
* OpenClaw

Explain each integration.

# Core MVP (Build First)

Create a practical MVP plan only.

Include:

* WhatsApp channel
* Teams
* Agents
* Labels
* Custom attributes
* Contacts
* Agent Bot
* Webhooks
* Mastra integration
* Supabase lead storage
* Human handoff

For each feature:

* purpose
* use case
* real-world example
* business value

# MVP Workflows

Design only these workflows:

1. Rental lead
2. Restaurant booking request
3. Nightlife concierge
4. Event inquiry

For each workflow show:

* user flow
* Chatwoot flow
* Mastra flow
* Supabase flow
* human handoff

# Revenue MVP

Analyze:

* broker lead fees
* restaurant commissions
* nightclub commissions
* featured listings
* concierge services

Rank by:

* easiest to implement
* fastest revenue
* highest ROI

# Roadmap

Create concise phases:

## Phase 1 — Foundation

Chatwoot deployment
WhatsApp setup
Teams
Agents
Labels
Custom attributes

## Phase 2 — Core MVP

Agent Bot
Mastra integration
Lead routing
Supabase sync
Human handoff

## Phase 3 — Revenue MVP

Broker workflows
Restaurant workflows
Nightlife workflows
Stripe

## Phase 4 — Advanced

Instagram
Facebook
Automations
Analytics
Campaigns
OpenClaw

For each phase provide:

* objectives
* deliverables
* dependencies
* risks

# Implementation Tasks

Generate Linear-ready tasks.

For each task:

* ID
* title
* description
* dependencies
* acceptance criteria
* effort
* priority

# GitHub Repository Review

Review:

* chatwoot/chatwoot
* chatwoot/ai-agents
* chatwoot/chatwoot-sdk-python
* chatwoot/implementation-examples
* fazer-ai/chatwoot-skills

Explain:

* what each repo is for
* whether mdeai should use it
* implementation priority

# Final Recommendations

Provide:

* what to build now
* what to build later
* what to avoid
* biggest risks
* quickest path to production

Output should be:

* concise
* implementation focused
* dependency ordered
* roadmap driven
* production ready
* MVP first
* advanced later

Avoid unnecessary complexity and keep recommendations practical.
