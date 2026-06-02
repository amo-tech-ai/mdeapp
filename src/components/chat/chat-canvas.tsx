"use client";

import { ChatCenterPanel } from "@/components/chat/chat-center-panel";
import { ChatMapPanel } from "@/components/chat/chat-map-panel";
import { ChatNavRail } from "@/components/chat/chat-nav-rail";
import { CafeDetailMobileSheet } from "@/components/chat/cafe-detail-mobile-sheet";
import { NightlifeDetailMobileSheet } from "@/components/chat/nightlife-detail-mobile-sheet";
import { MapMobileSheet } from "@/components/chat/map-mobile-sheet";

/**
 * MAP-007B Mindtrip layout: nav · center CopilotChat · right map.
 */
export function ChatCanvas() {
  return (
    <>
      <div
        className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_minmax(360px,420px)]"
        data-testid="chat-canvas"
      >
        <aside
          className="hidden min-h-0 border-r border-border p-4 lg:flex lg:flex-col"
          aria-label="Left navigation"
        >
          <ChatNavRail />
        </aside>
        <ChatCenterPanel />
        <ChatMapPanel />
      </div>
      <MapMobileSheet />
      <CafeDetailMobileSheet />
      <NightlifeDetailMobileSheet />
    </>
  );
}
