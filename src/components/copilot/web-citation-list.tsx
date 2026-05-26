"use client";

import { webCitationsEnabled } from "@/lib/web-citations-display";

export type WebCitationItem = {
  title: string;
  url: string;
  snippet?: string | null;
};

type WebCitationListProps = {
  citations: WebCitationItem[];
  reason?: string | null;
};

export function WebCitationList({ citations, reason }: WebCitationListProps) {
  if (!webCitationsEnabled()) {
    return null;
  }

  if (reason && citations.length === 0) {
    return (
      <p
        className="text-muted-foreground text-sm"
        data-testid="web-citation-unverified"
      >
        Couldn&apos;t verify online — try again or check official listings.
      </p>
    );
  }

  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2" data-testid="web-citation-list">
      <span
        className="bg-muted text-muted-foreground inline-block rounded px-2 py-0.5 text-xs font-medium"
        data-testid="web-citation-badge"
      >
        From the web
      </span>
      <ul className="space-y-1.5">
        {citations.map((c) => (
          <li key={c.url}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm underline-offset-2 hover:underline"
              data-testid="web-citation-link"
            >
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
