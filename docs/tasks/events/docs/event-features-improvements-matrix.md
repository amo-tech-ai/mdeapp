---
title: mdeai Event Platform — Features and Improvements Matrix
updated: 2026-05-27
status: Product planning reference
canonical_index: ../INDEX.md
related_review: ./luma-inspired-event-ux-review.md
---

# mdeai Event Platform — Features and Improvements Matrix

## Product Thesis

mdeai should not be only an event-card or ticketing product. The moat is:

```text
AI-powered human connection in Medellin
```

The product should combine event discovery, map intelligence, community context, host interaction, attendee visibility, and concierge-style planning.

## Feature Matrix

| Category | Feature | Core / Advanced | AI Agent Role | Real-World Value | Task Coverage |
|---|---|---|---|---|---|
| Discovery | AI event search chat | Core | Concierge Agent | "Find AI networking events in Poblado tonight" | EVP-004, EVP-005, EVP-037 |
| Discovery | Event vibe tags | Core | Classification Agent | Users instantly understand atmosphere | EVP-033 |
| Discovery | Smart recommendations | Core | Recommendation Agent | Suggests events based on interests/history | EVP-042 |
| Discovery | Nearby attractions | Core | Maps + Grounding Agent | Rooftops, coworking, cafes nearby | EVP-036, EVP-043 |
| Discovery | Neighborhood intelligence | Core | Geo Agent | Explains Laureles vs Poblado vibe | EVP-043 |
| Discovery | Event compatibility score | Advanced | Matching Agent | "92% match for startup founders" | EVP-042, EVP-038 |
| Discovery | AI itinerary builder | Advanced | Planning Agent | Full night plans around events | EVP-047 |
| Discovery | Hidden/local experiences | Advanced | Discovery Agent | Underground startup meetups and art nights | EVP-015, EVP-017, EVP-038 |
| Event Experience | Ask the host chat | Core | Host Assistant Agent | "Can beginners attend?" | EVP-034 |
| Event Experience | AI instant answers | Core | FAQ Agent | Drafts common answers from approved context | EVP-034 |
| Event Experience | Event summaries | Core | Summary Agent | "Best for founders and marketers" | EVP-033 |
| Event Experience | Attendee categories | Core | Audience Analysis Agent | Founders, creators, investors | EVP-035 |
| Event Experience | Live event updates | Core | Notification Agent | Room changes, schedule changes | EVP-046 |
| Event Experience | Networking rooms | Advanced | Matching Agent | AI founders table, creator table | EVP-039 |
| Event Experience | AI introductions | Advanced | Social Graph Agent | Suggest who to meet | EVP-038 |
| Event Experience | AI icebreakers | Advanced | Conversation Agent | Personalized starters | EVP-038 |
| Event Experience | Real-time event chat | Advanced | Community Agent | Live attendee discussion | EVP-039 |
| Event Experience | Event memory recap | Advanced | Memory Agent | Summarizes post-event connections | EVP-040, EVP-041 |
| Maps + Nearby | Nearby restaurants | Core | Places Agent | Dinner after networking | EVP-036 |
| Maps + Nearby | Rooftop recommendations | Core | Geo Lifestyle Agent | Best rooftop near venue | EVP-036, EVP-043 |
| Maps + Nearby | Nearby coworking spaces | Core | Remote Work Agent | Nomad-friendly before event | EVP-036, EVP-043 |
| Maps + Nearby | Safe walking routes | Core | Maps Safety Agent | Safer late-night movement | EVP-043 |
| Maps + Nearby | Traffic + ride estimates | Core | Transit Agent | Time to venue | EVP-043 |
| Maps + Nearby | Weather-aware suggestions | Core | Weather Agent | Indoor backup if raining | EVP-043 |
| Maps + Nearby | Nearby events | Advanced | Event Discovery Agent | Cross-promote experiences | EVP-047 |
| Maps + Nearby | Full city nightlife graph | Advanced | Urban Intelligence Agent | Discover hotspots dynamically | EVP-047, OCL tasks |
| Social + Community | Community groups | Core | Community Agent | Long-term engagement | EVP-044 |
| Social + Community | WhatsApp integration | Core | Messaging Agent | LATAM-native communication | EVP-044 |
| Social + Community | Follow-up reminders | Core | CRM Agent | "Message Sarah after event?" | EVP-040 |
| Social + Community | AI-generated follow-ups | Advanced | Relationship Agent | Draft LinkedIn/WhatsApp messages | EVP-040 |
| Social + Community | Friend attendance | Advanced | Social Agent | "3 friends attending" | EVP-041 |
| Social + Community | Relationship memory | Advanced | Memory Agent | Remembers prior event connections | EVP-041 |
| Social + Community | AI networking coach | Advanced | Coaching Agent | Suggests who to approach | EVP-038 |
| Social + Community | Reputation badges | Advanced | Trust Agent | Founder, investor, connector badges | EVP-041 |
| Host + Organizer | AI event creation | Core | Host Event Agent | Generates title/description | EVP-009, EVP-010 |
| Host + Organizer | Smart pricing suggestions | Core | Pricing Agent | Recommends ticket pricing | EVP-045 |
| Host + Organizer | AI sponsor suggestions | Advanced | Sponsor Matching Agent | Finds aligned sponsors | EVP-029, OCL-019/OCL-031 |
| Host + Organizer | Attendee analytics | Core | Analytics Agent | Audience breakdown | EVP-035 |
| Host + Organizer | Event heatmaps | Advanced | Maps Analytics Agent | Crowd movement visualization | EVP-041 / future |
| Host + Organizer | AI moderation | Core | Safety Agent | Filters spam/scams | EVP-045 |
| Host + Organizer | Auto social posting | Advanced | Content Agent | Instagram/LinkedIn promotion | EVP-030, OCL-035 |
| Host + Organizer | Sponsor ROI reports | Advanced | ROI Agent | Conversion metrics for sponsors | EVP-029, OCL-024 |

