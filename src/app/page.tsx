"use client";

import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { GeoChatShell } from "@/components/chat/geo-chat-shell";
import { MapContextProvider } from "@/platform/maps/map-context";

/** MAP-007B — center CopilotChat; map in right column (no CopilotSidebar). */
export default function HomePage() {
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
