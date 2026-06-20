"use client";

export const HOST_OS_CHAT_LABELS = {
  title: "Host concierge",
  initial:
    "Ask about any event, your sales, venues or attendees. I keep the thread across Overview, Events and Analytics — no need to re-explain which event we're on.",
};

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostOsChatTitle() {
  return (
    <div className="mb-2 shrink-0">
      <p className="text-sm font-semibold text-foreground">
        <span aria-hidden="true" className="mr-1 text-accent-foreground">
          ✦
        </span>
        {HOST_OS_CHAT_LABELS.title}
      </p>
      <p className="text-xs text-muted-foreground">
        Persistent across your host workspace.
      </p>
    </div>
  );
}
