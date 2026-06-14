"use client";

import { GeoChatShellV2 } from "@/components/chat/geo-chat-shell-v2";
import { MapContextProvider } from "@/platform/maps/map-context";

/** v2 /chat shell — SAN-890; flag-on only. */
export function ChatPageV2Client() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground"
    >
      <MapContextProvider>
        <GeoChatShellV2 />
      </MapContextProvider>
    </main>
  );
}
