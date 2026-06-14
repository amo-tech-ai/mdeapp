import { ChatPageV2Client } from "./chat-page-v2-client";
import { isCopilotKitV2ChatEnabled } from "@/lib/copilotkit-v2-chat-flag";
import { ChatPageClient } from "./chat-page-client";

/** Concierge surface — GeoChatShell (v1) or GeoChatShellV2 (v2 flag on). */
export default function ChatPage() {
  if (isCopilotKitV2ChatEnabled()) {
    return <ChatPageV2Client />;
  }

  return <ChatPageClient />;
}

