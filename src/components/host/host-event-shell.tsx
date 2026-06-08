"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostEventCopilotBridge } from "@/components/host/host-event-copilot-bridge";
import { HostEventForm } from "@/components/host/host-event-form";
import { HostEventPreviewCard } from "@/components/host/host-event-preview-card";
import { HostEventWorkflowStrip } from "@/components/host/host-event-workflow-strip";
import { HostNavRail } from "@/components/host/host-nav-rail";
import { activeHostWizardStep } from "@/lib/types";

const HOST_LABELS = {
  title: "Create event",
  initial:
    'Describe your event — e.g. "Startup mixer March 15 in Provenza, 200 cap, GA free + VIP 50000 COP". I will fill the form and ask for approval before publishing.',
};

type HostEventShellProps = {
  userEmail?: string | null;
};

/** SCREEN-016 — Roberto host wizard with co-agent + frontend tools. */
export function HostEventShell({ userEmail }: HostEventShellProps) {
  return (
    <HostEventCopilotBridge>
      {({ draft, setDraft }) => (
        <div
          data-testid="host-event-wizard"
          className="flex min-h-screen flex-col bg-background text-foreground"
        >
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← mdeai
              </Link>
              <h1 className="text-lg font-semibold sm:text-xl">Create event</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {userEmail ? `Signed in as ${userEmail}` : "Host workspace"}
              </p>
            </div>
            <AuthStatus />
          </header>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <HostNavRail />
            <section
              aria-label="Host event chat"
              className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
            >
              <HostEventWorkflowStrip activeStep={activeHostWizardStep(draft)} />
              <HostEventPreviewCard draft={draft} />
              <HostEventForm draft={draft} onChange={setDraft} />
              <div
                id="host-copilot-chat-region"
                data-testid="host-copilot-chat-region"
                aria-live="polite"
                aria-relevant="additions"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1 sm:px-4"
              >
                <CopilotChat
                  className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
                  labels={HOST_LABELS}
                />
              </div>
              {draft.publishedSlug ? (
                <p className="border-t border-border px-4 py-2 text-sm text-primary">
                  Published:{" "}
                  <Link href={`/events/${draft.publishedSlug}`} className="underline">
                    /events/{draft.publishedSlug}
                  </Link>
                </p>
              ) : null}
            </section>
          </div>
        </div>
      )}
    </HostEventCopilotBridge>
  );
}
