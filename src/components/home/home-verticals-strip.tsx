import Link from "next/link";
import { HomeIcon, UtensilsIcon, Music2Icon, CalendarDaysIcon, CoffeeIcon } from "lucide-react";

const verticals = [
  { label: "Rentals",     href: "/rentals",     Icon: HomeIcon,         testId: "vertical-rentals" },
  { label: "Restaurants", href: "/restaurants", Icon: UtensilsIcon,     testId: "vertical-restaurants" },
  { label: "Cafés",       href: "/cafes",       Icon: CoffeeIcon,       testId: "vertical-cafes" },
  { label: "Nightlife",   href: "/nightlife",   Icon: Music2Icon,       testId: "vertical-nightlife" },
  { label: "Events",      href: "/events",      Icon: CalendarDaysIcon, testId: "vertical-events" },
] as const;

export function HomeVerticalsStrip() {
  return (
    <section
      aria-label="Browse Medellín verticals"
      className="border-b border-border bg-background py-10 md:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {verticals.map(({ label, href, Icon, testId }) => (
            <Link
              key={label}
              href={href}
              data-testid={testId}
              className="group flex min-h-[88px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20 motion-reduce:transition-none">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
