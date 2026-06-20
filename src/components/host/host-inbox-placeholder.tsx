"use client";

import { Bell, CheckCircle2, FileText, MapPin, Sparkles, TriangleAlert } from "lucide-react";

/**
 * SAN-1209 · HOST-OS-001 — Notification / Approval Inbox (reserved shell slot).
 *
 * This phase ships the *location*, not the feature. It marks where the host's
 * approvals and signals will live so the OS frame is complete and later phases
 * (SAN-1207 · HOST-ONBOARD-001, command center) drop functionality in without
 * re-laying-out the shell. Nothing here is wired — every row is a labelled
 * placeholder, so Roberto sees the future home of his approvals queue today.
 */

const INBOX_SLOTS: { icon: typeof Bell; label: string; testId: string }[] = [
  { icon: CheckCircle2, label: "Approvals", testId: "host-inbox-slot-approvals" },
  { icon: MapPin, label: "Venue matches", testId: "host-inbox-slot-venues" },
  { icon: FileText, label: "Publishing reviews", testId: "host-inbox-slot-publishing" },
  { icon: Sparkles, label: "AI recommendations", testId: "host-inbox-slot-recommendations" },
  { icon: TriangleAlert, label: "Warnings", testId: "host-inbox-slot-warnings" },
];

export function HostInboxPlaceholder() {
  return (
    <section
      data-testid="host-inbox-placeholder"
      aria-label="Notifications and approvals (coming soon)"
      className="rounded-lg border border-dashed border-border bg-muted/20 p-3"
    >
      <header className="mb-2 flex items-center gap-2">
        <Bell className="size-4 text-muted-foreground" aria-hidden />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Inbox
        </h2>
        <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Soon
        </span>
      </header>
      <ul className="space-y-1">
        {INBOX_SLOTS.map((slot) => (
          <li
            key={slot.label}
            data-testid={slot.testId}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground/70"
          >
            <slot.icon className="size-4 shrink-0" aria-hidden />
            {slot.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
