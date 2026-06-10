Act as a Principal Product Manager, SaaS Founder, Chatwoot Solutions Architect, AI Systems Architect, CRM Specialist, WhatsApp Automation Expert, Marketplace Strategist, and Technical Program Manager.

Your task is to create a complete Product Requirements Document (PRD), Technical Architecture, Roadmap, Data Model, Agent Design, Workflow Architecture, Revenue Model, and Implementation Plan for Chatwoot within the mdeai platform.

Before generating the PRD:

1. Perform deep research using official Chatwoot documentation.
2. Review all Chatwoot features.
3. Review Chatwoot API capabilities.
4. Review Chatwoot channels.
5. Review Chatwoot automation capabilities.
6. Review Agent Bots.
7. Review advanced features.
8. Review integrations.
9. Review Chatwoot GitHub repositories.
10. Review Chatwoot Skills repository.

Research Sources:

Official Docs

* https://www.chatwoot.com/
* https://www.chatwoot.com/features
* https://www.chatwoot.com/deploy
* https://www.chatwoot.com/help-center
* https://developers.chatwoot.com/api-reference/introduction
* https://www.chatwoot.com/hc/user-guide/en/categories/features-explained
* https://www.chatwoot.com/hc/user-guide/en/categories/advanced-features-explained
* https://www.chatwoot.com/hc/user-guide/en/categories/apps-and-integrations
* https://www.chatwoot.com/hc/user-guide/articles/1677497472-how-to-use-agent-bots
* https://www.chatwoot.com/hc/user-guide/articles/1677778588-how-to-setup-a-facebook-channel
* https://www.chatwoot.com/hc/user-guide/articles/1677829420-how-to-setup-an-instagram-channel
* https://www.chatwoot.com/hc/user-guide/articles/1677832735-how-to-setup-a-whats_app-channel
* https://www.chatwoot.com/pricing/self-hosted-plans

GitHub

* https://github.com/chatwoot/chatwoot
* https://github.com/chatwoot
* https://github.com/chatwoot/chatwoot/releases
* https://github.com/chatwoot/chatwoot-mobile-app
* https://github.com/chatwoot/cli
* https://github.com/chatwoot/docs
* https://github.com/chatwoot/ai-agents
* https://github.com/chatwoot/chatwoot-sdk-python
* https://github.com/chatwoot/implementation-examples
* https://github.com/fazer-ai/chatwoot-skills

Use Chatwoot Skills as implementation guidance and best practices.

Current mdeai Stack:

* Next.js
* CopilotKit
* Mastra
* Gemini
* Google ADK
* Google Maps
* Google Places
* Search Grounding
* Grounding Lite
* Supabase
* pgvector
* Stripe
* Chatwoot
* WhatsApp Cloud API
* Instagram
* Facebook Messenger
* OpenClaw
* n8n
* Hetzner
* Coolify

Business Domains:

* Rentals
* Restaurants
* Cafes
* Nightlife
* Events
* Trips
* Concierge Services
* Relocation Services

Create the following:

# Executive Summary

* Why Chatwoot
* Build vs Buy analysis
* Strategic benefits
* Risks
* ROI

# Product Vision

Design a GuideGeek-style WhatsApp-first AI Concierge Platform powered by Chatwoot.

Explain:

* user experience
* conversational UX
* human + AI model
* concierge workflows
* marketplace workflows

# Complete PRD

Include:

* objectives
* goals
* non-goals
* personas
* user stories
* requirements
* success metrics
* KPIs
* acceptance criteria

# Chatwoot Architecture

Design:

User
→ WhatsApp / Instagram / Facebook / Website
→ Chatwoot
→ Mastra
→ Google Maps / Places / Grounding
→ Supabase
→ Stripe
→ OpenClaw
→ Human Concierge

Explain all integrations.

# Channel Strategy

Analyze:

* WhatsApp
* Instagram DM
* Facebook Messenger
* Website Chat Widget

For each:

* purpose
* use cases
* implementation priority
* conversion opportunities

# Core Chatwoot Features (MVP)

