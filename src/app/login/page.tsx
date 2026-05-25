import { redirect } from "next/navigation";
import { AuthEmailForm } from "@/components/auth/auth-email-form";
import { getServerUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/site-url";

const AUTH_ERRORS: Record<string, string> = {
  auth_callback_failed: "Sign-in link expired or was already used. Request a new magic link.",
  auth_callback_missing_code: "Invalid sign-in link. Request a new magic link.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const authError = params.error ? AUTH_ERRORS[params.error] ?? params.error : null;
  const { user } = await getServerUser();

  if (user?.email) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background">
      <AuthEmailForm mode="login" nextPath={nextPath} authError={authError} />
    </main>
  );
}
