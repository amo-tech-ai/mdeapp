"use client";

interface Props {
  onRetry: () => void;
}

/** UX-002 — Inline error bubble when the concierge turn fails (RUN_ERROR). */
export function ConciergeErrorNotice({ onRetry }: Props) {
  return (
    <div
      data-testid="concierge-error-notice"
      className="copilotKitMessage copilotKitAssistantMessage"
    >
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
        <p className="font-medium text-destructive">Something went wrong</p>
        <p className="mt-0.5 text-muted-foreground">
          The concierge timed out — please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Try again ↻
        </button>
      </div>
    </div>
  );
}
