import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { allowRateDurable } from "../_shared/rate-limit.ts";
import { insertAiRun, extractUsage } from "../_shared/ai-runs.ts";
import { safeJsonParse } from "../_shared/json.ts";
import { getUserClient, getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { fetchGemini, fetchGeminiStream } from "../_shared/gemini.ts";
import {
  type ToolExecutor,
  toolsArrayFromRegistry,
  dispatchTool,
} from "../_shared/tool-registry.ts";
import { buildLeadCaptureInsert } from "../_shared/leads-capture.ts";

/**
 * Human-readable persona per tool, used in the reasoning-trace header.
 * Mindtrip narrates "Handing off to our hotel agent…"; we do the same
 * but as a lightweight theater layer over the tool-registry pattern —
 * one LLM call under the hood, personas on the surface.
 */
const AGENT_LABELS: Record<string, string> = {
  rentals_search: "Rentals Concierge",
  rentals_intake: "Rentals Concierge",
  search_apartments: "Rentals Concierge",
  get_user_trips: "Trip Planner",
  get_user_bookings: "Booking Assistant",
  create_booking_preview: "Booking Assistant",
  capture_lead: "Lead Capture",
  search_events: "Events Guide",
  search_restaurants: "Restaurant Scout",
  search_attractions: "Attractions Guide",
};

/**
 * Build a compact "I considered N of M…" phase event from a tool result.
 * Returns null for tool results that don't fit the standard envelope
 * (e.g. booking preview, user trips list).
 */
function phaseNarrationFor(
  toolName: string,
  result: unknown,
  agentLabel: string,
): Record<string, unknown> | null {
  if (!result || typeof result !== "object" || Array.isArray(result)) return null;
  const r = result as Record<string, unknown>;
  if (typeof r.total_count === "number") {
    const total = r.total_count as number;
    if (total === 0) {
      return {
        phase: "thinking",
        agent_label: agentLabel,
        message: "No listings matched those criteria — widening search…",
      };
    }
    return {
      phase: "thinking",
      agent_label: agentLabel,
      message: `Considering ${total} match${total === 1 ? "" : "es"} in the database…`,
    };
  }
  if (r.error) {
    return {
      phase: "thinking",
      agent_label: agentLabel,
      message: `Tool returned an error: ${String(r.error).slice(0, 80)}`,
    };
  }
  return null;
}

// Strict caps limit prompt-injection surface and prevent token-burn attacks.
// Previous 500KB x 50 = 25MB was absurdly permissive.
//
// sessionData (chips): narrow jsonb mirrored from
// conversations.session_data.chat_context. Strictly-typed so client drift
// can't inject arbitrary keys into the system prompt.
const sessionDataSchema = z
  .object({
    neighborhood: z.string().trim().min(1).max(80).nullable().optional(),
    dates: z
      .object({
        start: z.string().trim().min(1).max(20).nullable().optional(),
        end: z.string().trim().min(1).max(20).nullable().optional(),
      })
      .nullable()
      .optional(),
    travelers: z.number().int().min(1).max(16).nullable().optional(),
    budget: z
      .object({
        min: z.number().min(0).max(100_000).nullable().optional(),
        max: z.number().min(0).max(100_000).nullable().optional(),
      })
      .nullable()
      .optional(),
    /** Last rental card IDs from OPEN_RENTALS_RESULTS (Proof 004 F9). */
    last_listing_ids: z.array(z.string().uuid()).max(20).optional(),
  })
  .passthrough();

const chatBodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system", "tool"]),
      content: z.string().min(1).max(8_000),
    }),
  ).min(1).max(20),
  tab: z.enum(["concierge", "trips", "explore", "bookings"]).optional().default("concierge"),
  conversationId: z.string().uuid().optional().nullable(),
  activeTripContext: z.record(z.unknown()).optional().nullable(),
  sessionData: sessionDataSchema.nullable().optional(),
});

type ChatSessionData = z.infer<typeof sessionDataSchema>;

/**
 * Format the sessionData chip bag into a compact system-prompt block.
 * Returns "" when nothing is set so the prompt isn't polluted with
 * "current filters: none". Every chip key is echoed exactly so Gemini
 * can quote them back in the "What I Searched For" section verbatim.
 */
function sessionContextBlock(data: ChatSessionData | null | undefined): string {
  if (!data) return "";
  const rows: string[] = [];
  if (data.neighborhood) rows.push(`- Neighborhood: ${data.neighborhood}`);
  if (data.dates && (data.dates.start || data.dates.end)) {
    const s = data.dates.start || "?";
    const e = data.dates.end || "?";
    rows.push(`- Dates: ${s} → ${e}`);
  }
  if (data.travelers != null) rows.push(`- Travelers: ${data.travelers}`);
  if (data.budget && (data.budget.min != null || data.budget.max != null)) {
    const mn = data.budget.min != null ? `$${data.budget.min}` : "any";
    const mx = data.budget.max != null ? `$${data.budget.max}` : "any";
    rows.push(`- Budget (USD/mo): ${mn}–${mx}`);
  }
  if (rows.length === 0) return "";
  return `\n\n🎯 CURRENT SEARCH CONTEXT (from chips):
${rows.join("\n")}

When calling rentals_search / search_apartments, inherit these values unless the user's latest message overrides them. Map chips → tool params: neighborhood → \`neighborhood\` (or \`neighborhoods: [neighborhood]\`); budget.min/max → \`min_price\`/\`max_price\` (or \`budget_min\`/\`budget_max\`); travelers → reasonable bedroom default (1–2 → 1BR, 3–4 → 2BR, ≥5 → 3BR+). Echo these back in the "What I Searched For" section so the user sees their chips were used.`;
}

/**
 * Tool registry — one entry per capability. Add a new vertical here with
 * { definition, execute } and it shows up in Gemini's tool list and the
 * dispatcher automatically. See tasks/CHAT-CENTRAL-PLAN.md §3.
 *
 * Executor functions are declared later in this file; TypeScript hoists
 * function declarations so forward-references work.
 */
