import type { ReactNode } from "react";
import { ChatProviderV2 } from "@/components/chat/chat-provider-v2";
import { isCopilotKitV2ChatEnabled } from "@/lib/copilotkit-v2-chat-flag";

/**
 * SAN-901 · CK-V2-004A — per-route CopilotKit for /chat.
 * Flag off → root MdeCopilotKitProvider (v1). Flag on → v2 subpath spike only.
 */
export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (isCopilotKitV2ChatEnabled()) {
    return <ChatProviderV2>{children}</ChatProviderV2>;
  }
  return children;
}
