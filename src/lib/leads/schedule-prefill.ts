/**
 * Build prefill values for the "Schedule a viewing" modal from a signed-in user.
 *
 * Sources (no guessing — only fields that actually exist):
 * - name:  profiles.full_name → auth user_metadata.full_name → user_metadata.name
 * - email: profiles.email → auth user.email
 * - phone: auth user.phone → auth user_metadata.phone
 *          (the `profiles` table has no phone column, so phone never comes from there)
 *
 * Any missing source yields an empty string — the field stays blank and editable.
 * A signed-out user (null user) yields all-blank.
 */

export type SchedulePrefillUser = {
  email?: string | null;
  phone?: string | null;
  user_metadata?: {
    full_name?: string | null;
    name?: string | null;
    phone?: string | null;
  } | null;
} | null;

export type SchedulePrefillProfile = {
  full_name?: string | null;
  email?: string | null;
} | null;

export type SchedulePrefill = {
  name: string;
  email: string;
  phone: string;
};

const firstNonEmpty = (...values: Array<string | null | undefined>): string => {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
};

export const buildSchedulePrefill = (
  user: SchedulePrefillUser,
  profile: SchedulePrefillProfile,
): SchedulePrefill => {
  if (!user) {
    return { name: "", email: "", phone: "" };
  }

  return {
    name: firstNonEmpty(
      profile?.full_name,
      user.user_metadata?.full_name,
      user.user_metadata?.name,
    ),
    email: firstNonEmpty(profile?.email, user.email),
    phone: firstNonEmpty(user.phone, user.user_metadata?.phone),
  };
};