const TOOLS: Record<string, ToolExecutor> = {
  rentals_search: {
    definition: {
      name: "rentals_search",
      description: "Search for apartment rentals in Medellín. Use this when users want to find an apartment, rental, or housing. Returns listings with freshness verification, map pins, and available filters.",
      parameters: {
        type: "object",
        properties: {
          neighborhoods: { type: "array", items: { type: "string" }, description: "Neighborhood names (e.g., ['El Poblado', 'Laureles', 'Envigado'])" },
          bedrooms_min: { type: "integer", description: "Minimum number of bedrooms (0 for studio)" },
          budget_min: { type: "number", description: "Minimum monthly price in USD" },
          budget_max: { type: "number", description: "Maximum monthly price in USD" },
          furnished: { type: "boolean", description: "Whether apartment should be furnished" },
          amenities: { type: "array", items: { type: "string" }, description: "Required amenities (e.g., ['wifi', 'parking', 'gym', 'pool', 'ac'])" },
          pets: { type: "boolean", description: "Whether pets are allowed" },
          verified_only: { type: "boolean", description: "Only show verified/active listings" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeRentalsSearch(ctx.params, ctx.authHeader),
  },
  rentals_intake: {
    definition: {
      name: "rentals_intake",
      description: "Collect rental search criteria through conversation. Use this when user mentions wanting an apartment but hasn't provided enough details. Returns either next questions to ask or a complete filter_json when ready to search.",
      parameters: {
        type: "object",
        properties: {
          user_message: { type: "string", description: "The user's latest message about their rental needs" },
          collected_criteria: { type: "object", description: "Criteria collected so far from previous messages" },
        },
        required: ["user_message"],
      },
    },
    execute: (ctx) => executeRentalsIntake(ctx.params, ctx.authHeader),
  },
  search_apartments: {
    definition: {
      name: "search_apartments",
      description: "Search for apartment rentals in Medellín by neighborhood, price range, or amenities.",
      parameters: {
        type: "object",
        properties: {
          neighborhood: { type: "string", description: "Neighborhood name (e.g., 'El Poblado', 'Laureles', 'Envigado')" },
          min_price: { type: "number", description: "Minimum monthly price in USD" },
          max_price: { type: "number", description: "Maximum monthly price in USD" },
          bedrooms: { type: "integer", description: "Number of bedrooms" },
          amenities: { type: "array", items: { type: "string" }, description: "Required amenities (e.g., ['WiFi', 'Pool', 'Gym'])" },
          limit: { type: "integer", description: "Maximum number of results to return (default: 5)" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeSearchApartments(ctx.params, ctx.supabase),
  },
  get_user_trips: {
    definition: {
      name: "get_user_trips",
      description: "Get the user's saved trips and itineraries.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["planning", "active", "completed"], description: "Filter by trip status" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeGetUserTrips(ctx.params, ctx.supabase, ctx.userId),
  },
  get_user_bookings: {
    definition: {
      name: "get_user_bookings",
      description: "Get the user's current and upcoming bookings.",
      parameters: {
        type: "object",
        properties: {
          booking_type: { type: "string", enum: ["apartment", "car", "restaurant", "event"], description: "Filter by booking type" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled"], description: "Filter by booking status" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeGetUserBookings(ctx.params, ctx.supabase, ctx.userId),
  },
  create_booking_preview: {
    definition: {
      name: "create_booking_preview",
      description: "Create a preview of a booking that the user can review before confirming. Returns booking details for user approval.",
      parameters: {
        type: "object",
        properties: {
          booking_type: { type: "string", enum: ["apartment", "car", "restaurant", "event"], description: "Type of booking" },
          resource_id: { type: "string", description: "ID of the resource to book (apartment, car, restaurant, or event)" },
          resource_title: { type: "string", description: "Name/title of the resource being booked" },
          start_date: { type: "string", description: "Start date in ISO format (YYYY-MM-DD)" },
          end_date: { type: "string", description: "End date in ISO format (YYYY-MM-DD), optional for single-day bookings" },
          party_size: { type: "integer", description: "Number of people (for restaurants/events)" },
          special_requests: { type: "string", description: "Any special requests or notes" },
        },
        required: ["booking_type", "resource_id", "resource_title", "start_date"],
      },
    },
    // Sync function — still return the expected Promise-compatible shape.
    execute: (ctx) => Promise.resolve(executeCreateBookingPreview(ctx.params, ctx.userId)),
  },
  capture_lead: {
    definition: {
      name: "capture_lead",
      description: "Save the user's contact details and housing intent when they express strong interest or provide their email/phone. Use this when: (1) user says 'contact me', 'I want to apply', 'send me details', (2) user provides email or phone number, (3) user has 3+ turns in a housing conversation and confirms interest. Do NOT use for casual browsing.",
      parameters: {
        type: "object",
        properties: {
          intent: {
            type: "string",
            enum: ["rental", "host", "buyer", "event_organizer", "sponsor"],
            description: "What the user is trying to accomplish",
          },
          email: { type: "string", description: "User email if provided in chat" },
          phone: { type: "string", description: "User phone number if provided" },
          name: { type: "string", description: "User name if provided" },
          neighborhood: { type: "string", description: "Neighborhood they are interested in" },
          budget_max: { type: "number", description: "Max monthly budget in USD" },
          move_in_date: { type: "string", description: "Desired move-in date (YYYY-MM-DD)" },
          listing_id: {
            type: "string",
            description: "Apartment UUID when user refers to a specific listing (e.g. first card)",
          },
        },
        required: ["intent"],
      },
    },
    execute: (ctx) =>
      executeCaptureLead(
        ctx.params,
        ctx.userId,
        ctx.conversationId ?? null,
        ctx.lastUserContent ?? "",
        ctx.lastListingIds ?? [],
      ),
  },
  search_events: {
    definition: {
      name: "search_events",
      description: "Search for events, concerts, festivals, and nightlife in Medellín. Use when users ask about things to do, events this weekend, concerts, festivals, parties, or local activities.",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string", description: "Search term (e.g., 'salsa', 'jazz', 'festival', 'art show')" },
          date_from: { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          date_to: { type: "string", description: "End date filter (YYYY-MM-DD)" },
          event_type: { type: "string", description: "Type of event (e.g., 'concert', 'festival', 'sports', 'nightlife')" },
          limit: { type: "integer", description: "Max results to return (default: 6)" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeSearchEvents(ctx.params, ctx.supabase),
  },
  search_restaurants: {
    definition: {
      name: "search_restaurants",
      description: "Search for restaurants, cafés, and dining in Medellín. Use when users ask about places to eat, restaurants in a neighborhood, food recommendations, brunch, dinner, or coffee spots.",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string", description: "Search term (e.g., 'Colombian', 'seafood', 'brunch', 'rooftop')" },
          neighborhood: { type: "string", description: "Neighborhood filter (e.g., 'El Poblado', 'Laureles', 'Provenza', 'Envigado')" },
          cuisine: { type: "string", description: "Cuisine type (e.g., 'Colombian', 'Italian', 'Japanese', 'vegetarian')" },
          price_level: { type: "integer", description: "Price level 1–4 (1=budget, 4=fine dining)" },
          limit: { type: "integer", description: "Max results to return (default: 6)" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeSearchRestaurants(ctx.params, ctx.supabase),
  },
  search_attractions: {
    definition: {
      name: "search_attractions",
      description: "Search for tourist attractions, activities, museums, tours, and things to do in Medellín. Use when users ask about sightseeing, museums, cable cars, parks, day trips, or activities.",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string", description: "Search term (e.g., 'museum', 'metro cable', 'nature', 'Pablo Escobar tour')" },
          category: { type: "string", description: "Category filter (e.g., 'museum', 'outdoor', 'cultural', 'tour', 'park')" },
          neighborhood: { type: "string", description: "Neighborhood or area filter" },
          limit: { type: "integer", description: "Max results to return (default: 6)" },
        },
        required: [],
      },
    },
    execute: (ctx) => executeSearchAttractions(ctx.params, ctx.supabase),
  },
};

// Gemini request format derived from the registry — single source of truth.
const tools = toolsArrayFromRegistry(TOOLS);

// System prompts for each tab/agent type - enhanced with tool awareness
const getSystemPrompt = (
  tab: string,
  tripContext?: { id: string; title: string; start_date: string; end_date: string; destination?: string } | null,
  sessionData?: ChatSessionData | null,
): string => {
  const sessionBlock = sessionContextBlock(sessionData);
  const tripInfo = tripContext 
    ? `\n\n🎯 ACTIVE TRIP CONTEXT:
The user is currently planning/viewing: "${tripContext.title}"
Dates: ${tripContext.start_date} to ${tripContext.end_date}
${tripContext.destination ? `Destination: ${tripContext.destination}` : 'Destination: Medellín, Colombia'}

When making recommendations, consider these trip dates and tailor suggestions accordingly.
When adding items to trips, use this trip ID: ${tripContext.id}`
    : '';

  const basePrompts: Record<string, string> = {
    concierge: `You are the mdeai.co AI Concierge — a friendly, knowledgeable local guide for Medellín.

⚠️ MANDATORY TOOL USE — You MUST call the appropriate tool before responding when the user asks about:
- Events, concerts, festivals, parties, nightlife, things to do → call search_events FIRST
- Restaurants, food, dining, cafés, brunch, coffee → call search_restaurants FIRST
- Tourist attractions, museums, tours, parks, sightseeing, day trips → call search_attractions FIRST
- Apartments, rentals, housing → call rentals_search or search_apartments FIRST

Do NOT answer events/restaurants/attractions/rentals questions from your own knowledge. Always search the database and show real listings.

Available tools:
- rentals_search / rentals_intake — apartment/housing search with filters, freshness, map pins
- search_apartments — quick apartment lookup by neighborhood, price, bedrooms, amenities
- search_events — concerts, festivals, nightlife, and local events
- search_restaurants — restaurants, cafés, dining
- search_attractions — museums, tours, parks, activities, sightseeing
- get_user_trips / get_user_bookings — recall the user's existing trips/bookings when they ask
- create_booking_preview — propose a booking for user approval (never auto-confirm)
- capture_lead — save user contact details when they want to be contacted (rentals only — see rules below)

LEAD CAPTURE RULES (important):
- Call capture_lead when: user says "contact me", "send me details", "I want to apply", or provides their email/phone number.
- Call capture_lead after 3+ turns if the user has confirmed strong interest in a specific listing or neighborhood.
- After capture_lead succeeds, say: "Perfect — I've saved your details. A local agent who specializes in [neighborhood] will reach out within 24 hours."
- Never ask for contact info unless the user has already expressed strong intent.

You can also answer local questions about:
- Neighborhoods (El Poblado, Laureles, Envigado, Provenza, Belén, Sabaneta)
- Safety, commute, Wi-Fi quality, expat/nomad areas
- Colombian culture, weather, cost of living

Be warm, helpful, conversational. Specific, actionable advice.${tripInfo}`,

    trips: `You are an mdeai.co Trip Planner. Help users add apartments and notes to their Medellín trips.

Tools:
- get_user_trips — view existing trips
- rentals_search / search_apartments — find apartments to add
- create_booking_preview — prepare a booking for user approval

Be specific with timing, neighborhoods, and budget. If you don't have the tool for something (e.g., a restaurant reservation), say so and offer to help with rentals or neighborhoods instead.${tripInfo}`,

    explore: `You are the mdeai.co Discovery Agent for Medellín rentals.

You MUST use the rental tools for real listings:
- rentals_search / rentals_intake — composite-scored listings with verification + filters
- search_apartments — direct query by neighborhood/price/bedrooms/amenities

For each recommendation include: neighborhood, monthly price (USD), bedrooms, and one standout detail (Wi-Fi Mbps, walkability, amenities). Ask a refining follow-up.${tripInfo}`,

    bookings: `You are the mdeai.co Booking Assistant. Help users manage rental bookings.

Tools:
- get_user_bookings — view existing bookings
- rentals_search / search_apartments — find bookable apartments
- create_booking_preview — show a booking preview for user approval

IMPORTANT: Always use create_booking_preview and WAIT for explicit user confirmation before any booking action. Never book without confirmation.${tripInfo}`,
  };

  const universalGuardrails = `

🛑 RESPONSE RULES (ALWAYS FOLLOW):

1. NEVER respond with an empty message. If you have nothing to say, ask a clarifying question.

2. If a tool returns an error, say so in one short sentence and suggest a next step.

3. If a tool returns no results (total_count=0), tell the user plainly, propose 1–2 ways to widen the search, and offer help in adjacent areas.

4. When a rental search returns results, structure your reply EXACTLY as these sections (markdown headings):

   **What I Searched For**
   - Location: [neighborhoods searched]
   - Criteria: [bedrooms / price range / amenities — whatever is relevant]
   - Dates: [if provided; if not, explicitly say "no dates specified — showing current inventory"]

   **Best Option**
   One sentence naming the top pick and why it stands out. The card itself renders below your text — don't repeat all its details.

   **Other Top Rentals**
   2–3 concise bullets — one line each, naming the property and one standout detail (fiber Wi-Fi, steps to Parque Lleras, below market, etc.). Cards render below.

   **Not a Good Fit** (only if the tool response included considered_but_rejected rows)
   One line introducing why these were considered but set aside. The rejection table renders below — don't repeat its contents.

   **Follow-up**
   One short refining question ("Want me to widen the budget?" / "Should I include Envigado?" / "Any specific amenities?").

5. Keep total length under 180 words. The UI renders the actual listing cards, the pins, the rejection table — your job is the narrative glue.

6. Respond in the user's language (English or Spanish). Default to English; switch fully if the user writes in Spanish.

7. If the user didn't provide dates, travelers, or budget, pick reasonable defaults (current month, 1 traveler, any budget) and disclose them in "What I Searched For". Never refuse to search for missing info — assume and disclose.`;

  return (basePrompts[tab] || basePrompts.concierge) + sessionBlock + universalGuardrails;
};

/**
 * Maps Grounding pre-pass — optional, feature-flagged (MDEAI_MAPS_GROUNDING=true).
 *
 * Uses Gemini's native generateContent endpoint with `tools: [{ googleMaps: {} }]`
 * and Medellín's lat/lng so location-aware queries return factually accurate place
 * data (opening hours, ratings, current addresses) from Google Maps.
 *
 * This runs BEFORE the main fetchGemini call and injects a grounded context block
 * into the system prompt. It is deliberately non-fatal — any failure returns null
 * and the main chat continues unaffected.
 *
 * API reference (MCP-verified 2026-05-15):
 *   https://ai.google.dev/gemini-api/docs/maps-grounding
 *   REST key: "googleMaps" (camelCase), not "google_maps"
 *   toolConfig.retrievalConfig.latLng for location context
 */
async function groundWithMaps(userMessage: string, apiKey: string): Promise<string | null> {
  // Pattern-gate: only trigger on queries with geographical / venue intent.
  // Avoids billing for general chat turns that don't need Maps data.
  const isLocationQuery =
    /\b(restaurant|caf[eé]|bar|club|museum|park|hotel|hostel|tour|tours|place|places|where|near|around|medellin|medell[ií]n|poblado|laureles|envigado|sabaneta|bel[eé]n|provenza|carnival|festival|nightlife|nightclub|coffee|brunch|dinner|lunch|eat|dining|attraction|activities|sightseeing)\b/i.test(
      userMessage,
    );
  if (!isLocationQuery) return null;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `In Medellín, Colombia: ${userMessage}` }],
            },
          ],
          // REST key is "googleMaps" (camelCase) — verified against Gemini API docs
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              // Medellín city center — provides local context for "near me" queries
              latLng: { latitude: 6.2442, longitude: -75.5812 },
            },
          },
          generationConfig: {
            // Short grounding snippet — injected into system prompt only
            maxOutputTokens: 400,
            temperature: 0.1,
          },
        }),
        // 8s hard cap — grounding is a pre-pass; main chat must start promptly
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!res.ok) {
      console.warn(`[maps-grounding] HTTP ${res.status} — grounding skipped`);
      return null;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string; thought?: boolean }> };
      }>;
    };

    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .filter((p) => !p.thought && typeof p.text === "string")
      .map((p) => p.text as string)
      .join("")
      .trim();

    return text.length > 20 ? text : null;
  } catch (err) {
    // AbortError (timeout) or network error — grounding is non-fatal
    console.warn(
      `[maps-grounding] ${err instanceof Error ? err.message : String(err)} — grounding skipped`,
    );
    return null;
  }
}

// Type alias for Supabase client (uses shared helpers from _shared/supabase-clients.ts)
type SupabaseClientType = ReturnType<typeof getUserClient>;

// Tool execution functions
async function executeSearchApartments(params: Record<string, unknown>, supabase: SupabaseClientType) {
  let query = supabase
    .from("apartments")
    .select("id, title, description, neighborhood, price_monthly, price_daily, bedrooms, bathrooms, amenities, rating, images, verified, source_url, latitude, longitude")
    .eq("status", "active");

  if (params.neighborhood) {
    query = query.ilike("neighborhood", `%${params.neighborhood}%`);
  }
  if (params.min_price) {
    query = query.gte("price_monthly", params.min_price);
  }
  if (params.max_price) {
    query = query.lte("price_monthly", params.max_price);
  }
  if (params.bedrooms) {
    query = query.eq("bedrooms", params.bedrooms);
  }

  const limit = (params.limit as number) || 5;
  // Over-fetch so we can surface "Not a Good Fit" transparency rows.
  const overfetch = limit + 5;
  query = query.order("rating", { ascending: false, nullsFirst: false }).limit(overfetch);

  const { data, error } = await query;
  if (error) throw error;

  const all = data ?? [];
  const listings = all.slice(0, limit);
  const rejectedCandidates = all.slice(limit, limit + 3);
  const topRating = (listings[0]?.rating as number | null | undefined) ?? null;
  const topPrice = (listings[0]?.price_monthly as number | null | undefined) ?? null;

  // Compose human-readable rejection reasons by comparing against the
  // top pick. For V1 we surface rating + price gaps; real production
  // reasons (wrong neighborhood, bad freshness, scam-flagged) come online
  // once the multi-source ingestion lands.
  const considered_but_rejected = rejectedCandidates.map((l) => {
    const reasons: string[] = [];
    const lRating = l.rating as number | null | undefined;
    if (lRating != null && topRating != null && lRating < topRating) {
      reasons.push(`${lRating}★ vs top pick's ${topRating}★`);
    }
    const lPrice = l.price_monthly as number | null | undefined;
    if (lPrice != null && topPrice != null && lPrice > topPrice) {
      reasons.push(
        `$${Number(lPrice).toLocaleString()}/mo vs top pick's $${Number(topPrice).toLocaleString()}/mo`,
      );
    }
    return {
      listing_summary: `${l.title} — ${l.neighborhood}`,
      reason: reasons.join("; ") || "Didn't rank in the top picks",
    };
  });

  // Translate tool params → ApartmentFilters shape consumed by /apartments?q=
  const filters: Record<string, unknown> = {};
  if (params.neighborhood) filters.neighborhoods = [params.neighborhood];
  if (params.bedrooms) filters.bedrooms = [params.bedrooms];
  if (params.min_price || params.max_price) {
    filters.priceRange = {
      min: (params.min_price as number) ?? 0,
      max: (params.max_price as number) ?? 10000,
    };
  }

  // Inline listing data for chat cards. Narrower than full Apartment type
  // to keep SSE payload small (only fields the card component needs).
  const inlineListings = listings.map((l) => ({
    id: l.id,
    title: l.title,
    neighborhood: l.neighborhood,
    price_monthly: l.price_monthly,
    price_daily: l.price_daily,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    rating: l.rating,
    amenities: l.amenities,
    images: l.images,
    verified: l.verified,
    source_url: l.source_url,
    description: l.description,
    latitude: l.latitude,
    longitude: l.longitude,
  }));

  // Return the "action envelope" shape so the client can render inline
  // rental cards, the "See all on the map →" button, AND the "Not a Good
  // Fit" transparency table.
  return {
    success: true,
    total_count: listings.length,
    considered: all.length,
    listings,
    considered_but_rejected,
    filters_applied: params,
    actions: listings.length > 0
      ? [{
          type: "OPEN_RENTALS_RESULTS",
          payload: {
            filters,
            listing_ids: listings.map((l) => l.id),
            listings: inlineListings,
            considered_but_rejected,
            considered: all.length,
          },
        }]
      : [],
    message: listings.length > 0
      ? `Found ${listings.length} apartments${params.neighborhood ? ` in ${params.neighborhood}` : ""}.`
      : "No apartments matched those criteria. Try widening the price range or a different neighborhood.",
  };
}

async function executeGetUserTrips(params: Record<string, unknown>, supabase: SupabaseClientType, userId: string | null) {
  if (!userId) {
    return { error: "User not authenticated. Please log in to view your trips." };
  }

  let query = supabase
    .from("trips")
    .select("id, name, description, start_date, end_date, status, destination")
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (params.status) {
    query = query.eq("status", params.status);
  }

  query = query.order("start_date", { ascending: true }).limit(10);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function executeGetUserBookings(params: Record<string, unknown>, supabase: SupabaseClientType, userId: string | null) {
  if (!userId) {
    return { error: "User not authenticated. Please log in to view your bookings." };
  }

  let query = supabase
    .from("bookings")
    .select("id, booking_type, resource_title, start_date, end_date, status, total_price, party_size")
    .eq("user_id", userId);

  if (params.booking_type) {
    query = query.eq("booking_type", params.booking_type);
  }
  if (params.status) {
    query = query.eq("status", params.status);
  }

  query = query.order("start_date", { ascending: true }).limit(10);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

function executeCreateBookingPreview(params: Record<string, unknown>, userId: string | null) {
  if (!userId) {
    return { 
      error: "User not authenticated. Please log in to create bookings.",
      requires_login: true 
    };
  }

  // Return a preview that the user can approve
  return {
    preview: true,
    message: "🎫 **Booking Preview** - Please review and confirm:",
    booking_details: {
      type: params.booking_type,
      resource_id: params.resource_id,
      resource_name: params.resource_title,
      start_date: params.start_date,
      end_date: params.end_date || params.start_date,
      party_size: params.party_size || 1,
      special_requests: params.special_requests || null,
    },
    action_required: "Reply 'confirm' to proceed with this booking, or 'cancel' to discard.",
    note: "This is a preview only. No booking has been made yet."
  };
}

// Execute rentals search by calling the rentals Edge Function.
// Forwards the caller's auth header so the rentals function can validate the JWT
// (rentals fn runs supabase.auth.getUser(token), which rejects the service_role key with 401).
// Falls back to anon key when the caller is unauthenticated (public searches allowed).
async function executeRentalsSearch(
  params: Record<string, unknown>,
  authHeader: string | null,
) {
  console.log("Executing rentals_search with params:", params);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const forwardedAuth = authHeader ?? `Bearer ${anonKey}`;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": forwardedAuth,
        "apikey": anonKey,
      },
      body: JSON.stringify({
        action: "search",
        filter_json: params,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Rentals search error:", errorText);
      return { error: "Failed to search rentals", details: errorText };
    }
    
    const result = await response.json();
    const listings = result.results?.listings ?? [];
    const listing_ids = listings.map((l: { id: string }) => l.id);

    // Format for chat display
    return {
      success: true,
      total_count: result.results?.total_count || 0,
      listings: listings.slice(0, 5),
      filters_applied: params,
      actions: listings.length > 0
        ? [{
            type: "OPEN_RENTALS_RESULTS",
            payload: {
              filters: params,
              listings,
              listing_ids,
              map_pins: result.map_data?.pins,
            },
          }]
        : [],
      message: result.results?.total_count > 0 
        ? `Found ${result.results.total_count} apartments matching your criteria.`
        : "No apartments found matching your criteria. Try adjusting your filters."
    };
  } catch (error) {
    console.error("Rentals search error:", error);
    return { error: "Failed to search rentals", details: String(error) };
  }
}

// Execute rentals intake for conversational criteria collection.
// Same auth-forwarding rule as executeRentalsSearch.
async function executeRentalsIntake(
  params: Record<string, unknown>,
  authHeader: string | null,
) {
  console.log("Executing rentals_intake with params:", params);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const forwardedAuth = authHeader ?? `Bearer ${anonKey}`;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": forwardedAuth,
        "apikey": anonKey,
      },
      body: JSON.stringify({
        action: "intake",
        user_message: params.user_message,
        context: {
          collected_criteria: params.collected_criteria || {},
          message_history: [],
        },
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Rentals intake error:", errorText);
      return { error: "Failed to process rental inquiry", details: errorText };
    }
    
    const result = await response.json();
    
    // Return structured response for the chat
    return {
      status: result.status,
      filter_json: result.filter_json,
      next_questions: result.next_questions,
      ready_to_search: result.status === "complete",
      summary: result.summary,
    };
  } catch (error) {
    console.error("Rentals intake error:", error);
    return { error: "Failed to process rental inquiry", details: String(error) };
  }
}

async function executeCaptureLead(
  params: Record<string, unknown>,
  userId: string | null,
  conversationId: string | null,
  lastUserContent: string,
  lastListingIds: string[],
): Promise<unknown> {
  const serviceClient = getServiceClient();
  const { enrichCaptureLeadParams } = await import("../_shared/lead-listing-context.ts");
  const enriched = enrichCaptureLeadParams(params, lastUserContent, lastListingIds);
  const intent = enriched.intent as string;
  if (!intent) {
    return { error: "Failed to save lead", details: "intent is required" };
  }

  const row = buildLeadCaptureInsert({
    userId,
    conversationId,
    intent,
    email: typeof enriched.email === "string" ? enriched.email : null,
    phone: typeof enriched.phone === "string" ? enriched.phone : null,
    name: typeof enriched.name === "string" ? enriched.name : null,
    neighborhood: typeof enriched.neighborhood === "string" ? enriched.neighborhood : null,
    budget_max: typeof enriched.budget_max === "number" ? enriched.budget_max : null,
    move_in_date: typeof enriched.move_in_date === "string" ? enriched.move_in_date : null,
    listing_id: typeof enriched.listing_id === "string" ? enriched.listing_id : null,
  });

  const { data: lead, error } = await serviceClient
    .from("leads")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("capture_lead insert error:", error);
    return { error: "Failed to save lead", details: error.message };
  }

  const loggedEmail = typeof row.email === "string" ? row.email : "—";
  console.log(`[capture_lead] saved lead ${lead.id} | intent=${intent} | email=${loggedEmail}`);

  return {
    message: "Lead saved. An agent will reach out within 24 hours.",
    lead_id: lead.id,
    actions: [
      {
        type: "OPEN_LEAD_CAPTURED",
        payload: {
          lead_id: lead.id,
          message: "Agent notified — someone will reach out within 24h.",
        },
      },
    ],
  };
}

async function executeSearchEvents(params: Record<string, unknown>, supabase: SupabaseClientType) {
  let query = supabase
    .from("events")
    .select("id, name, event_type, subcategory, address, city, event_start_time, ticket_price_min, currency, primary_image_url, ticket_url, latitude, longitude, event_venues(name)")
    .eq("is_active", true)
    .gte("event_start_time", new Date().toISOString());

  if (params.keyword) {
    query = query.ilike("name", `%${params.keyword}%`);
  }
  if (params.date_from) {
    // Medellín local time (UTC-5) — Gemini emits YYYY-MM-DD intending local-day boundaries
    query = query.gte("event_start_time", `${params.date_from}T00:00:00-05:00`);
  }
  if (params.date_to) {
    query = query.lte("event_start_time", `${params.date_to}T23:59:59-05:00`);
  }
  if (params.event_type) {
    query = query.ilike("event_type", `%${params.event_type}%`);
  }

  const limit = (params.limit as number) || 6;
  query = query.order("event_start_time", { ascending: true }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const events = data ?? [];
  const inlineListings = events.map((e) => ({
    id: e.id,
    title: e.name,
    category: (e.event_type || e.subcategory || "Event") as string,
    venue: (() => {
      const v = e.event_venues as unknown as { name: string } | { name: string }[] | null;
      const venueName = Array.isArray(v) ? v[0]?.name : v?.name;
      return (venueName || e.address || "Medellín") as string;
    })(),
    neighborhood: (e.city || "Medellín") as string,
    startsAt: e.event_start_time as string,
    pricePerTicket: e.ticket_price_min != null ? Number(e.ticket_price_min) : null,
    currency: (e.currency || "USD") as string,
    imageUrl: e.primary_image_url ?? null,
    sourceUrl: e.ticket_url ?? null,
    latitude: e.latitude != null ? Number(e.latitude) : null,
    longitude: e.longitude != null ? Number(e.longitude) : null,
  }));

  return {
    success: true,
    total_count: events.length,
    actions: events.length > 0
      ? [{ type: "OPEN_EVENT_RESULTS", payload: { filters: params, listings: inlineListings } }]
      : [],
    message: events.length > 0
      ? `Found ${events.length} event${events.length === 1 ? "" : "s"}.`
      : "No upcoming events found for those criteria. Try different dates or a broader keyword.",
  };
}

async function executeSearchRestaurants(params: Record<string, unknown>, supabase: SupabaseClientType) {
  let query = supabase
    .from("restaurants")
    .select("id, name, cuisine_types, city, price_level, ambiance, primary_image_url, website, rating, latitude, longitude")
    .eq("is_active", true);

  if (params.keyword) {
    query = query.ilike("name", `%${params.keyword}%`);
  }
  if (params.neighborhood) {
    query = query.ilike("city", `%${params.neighborhood}%`);
  }
  if (params.cuisine) {
    query = query.contains("cuisine_types", [params.cuisine as string]);
  }
  if (params.price_level) {
    query = query.eq("price_level", params.price_level as number);
  }

  const limit = (params.limit as number) || 6;
  query = query.order("rating", { ascending: false, nullsFirst: false }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const restaurants = data ?? [];
  const priceTierMap: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

  const inlineListings = restaurants.map((r) => ({
    id: r.id,
    name: r.name as string,
    cuisine: Array.isArray(r.cuisine_types) && (r.cuisine_types as string[]).length > 0
      ? (r.cuisine_types as string[]).join(", ")
      : "Local",
    neighborhood: (r.city || "Medellín") as string,
    priceTier: priceTierMap[r.price_level as number] ?? null,
    avgPricePerPerson: null,
    rating: r.rating != null ? Number(r.rating) : null,
    vibe: Array.isArray(r.ambiance) ? r.ambiance as string[] : null,
    imageUrl: r.primary_image_url ?? null,
    sourceUrl: r.website ?? null,
    latitude: r.latitude != null ? Number(r.latitude) : null,
    longitude: r.longitude != null ? Number(r.longitude) : null,
  }));

  return {
    success: true,
    total_count: restaurants.length,
    actions: restaurants.length > 0
      ? [{ type: "OPEN_RESTAURANT_RESULTS", payload: { filters: params, listings: inlineListings } }]
      : [],
    message: restaurants.length > 0
      ? `Found ${restaurants.length} restaurant${restaurants.length === 1 ? "" : "s"}.`
      : "No restaurants found for those criteria. Try a different neighborhood or cuisine type.",
  };
}

async function executeSearchAttractions(params: Record<string, unknown>, supabase: SupabaseClientType) {
  let query = supabase
    .from("tourist_destinations")
    .select("id, name, category, subcategory, city, entry_fee_amount, tags, best_for, primary_image_url, website, rating, latitude, longitude")
    .eq("is_active", true);

  if (params.keyword) {
    query = query.ilike("name", `%${params.keyword}%`);
  }
  if (params.category) {
    query = query.ilike("category", `%${params.category}%`);
  }
  if (params.neighborhood) {
    // city is always "Medellín" — also search address so "El Poblado" etc. resolve
    query = query.or(
      `city.ilike.%${params.neighborhood}%,address.ilike.%${params.neighborhood}%`
    );
  }

  const limit = (params.limit as number) || 6;
  query = query.order("rating", { ascending: false, nullsFirst: false }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const attractions = data ?? [];
  const inlineListings = attractions.map((a) => ({
    id: a.id,
    name: a.name as string,
    category: (a.category || a.subcategory || "Attraction") as string,
    neighborhood: (a.city || "Medellín") as string,
    priceUsd: a.entry_fee_amount != null ? Number(a.entry_fee_amount) : null,
    durationMinutes: null,
    rating: a.rating != null ? Number(a.rating) : null,
    tags: Array.isArray(a.tags) && (a.tags as string[]).length > 0
      ? a.tags as string[]
      : Array.isArray(a.best_for) ? a.best_for as string[] : null,
    imageUrl: a.primary_image_url ?? null,
    sourceUrl: a.website ?? null,
    latitude: a.latitude != null ? Number(a.latitude) : null,
    longitude: a.longitude != null ? Number(a.longitude) : null,
  }));

  return {
    success: true,
    total_count: attractions.length,
    actions: attractions.length > 0
      ? [{ type: "OPEN_ATTRACTION_RESULTS", payload: { filters: params, listings: inlineListings } }]
      : [],
    message: attractions.length > 0
      ? `Found ${attractions.length} attraction${attractions.length === 1 ? "" : "s"}.`
      : "No attractions found for those criteria. Try a different keyword or category.",
  };
}

// Execute a tool call via the registry. Adding a new tool = add an entry to
// TOOLS above; no changes here. Errors are swallowed into a safe response so
// Gemini's tool-response handling stays sane.
async function executeTool(
  toolName: string,
  params: Record<string, unknown>,
  supabase: SupabaseClientType,
  userId: string | null,
  authHeader: string | null,
  conversationId: string | null,
  lastUserContent: string,
  lastListingIds: string[],
): Promise<unknown> {
  console.log(`Executing tool: ${toolName}`, params);
  return dispatchTool(TOOLS, toolName, {
    params,
    supabase,
    userId,
    authHeader,
    conversationId,
    lastUserContent,
    lastListingIds,
  });
}

function parseToolArguments(args: string | undefined): Record<string, unknown> {
  const parsed = safeJsonParse(args ?? "{}");
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed as Record<string, unknown>
    : {};
}

Deno.serve(async (req) => {
  const jr = (body: Record<string, unknown>, status = 200) =>
    jsonResponse(body, status, req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jr(errorBody("METHOD_NOT_ALLOWED", "Use POST"), 405);
  }

  const startTime = Date.now();
  const authHeader = req.headers.get("Authorization");
  // User client for RLS-scoped queries; service client for logging + internal calls
  const supabase = authHeader ? getUserClient(authHeader) : getServiceClient();
  const userId = await getUserId(authHeader);

  // Anonymous-visitor gate: accept a client-generated anon_session_id (UUID)
  // in the `X-Anon-Session-Id` header so the server can enforce a small free
  // quota before requiring email sign-in. Tradeoff: clearing localStorage
  // refreshes the quota (acceptable for MVP; server-signed cookies are the
  // hardening path). The ANON_MESSAGE_LIMIT * ANON_WINDOW_SECONDS bounds the
  // Gemini bill at ANON_LIMIT × Gemini cost × unique-visitor count.
  const ANON_MESSAGE_LIMIT = 3;
  const ANON_WINDOW_SECONDS = 24 * 60 * 60; // 24h rolling (fixed window)
  const AUTHED_MESSAGE_LIMIT = 10;
  const AUTHED_WINDOW_SECONDS = 60; // per minute

  let rateKey: string;
  let limit: number;
  let windowSeconds: number;
  let isAnon = false;

  if (userId) {
    rateKey = `ai-chat:${userId}`;
    limit = AUTHED_MESSAGE_LIMIT;
    windowSeconds = AUTHED_WINDOW_SECONDS;
  } else {
    // Try the anon path. Requires X-Anon-Session-Id; anything else is rejected.
    const anonSessionId = req.headers.get("X-Anon-Session-Id")?.trim();
    if (!anonSessionId || anonSessionId.length < 8 || anonSessionId.length > 64) {
      return jr(
        errorBody(
          "UNAUTHORIZED",
          "Please sign in to chat. AI features require authentication.",
        ),
        401,
      );
    }
    rateKey = `ai-chat:anon:${anonSessionId}`;
    limit = ANON_MESSAGE_LIMIT;
    windowSeconds = ANON_WINDOW_SECONDS;
    isAnon = true;
  }

  const rl = await allowRateDurable(getServiceClient(), rateKey, limit, windowSeconds);
  if (!rl.allowed) {
    // Differentiate the two exhaustion cases — the client uses the code to
    // choose between "slow down" toast (authed) and email-gate modal (anon).
    if (isAnon) {
      return jr(
        {
          success: false,
          error: {
            code: "ANON_LIMIT_EXCEEDED",
            message: `You've used your ${ANON_MESSAGE_LIMIT} free messages. Sign in with email to keep chatting.`,
            retry_after_seconds: rl.retry_after_seconds,
          },
        },
        402,
      );
    }
    return jr(
      errorBody(
        "RATE_LIMIT",
        `Too many requests. Retry in ${rl.retry_after_seconds}s.`,
      ),
      429,
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jr(errorBody("BAD_REQUEST", "Invalid JSON body"), 400);
  }

  const bodyParsed = chatBodySchema.safeParse(raw);
  if (!bodyParsed.success) {
    return jr(
      errorBody("VALIDATION_ERROR", "Invalid request", bodyParsed.error.flatten()),
      400,
    );
  }

  const { messages, tab, conversationId, activeTripContext, sessionData } = bodyParsed.data;
  const { extractListingIdsFromSession } = await import("../_shared/lead-listing-context.ts");
  const lastListingIds = extractListingIdsFromSession(
    sessionData as Record<string, unknown> | null | undefined,
  );
  const lastUserContent = (messages[messages.length - 1]?.content ?? "") as string;

  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    return jr(errorBody("SERVER_CONFIG", "GEMINI_API_KEY is not configured"), 500);
  }

  try {
    const systemPrompt = getSystemPrompt(
      tab,
      activeTripContext as Parameters<typeof getSystemPrompt>[1],
      sessionData ?? null,
    );

    const aiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages,
    ];

    console.log(
      `AI Chat request - Tab: ${tab}, Messages: ${messages.length}, User: ${userId || "anonymous"}`,
    );

    // Force the right tool when keywords are unambiguous (rentals before events — see chat-tool-choice.ts).
    const { buildToolChoice } = await import("../_shared/chat-tool-choice.ts");
    const toolChoice = buildToolChoice(lastUserContent);

    // Maps Grounding pre-pass (MDEAI_MAPS_GROUNDING=true — off by default).
    // Runs BEFORE fetchGemini; injects live Maps context into the system prompt.
    // Non-fatal: if grounding times out or fails, chat proceeds without it.
    if (Deno.env.get("MDEAI_MAPS_GROUNDING") === "true") {
      const groundedContext = await groundWithMaps(lastUserContent, GEMINI_API_KEY);
      if (groundedContext) {
        console.log(`[maps-grounding] injected ${groundedContext.length} chars of Maps context`);
        // Append to the system message so Gemini can cite Maps sources inline
        aiMessages[0] = {
          ...aiMessages[0],
          content:
            aiMessages[0].content +
            `\n\n🗺️ LIVE MAPS CONTEXT (grounded from Google Maps — cite these facts when relevant):\n${groundedContext}`,
        };
      }
    }

    const initialResponse = await fetchGemini({
      model: "gemini-3-flash-preview",
      messages: aiMessages,
      tools: tools,
      tool_choice: toolChoice,
      temperature: 0.7,
      max_tokens: 2000,
    }, 30_000);

    if (!initialResponse.ok) {
      const errorText = await initialResponse.text();
      console.error("AI gateway error:", initialResponse.status, errorText);
      // Diag: snip a short prefix of the upstream body so 502 / UPSTREAM_ERROR
      // responses carry enough to triage (auth, quota, safety block, model
      // name typo, etc.) without leaking the whole payload.
      const upstreamSnippet = errorText.slice(0, 240);

      // Log error to ai_runs so cost + failure rate stay observable.
      // Skip for anon (ai_runs.user_id is NOT NULL; anon sessions don't have one).
      if (userId) {
        await insertAiRun(getServiceClient(), {
          user_id: userId,
          agent_name: "multi_agent_chat",
          agent_type: "general_concierge",
          input_data: {
            tab,
            conversationId: conversationId ?? null,
            messageCount: messages.length,
          },
          output_data: { upstream_status: initialResponse.status },
          duration_ms: Date.now() - startTime,
          status: initialResponse.status === 429 ? "timeout" : "error",
          model_name: "gemini-3-flash-preview",
          error_message: errorText.slice(0, 500),
        });
      }

      if (initialResponse.status === 429) {
        return jr(
          errorBody("RATE_LIMIT", "Rate limit exceeded. Please try again later."),
          429,
        );
      }

      if (initialResponse.status === 402) {
        return jr(
          errorBody("PAYMENT_REQUIRED", "AI credits exhausted. Please add credits to continue."),
          402,
        );
      }

      return jr(
        errorBody("UPSTREAM_ERROR", "AI gateway error", {
          upstream_status: initialResponse.status,
          upstream_body: upstreamSnippet,
        }),
        502,
      );
    }

    const initialData = await initialResponse.json();
    const assistantMessage = initialData.choices?.[0]?.message;
    const initialUsage = extractUsage(initialData);

    // Log AI run with real token counts from Gemini's usage block.
    // Logged via service client so RLS on ai_runs never blocks telemetry
    // writes. Skip anon (ai_runs.user_id is NOT NULL).
    if (userId) {
      await insertAiRun(getServiceClient(), {
        user_id: userId,
        agent_name: "multi_agent_chat",
        agent_type: "general_concierge",
        input_data: {
          tab,
          conversationId: conversationId ?? null,
          messageCount: messages.length,
          anon: isAnon,
        },
        output_data: {
          toolCallCount: assistantMessage?.tool_calls?.length ?? 0,
          streaming: true,
          phase: "initial_call",
        },
        duration_ms: Date.now() - startTime,
        status: "success",
        model_name: "gemini-3-flash-preview",
        input_tokens: initialUsage.input_tokens,
        output_tokens: initialUsage.output_tokens,
        total_tokens: initialUsage.total_tokens,
      });
    }

    const sseHeaders = {
      ...getCorsHeaders(req),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log(`AI requested ${assistantMessage.tool_calls.length} tool call(s)`);

      // Accumulate actions emitted by tools so we can prepend them as an SSE
      // sidecar event before Gemini's final text stream begins.
      const collectedActions: Array<Record<string, unknown>> = [];
      // Accumulate phase events — each tool call produces a "handoff" phase
      // with the persona label, followed by a "thinking" phase once results
      // come back. Streamed to the client alongside actions so the reasoning
      // trace renders above the final AI message.
      const collectedPhases: Array<Record<string, unknown>> = [];

      const toolResults = await Promise.all(
        assistantMessage.tool_calls.map(
          async (toolCall: {
            id: string;
            function: { name: string; arguments: string };
          }) => {
            const params = parseToolArguments(toolCall.function.arguments);
            const agentLabel = AGENT_LABELS[toolCall.function.name] ?? "Concierge";
            collectedPhases.push({
              phase: "handoff",
              agent_label: agentLabel,
              message: `Handing off to ${agentLabel}…`,
            });
            const result = await executeTool(
              toolCall.function.name,
              params,
              supabase,
              userId,
              authHeader,
              conversationId ?? null,
              lastUserContent,
              lastListingIds,
            );
            // After the tool returns, narrate a compact summary using the
            // response envelope fields (total_count, considered, etc).
            const narration = phaseNarrationFor(toolCall.function.name, result, agentLabel);
            if (narration) collectedPhases.push(narration);
            // Extract structured actions from the tool envelope (if any)
            if (
              result && typeof result === "object" && !Array.isArray(result) &&
              Array.isArray((result as { actions?: unknown }).actions)
            ) {
              for (const a of (result as { actions: Record<string, unknown>[] }).actions) {
                collectedActions.push(a);
              }
            }
            return {
              tool_call_id: toolCall.id,
              role: "tool" as const,
              content: JSON.stringify(result),
            };
          },
        ),
      );

      const messagesWithTools = [
        ...aiMessages,
        assistantMessage,
        ...toolResults,
        // Explicit instruction prevents Gemini from hallucinating a second
        // tool call in the streaming pass when tool results are sparse.
        {
          role: "user" as const,
          content: "Based on the search results above, write a helpful conversational response for the user. Do not call any functions. Respond in plain text only.",
        },
      ];

      const finalResponse = await fetchGeminiStream({
        model: "gemini-3-flash-preview",
        messages: messagesWithTools,
        temperature: 0.7,
        max_tokens: 2000,
      }, 30_000);

      if (!finalResponse.ok) {
        const t = await finalResponse.text();
        console.error("Final stream error:", finalResponse.status, t);
        return jr(
          errorBody("UPSTREAM_ERROR", "Failed to get final AI response after tool execution"),
          502,
        );
      }

      // Prepend SSE sidecar events (phases + actions) before piping Gemini's
      // stream. The client parser (useChat.ts) looks for `phase` or
      // `mdeai_actions` on any data event and dispatches them independently
      // of Gemini's `choices[].delta.content` chunks.
      if ((collectedPhases.length > 0 || collectedActions.length > 0) && finalResponse.body) {
        const encoder = new TextEncoder();
        const merged = new ReadableStream<Uint8Array>({
          async start(controller) {
            // 1) Phase events in order — reasoning trace
            for (const p of collectedPhases) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(p)}\n\n`));
            }
            // 2) Actions sidecar — inline cards + "See all →" button
            if (collectedActions.length > 0) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ mdeai_actions: collectedActions })}\n\n`,
              ));
            }
            // 3) Then Gemini's normal content stream
            const reader = finalResponse.body!.getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(value);
              }
            } finally {
              controller.close();
              reader.releaseLock();
            }
          },
        });
        return new Response(merged, { headers: sseHeaders });
      }

      return new Response(finalResponse.body, { headers: sseHeaders });
    }

    // No tool calls — convert the already-received response to SSE format
    // instead of making a redundant second streaming call.
    const content = assistantMessage?.content || "";
    console.log(`No tool calls — returning direct response (${content.length} chars)`);

    const encoder = new TextEncoder();
    const sseBody = new ReadableStream({
      start(controller) {
        // Emit the content in a single SSE chunk matching OpenAI format
        const chunk = {
          choices: [{ delta: { content }, index: 0, finish_reason: null }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        // Send the done signal
        const doneChunk = {
          choices: [{ delta: {}, index: 0, finish_reason: "stop" }],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(doneChunk)}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(sseBody, { headers: sseHeaders });
  } catch (error) {
    console.error("Chat error:", error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    // Best-effort error log; never throws since insertAiRun swallows errors.
    // Skip anon (ai_runs.user_id is NOT NULL).
    if (userId) {
      await insertAiRun(getServiceClient(), {
        user_id: userId,
        agent_name: "multi_agent_chat",
        agent_type: "general_concierge",
        input_data: {
          tab,
          conversationId: conversationId ?? null,
          messageCount: messages.length,
        },
        output_data: { phase: "exception" },
        duration_ms: Date.now() - startTime,
        status: "error",
        model_name: "gemini-3-flash-preview",
        error_message: errMsg.slice(0, 500),
      });
    }
    return jr(errorBody("INTERNAL", errMsg), 500);
  }
});