Analyze and recommend:

* Inboxes
* Contacts
* Teams
* Labels
* Custom Attributes
* Notes
* Assignments
* Routing
* Conversation Status
* Macros
* Canned Responses
* Business Hours
* API
* Webhooks

For each feature provide:

* purpose
* use case
* real-world example
* implementation priority

# Advanced Chatwoot Features

Analyze:

* Agent Bots
* AI Agents
* Automation Rules
* Campaigns
* CSAT
* SLA
* Audit Logs
* Analytics
* Mobile Apps
* Captain AI
* Required Attributes
* Custom Dashboards

Classify:

* MVP
* Post-MVP
* Advanced

# Agent Architecture

Design:

* Router Agent
* Rental Agent
* Restaurant Agent
* Nightlife Agent
* Event Agent
* Concierge Agent
* Booking Agent
* Broker Agent
* Memory Agent
* Operations Agent

For each agent include:

* responsibilities
* tools
* inputs
* outputs
* handoff rules
* workflows

# Workflow Architecture

Create detailed workflows for:

1. Rental Lead
2. Restaurant Reservation
3. Nightlife Concierge
4. Event Ticketing
5. Relocation Assistance
6. VIP Concierge

Show:

* User flow
* Chatwoot flow
* Mastra flow
* Supabase flow
* Human handoff flow

# Supabase Architecture

Design schema for:

* users
* contacts
* conversations
* leads
* rentals
* restaurants
* events
* bookings
* venue_signals
* itineraries
* concierge_requests
* payments
* ai_memory
* embeddings

Include:

* relationships
* indexes
* vector search opportunities

# Revenue Architecture

Analyze:

* broker lead fees
* restaurant commissions
* nightclub commissions
* event commissions
* featured listings
* sponsored placements
* concierge subscriptions
* relocation packages
* premium memberships

For each:

* implementation complexity
* revenue potential
* MVP vs advanced

# Booking Architecture

Explain:

* Stripe
* Chatwoot
* Mastra
* OpenClaw

Workflows for:

* restaurant bookings
* rental viewings
* VIP tables
* event tickets

# OpenClaw Strategy

Analyze:

* where to use OpenClaw
* where NOT to use OpenClaw
* browser automation opportunities
* rental aggregation
* concierge automation
* booking automation

# CopilotKit Integration

Design:

* AI search
* conversational UI
* maps integration
* recommendation cards
* saved places
* concierge panel

# GitHub Repository Analysis

Review:

* chatwoot/chatwoot
* chatwoot/ai-agents
* chatwoot/chatwoot-sdk-python
* chatwoot/implementation-examples
* fazer-ai/chatwoot-skills

Explain:

* what each repo provides
* how mdeai should use it
* implementation priority

# Roadmap

Create:

Phase 1 — Foundation
Phase 2 — Core MVP
Phase 3 — Revenue MVP
Phase 4 — Intelligence Layer
Phase 5 — Automation Layer
Phase 6 — Advanced Concierge Platform

For each phase include:

* goals
* deliverables
* dependencies
* risks
* milestones

# Implementation Tasks

Generate:

* epics
* initiatives
* milestones
* Linear-ready tasks

For every task include:

* ID
* title
* description
* dependencies
* acceptance criteria
* effort
* priority

# Production Readiness

Create:

* deployment checklist
* security checklist
* monitoring checklist
* backup strategy
* disaster recovery plan
* testing strategy

# Final Deliverables

Provide:

1. Complete PRD
2. Technical Architecture
3. Agent Architecture
4. Workflow Diagrams
5. Data Model
6. Revenue Model
7. Roadmap
8. Task Breakdown
9. Production Checklist
10. Recommended Implementation Order

Focus on:

* WhatsApp-first UX
* GuideGeek-style concierge experience
* Chatwoot best practices
* Official documentation alignment
* Fast MVP execution
* Revenue generation
* Scalability
* Production readiness
* Long-term maintainability

Generate tables, diagrams, workflows, roadmap phases, implementation tasks, and recommendations.
