"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";

const chips = [
  "Rentals in Laureles",
  "What's on this weekend?",
  "Best cafés to work from",
  "Rooftop bars in Poblado",
] as const;

export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section
      aria-label="AI concierge search"
      className="bg-background px-4 pb-14 pt-16 sm:px-6 md:pb-20 md:pt-24 lg:px-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Badge */}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <span aria-hidden="true">✦</span>
            AI concierge for Medellín
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your city, on demand
        </h1>
        <p className="mb-8 text-base text-muted-foreground sm:text-lg">
          Ask anything — rentals, events, restaurants, nightlife. Get real
          answers grounded in Google Maps, not a list of links.
        </p>

        {/* Search bar */}
        <form
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm transition-shadow duration-200 focus-within:border-primary/50 focus-within:shadow-md"
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          role="search"
        >
          <span className="text-base text-accent" aria-hidden="true">✦</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Ask anything about Medellín — "rooftop bars in Provenza tonight"'
            aria-label="Ask the AI concierge"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            aria-label="Search"
            className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Ask
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </button>
        </form>

        {/* Cold-start chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => submit(chip)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:border-primary/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
