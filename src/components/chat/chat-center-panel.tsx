"use client";

import { CopilotChat } from "@copilotkit/react-ui";

import { ChatQueryBar } from "@/components/chat/chat-query-bar";
import { ChatResultsColumn } from "@/components/chat/chat-results-column";
import { ChatFilterCopilotInstructions } from "@/components/chat/chat-filter-copilot-instructions";
import { EventResultsPanel } from "@/components/chat/event-results-panel";
import { WorkflowProgressStrip } from "@/components/chat/workflow-progress-strip";

const CONCIERGE_LABELS = {
  title: "Medellín concierge",
  initial:
    'Hi — I can help with rentals, events, restaurants, and day trips in Medellín. Try: "1BR in Laureles under $80/night" or "salsa events this weekend".',
};

/** SCREEN-001 — center column: query bar · workflow strip · CopilotChat · results. */
export function ChatCenterPanel() {
  return (
    <section
      data-testid="center-chat-panel"
      aria-label="Concierge chat"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
    >
      <ChatQueryBar />
      <ChatFilterCopilotInstructions />
      <WorkflowProgressStrip />
      <div
        id="copilot-chat-region"
        data-testid="copilot-chat-region"
        aria-live="polite"
        aria-relevant="additions"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1 sm:px-4"
      >
        <CopilotChat
          className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
          labels={CONCIERGE_LABELS}
        />
      </div>
      <EventResultsPanel />
      <div className="hidden max-h-[200px] shrink-0 border-t border-border sm:block">
        <ChatResultsColumn compact />
      </div>
    </section>
  );
}
