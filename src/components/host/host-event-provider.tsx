"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import { useState } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/** Fresh threadId per wizard session avoids stale thought_signature history. */
export function HostEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [threadId] = useState(() => crypto.randomUUID());

  return (
    <CopilotKit
      {...getCopilotKitClientProps("hostEventAgent")}
      threadId={threadId}
      enableInspector={false}
    >
      {children}
    </CopilotKit>
  );
}
