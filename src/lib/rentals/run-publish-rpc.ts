import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { mapPublishTransitionFromRpc } from "./publish-transition-mapper";
import type { PublishTransitionResult } from "./broker-surface-state";
import { resolvePublishRpc } from "./resolve-publish-rpc";
import type { ListingWorkflowStatus } from "./listing-workflow";

type DbClient = SupabaseClient<Database>;

export type RunPublishRpcResult =
  | { ok: true; transition: PublishTransitionResult }
  | { ok: false; message: string };

/** Call publish FSM RPC for a broker-owned apartment. */
export async function runPublishRpc(
  supabase: DbClient,
  apartmentId: string,
  currentStatus: ListingWorkflowStatus,
): Promise<RunPublishRpcResult> {
  const rpc = resolvePublishRpc(currentStatus);
  if (!rpc) {
    return { ok: false, message: `No publish action for status: ${currentStatus}` };
  }

  const { data, error } = await supabase.rpc(rpc, {
    p_apartment_id: apartmentId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data || typeof data !== "object" || !("id" in data)) {
    return { ok: false, message: "Publish RPC returned an unexpected payload." };
  }

  try {
    const transition = mapPublishTransitionFromRpc(
      data as Parameters<typeof mapPublishTransitionFromRpc>[0],
    );
    return { ok: true, transition };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to map publish transition.";
    return { ok: false, message };
  }
}
