"use client";

import { WebCitationList } from "@/components/copilot/web-citation-list";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";

/**
 * Compact web attribution footer — never duplicates EventCards (those live in chat only).
 * Fed by EventWebCitationSync / EventWebCitationFetch after search-events or web grounding.
 */
export function EventResultsPanel() {
  const { webCitations } = useEventSearchResults();

  if (webCitations.length === 0) return null;

  return (
    <section
      data-testid="event-results-panel"
      aria-label="Event search sources"
      className="shrink-0 border-t border-border bg-background px-2 py-2 sm:px-4"
    >
      <WebCitationList citations={webCitations} />
    </section>
  );
}
