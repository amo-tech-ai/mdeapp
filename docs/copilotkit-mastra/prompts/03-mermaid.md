Create Mermaid diagrams for an AI-native marketplace system that combines:

Events, rentals, venues, restaurants, cafes, bookings, Stripe, Supabase, CopilotKit, Mastra, ADK, and Google Maps.

## Goal

Show how the platform works across Core, MVP, and Advanced phases.

## Required diagrams

| # | Diagram | Mermaid Type | Purpose |
|---:|---|---|---|
| 1 | Full system architecture | flowchart | Show CopilotKit UI, Mastra agents, Supabase, Stripe, Maps, ADK, Gemini, MCP tools |
| 2 | User journey | journey | Show consumer searching, booking, paying, saving, and attending |
| 3 | Partner journey | journey | Show venue/rental/restaurant host onboarding and managing bookings |
| 4 | Data flow | sequenceDiagram | Show chat → CopilotKit → Mastra → tools → Supabase/Stripe/Maps |
| 5 | Booking flow | sequenceDiagram | Show user → booking request → Stripe payment → confirmation |
| 6 | Agent workflow | flowchart | Show routerAgent routing to eventAgent, rentalAgent, venueAgent, restaurantAgent, bookingAgent |
| 7 | ERD/data model | erDiagram | Show users, events, rentals, venues, restaurants, cafes, bookings, payments, tickets, leads |
| 8 | Approval flow | flowchart | Show AI proposal → human approval → database commit |
| 9 | Maps flow | flowchart | Show Google Maps/Places + ADK returning venues, cafes, restaurants, rentals |
| 10 | Roadmap | flowchart | Show Core → MVP → Advanced |

## Required phases

### Core
- Chat shell
- Event discovery
- Rental search
- Venue search
- Restaurant/cafe search
- Google Maps pins
- Supabase data
- Basic booking request

### MVP
- Stripe checkout
- Ticketing
- Partner onboarding
- Booking management
- Lead capture
- CRM
- Analytics chat
- Sponsor discovery

### Advanced
- ADK advanced tools
- MCP automations
- WhatsApp workflows
- Marketing automation
- Multi-agent collaboration
- Personalized recommendations
- AI revenue forecasting

## Required agents

- routerAgent
- eventAgent
- rentalAgent
- venueAgent
- restaurantAgent
- cafeAgent
- bookingAgent
- ticketingAgent
- partnerAgent
- crmAgent
- analyticsAgent
- sponsorAgent
- mapsAgent

## Output format

Return clean markdown.

Use one Mermaid code block per diagram.

Do not add unnecessary explanation.

Make diagrams production-focused and easy to understand.