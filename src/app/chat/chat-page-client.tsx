"use client";

import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { GeoChatShell } from "@/components/chat/geo-chat-shell";
import { MapContextProvider } from "@/platform/maps/map-context";

/** v1 /chat shell — unchanged when COPILOTKIT_V2_CHAT is off. */
export function ChatPageClient() {
  return (
    <main
      id="main-content"
      style={
        {
          "--copilot-kit-primary-color": "var(--primary)",
        } as CopilotKitCSSProperties
      }
      className="min-h-screen bg-background text-foreground"
    >
      <MapContextProvider>
        <GeoChatShell />
      </MapContextProvider>
    </main>
  );
}
