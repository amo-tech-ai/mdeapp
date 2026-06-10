const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SavedPlace {
  id: string;
  location_id: string;
  location_type: string;
  title?: string;
  cuisine_types?: string[];
  event_type?: string;
  neighborhood?: string;
  tags?: string[];
  price_level?: number;
  rating?: number;
}

interface CollectionSuggestion {
  name: string;
  description: string;
  emoji: string;
  color: string;
  placeIds: string[];
  confidence: number;
  reasoning: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { savedPlaces }: { savedPlaces: SavedPlace[] } = await req.json();

    if (!savedPlaces || savedPlaces.length < 3) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          suggestions: [],
          message: "Need at least 3 saved places to suggest collections"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze patterns in saved places
    const suggestions: CollectionSuggestion[] = [];

    // Pattern 1: Group by cuisine type for restaurants
    const restaurants = savedPlaces.filter(p => p.location_type === 'restaurant');
    if (restaurants.length >= 3) {
      const cuisineGroups: Record<string, SavedPlace[]> = {};
      restaurants.forEach(r => {
        (r.cuisine_types || ['Other']).forEach(cuisine => {
          if (!cuisineGroups[cuisine]) cuisineGroups[cuisine] = [];
          cuisineGroups[cuisine].push(r);
        });
      });

      Object.entries(cuisineGroups).forEach(([cuisine, places]) => {
        if (places.length >= 2) {
          const cuisineEmojis: Record<string, string> = {
            'Colombian': '🇨🇴',
            'Italian': '🍝',
            'Japanese': '🍣',
            'Mexican': '🌮',
            'Chinese': '🥢',
            'Indian': '🍛',
            'Thai': '🍜',
            'Mediterranean': '🫒',
            'American': '🍔',
            'Seafood': '🦐',
            'Vegetarian': '🥗',
            'Coffee': '☕',
            'Bakery': '🥐',
            'default': '🍽️'
          };
          
          suggestions.push({
            name: `Best ${cuisine} Spots`,
            description: `Your favorite ${cuisine.toLowerCase()} restaurants in Medellín`,
            emoji: cuisineEmojis[cuisine] || cuisineEmojis.default,
            color: '#22C55E',
            placeIds: places.map(p => p.id),
            confidence: Math.min(0.9, 0.5 + places.length * 0.1),
            reasoning: `Found ${places.length} ${cuisine} restaurants in your saves`
          });
        }
      });
    }

    // Pattern 2: Group by neighborhood
    const byNeighborhood: Record<string, SavedPlace[]> = {};
    savedPlaces.forEach(p => {
      const hood = p.neighborhood || 'Unknown';
      if (!byNeighborhood[hood]) byNeighborhood[hood] = [];
      byNeighborhood[hood].push(p);
    });

    Object.entries(byNeighborhood).forEach(([neighborhood, places]) => {
      if (places.length >= 3 && neighborhood !== 'Unknown') {
        suggestions.push({
          name: `Explore ${neighborhood}`,
          description: `All your saved spots in the ${neighborhood} neighborhood`,
          emoji: '📍',
          color: '#3B82F6',
          placeIds: places.map(p => p.id),
          confidence: Math.min(0.85, 0.4 + places.length * 0.1),
          reasoning: `${places.length} places saved in ${neighborhood}`
        });
      }
    });

    // Pattern 3: Group by location type
    const typeGroups: Record<string, { places: SavedPlace[], emoji: string, color: string }> = {
      restaurant: { places: [], emoji: '🍽️', color: '#F97316' },
      event: { places: [], emoji: '🎉', color: '#A855F7' },
      apartment: { places: [], emoji: '🏠', color: '#3B82F6' },
      car: { places: [], emoji: '🚗', color: '#EAB308' },
    };

    savedPlaces.forEach(p => {
      if (typeGroups[p.location_type]) {
        typeGroups[p.location_type].places.push(p);
      }
    });

    // Events collection
    if (typeGroups.event.places.length >= 2) {
      suggestions.push({
        name: 'Upcoming Events',
        description: 'Events and activities you want to attend',
        emoji: '🎉',
        color: '#A855F7',
        placeIds: typeGroups.event.places.map(p => p.id),
        confidence: 0.8,
        reasoning: `${typeGroups.event.places.length} events saved`
      });
    }

    // Pattern 4: Price level groupings for restaurants
    const budgetRestaurants = restaurants.filter(r => (r.price_level || 2) <= 2);
    const fineRestaurants = restaurants.filter(r => (r.price_level || 2) >= 3);

    if (budgetRestaurants.length >= 2) {
      suggestions.push({
        name: 'Budget-Friendly Eats',
        description: 'Great food without breaking the bank',
        emoji: '💰',
        color: '#22C55E',
        placeIds: budgetRestaurants.map(p => p.id),
        confidence: 0.7,
        reasoning: `${budgetRestaurants.length} affordable restaurants found`
      });
    }

    if (fineRestaurants.length >= 2) {
      suggestions.push({
        name: 'Special Occasion Dining',
        description: 'Fine dining for celebrations and date nights',
        emoji: '✨',
        color: '#F59E0B',
        placeIds: fineRestaurants.map(p => p.id),
        confidence: 0.75,
        reasoning: `${fineRestaurants.length} upscale restaurants found`
      });
    }

    // Pattern 5: Highly rated places
    const topRated = savedPlaces.filter(p => (p.rating || 0) >= 4.5);
    if (topRated.length >= 3) {
      suggestions.push({
        name: 'Top Rated Favorites',
        description: 'The highest rated places in your saves',
        emoji: '⭐',
        color: '#EAB308',
        placeIds: topRated.map(p => p.id),
        confidence: 0.85,
        reasoning: `${topRated.length} places with 4.5+ rating`
      });
    }

    // Sort by confidence and limit to top 5
    const topSuggestions = suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: topSuggestions,
        analyzedCount: savedPlaces.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI suggest collections error:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
