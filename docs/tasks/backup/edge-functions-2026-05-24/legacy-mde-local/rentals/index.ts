import { createClient } from "npm:@supabase/supabase-js@2";
import { allowRateDurable, clientIp } from "../_shared/rate-limit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FilterJson {
  move_in_date?: string;
  stay_length_months?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  neighborhoods?: string[];
  furnished?: boolean;
  amenities?: string[];
  work_needs?: string[];
  pets?: boolean;
  safety_vibe?: string;
  utilities_included?: boolean;
  parking?: boolean;
  verified_only?: boolean;
}

interface IntakeResult {
  filter_json: FilterJson | null;
  next_questions: string[] | null;
  ready_to_search: boolean;
  reasoning?: string;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  price: number;
  bedrooms: number;
  freshness_status: string;
}

// Helpers
function getSupabaseClient(authHeader: string) {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_ANON_KEY") || "",
    { global: { headers: { Authorization: authHeader } } }
  );
}

function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );
}

async function getUserId(authHeader: string): Promise<string | null> {
  const supabase = getSupabaseClient(authHeader);
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.id;
}

// ============================================================================
// INTAKE AGENT - Gemini 3 Pro
// ============================================================================

const INTAKE_SYSTEM_PROMPT = `You are a friendly apartment search assistant for Medellín, Colombia.

Your job is to collect the user's rental search criteria through a conversational wizard.

CORE QUESTIONS (must collect before searching):
1. Move-in date and length of stay
2. Number of bedrooms (Studio/1/2/3+)
3. Monthly budget range (COP or USD)
4. Neighborhood preference (Poblado/Laureles/Envigado/Sabaneta/Any safe)
5. Furnished or unfurnished

OPTIONAL but helpful:
- Must-have amenities (WiFi, AC, balcony, parking, gym)
- Work needs (strong WiFi, quiet, desk)
- Pets allowed needed?
- Utilities included preference

MEDELLÍN NEIGHBORHOODS:
- El Poblado: Upscale, expat-friendly, nightlife, $1000-2500/month
- Laureles: Local vibe, cafes, safer, $400-1200/month
- Envigado: Family-friendly, quieter, good value, $600-1500/month
- Sabaneta: Suburban, affordable, growing, $400-1000/month
- Centro: Budget, historic, less safe for newcomers, $200-500/month

RULES:
1. Be conversational and friendly
2. Ask 2-3 questions at a time maximum
3. Extract all information the user already provided
4. Once you have: bedrooms, budget, and neighborhood (or "any safe") - set ready_to_search: true
5. Default furnished to true for nomads/expats
6. Default currency to USD unless they mention pesos`;

async function runIntakeAgent(messages: Message[]): Promise<IntakeResult> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not configured");
    // Return fallback questions
    return {
      filter_json: null,
      next_questions: [
        "When do you want to move in, and for how long?",
        "How many bedrooms do you need?",
        "What's your monthly budget (USD)?",
      ],
      ready_to_search: false,
      reasoning: "API key not configured, using fallback questions",
    };
  }

  const aiMessages = [
    { role: "system", content: INTAKE_SYSTEM_PROMPT },
    ...messages,
  ];

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3.1-pro-preview",
        messages: aiMessages,
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_criteria",
              description: "Analyze user criteria and return structured search parameters or next questions",
              parameters: {
                type: "object",
                properties: {
                  filter_json: {
                    type: "object",
                    description: "Structured search filters when ready",
                    properties: {
                      bedrooms_min: { type: "number" },
                      bedrooms_max: { type: "number" },
                      budget_min: { type: "number" },
                      budget_max: { type: "number" },
                      currency: { type: "string", enum: ["USD", "COP"] },
                      neighborhoods: { type: "array", items: { type: "string" } },
                      furnished: { type: "boolean" },
                      amenities: { type: "array", items: { type: "string" } },
                      pets: { type: "boolean" },
                      parking: { type: "boolean" },
                    },
                  },
                  next_questions: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 follow-up questions if more info needed",
                  },
                  ready_to_search: {
                    type: "boolean",
                    description: "True if we have enough info to search",
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation of what info we have/need",
                  },
                },
                required: ["ready_to_search"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_criteria" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      return {
        filter_json: args.filter_json || null,
        next_questions: args.next_questions || null,
        ready_to_search: args.ready_to_search || false,
        reasoning: args.reasoning,
      };
    }

    // Fallback if no tool call
    return {
      filter_json: null,
      next_questions: ["What are you looking for in an apartment?"],
      ready_to_search: false,
    };
  } catch (error) {
    console.error("Intake agent error:", error);
    return {
      filter_json: null,
      next_questions: [
        "How many bedrooms do you need?",
        "What's your monthly budget?",
        "Which neighborhood interests you? (Poblado, Laureles, Envigado)",
      ],
      ready_to_search: false,
      reasoning: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
    };
  }
}

// ============================================================================
// SEARCH SERVICE
// ============================================================================

