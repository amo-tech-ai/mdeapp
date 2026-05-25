"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteOrigin, safeNextPath } from "@/lib/auth/site-url";

export type AuthActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function sendMagicLink(
  formData: FormData,
): Promise<AuthActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const next = safeNextPath(
    typeof formData.get("next") === "string"
      ? (formData.get("next") as string)
      : null,
  );
  const origin = await getSiteOrigin();
  const redirectTo = new URL("/auth/callback", origin);
  redirectTo.searchParams.set("next", next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo.toString(),
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    message: "Check your email for the magic link to continue.",
  };
}

/** AUTH-001 — Google OAuth via Supabase (no app-side Google client id). */
export async function signInWithGoogle(formData: FormData): Promise<never> {
  const next = safeNextPath(
    typeof formData.get("next") === "string"
      ? (formData.get("next") as string)
      : null,
  );
  const origin = await getSiteOrigin();
  const redirectTo = new URL("/auth/callback", origin);
  redirectTo.searchParams.set("next", next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectTo.toString() },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`,
    );
  }

  if (data.url) {
    redirect(data.url);
  }

  redirect(
    `/login?error=${encodeURIComponent("Google sign-in could not start")}&next=${encodeURIComponent(next)}`,
  );
}