## Information To Show Users

| Information | Why It Matters | MVP Task |
|---|---|---|
| Event vibe | Emotional decision-making | EVP-033 |
| Expected audience | Networking targeting | EVP-035 |
| Language spoken | Critical for expats | EVP-033 / EVP-034 |
| Solo-friendly rating | Reduces anxiety | EVP-033 / EVP-034 |
| Dress code | Reduces uncertainty | EVP-034 |
| Networking intensity | Casual vs serious business | EVP-033 |
| Age range | Social compatibility, privacy-thresholded | EVP-035 |
| Founder/investor density | Startup targeting | EVP-035 / EVP-038 |
| Music/noise level | Preference matching | EVP-033 |
| Venue style | Rooftop, luxury, casual, creative | EVP-033 / EVP-036 |
| Wi-Fi availability | Nomad audience | EVP-036 |
| Best arrival time | Better experience | EVP-046 |
| Nearby nightlife | Continue the social flow | EVP-036 / EVP-047 |
| Safety notes | Medellin-specific trust | EVP-043 |
| Transportation options | Ease of attendance | EVP-043 |
| Community overlap | Shared interests/groups | EVP-044 / EVP-041 |

## Nearby Suggestions System

| Moment | Suggestions | Task |
|---|---|---|
| Before event | Coworking, cafes, dinner, parking, Metro access | EVP-036, EVP-043 |
| During event | Networking zones, quiet spaces, sponsor booths, meetup recommendations | EVP-046, EVP-039 |
| After event | Rooftops, salsa, afterparties, late-night food, nearby social venues | EVP-047 |

## High-Value AI Flows

| Flow | Why Powerful | Task |
|---|---|---|
| "Who should I meet?" | Immediate networking value | EVP-038 |
| "What events fit my goals?" | Personalized discovery | EVP-037, EVP-042 |
| "Plan my night in Medellin" | Concierge moat | EVP-047 |
| "Find investors attending" | Startup-focused networking | EVP-035, EVP-038 |
| "Help me follow up after event" | Relationship retention | EVP-040 |
| "Find nearby hidden gems" | Local intelligence advantage | EVP-036, EVP-047 |
| "Generate sponsor pitch deck" | B2B monetization | EVP-029, OCL-032 |
| "Summarize everyone I met" | Memory + CRM moat | EVP-040, EVP-041 |

## MVP Priorities

Ship first:

1. AI event concierge.
2. Event cards + maps.
3. Ask Host chat.
4. Nearby recommendations.
5. Attendee categories.
6. AI summaries.
7. WhatsApp/community links.

Ship second:

1. AI matchmaking.
2. Live event chat.
3. AI introductions.
4. Networking groups.
5. Follow-up assistant.

Ship later:

1. Relationship memory graph.
2. Sponsor intelligence.
3. Autonomous outreach.
4. Advanced analytics.
5. OpenClaw automations.

## Architecture Boundaries

- Supabase owns event, ticket, attendee, host, Q&A, community, and audit truth.
- Stripe owns money.
- Mastra orchestrates agents and workflows.
- CopilotKit renders conversational UI and approval cards.
- Google Maps/Places/Routes/Grounding provide geo intelligence.
- AI may recommend, classify, summarize, and draft.
- AI must not publish, price, charge, message, moderate-ban, or expose private attendee data without deterministic controls and human approval.
