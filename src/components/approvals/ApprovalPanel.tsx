// ApprovalPanel — mdeai-themed adaptation of CopilotKit's MoonCard HITL demo.
// Pattern: human-in-the-loop via `useCopilotAction({ renderAndWaitForResponse })`.
// Foundation for W3 Roberto's event-publish HITL flow (PRD §17).
// Strict state machine per PRD §17: PENDING → APPROVED | REJECTED | EDIT.

import { useState } from "react";

export type ApprovalDecision = "approved" | "edit" | "rejected";

export interface ApprovalPanelProps {
  title?: string;
  description?: string;
  /** Display summary of what's being approved (e.g., event draft preview). */
  preview?: React.ReactNode;
  status: "inProgress" | "executing" | "complete";
  respond?: (response: string) => void;
  themeColor?: string;
}

export function ApprovalPanel({
  title = "Approval required",
  description = "Review the proposed action.",
  preview,
  status,
  respond,
  themeColor = "#0f766e", // mdeai teal default
}: ApprovalPanelProps) {
  const [decision, setDecision] = useState<ApprovalDecision | null>(null);

  const handleApprove = () => {
    setDecision("approved");
    respond?.("APPROVED — proceed with the action.");
  };

  const handleEdit = () => {
    setDecision("edit");
    respond?.("EDIT — user wants to modify the proposal before approving.");
  };

  const handleReject = () => {
    setDecision("rejected");
    respond?.("REJECTED — user declined the proposed action.");
  };

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="rounded-2xl shadow-xl max-w-md w-full mt-6"
    >
      <div className="bg-white/15 backdrop-blur-md p-6 w-full rounded-2xl">
        {decision === "approved" ? (
          <div className="text-center">
            <div className="text-6xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-white mb-1">Approved</h2>
            <p className="text-white/90 text-sm">Proceeding with the action.</p>
          </div>
        ) : decision === "edit" ? (
          <div className="text-center">
            <div className="text-6xl mb-3">✏️</div>
            <h2 className="text-xl font-bold text-white mb-1">Edit Requested</h2>
            <p className="text-white/90 text-sm">User wants to modify the proposal.</p>
          </div>
        ) : decision === "rejected" ? (
          <div className="text-center">
            <div className="text-6xl mb-3">❌</div>
            <h2 className="text-xl font-bold text-white mb-1">Rejected</h2>
            <p className="text-white/90 text-sm">User declined the action.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">📋</div>
              <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
              <p className="text-white/90 text-sm">{description}</p>
            </div>

            {preview && (
              <div className="bg-white/10 rounded-lg p-3 mb-4 text-white/95 text-sm">
                {preview}
              </div>
            )}

            {status === "executing" && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleApprove}
                  className="px-3 py-3 rounded-xl bg-white text-black font-bold
                    shadow-lg hover:shadow-xl transition-all
                    hover:scale-105 active:scale-95"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={handleEdit}
                  className="px-3 py-3 rounded-xl bg-black/15 text-white font-bold
                    border-2 border-white/30 shadow-lg
                    transition-all hover:scale-105 active:scale-95
                    hover:bg-black/25"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleReject}
                  className="px-3 py-3 rounded-xl bg-black/15 text-white font-bold
                    border-2 border-white/30 shadow-lg
                    transition-all hover:scale-105 active:scale-95
                    hover:bg-black/25"
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
