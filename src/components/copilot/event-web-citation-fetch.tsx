"use client";

import { useEffect, useRef } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { shouldChainWebGrounding } from "@/mastra/lib/attach-web-grounding";

/** MAP-002D — load web citations after concierge turn (EventResultsPanel). */
export function EventWebCitationFetch() {
  const { isLoading } = useCopilotChat();
  const { state } = useConciergeCoAgent();
  const { rows, webCitations, setWebCitations } = useEventSearchResults();
  const wasLoadingRef = useRef(false);
  const inflightRef = useRef(false);
  const lastTurnRef = useRef("");

  useEffect(() => {
    const wasLoading = wasLoadingRef.current;
    wasLoadingRef.current = isLoading;

    if (!wasLoading || isLoading) return;
    if (webCitations.length > 0 || inflightRef.current) return;

    const sqlEventCount = state?.lastEventResults?.length ?? rows.length;
    const q = state?.lastEventQuery;
    if (!q) return;

    const payload = {
      category: q.category,
      neighborhood: q.neighborhood,
      dateWindow: q.dateWindow ?? "any",
    };

    if (!shouldChainWebGrounding(payload, sqlEventCount)) return;

    const turnKey = JSON.stringify({ ...payload, sqlEventCount });
    if (turnKey === lastTurnRef.current) return;
    lastTurnRef.current = turnKey;

    inflightRef.current = true;
    void fetch("/api/grounding/event-web", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, sqlEventCount }),
    })
      .then((res) => res.json())
      .then((data: { webGrounding?: { citations?: typeof webCitations } }) => {
        const citations = data.webGrounding?.citations ?? [];
        if (citations.length > 0) setWebCitations(citations);
      })
      .finally(() => {
        inflightRef.current = false;
      });
  }, [
    isLoading,
    state?.lastEventQuery,
    state?.lastEventResults,
    rows.length,
    webCitations.length,
    setWebCitations,
  ]);

  return null;
}
