import { Gallery4 } from "@/components/blocks/gallery4";
import type { Gallery4Item } from "@/components/blocks/gallery4";

const trendingItems: Gallery4Item[] = [
  {
    id: "parque-lleras",
    title: "Parque Lleras this weekend",
    description:
      "Rooftop bars, live salsa, and Medellín's best nightlife all within 3 blocks. Find what's on tonight.",
    href: "/chat?q=Things+to+do+at+Parque+Lleras+this+weekend",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "laureles-cafe",
    title: "Best cafés in Laureles",
    description:
      "Tree-lined streets, specialty Colombian coffee, and quiet spots to work. Walkable, local, and genuine.",
    href: "/chat?q=Best+cafés+in+Laureles+with+outdoor+seating",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "envigado-eats",
    title: "Local eats in Envigado",
    description:
      "Authentic Paisa food, low prices, hidden neighbourhood restaurants. No tourist markup here.",
    href: "/chat?q=Local+restaurants+in+Envigado",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "poblado-rooftops",
    title: "Rooftop bars in El Poblado",
    description:
      "Skyline views, craft cocktails, and the city lights below. The best rooftops open right now.",
    href: "/chat?q=Best+rooftop+bars+in+El+Poblado",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "centro-culture",
    title: "Culture at El Centro",
    description:
      "Botero Plaza, Mercado del Río, street art and raw city energy. History you can walk through.",
    href: "/chat?q=Cultural+things+to+do+in+El+Centro+Medellín",
    image:
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
];

export function HomeTrending() {
  return (
    <div className="bg-background overflow-hidden">
      <Gallery4
        title="Trending in Medellín"
        description="What's happening right now — picked by AI, grounded in Google Maps."
        items={trendingItems}
      />
    </div>
  );
}
