import Link from "next/link";

const cols = [
  {
    heading: "Explore",
    links: [
      { label: "Rentals",     href: "/rentals" },
      { label: "Restaurants", href: "/restaurants" },
      { label: "Cafés",       href: "/cafes" },
      { label: "Nightlife",   href: "/nightlife" },
      { label: "Events",      href: "/events" },
    ],
  },
  {
    heading: "For hosts",
    links: [
      { label: "Host an event", href: "/host/event/new" },
      { label: "My events",     href: "/host/events" },
      { label: "How it works",  href: "#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms",   href: "/legal/terms" },
    ],
  },
] as const;

export function HomeFooter() {
  return (
    <footer className="border-t border-border bg-background" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* Large wordmark */}
        <p
          className="mb-10 select-none text-[clamp(3rem,10vw,7rem)] font-extrabold leading-none tracking-[-0.04em] text-border"
          aria-hidden="true"
        >
          mde·ai
        </p>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {cols.map(({ heading, links }) => (
            <div key={heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 motion-reduce:transition-none"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} mdeai. Medellín, Colombia.</p>
          <p>AI-powered city concierge — not affiliated with Google or Airbnb.</p>
        </div>
      </div>
    </footer>
  );
}
