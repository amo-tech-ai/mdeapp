"use client";

/** UX-005 — "Searching Medellín…" animated dots while concierge turn is in-flight. */
export function ConciergeThinkingIndicator() {
  return (
    <div
      data-testid="concierge-thinking"
      className="copilotKitMessage copilotKitAssistantMessage"
    >
      <div
        className="flex items-center gap-1.5"
        role="status"
        aria-label="Searching Medellín…"
      >
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"
          aria-hidden
        />
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"
          aria-hidden
        />
        <span
          className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
          aria-hidden
        />
        <span className="ml-1 text-sm text-muted-foreground">
          Searching Medellín…
        </span>
      </div>
    </div>
  );
}
