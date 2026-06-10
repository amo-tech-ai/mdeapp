import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TripPlanRequest {
  tripId?: string;
  destination?: string;
  startDate: string;
  endDate: string;
  interests: string[];
  budget?: "budget" | "moderate" | "luxury";
  travelStyle?: "relaxed" | "balanced" | "packed";
  preferences?: {
    neighborhoods?: string[];
    cuisineTypes?: string[];
    mustSee?: string[];
  };
}

interface ItineraryItem {
  day: number;
  date: string;
  timeSlot: "morning" | "afternoon" | "evening" | "night";
  startTime: string;
  endTime: string;
  type: "restaurant" | "apartment" | "car" | "event" | "activity" | "transport";
  title: string;
  description: string;
  location: string;
  estimatedCost: number | null;
  resourceId: string | null;
  resourceType: string | null;
  notes: string;
}

interface TripPlanResponse {
  success: boolean;
  tripTitle: string;
  summary: string;
  itinerary: ItineraryItem[];
  totalEstimatedCost: number;
  tips: string[];
}

function getSupabaseClient(authHeader: string | null) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}

async function getUserIdFromAuth(authHeader: string | null, supabase: ReturnType<typeof getSupabaseClient>): Promise<string | null> {
  if (!authHeader) return null;
  
  try {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    return user?.id || null;
  } catch {
    return null;
  }
}

// Fetch real listings from database
async function fetchListingsContext(supabase: ReturnType<typeof getSupabaseClient>, interests: string[]) {
  const [restaurants, apartments, events] = await Promise.all([
    supabase
      .from("restaurants")
      .select("id, name, cuisine_types, price_level, rating, address, city")
      .eq("is_active", true)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(15),
    supabase
      .from("apartments")
      .select("id, title, neighborhood, price_daily, rating, amenities")
      .eq("status", "active")
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(10),
    supabase
      .from("events")
      .select("id, name, event_type, event_start_time, ticket_price_min, address")
      .eq("is_active", true)
      .gte("event_start_time", new Date().toISOString())
      .order("event_start_time", { ascending: true })
      .limit(10),
  ]);

  return {
    restaurants: restaurants.data || [],
    apartments: apartments.data || [],
    events: events.data || [],
  };
}

