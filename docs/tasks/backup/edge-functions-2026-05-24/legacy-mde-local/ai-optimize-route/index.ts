const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calculate total route distance
function calculateTotalDistance(items: TripItemInput[]): number {
  let total = 0;
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].latitude && items[i].longitude && items[i + 1].latitude && items[i + 1].longitude) {
      total += calculateDistance(
        items[i].latitude!,
        items[i].longitude!,
        items[i + 1].latitude!,
        items[i + 1].longitude!
      );
    }
  }
  return total;
}

interface TripItemInput {
  id: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  item_type: string;
  start_at: string | null;
}

interface OptimizeRequest {
  items: TripItemInput[];
  dayDate: string;
  preferences?: {
    startLocation?: { lat: number; lng: number };
    prioritizeByType?: string[];
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, dayDate, preferences } = (await req.json()) as OptimizeRequest;

    if (!items || items.length < 2) {
      return new Response(
        JSON.stringify({ 
          optimizedOrder: items?.map(i => i.id) || [],
          explanation: "Need at least 2 items to optimize route.",
          savings: { distanceKm: 0, timeMinutes: 0 }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter items with valid coordinates
    const itemsWithCoords = items.filter(i => i.latitude && i.longitude);
    const itemsWithoutCoords = items.filter(i => !i.latitude || !i.longitude);

    if (itemsWithCoords.length < 2) {
      return new Response(
        JSON.stringify({
          optimizedOrder: items.map(i => i.id),
          explanation: "Not enough items with location data to optimize. Add addresses to your activities for better optimization.",
          savings: { distanceKm: 0, timeMinutes: 0 }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate original distance
    const originalDistance = calculateTotalDistance(itemsWithCoords);

    // Use AI to suggest optimal order with context
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      // Fallback: Use nearest neighbor algorithm
      const optimized = nearestNeighborOptimize(itemsWithCoords, preferences?.startLocation);
      const newDistance = calculateTotalDistance(optimized);
      const savings = originalDistance - newDistance;
      
      return new Response(
        JSON.stringify({
          optimizedOrder: [...optimized.map(i => i.id), ...itemsWithoutCoords.map(i => i.id)],
          explanation: `Route optimized using nearest-neighbor algorithm. Estimated savings: ${savings.toFixed(1)} km.`,
          savings: { 
            distanceKm: Math.max(0, savings),
            timeMinutes: Math.round(Math.max(0, savings) / 25 * 60)
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build prompt for AI
    const itemDescriptions = itemsWithCoords.map((item, idx) => 
      `${idx + 1}. "${item.title}" (${item.item_type}) at coordinates (${item.latitude}, ${item.longitude})`
    ).join("\n");

    const systemPrompt = `You are an expert route optimizer for Medellín, Colombia. Given a list of activities with their coordinates, suggest the optimal order to visit them to minimize total travel time and distance.

Consider:
- Geographic clustering (visit nearby places together)
- Typical traffic patterns in Medellín
- Logical meal timing (restaurants around lunch/dinner hours)
- Activity types (start with outdoor activities in morning when cooler)

Respond ONLY with a JSON object in this exact format:
{
  "order": [1, 3, 2, 4],
  "reasoning": "Brief explanation of the optimization logic"
}

Where "order" is an array of the original position numbers (1-indexed) in the optimal sequence.`;

    const userPrompt = `Optimize this itinerary for ${dayDate}:

${itemDescriptions}

${preferences?.startLocation ? `Starting from coordinates: (${preferences.startLocation.lat}, ${preferences.startLocation.lng})` : ""}

Return the optimal order as a JSON object.`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "";

    // Parse AI response
    let optimizationResult: { order: number[]; reasoning: string };
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      optimizationResult = JSON.parse(jsonMatch[0]);
    } catch {
      // Fallback to nearest neighbor if AI response parsing fails
      const optimized = nearestNeighborOptimize(itemsWithCoords, preferences?.startLocation);
      const newDistance = calculateTotalDistance(optimized);
      const savings = originalDistance - newDistance;
      
      return new Response(
        JSON.stringify({
          optimizedOrder: [...optimized.map(i => i.id), ...itemsWithoutCoords.map(i => i.id)],
          explanation: `Route optimized algorithmically. Estimated savings: ${savings.toFixed(1)} km.`,
          savings: { 
            distanceKm: Math.max(0, savings),
            timeMinutes: Math.round(Math.max(0, savings) / 25 * 60)
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reorder items based on AI suggestion
    const reorderedItems = optimizationResult.order
      .map(idx => itemsWithCoords[idx - 1])
      .filter(Boolean);

    const newDistance = calculateTotalDistance(reorderedItems);
    const savings = originalDistance - newDistance;

    return new Response(
      JSON.stringify({
        optimizedOrder: [...reorderedItems.map(i => i.id), ...itemsWithoutCoords.map(i => i.id)],
        explanation: optimizationResult.reasoning,
        savings: {
          distanceKm: Math.max(0, savings),
          timeMinutes: Math.round(Math.max(0, savings) / 25 * 60)
        },
        originalDistance: originalDistance,
        newDistance: newDistance
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Route optimization error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Nearest neighbor algorithm as fallback
function nearestNeighborOptimize(
  items: TripItemInput[], 
  startLocation?: { lat: number; lng: number }
): TripItemInput[] {
  if (items.length <= 1) return items;

  const remaining = [...items];
  const result: TripItemInput[] = [];

  // Start with the item closest to start location, or first item
  let current: { lat: number; lng: number };
  
  if (startLocation) {
    current = startLocation;
  } else {
    // Start with first item
    const first = remaining.shift()!;
    result.push(first);
    current = { lat: first.latitude!, lng: first.longitude! };
  }

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const item = remaining[i];
      if (item.latitude && item.longitude) {
        const dist = calculateDistance(current.lat, current.lng, item.latitude, item.longitude);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }
    }

    const nearest = remaining.splice(nearestIdx, 1)[0];
    result.push(nearest);
    current = { lat: nearest.latitude!, lng: nearest.longitude! };
  }

  return result;
}
