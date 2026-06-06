import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const suggestions = [
  {
    id: "friday-night",
    prompt: "Build my Friday night",
    desc: "Events, dinner, and a late bar in Poblado or Laureles — fully planned.",
  },
  {
    id: "romantic-dinner",
    prompt: "Romantic dinner near Provenza",
    desc: "Top-rated restaurants with outdoor terraces, live music on weekends.",
  },
  {
    id: "weekend-plan",
    prompt: "Plan my weekend in Laureles",
    desc: "Cafés to work from, places to eat, and things to do — all walking distance.",
  },
] as const;

export function HomeSuggestions() {
  return (
    <section aria-label="AI concierge suggestions" className="bg-muted/40 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-accent text-base font-bold leading-none" aria-hidden="true">✦</span>
          <h2 className="text-lg font-semibold text-foreground">Try asking the concierge</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {suggestions.map(({ id, prompt, desc }) => (
            <Link
              key={id}
              href={`/chat?q=${encodeURIComponent(prompt)}`}
              data-testid={`suggestion-${id}`}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Card className="h-full transition-all duration-200 group-hover:border-accent/50 group-hover:shadow-sm motion-reduce:transition-none">
                <CardContent className="flex flex-col gap-2 p-5">
                  <span className="text-sm font-bold text-accent leading-none" aria-hidden="true">✦</span>
                  <p className="text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary motion-reduce:transition-none">
                    &ldquo;{prompt}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
