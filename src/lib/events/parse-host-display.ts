import type { PublicEventHost } from "./types";

/** Read host snapshot from events.details.host_display (Option C — no profile join). */
export function parseEventHostDisplay(details: unknown): PublicEventHost | null {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }

  const hostDisplay = (details as Record<string, unknown>).host_display;
  if (!hostDisplay || typeof hostDisplay !== "object" || Array.isArray(hostDisplay)) {
    return null;
  }

  const raw = hostDisplay as Record<string, unknown>;
  const name = raw.name;
  if (typeof name !== "string" || !name.trim()) {
    return null;
  }

  const avatarUrl = raw.avatar_url;
  return {
    name: name.trim(),
    avatarUrl: typeof avatarUrl === "string" && avatarUrl.trim() ? avatarUrl.trim() : null,
  };
}

export function hostInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
