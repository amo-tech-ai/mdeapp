import type { SupabaseClient } from "@supabase/supabase-js";
import {
  sanitizePartnerSettings,
  type ActivatePartnerInput,
} from "@/lib/partners/activate-schema";
import {
  PARTNER_ACTIVATE_REDIRECT,
  type PartnerType,
} from "@/lib/partners/partner-types";
import type { Database, Json } from "@/lib/supabase/database.types";

export type ActivatePartnerSuccess = {
  partnerId: string;
  type: PartnerType;
  status: "draft";
  redirectTo: typeof PARTNER_ACTIVATE_REDIRECT;
  created: boolean;
};

export type ActivatePartnerError = {
  code: "draft_not_found" | "draft_forbidden" | "insert_failed" | "member_failed" | "draft_link_failed";
  message: string;
};

export function buildPartnerInsertRow(
  profileId: string,
  input: ActivatePartnerInput,
): Database["public"]["Tables"]["partners"]["Insert"] {
  return {
    profile_id: profileId,
    type: input.type,
    status: "draft",
    completion_score: 0,
    settings: sanitizePartnerSettings(input.settings) as Json,
  };
}

export async function activatePartner(
  db: SupabaseClient<Database>,
  profileId: string,
  input: ActivatePartnerInput,
): Promise<
  | { ok: true; data: ActivatePartnerSuccess }
  | { ok: false; error: ActivatePartnerError }
> {
  const { data: existing, error: existingError } = await db
    .from("partners")
    .select("id, type, status")
    .eq("profile_id", profileId)
    .eq("type", input.type)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false,
      error: { code: "insert_failed", message: existingError.message },
    };
  }

  let partnerId: string;
  let created = false;

  if (existing) {
    partnerId = existing.id;
  } else {
    const { data: inserted, error: insertError } = await db
      .from("partners")
      .insert(buildPartnerInsertRow(profileId, input))
      .select("id, type, status")
      .single();

    if (insertError || !inserted) {
      return {
        ok: false,
        error: {
          code: "insert_failed",
          message: insertError?.message ?? "Partner insert failed",
        },
      };
    }

    partnerId = inserted.id;
    created = true;
  }

  const { error: memberError } = await db.from("partner_members").upsert(
    {
      partner_id: partnerId,
      profile_id: profileId,
      role: "owner",
    },
    { onConflict: "partner_id,profile_id" },
  );

  if (memberError) {
    return {
      ok: false,
      error: { code: "member_failed", message: memberError.message },
    };
  }

  if (input.draftId) {
    const linkError = await linkPartnerDraft(db, profileId, partnerId, input.draftId);
    if (linkError) return { ok: false, error: linkError };
  }

  return {
    ok: true,
    data: {
      partnerId,
      type: input.type,
      status: "draft",
      redirectTo: PARTNER_ACTIVATE_REDIRECT,
      created,
    },
  };
}

async function linkPartnerDraft(
  db: SupabaseClient<Database>,
  profileId: string,
  partnerId: string,
  draftId: string,
): Promise<ActivatePartnerError | null> {
  const { data: draft, error: draftError } = await db
    .from("partner_drafts")
    .select("id, profile_id")
    .eq("id", draftId)
    .maybeSingle();

  if (draftError) {
    return { code: "draft_link_failed", message: draftError.message };
  }
  if (!draft) {
    return { code: "draft_not_found", message: "Draft not found" };
  }
  if (draft.profile_id !== profileId) {
    return { code: "draft_forbidden", message: "Draft does not belong to user" };
  }

  const { error: updateError } = await db
    .from("partner_drafts")
    .update({
      partner_id: partnerId,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", draftId);

  if (updateError) {
    return { code: "draft_link_failed", message: updateError.message };
  }

  return null;
}
