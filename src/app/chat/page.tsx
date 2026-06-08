"use client";

import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { GeoChatShell } from "@/components/chat/geo-chat-shell";
import { MapContextProvider } from "@/platform/maps/map-context";

/** Concierge surface — original GeoChatShell (SCREEN-001 / MAP-007B). */
export default function ChatPage() {
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