async function executeSearch(filterJson: FilterJson, limit = 50) {
  const service = getServiceClient();
  
  let query = service
    .from("apartments")
    .select("*")
    .eq("status", "active");

  // Apply filters
  if (filterJson.neighborhoods?.length) {
    query = query.in("neighborhood", filterJson.neighborhoods);
  }
  
  if (filterJson.bedrooms_min !== undefined) {
    query = query.gte("bedrooms", filterJson.bedrooms_min);
  }
  
  if (filterJson.bedrooms_max !== undefined) {
    query = query.lte("bedrooms", filterJson.bedrooms_max);
  }
  
  if (filterJson.budget_max !== undefined) {
    query = query.lte("price_monthly", filterJson.budget_max);
  }
  
  if (filterJson.budget_min !== undefined) {
    query = query.gte("price_monthly", filterJson.budget_min);
  }
  
  if (filterJson.furnished !== undefined) {
    query = query.eq("furnished", filterJson.furnished);
  }
  
  if (filterJson.pets) {
    query = query.eq("pet_friendly", true);
  }
  
  if (filterJson.parking) {
    query = query.eq("parking_included", true);
  }
  
  if (filterJson.verified_only) {
    query = query.eq("freshness_status", "active");
  }

  const { data: listings, error } = await query.limit(limit);
  
  if (error) {
    console.error("Search query error:", error);
    throw error;
  }

  // Generate map pins
  const mapPins: MapPin[] = (listings || [])
    .filter((l: any) => l.latitude && l.longitude)
    .map((l: any) => ({
      id: l.id,
      lat: Number(l.latitude),
      lng: Number(l.longitude),
      price: Number(l.price_monthly) || 0,
      bedrooms: l.bedrooms || 0,
      freshness_status: l.freshness_status || "unconfirmed",
    }));

  // Calculate facets
  const neighborhoodCounts = new Map<string, number>();
  const bedroomCounts = new Map<number, number>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const l of listings || []) {
    if (l.neighborhood) {
      neighborhoodCounts.set(l.neighborhood, (neighborhoodCounts.get(l.neighborhood) || 0) + 1);
    }
    if (l.bedrooms !== null) {
      bedroomCounts.set(l.bedrooms, (bedroomCounts.get(l.bedrooms) || 0) + 1);
    }
    if (l.price_monthly) {
      priceMin = Math.min(priceMin, Number(l.price_monthly));
      priceMax = Math.max(priceMax, Number(l.price_monthly));
    }
  }

  return {
    listings: listings || [],
    total_count: listings?.length || 0,
    map_pins: mapPins,
    filters_available: {
      neighborhoods: Array.from(neighborhoodCounts).map(([value, count]) => ({ value, count })),
      bedrooms: Array.from(bedroomCounts).map(([value, count]) => ({ value, count })),
      price_range: { 
        min: priceMin === Infinity ? 0 : priceMin, 
        max: priceMax 
      },
    },
  };
}

// ============================================================================
// VERIFY SERVICE
// ============================================================================

const STALE_PATTERNS = [
  /no longer available/i,
  /listing not found/i,
  /already rented/i,
  /ya rentado/i,
  /no disponible/i,
  /removed from listing/i,
  /property has been rented/i,
  /this listing has been taken down/i,
  /sorry.*this page/i,
];

