import type { ReactNode } from "react";
import { ChatProvider } from "@/components/chat/chat-provider";

/** Per-route CopilotKit v2 for /chat. */
export default function ChatLayout({ children }: { children: ReactNode }) {
  return <ChatProvider>{children}</ChatProvider>;
}