// Generate itinerary using Gemini
async function generateItinerary(
  request: TripPlanRequest,
  listings: Awaited<ReturnType<typeof fetchListingsContext>>
): Promise<TripPlanResponse> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);
  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Format listings for context
  const restaurantList = listings.restaurants.slice(0, 10).map(r => 
    `- ${r.name} (${r.cuisine_types?.join(", ") || "Various"}, ${"$".repeat(r.price_level || 2)}, Rating: ${r.rating || "N/A"}) at ${r.address || r.city}`
  ).join("\n");

  const eventList = listings.events.slice(0, 8).map(e =>
    `- ${e.name} (${e.event_type || "Event"}) on ${new Date(e.event_start_time).toLocaleDateString()} at ${e.address || "Medellín"}`
  ).join("\n");

  const prompt = `Create a ${numDays}-day itinerary for Medellín, Colombia.

TRIP DETAILS:
- Dates: ${request.startDate} to ${request.endDate} (${numDays} days)
- Interests: ${request.interests.join(", ")}
- Budget: ${request.budget || "moderate"}
- Style: ${request.travelStyle || "balanced"}
${request.preferences?.neighborhoods ? `- Preferred neighborhoods: ${request.preferences.neighborhoods.join(", ")}` : ""}
${request.preferences?.cuisineTypes ? `- Cuisine preferences: ${request.preferences.cuisineTypes.join(", ")}` : ""}

AVAILABLE RESTAURANTS:
${restaurantList}

UPCOMING EVENTS:
${eventList}

POPULAR ACTIVITIES IN MEDELLÍN:
- Comuna 13 Graffiti Tour (morning, 3-4 hours, ~$25)
- Guatapé Day Trip (full day, ~$50)
- Cable car to Santo Domingo (1-2 hours, ~$3)
- Botanical Garden (2-3 hours, free)
- Parque Arví (half day, ~$15)
- Coffee Farm Tour (half day, ~$40)
- Nightlife in El Poblado (evening)
- Plaza Botero (1-2 hours, free)
- Museo de Antioquia (2-3 hours, ~$8)

Generate a JSON response with this EXACT structure:
{
  "tripTitle": "Creative trip title",
  "summary": "2-3 sentence trip overview",
  "itinerary": [
    {
      "day": 1,
      "date": "${request.startDate}",
      "timeSlot": "morning|afternoon|evening|night",
      "startTime": "09:00",
      "endTime": "12:00",
      "type": "activity|restaurant|event",
      "title": "Activity name",
      "description": "Brief description",
      "location": "Neighborhood or address",
      "estimatedCost": 25,
      "resourceId": null,
      "resourceType": null,
      "notes": "Any tips"
    }
  ],
  "totalEstimatedCost": 500,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Include 3-5 activities per day. Use REAL restaurant names from the list when suggesting meals. Match activities to their interests. Be specific with times.`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-3.1-pro-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert Medellín travel planner. Create detailed, realistic itineraries using real local knowledge. Always respond with valid JSON only, no markdown."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Gateway error:", errorText);
    throw new Error(`AI Gateway returned ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  
  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse itinerary response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  
  // Validate and fix dates
  const itinerary = (parsed.itinerary || []).map((item: ItineraryItem, idx: number) => {
    const dayOffset = item.day - 1;
    const itemDate = new Date(startDate);
    itemDate.setDate(itemDate.getDate() + dayOffset);
    
    return {
      ...item,
      day: item.day || Math.floor(idx / 4) + 1,
      date: itemDate.toISOString().split("T")[0],
      timeSlot: item.timeSlot || "afternoon",
      estimatedCost: item.estimatedCost || null,
      resourceId: item.resourceId || null,
      resourceType: item.resourceType || null,
    };
  });

  return {
    success: true,
    tripTitle: parsed.tripTitle || `${numDays}-Day Medellín Adventure`,
    summary: parsed.summary || `An exciting ${numDays}-day journey through Medellín featuring ${request.interests.join(", ")}.`,
    itinerary,
    totalEstimatedCost: parsed.totalEstimatedCost || itinerary.reduce((sum: number, i: ItineraryItem) => sum + (i.estimatedCost || 0), 0),
    tips: parsed.tips || [
      "Bring sunscreen - Medellín's sun is strong!",
      "Use Uber or InDriver for safe transportation",
      "Learn basic Spanish phrases for better experiences",
    ],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = getSupabaseClient(authHeader);
    const userId = await getUserIdFromAuth(authHeader, supabase);

    const body: TripPlanRequest = await req.json();
    
    // Validate required fields
    if (!body.startDate || !body.endDate) {
      return new Response(
        JSON.stringify({ error: "Start date and end date are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.interests || body.interests.length === 0) {
      body.interests = ["culture", "food", "nightlife"];
    }

    // Fetch real listings for context
    const listings = await fetchListingsContext(supabase, body.interests);

    // Generate itinerary
    const plan = await generateItinerary(body, listings);

    // Log AI run
    if (userId) {
      await supabase.from("ai_runs").insert({
        user_id: userId,
        agent_name: "trip_planner",
        agent_type: "itinerary_optimizer",
        input_data: body,
        output_data: { itemCount: plan.itinerary.length, totalCost: plan.totalEstimatedCost },
        duration_ms: Date.now() - startTime,
        status: "success",
        model_name: "gemini-3.1-pro-preview",
      });
    }

    return new Response(
      JSON.stringify({
        ...plan,
        meta: {
          durationMs: Date.now() - startTime,
          listingsUsed: {
            restaurants: listings.restaurants.length,
            events: listings.events.length,
          },
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Trip planner error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Trip planning failed" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