async function verifyListing(listingId: string) {
  const service = getServiceClient();
  const now = new Date().toISOString();

  // Get listing source_url
  const { data: listing, error: fetchError } = await service
    .from("apartments")
    .select("source_url")
    .eq("id", listingId)
    .single();

  if (fetchError || !listing?.source_url) {
    // Update to unconfirmed
    await service
      .from("apartments")
      .update({ freshness_status: "unconfirmed", last_checked_at: now })
      .eq("id", listingId);

    // Log
    await service.from("rental_freshness_log").insert({
      listing_id: listingId,
      checked_at: now,
      status: "unconfirmed",
    });

    return {
      status: "unconfirmed",
      last_checked_at: now,
      reason: "No source URL on record",
    };
  }

  try {
    // Make HTTP request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(listing.source_url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ILM-Verifier/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const httpStatus = response.status;

    // Check HTTP status
    if (httpStatus >= 400) {
      await service
        .from("apartments")
        .update({ freshness_status: "stale", last_checked_at: now })
        .eq("id", listingId);

      await service.from("rental_freshness_log").insert({
        listing_id: listingId,
        checked_at: now,
        status: "stale",
        http_status: httpStatus,
        html_signature_match: false,
      });

      return {
        status: "stale",
        last_checked_at: now,
        http_status: httpStatus,
        reason: `HTTP ${httpStatus}`,
      };
    }

    // Check HTML content
    const html = await response.text();
    const isStale = STALE_PATTERNS.some((pattern) => pattern.test(html));

    if (isStale) {
      await service
        .from("apartments")
        .update({ freshness_status: "stale", last_checked_at: now })
        .eq("id", listingId);

      await service.from("rental_freshness_log").insert({
        listing_id: listingId,
        checked_at: now,
        status: "stale",
        http_status: httpStatus,
        html_signature_match: false,
      });

      return {
        status: "stale",
        last_checked_at: now,
        http_status: httpStatus,
        reason: "Listing marked as unavailable on source",
      };
    }

    // Listing is active
    await service
      .from("apartments")
      .update({ freshness_status: "active", last_checked_at: now })
      .eq("id", listingId);

    await service.from("rental_freshness_log").insert({
      listing_id: listingId,
      checked_at: now,
      status: "active",
      http_status: httpStatus,
      html_signature_match: true,
    });

    return {
      status: "active",
      last_checked_at: now,
      http_status: httpStatus,
    };
  } catch (error) {
    console.error("Verification error:", error);

    await service
      .from("apartments")
      .update({ freshness_status: "unconfirmed", last_checked_at: now })
      .eq("id", listingId);

    await service.from("rental_freshness_log").insert({
      listing_id: listingId,
      checked_at: now,
      status: "unconfirmed",
    });

    return {
      status: "unconfirmed",
      last_checked_at: now,
      reason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();
    const action = body.action;

    // Actions that require authentication
    const authRequiredActions = ["intake", "verify"];
    
    if (authRequiredActions.includes(action) && !authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Rentals action: ${action}`);

    switch (action) {
      // ====== INTAKE ======
      case "intake": {
        const messages: Message[] = body.messages || [];
        const result = await runIntakeAgent(messages);

        return new Response(
          JSON.stringify({
            success: true,
            ...result,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ====== SEARCH ======
      case "search": {
        const filterJson: FilterJson = body.filter_json || {};
        const limit = body.limit || 50;
        const userId = authHeader ? await getUserId(authHeader) : null;

        const rateSvc = getServiceClient();
        const rateKey = userId ? `rentals-search:${userId}` : `rentals-search:${clientIp(req)}`;
        const rl = await allowRateDurable(rateSvc, rateKey, 30, 60);
        if (!rl.allowed) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Too many searches — slow down.",
              retry_after_seconds: rl.retry_after_seconds,
            }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const searchResult = await executeSearch(filterJson, limit);
        const resultIds = searchResult.listings.map((l: any) => l.id);

        // Store search session if user is authenticated
        let jobId = null;
        if (userId && authHeader) {
          const service = getServiceClient();
          const { data: session } = await service
            .from("rental_search_sessions")
            .insert({
              user_id: userId,
              filter_json: filterJson,
              result_ids: resultIds,
            })
            .select("id")
            .single();
          jobId = session?.id;
        }

        return new Response(
          JSON.stringify({
            success: true,
            job_id: jobId,
            status: searchResult.total_count > 0 ? "completed" : "no_results",
            results: {
              listings: searchResult.listings,
              total_count: searchResult.total_count,
            },
            map_data: {
              pins: searchResult.map_pins,
            },
            filters_available: searchResult.filters_available,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ====== RESULT (Poll) ======
      case "result": {
        const jobId = body.job_id;
        if (!jobId) {
          return new Response(
            JSON.stringify({ error: "job_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const service = getServiceClient();
        const { data: session, error } = await service
          .from("rental_search_sessions")
          .select("filter_json, result_ids, created_at")
          .eq("id", jobId)
          .single();

        if (error || !session) {
          return new Response(
            JSON.stringify({ error: "Search session not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Fetch listings by IDs
        const resultIds = (session.result_ids as string[]) || [];
        let listings: any[] = [];
        if (resultIds.length > 0) {
          const { data } = await service
            .from("apartments")
            .select("*")
            .in("id", resultIds);
          listings = data || [];
        }

        const mapPins: MapPin[] = listings
          .filter((l) => l.latitude && l.longitude)
          .map((l) => ({
            id: l.id,
            lat: Number(l.latitude),
            lng: Number(l.longitude),
            price: Number(l.price_monthly) || 0,
            bedrooms: l.bedrooms || 0,
            freshness_status: l.freshness_status || "unconfirmed",
          }));

        return new Response(
          JSON.stringify({
            success: true,
            status: listings.length > 0 ? "completed" : "no_results",
            results: {
              filter_json: session.filter_json,
              total_count: listings.length,
              created_at: session.created_at,
            },
            listings,
            map_data: { pins: mapPins },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ====== VERIFY ======
      case "verify": {
        const listingId = body.listing_id;
        if (!listingId) {
          return new Response(
            JSON.stringify({ error: "listing_id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const result = await verifyListing(listingId);

        return new Response(
          JSON.stringify({
            success: true,
            ...result,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ====== LISTING DETAIL ======
      case "listing": {
        const listingId = body.id;
        if (!listingId) {
          return new Response(
            JSON.stringify({ error: "id required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const service = getServiceClient();
        const { data: listing, error } = await service
          .from("apartments")
          .select("*")
          .eq("id", listingId)
          .single();

        if (error || !listing) {
          return new Response(
            JSON.stringify({ error: "Listing not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            listing,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: "Unknown action", 
            available_actions: ["intake", "search", "result", "verify", "listing"] 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Rentals function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
