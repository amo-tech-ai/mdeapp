import { ChatSpikeShellV2 } from "@/components/chat/chat-spike-shell-v2";
import { isCopilotKitV2ChatEnabled } from "@/lib/copilotkit-v2-chat-flag";
import { ChatPageClient } from "./chat-page-client";

/** Concierge surface — GeoChatShell (v1) or SAN-901 spike shell (v2 flag on). */
export default function ChatPage() {
  if (isCopilotKitV2ChatEnabled()) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground"
      >
        <ChatSpikeShellV2 />
      </main>
    );
  }

  return <ChatPageClient />;
}

