"use client";

import { Suspense } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";

import { ChatFilterCopilotInstructions } from "@/components/chat/chat-filter-copilot-instructions";
import { ChatQueryBar } from "@/components/chat/chat-query-bar";
import { ConciergeChatView } from "@/components/chat/concierge-copilot-chat-view";
import { ConciergeInitialPrompt } from "@/components/chat/concierge-initial-prompt";
import { useConciergeSession } from "@/components/chat/concierge-session-context";
import { CenterPanelMapResultsSlot } from "@/components/chat/center-panel-map-results-slot";
import { EventResultsPanel } from "@/components/chat/event-results-panel";
import { EventFastPathPanel } from "@/components/chat/event-fast-path-panel";
import { GroundedFastPathPanel } from "@/components/chat/grounded-fast-path-panel";
import { RentalFastPathPanel } from "@/components/chat/rental-fast-path-panel";
import { RestaurantFastPathPanel } from "@/components/chat/restaurant-fast-path-panel";
import { WorkflowProgressStrip } from "@/components/chat/workflow-progress-strip";

const CONCIERGE_LABELS = {
  modalHeaderTitle: "Medellín concierge",
  welcomeMessageText:
    'Hi — I can help with rentals, events, restaurants, and day trips in Medellín. Try: "1BR in Laureles under $80/night" or "salsa events this weekend".',
};

/** CopilotChat with ConciergeChatView slot — fast-path before agent (CK-V2-015). */
function ConciergeCopilotChat() {
  return (
    <CopilotChat
      agentId="conciergeAgent"
      className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
      labels={CONCIERGE_LABELS}
      chatView={ConciergeChatView}
    />
  );
}

export function ChatCenterPanel() {
  const { sessionKey } = useConciergeSession();

  return (
    <section
      data-testid="center-chat-panel"
      aria-label="Concierge chat"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
    >
      <div
        key={sessionKey}
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
          <Suspense fallback={null}>
            <ConciergeInitialPrompt />
          </Suspense>
          <ConciergeCopilotChat />
          <RentalFastPathPanel />
          <EventFastPathPanel />
          <GroundedFastPathPanel />
          <RestaurantFastPathPanel />
        </div>
        <EventResultsPanel />
        <CenterPanelMapResultsSlot />
      </div>
    </section>
  );
}
