import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapPublishTransitionFromRpc } from "./publish-transition-mapper";
import type { PublishTransitionResult } from "./broker-surface-state";
import { resolvePublishRpc } from "./resolve-publish-rpc";
import type { ListingWorkflowStatus } from "./listing-workflow";

type DbClient = SupabaseClient<Database>;

export type RunPublishRpcResult =
  | { ok: true; transition: PublishTransitionResult }
  | { ok: false; message: string; status: 400 | 403 | 404 | 500 };

function publishRpcFailure(
  message: string,
  code?: string,
): Extract<RunPublishRpcResult, { ok: false }> {
  if (
    code === "42501" ||
    /authentication required|broker does not own this apartment/i.test(message)
  ) {
    return { ok: false, message, status: 403 };
  }
  if (code === "P0002" || /apartment not found/i.test(message)) {
    return { ok: false, message, status: 404 };
  }
  if (
    code === "check_violation" ||
    /invalid listing workflow transition|No publish action for status/i.test(message)
  ) {
    return { ok: false, message, status: 400 };
  }
  if (/unexpected payload|Failed to map publish transition/i.test(message)) {
    return { ok: false, message, status: 500 };
  }
  return { ok: false, message, status: 500 };
}

/** Call publish FSM RPC for a broker-owned apartment. */
export async function runPublishRpc(
  supabase: DbClient,
  apartmentId: string,
  currentStatus: ListingWorkflowStatus,
): Promise<RunPublishRpcResult> {
  const rpc = resolvePublishRpc(currentStatus);
  if (!rpc) {
    return publishRpcFailure(`No publish action for status: ${currentStatus}`);
  }

  const { data, error } = await supabase.rpc(rpc, {
    p_apartment_id: apartmentId,
  });

  if (error) {
    return publishRpcFailure(error.message, error.code);
  }

  if (!data || typeof data !== "object" || !("id" in data)) {
    return publishRpcFailure("Publish RPC returned an unexpected payload.");
  }

  try {
    const transition = mapPublishTransitionFromRpc(
      data as Parameters<typeof mapPublishTransitionFromRpc>[0],
    );
    return { ok: true, transition };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to map publish transition.";
    return publishRpcFailure(message);
  }
}
