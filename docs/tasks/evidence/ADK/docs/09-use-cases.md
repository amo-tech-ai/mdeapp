|#|Feature|What it does|Real-world mdeai use case|Example|Score /100|
|---|---|---|---|---|--:|
|1|**Google Maps Grounding**|Gemini answers using live Google Maps place data|Restaurant, venue, tourism, rentals nearby intelligence|“Best cafés near Laureles with Wi-Fi”|**98**|
|2|**Grounded Place Recommendations**|AI recommends real places instead of hallucinations|Concierge recommendations|“Romantic dinner near Provenza”|**97**|
|3|**Nearby Search Intelligence**|Geographic proximity reasoning|Apartment enrichment|“Gyms within walking distance of this rental”|**96**|
|4|**Place Details Integration**|Ratings, hours, reviews, addresses, photos|Rich venue/event cards|“Fashion venue open late with parking”|**95**|
|5|**Search + Maps Combined Grounding**|Combines web search with maps context|Live event discovery|“Events tonight near El Poblado”|**95**|
|6|**Itinerary Generation**|AI creates geographically optimized plans|Tourist concierge|“3-day Medellín itinerary”|**94**|
|7|**Neighborhood Intelligence**|AI reasons about areas and lifestyle fit|Rental concierge|“Laureles vs Poblado for nomads”|**94**|
|8|**Route & Distance Awareness**|Understands travel time and movement|Event + tourism planning|“Restaurants within 10 minutes of venue”|**93**|
|9|**Grounded Citations & Attribution**|Shows trusted sources/places|Trust + anti-hallucination UX|“Why this café was recommended”|**92**|
|10|**Live Local Discovery**|Uses current Maps ecosystem data|Real-time concierge|“Quiet brunch spots open now”|**92**|

# Best mdeai use cases

|mdeai feature|Why grounding is powerful|
|---|---|
|Rentals|Nearby cafés, coworking, gyms, nightlife|
|Restaurants|Real ratings + reviews + hours|
|Events|Live venue + nightlife discovery|
|Tourism|Smart itineraries + routes|
|Concierge chat|Real local intelligence|
|Maps pins|Grounded map experiences|
|Neighborhood guides|Geographic reasoning|
|Event planning|Venue + logistics intelligence|
|Digital nomad assistant|Lifestyle-aware recommendations|
|“What’s nearby?” UX|Core conversational maps feature|

# Strongest benefits

|Benefit|Impact|
|---|---|
|Less hallucination|Huge|
|Real-time place awareness|Huge|
|Better local recommendations|Huge|
|Geographic reasoning|Huge|
|Better user trust|Huge|
|Better tourism UX|Huge|
|Better conversational maps|Huge|

# Best architecture for mdeai

```text
CopilotKit UI
    ↓
Mastra orchestration
    ↓
Google Maps Grounding tools
    ↓
Gemini reasoning
    ↓
Supabase cache + business logic
```

# Overall rating for mdeai

|Area|Score|
|---|--:|
|Tourism concierge|99/100|
|Restaurant discovery|98/100|
|Neighborhood intelligence|97/100|
|Event discovery|95/100|
|Rental enrichment|96/100|
|Conversational maps|99/100|
|Local AI assistant|98/100|
|Production readiness|85/100 (code) · **42/100** (deploy — see below)|
|Mastra compatibility|90/100|
|Full mdeai fit|**96/100**|

### Production readiness (2026-05-25)

| Dimension | Score | Notes |
|-----------|------:|-------|
| Code / MAP-002 contract | **88** | Sidecar + Mastra client fail-closed |
| Vercel `ADK_GROUNDING_URL` | **20** | Not set → localhost on prod |
| Cloud Run plan | **Ready** | [`12-cloud-run-production-plan.md`](./12-cloud-run-production-plan.md) |
| **Overall prod ADK** | **42** → **~82** after ADK-CR-04–06 |

**Go/no-go for www grounded maps:** **NO** until Cloud Run + Vercel env. **Canonical host:** Cloud Run ([adk.dev/deploy/cloud-run](https://adk.dev/deploy/cloud-run/)), not VPS.

For mdeai specifically, Google Maps Grounding is probably one of the highest-leverage AI features you can add because your product is fundamentally:

```text
local conversational intelligence
+
maps
+
real-world places
+
live recommendations
```